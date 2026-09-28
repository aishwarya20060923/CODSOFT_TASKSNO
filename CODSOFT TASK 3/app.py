import os
from datetime import datetime
from functools import wraps
from flask import (
    Flask, render_template, request, redirect,
    url_for, flash, session, send_from_directory, abort
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# ---------------------------------------------------------
# App Initialization & Configuration
# ---------------------------------------------------------
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'careerhub-codsoft-internship-task3-secret-key-2026'

# SQLite database in database/ folder
db_dir = os.path.join(basedir, 'database')
os.makedirs(db_dir, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(db_dir, "careerhub.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Resume uploads folder
upload_dir = os.path.join(basedir, 'static', 'uploads', 'resumes')
os.makedirs(upload_dir, exist_ok=True)
app.config['UPLOAD_FOLDER'] = upload_dir
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

db = SQLAlchemy(app)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# Database Models
# ---------------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='candidate')  # 'candidate' or 'recruiter'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship('CandidateProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    jobs = db.relationship('Job', backref='recruiter', lazy=True, cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='candidate', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class CandidateProfile(db.Model):
    __tablename__ = 'candidate_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    skills = db.Column(db.String(255), nullable=True)
    education = db.Column(db.String(255), nullable=True)
    experience = db.Column(db.Text, nullable=True)
    resume_filename = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    company = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    job_type = db.Column(db.String(50), nullable=False, default='Full-time')  # Full-time, Part-time, Remote, Internship, Contract
    salary = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship('Application', backref='job', lazy=True, cascade='all, delete-orphan')


class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    resume_filename = db.Column(db.String(255), nullable=True)
    cover_note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), nullable=False, default='Pending')  # Pending, Shortlisted, Rejected, Selected
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('job_id', 'candidate_id', name='unique_candidate_job_application'),
    )


# ---------------------------------------------------------
# Authentication & Authorization Helpers
# ---------------------------------------------------------
@app.context_processor
def inject_current_user():
    user = None
    if 'user_id' in session:
        user = db.session.get(User, session['user_id'])
    return dict(current_user=user)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to continue.', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def candidate_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in as a candidate to access this page.', 'warning')
            return redirect(url_for('login', next=request.url))
        if session.get('role') != 'candidate':
            flash('Access restricted to job candidates.', 'danger')
            return redirect(url_for('recruiter_dashboard'))
        return f(*args, **kwargs)
    return decorated_function


def recruiter_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in as a recruiter to access this page.', 'warning')
            return redirect(url_for('recruiter_login', next=request.url))
        if session.get('role') != 'recruiter':
            flash('Access restricted to recruiters.', 'danger')
            return redirect(url_for('candidate_dashboard'))
        return f(*args, **kwargs)
    return decorated_function


# ---------------------------------------------------------
# Public Routes (Home, Jobs, Job Details)
# ---------------------------------------------------------
@app.route('/')
def index():
    # Featured jobs for home page (latest 6)
    featured_jobs = Job.query.order_by(Job.created_at.desc()).limit(6).all()
    total_jobs = Job.query.count()
    total_companies = db.session.query(db.func.count(db.func.distinct(Job.company))).scalar() or 0
    total_candidates = User.query.filter_by(role='candidate').count()
    return render_template(
        'index.html',
        featured_jobs=featured_jobs,
        total_jobs=total_jobs,
        total_companies=total_companies,
        total_candidates=total_candidates
    )


@app.route('/jobs')
def jobs():
    query_text = request.args.get('q', '').strip()
    location_filter = request.args.get('location', '').strip()
    type_filter = request.args.get('type', '').strip()

    job_query = Job.query

    if query_text:
        job_query = job_query.filter(
            (Job.title.ilike(f'%{query_text}%')) |
            (Job.company.ilike(f'%{query_text}%')) |
            (Job.description.ilike(f'%{query_text}%')) |
            (Job.requirements.ilike(f'%{query_text}%'))
        )

    if location_filter:
        job_query = job_query.filter(Job.location.ilike(f'%{location_filter}%'))

    if type_filter and type_filter != 'All':
        job_query = job_query.filter(Job.job_type == type_filter)

    all_jobs = job_query.order_by(Job.created_at.desc()).all()

    # Get distinct locations for filter dropdown
    locations = [r[0] for r in db.session.query(Job.location).distinct().all()]

    return render_template(
        'jobs.html',
        jobs=all_jobs,
        query_text=query_text,
        location_filter=location_filter,
        type_filter=type_filter,
        locations=locations
    )


@app.route('/jobs/<int:job_id>')
def job_details(job_id):
    job = db.get_or_404(Job, job_id)
    already_applied = False
    candidate_app = None

    if 'user_id' in session and session.get('role') == 'candidate':
        candidate_app = Application.query.filter_by(
            job_id=job.id,
            candidate_id=session['user_id']
        ).first()
        already_applied = candidate_app is not None

    # Similar/Other jobs
    related_jobs = Job.query.filter(Job.id != job.id).order_by(Job.created_at.desc()).limit(3).all()

    return render_template(
        'job_details.html',
        job=job,
        already_applied=already_applied,
        candidate_app=candidate_app,
        related_jobs=related_jobs
    )


# ---------------------------------------------------------
# Candidate Authentication & Management
# ---------------------------------------------------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('candidate_dashboard' if session.get('role') == 'candidate' else 'recruiter_dashboard'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        # Validation
        if not full_name or not email or not password:
            flash('All required fields must be filled.', 'danger')
            return render_template('register.html', full_name=full_name, email=email)

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html', full_name=full_name, email=email)

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html', full_name=full_name, email=email)

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('An account with this email already exists. Please log in.', 'danger')
            return redirect(url_for('login'))

        # Create Candidate User
        new_user = User(full_name=full_name, email=email, role='candidate')
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()

        # Create Profile
        new_profile = CandidateProfile(user_id=new_user.id)
        db.session.add(new_profile)
        db.session.commit()

        # Auto-login
        session['user_id'] = new_user.id
        session['role'] = new_user.role
        session['user_name'] = new_user.full_name

        flash(f'Account created successfully! Welcome to CareerHub, {new_user.full_name}.', 'success')
        return redirect(url_for('candidate_dashboard'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('candidate_dashboard' if session.get('role') == 'candidate' else 'recruiter_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please provide both email and password.', 'danger')
            return render_template('login.html', email=email)

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            session['user_id'] = user.id
            session['role'] = user.role
            session['user_name'] = user.full_name

            flash(f'Welcome back, {user.full_name}!', 'success')
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            return redirect(url_for('candidate_dashboard' if user.role == 'candidate' else 'recruiter_dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'danger')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('index'))


# ---------------------------------------------------------
# Candidate Portal (Dashboard, Profile, Apply)
# ---------------------------------------------------------
@app.route('/dashboard')
@candidate_required
def candidate_dashboard():
    user = db.session.get(User, session['user_id'])
    profile = user.profile or CandidateProfile(user_id=user.id)
    applications = Application.query.filter_by(candidate_id=user.id).order_by(Application.applied_at.desc()).all()
    recent_jobs = Job.query.order_by(Job.created_at.desc()).limit(4).all()

    return render_template(
        'candidate_dashboard.html',
        user=user,
        profile=profile,
        applications=applications,
        recent_jobs=recent_jobs
    )


@app.route('/profile', methods=['GET', 'POST'])
@candidate_required
def profile():
    user = db.session.get(User, session['user_id'])
    cand_profile = user.profile
    if not cand_profile:
        cand_profile = CandidateProfile(user_id=user.id)
        db.session.add(cand_profile)
        db.session.commit()

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        phone = request.form.get('phone', '').strip()
        skills = request.form.get('skills', '').strip()
        education = request.form.get('education', '').strip()
        experience = request.form.get('experience', '').strip()

        if full_name:
            user.full_name = full_name
            session['user_name'] = full_name

        cand_profile.phone = phone
        cand_profile.skills = skills
        cand_profile.education = education
        cand_profile.experience = experience

        # Handle resume upload
        if 'resume' in request.files:
            file = request.files['resume']
            if file and file.filename:
                if allowed_file(file.filename):
                    safe_name = secure_filename(f"user_{user.id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], safe_name))
                    cand_profile.resume_filename = safe_name
                else:
                    flash('Invalid file format for resume. Allowed: PDF, DOC, DOCX, TXT.', 'warning')

        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))

    return render_template('profile.html', user=user, profile=cand_profile)


@app.route('/apply/<int:job_id>', methods=['POST'])
@candidate_required
def apply_job(job_id):
    job = db.get_or_404(Job, job_id)
    user = db.session.get(User, session['user_id'])
    user_profile = user.profile

    # Check if already applied
    existing_app = Application.query.filter_by(job_id=job.id, candidate_id=user.id).first()
    if existing_app:
        flash('You have already applied for this position.', 'warning')
        return redirect(url_for('job_details', job_id=job.id))

    cover_note = request.form.get('cover_note', '').strip()
    resume_file_to_save = None

    # Resume handling: either new file uploaded or existing profile resume
    if 'resume' in request.files:
        file = request.files['resume']
        if file and file.filename:
            if allowed_file(file.filename):
                safe_name = secure_filename(f"app_{user.id}_{job.id}_{int(datetime.utcnow().timestamp())}_{file.filename}")
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], safe_name))
                resume_file_to_save = safe_name
                # also update candidate profile resume if empty
                if user_profile and not user_profile.resume_filename:
                    user_profile.resume_filename = safe_name
            else:
                flash('Unsupported resume format. Please use PDF, DOC, DOCX, or TXT.', 'danger')
                return redirect(url_for('job_details', job_id=job.id))

    if not resume_file_to_save:
        if user_profile and user_profile.resume_filename:
            resume_file_to_save = user_profile.resume_filename
        else:
            resume_file_to_save = f"Resume_{user.full_name.replace(' ', '_')}.pdf"

    # Create application
    new_application = Application(
        job_id=job.id,
        candidate_id=user.id,
        resume_filename=resume_file_to_save,
        cover_note=cover_note,
        status='Pending'
    )
    db.session.add(new_application)
    db.session.commit()

    flash(f'Congratulations! Your application for "{job.title}" at {job.company} was submitted successfully.', 'success')
    return redirect(url_for('candidate_dashboard'))


# ---------------------------------------------------------
# Recruiter Authentication & Portal
# ---------------------------------------------------------
@app.route('/recruiter/login', methods=['GET', 'POST'])
def recruiter_login():
    if 'user_id' in session:
        if session.get('role') == 'recruiter':
            return redirect(url_for('recruiter_dashboard'))
        else:
            flash('Logged in as a candidate. Please log out first to switch to a recruiter account.', 'info')
            return redirect(url_for('candidate_dashboard'))

    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please enter recruiter email and password.', 'danger')
            return render_template('recruiter_login.html', email=email)

        user = User.query.filter_by(email=email, role='recruiter').first()

        if user and user.check_password(password):
            session['user_id'] = user.id
            session['role'] = user.role
            session['user_name'] = user.full_name

            flash(f'Recruiter session active. Welcome back, {user.full_name}!', 'success')
            return redirect(url_for('recruiter_dashboard'))
        else:
            flash('Invalid recruiter credentials. Use the demo credentials below or check your details.', 'danger')

    return render_template('recruiter_login.html')


@app.route('/recruiter/register', methods=['GET', 'POST'])
def recruiter_register():
    if 'user_id' in session:
        return redirect(url_for('recruiter_dashboard' if session.get('role') == 'recruiter' else 'candidate_dashboard'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        company = request.form.get('company', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not full_name or not email or not password:
            flash('All required fields must be filled.', 'danger')
            return render_template('recruiter_register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('recruiter_register.html')

        existing = User.query.filter_by(email=email).first()
        if existing:
            flash('An account with this email already exists.', 'danger')
            return redirect(url_for('recruiter_login'))

        new_recruiter = User(
            full_name=f"{full_name} ({company})" if company else full_name,
            email=email,
            role='recruiter'
        )
        new_recruiter.set_password(password)
        db.session.add(new_recruiter)
        db.session.commit()

        session['user_id'] = new_recruiter.id
        session['role'] = new_recruiter.role
        session['user_name'] = new_recruiter.full_name

        flash('Recruiter account created successfully! Welcome to CareerHub Recruiter Portal.', 'success')
        return redirect(url_for('recruiter_dashboard'))

    return render_template('recruiter_register.html')


@app.route('/recruiter/dashboard')
@recruiter_required
def recruiter_dashboard():
    recruiter = db.session.get(User, session['user_id'])
    
    # Recruiter's jobs
    my_jobs = Job.query.filter_by(recruiter_id=recruiter.id).all()
    job_ids = [j.id for j in my_jobs]

    # Metrics
    total_jobs = len(my_jobs)
    total_applications = Application.query.filter(Application.job_id.in_(job_ids)).count() if job_ids else 0
    pending_applications = Application.query.filter(Application.job_id.in_(job_ids), Application.status == 'Pending').count() if job_ids else 0
    shortlisted_candidates = Application.query.filter(Application.job_id.in_(job_ids), Application.status == 'Shortlisted').count() if job_ids else 0
    selected_candidates = Application.query.filter(Application.job_id.in_(job_ids), Application.status == 'Selected').count() if job_ids else 0

    # Recent applications
    recent_applications = []
    if job_ids:
        recent_applications = Application.query.filter(
            Application.job_id.in_(job_ids)
        ).order_by(Application.applied_at.desc()).limit(8).all()

    return render_template(
        'recruiter_dashboard.html',
        recruiter=recruiter,
        total_jobs=total_jobs,
        total_applications=total_applications,
        pending_applications=pending_applications,
        shortlisted_candidates=shortlisted_candidates,
        selected_candidates=selected_candidates,
        recent_applications=recent_applications,
        my_jobs=my_jobs[:5]
    )


@app.route('/recruiter/jobs')
@recruiter_required
def recruiter_jobs():
    recruiter = db.session.get(User, session['user_id'])
    jobs_list = Job.query.filter_by(recruiter_id=recruiter.id).order_by(Job.created_at.desc()).all()
    return render_template('recruiter_jobs.html', jobs=jobs_list)


@app.route('/recruiter/jobs/new', methods=['GET', 'POST'])
@recruiter_required
def post_job():
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        company = request.form.get('company', '').strip()
        location = request.form.get('location', '').strip()
        job_type = request.form.get('job_type', 'Full-time')
        salary = request.form.get('salary', '').strip()
        description = request.form.get('description', '').strip()
        requirements = request.form.get('requirements', '').strip()

        if not title or not company or not location or not description:
            flash('Title, Company, Location, and Description are required fields.', 'danger')
            return render_template('post_job.html', form_data=request.form)

        new_job = Job(
            recruiter_id=session['user_id'],
            title=title,
            company=company,
            location=location,
            job_type=job_type,
            salary=salary if salary else 'Competitive / Negotiable',
            description=description,
            requirements=requirements
        )
        db.session.add(new_job)
        db.session.commit()

        flash(f'Job listing "{title}" published successfully!', 'success')
        return redirect(url_for('recruiter_jobs'))

    return render_template('post_job.html')


@app.route('/recruiter/jobs/<int:job_id>/edit', methods=['GET', 'POST'])
@recruiter_required
def edit_job(job_id):
    job = db.get_or_404(Job, job_id)
    if job.recruiter_id != session['user_id']:
        flash('You can only edit jobs you posted.', 'danger')
        return redirect(url_for('recruiter_jobs'))

    if request.method == 'POST':
        job.title = request.form.get('title', '').strip()
        job.company = request.form.get('company', '').strip()
        job.location = request.form.get('location', '').strip()
        job.job_type = request.form.get('job_type', 'Full-time')
        job.salary = request.form.get('salary', '').strip()
        job.description = request.form.get('description', '').strip()
        job.requirements = request.form.get('requirements', '').strip()

        if not job.title or not job.company or not job.location or not job.description:
            flash('All primary fields are required.', 'danger')
            return render_template('edit_job.html', job=job)

        db.session.commit()
        flash(f'Job "{job.title}" updated successfully!', 'success')
        return redirect(url_for('recruiter_jobs'))

    return render_template('edit_job.html', job=job)


@app.route('/recruiter/jobs/<int:job_id>/delete', methods=['POST'])
@recruiter_required
def delete_job(job_id):
    job = db.get_or_404(Job, job_id)
    if job.recruiter_id != session['user_id']:
        flash('You can only delete jobs you posted.', 'danger')
        return redirect(url_for('recruiter_jobs'))

    title = job.title
    db.session.delete(job)
    db.session.commit()
    flash(f'Job listing "{title}" has been deleted.', 'info')
    return redirect(url_for('recruiter_jobs'))


@app.route('/recruiter/applications')
@recruiter_required
def view_applications():
    recruiter = db.session.get(User, session['user_id'])
    my_jobs = Job.query.filter_by(recruiter_id=recruiter.id).all()
    job_ids = [j.id for j in my_jobs]

    selected_job_id = request.args.get('job_id', type=int)
    selected_status = request.args.get('status', '').strip()

    if not job_ids:
        return render_template(
            'applications.html',
            applications=[],
            my_jobs=[],
            selected_job_id=None,
            selected_status=''
        )

    app_query = Application.query.filter(Application.job_id.in_(job_ids))

    if selected_job_id:
        app_query = app_query.filter(Application.job_id == selected_job_id)

    if selected_status and selected_status != 'All':
        app_query = app_query.filter(Application.status == selected_status)

    applications = app_query.order_by(Application.applied_at.desc()).all()

    return render_template(
        'applications.html',
        applications=applications,
        my_jobs=my_jobs,
        selected_job_id=selected_job_id,
        selected_status=selected_status
    )


@app.route('/recruiter/applications/<int:app_id>/status', methods=['POST'])
@recruiter_required
def update_application_status(app_id):
    app_record = db.get_or_404(Application, app_id)

    # Verify that the recruiter owns this job
    if app_record.job.recruiter_id != session['user_id']:
        flash('Unauthorized to manage this application.', 'danger')
        return redirect(url_for('recruiter_dashboard'))

    new_status = request.form.get('status', '').strip()
    valid_statuses = {'Pending', 'Shortlisted', 'Rejected', 'Selected'}

    if new_status in valid_statuses:
        app_record.status = new_status
        db.session.commit()
        flash(f"Application status for {app_record.candidate.full_name} updated to '{new_status}'.", 'success')
    else:
        flash('Invalid status selected.', 'danger')

    # Redirect back to where the request came from
    referer = request.referrer
    if referer and ('applications' in referer or 'dashboard' in referer):
        return redirect(referer)
    return redirect(url_for('view_applications'))


@app.route('/download-resume/<filename>')
def download_resume(filename):
    # Only allow logged in users to download/view resumes
    if 'user_id' not in session:
        abort(403)
    safe_filename = secure_filename(filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
    if os.path.exists(file_path):
        return send_from_directory(app.config['UPLOAD_FOLDER'], safe_filename, as_attachment=True)
    else:
        # Fallback demo message if resume file was only virtual
        flash(f'Sample resume file "{safe_filename}" is simulated for demo evaluation.', 'info')
        if session.get('role') == 'recruiter':
            return redirect(url_for('view_applications'))
        return redirect(url_for('candidate_dashboard'))


# ---------------------------------------------------------
# Database Initialization & Sample Data Seeder
# ---------------------------------------------------------
def seed_database():
    """Initializes tables and seeds demo recruiter and 5 realistic jobs if empty."""
    with app.app_context():
        db.create_all()

        # Check if demo recruiter exists
        demo_recruiter_email = 'recruiter@careerhub.com'
        recruiter = User.query.filter_by(email=demo_recruiter_email).first()

        if not recruiter:
            recruiter = User(
                full_name='Sarah Jenkins (Talent Lead)',
                email=demo_recruiter_email,
                role='recruiter'
            )
            recruiter.set_password('recruiter123')
            db.session.add(recruiter)
            db.session.commit()
            print("[CareerHub] Seeded demo recruiter: recruiter@careerhub.com / recruiter123")

        # Check if sample jobs exist
        if Job.query.count() == 0:
            sample_jobs = [
                # --- INTERNSHIP JOBS ---
                Job(
                    recruiter_id=recruiter.id,
                    title='Web Development Intern',
                    company='CODSOFT Technologies',
                    location='Remote (India)',
                    job_type='Internship',
                    salary='₹15,000 - ₹25,000 / month',
                    description=(
                        "CODSOFT Technologies is offering a 3-month virtual Web Development Internship. "
                        "Work on real-world projects building responsive frontends, backend REST APIs with Python/Flask, "
                        "and database integrations under senior developer mentorship. Certificate and PPO opportunity upon completion."
                    ),
                    requirements="HTML5, CSS3, JavaScript (ES6+), Python / Flask Basics, Git Version Control, Problem Solving"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Data Science & AI Intern',
                    company='Cognitive AI Labs',
                    location='Bengaluru, Karnataka',
                    job_type='Internship',
                    salary='₹20,000 - ₹30,000 / month',
                    description=(
                        "Join Cognitive AI Labs as an intern to assist in cleaning datasets, exploratory data analysis (EDA), "
                        "and building predictive machine learning models. Ideal for pre-final and final-year engineering students."
                    ),
                    requirements="Python, Pandas, NumPy, Scikit-learn, SQL Basics, Data Visualization, Jupyter Notebooks"
                ),

                # --- REMOTE JOBS ---
                Job(
                    recruiter_id=recruiter.id,
                    title='Remote Full Stack Developer',
                    company='ZestGlobal Systems',
                    location='Remote (Work From Anywhere - India)',
                    job_type='Remote',
                    salary='₹9.0 - ₹14.0 LPA',
                    description=(
                        "100% remote opportunity. We are seeking an autonomous Full Stack Developer to build scalable "
                        "microservices, customer-facing web applications, and database schemas with modern Python and JavaScript."
                    ),
                    requirements="Python (Flask or FastAPI), JavaScript / React, PostgreSQL or SQLite, Docker, REST APIs, Git"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Remote Technical Content Specialist',
                    company='GeekDocs Media',
                    location='Remote (India)',
                    job_type='Remote',
                    salary='₹4.5 - ₹6.5 LPA',
                    description=(
                        "Work from anywhere in India crafting developer documentation, coding guides, tutorials, and API reference "
                        "materials for our global engineering software platform."
                    ),
                    requirements="Technical Writing, Python Basics, Markdown, API Documentation, Good English Communication"
                ),

                # --- PART-TIME JOBS ---
                Job(
                    recruiter_id=recruiter.id,
                    title='Part-time UI/UX Designer',
                    company='CreativePulse Studio',
                    location='Mumbai, Maharashtra (Flexible Hours)',
                    job_type='Part-time',
                    salary='₹25,000 - ₹35,000 / month (20 hrs/week)',
                    description=(
                        "Flexible 20 hours per week role. Design clean wireframes, interactive user flows, and modern design systems "
                        "for emerging fintech and SaaS mobile apps."
                    ),
                    requirements="Figma, Wireframing, User Journey Mapping, Prototyping, Mobile App Guidelines, Design Systems"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Part-time Python Tutor & Mentor',
                    company='EdTech Academy India',
                    location='Remote (India)',
                    job_type='Part-time',
                    salary='₹800 - ₹1,200 / hour (Flexible)',
                    description=(
                        "Conduct evening & weekend live problem-solving sessions and code reviews for students learning Python, "
                        "Flask web development, and algorithmic problem solving."
                    ),
                    requirements="Strong Python Skills, Flask/Django, OOP, Patient Communication, Mentorship Aptitude"
                ),

                # --- CONTRACT JOBS ---
                Job(
                    recruiter_id=recruiter.id,
                    title='Cloud & DevOps Consultant (6-Month Contract)',
                    company='InfraCloud Networks',
                    location='Pune, Maharashtra (Hybrid)',
                    job_type='Contract',
                    salary='₹1,20,000 - ₹1,60,000 / month',
                    description=(
                        "6-month renewable contract for an experienced DevOps Engineer. Set up automated CI/CD deployment pipelines, "
                        "manage Docker containers, and optimize cloud infrastructure on AWS."
                    ),
                    requirements="AWS (EC2, S3, IAM), Docker, Kubernetes, CI/CD (GitHub Actions), Linux Administration, Bash"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Frontend React Specialist (3-Month Contract)',
                    company='NextGen Mobility',
                    location='Gurugram, Haryana',
                    job_type='Contract',
                    salary='₹80,000 - ₹1,10,000 / month',
                    description=(
                        "Short-term contract to revamp our real-time fleet tracking dashboard. Work with product managers to deliver "
                        "high-performance, responsive UI components."
                    ),
                    requirements="React.js, TailwindCSS or CSS Modules, State Management (Redux/Zustand), WebSocket/REST APIs"
                ),

                # --- FULL-TIME JOBS ---
                Job(
                    recruiter_id=recruiter.id,
                    title='Frontend Developer',
                    company='TechNova Solutions India',
                    location='Bengaluru, Karnataka (Hybrid)',
                    job_type='Full-time',
                    salary='₹6.5 - ₹9.5 LPA',
                    description=(
                        "TechNova Solutions is looking for a talented Frontend Developer to join our Bengaluru "
                        "engineering team. You will build user-friendly, responsive interfaces for high-traffic "
                        "web applications using HTML5, CSS3, and modern JavaScript."
                    ),
                    requirements="HTML5, CSS3, JavaScript (ES6+), React/Vue or Vanilla JS, Responsive Design, Git"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Python / Backend Developer',
                    company='CloudScale Technologies',
                    location='Hyderabad, Telangana',
                    job_type='Full-time',
                    salary='₹8.5 - ₹13.0 LPA',
                    description=(
                        "CloudScale Technologies is hiring a Python Backend Developer to design scalable REST APIs, "
                        "manage relational SQLite/PostgreSQL databases, and optimize backend microservices for enterprise clients."
                    ),
                    requirements="Python 3, Flask or Django, SQL, RESTful APIs, OOP, Unit Testing, Git"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Software Development Engineer (SDE-1)',
                    company='Apex Innovations Labs',
                    location='Pune, Maharashtra',
                    job_type='Full-time',
                    salary='₹10.0 - ₹15.0 LPA',
                    description=(
                        "Join Apex Innovations Labs as an SDE-1. Work with agile product squads on core system "
                        "architecture, data structures, backend engineering, and CI/CD pipelines."
                    ),
                    requirements="Data Structures & Algorithms, Java/Python, Problem Solving, DBMS, Git, Agile"
                ),
                Job(
                    recruiter_id=recruiter.id,
                    title='Data Analyst',
                    company='Insight Analytics India',
                    location='Gurugram / Noida (Delhi-NCR)',
                    job_type='Full-time',
                    salary='₹6.0 - ₹8.5 LPA',
                    description=(
                        "Insight Analytics India is seeking an analytical thinker to transform raw business metrics into "
                        "insightful dashboards, SQL queries, and automated reporting systems for leadership teams."
                    ),
                    requirements="SQL, Python (Pandas/NumPy), PowerBI or Tableau, Advanced Excel, Data Cleaning"
                ),
            ]
            db.session.add_all(sample_jobs)
            db.session.commit()
            print(f"[CareerHub] Seeded {len(sample_jobs)} sample Indian tech jobs across all types successfully.")

        # Seed a sample candidate for ready-to-test demo
        demo_candidate_email = 'alex.seeker@example.com'
        candidate = User.query.filter_by(email=demo_candidate_email).first()
        if not candidate:
            candidate = User(
                full_name='Alex Rivera (Aarav)',
                email=demo_candidate_email,
                role='candidate'
            )
            candidate.set_password('candidate123')
            db.session.add(candidate)
            db.session.flush()

            cand_profile = CandidateProfile(
                user_id=candidate.id,
                phone='+91 98765 43210',
                skills='Python, Flask, JavaScript, HTML, CSS, SQL, Git',
                education='B.Tech in Computer Science & Engineering - Tier-1 College (2024)',
                experience='Junior Full Stack Intern at TechCraft India (6 months). Built responsive web portals and Flask REST APIs.',
                resume_filename='Alex_Rivera_Resume.pdf'
            )
            db.session.add(cand_profile)

            # Add a demo application
            first_job = Job.query.first()
            if first_job:
                sample_application = Application(
                    job_id=first_job.id,
                    candidate_id=candidate.id,
                    resume_filename='Alex_Rivera_Resume.pdf',
                    cover_note='I am thrilled to apply for this role. My experience in Python and Flask aligns well with your stack.',
                    status='Shortlisted'
                )
                db.session.add(sample_application)

            db.session.commit()
            print("[CareerHub] Seeded sample candidate: alex.seeker@example.com / candidate123")


# Run seeder on startup
seed_database()


if __name__ == '__main__':
    print("=" * 60)
    print("  CareerHub - Modern Job Portal (CODSOFT Task 3)")
    print("  Server running on http://127.0.0.1:5000")
    print("  Recruiter Demo: recruiter@careerhub.com | recruiter123")
    print("  Candidate Demo: alex.seeker@example.com | candidate123")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
