"""
Comprehensive automated test suite for CareerHub (CODSOFT Task 3)
Tests all core candidate and recruiter user flows using the Flask test client.
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from app import app, db, User, Job, Application, CandidateProfile


class CareerHubTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        self.client = app.test_client()

    def test_01_home_page(self):
        """Test home landing page loads correctly with featured jobs."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Find Your', response.data)
        self.assertIn(b'Career', response.data)
        self.assertIn(b'Featured Opportunities', response.data)
        print("[PASS] Test 1: Home page loaded successfully.")

    def test_02_jobs_listing_and_filter(self):
        """Test job listings page with search and filter queries."""
        # 1. Browse all
        response = self.client.get('/jobs')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Find Your Next Role', response.data)

        # 2. Search query 'Python'
        response_py = self.client.get('/jobs?q=Python')
        self.assertEqual(response_py.status_code, 200)
        self.assertIn(b'Python / Backend Developer', response_py.data)

        # 3. Filter by location 'Remote'
        response_remote = self.client.get('/jobs?location=Remote')
        self.assertEqual(response_remote.status_code, 200)
        self.assertIn(b'Remote', response_remote.data)

        # 4. Filter by job type 'Full-time'
        response_type = self.client.get('/jobs?type=Full-time')
        self.assertEqual(response_type.status_code, 200)
        print("[PASS] Test 2: Jobs search and filtering working properly.")

    def test_03_job_details_page(self):
        """Test individual job details page."""
        with app.app_context():
            first_job = Job.query.first()
            self.assertIsNotNone(first_job)
            job_id = first_job.id
            title = first_job.title
            company = first_job.company

        response = self.client.get(f'/jobs/{job_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn(title.encode(), response.data)
        self.assertIn(company.encode(), response.data)
        print(f"[PASS] Test 3: Job details view works for '{title}'.")

    def test_04_candidate_register_login(self):
        """Test candidate registration and subsequent login."""
        test_email = "test.candidate@codsoft.org"
        
        with app.app_context():
            existing = User.query.filter_by(email=test_email).first()
            if existing:
                db.session.delete(existing)
                db.session.commit()

        # 1. Register new candidate
        reg_response = self.client.post('/register', data={
            'full_name': 'Test Candidate User',
            'email': test_email,
            'password': 'password123',
            'confirm_password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(reg_response.status_code, 200)
        self.assertIn(b'Account created successfully', reg_response.data)

        # 2. Logout
        logout_res = self.client.get('/logout', follow_redirects=True)
        self.assertIn(b'logged out successfully', logout_res.data)

        # 3. Login
        login_res = self.client.post('/login', data={
            'email': test_email,
            'password': 'password123'
        }, follow_redirects=True)
        self.assertEqual(login_res.status_code, 200)
        self.assertIn(b'Candidate Portal', login_res.data)
        print("[PASS] Test 4: Candidate registration and login working.")

    def test_05_candidate_profile_update(self):
        """Test candidate updating their profile skills and education."""
        with self.client as c:
            # Login as demo candidate
            c.post('/login', data={'email': 'alex.seeker@example.com', 'password': 'candidate123'})

            # Update profile
            response = c.post('/profile', data={
                'full_name': 'Alex Rivera',
                'phone': '+1 (555) 999-8888',
                'skills': 'Python, Flask, JavaScript, SQLite, Git, Docker',
                'education': 'B.Tech in Computer Engineering (2024)',
                'experience': 'Experienced in full stack web development and testing.'
            }, follow_redirects=True)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Profile updated successfully', response.data)
            self.assertIn(b'Alex Rivera', response.data)
        print("[PASS] Test 5: Candidate profile update verified.")

    def test_06_candidate_apply_and_duplicate_prevention(self):
        """Test applying for a job, duplicate detection, and dashboard tracker."""
        with app.app_context():
            candidate = User.query.filter_by(email='test.candidate@codsoft.org').first()
            if not candidate:
                candidate = User(full_name='Test Seeker', email='test.candidate@codsoft.org', role='candidate')
                candidate.set_password('password123')
                db.session.add(candidate)
                db.session.commit()

            applied_ids = [a.job_id for a in candidate.applications]
            target_job = Job.query.filter(~Job.id.in_(applied_ids)).first() if applied_ids else Job.query.first()
            self.assertIsNotNone(target_job, "Target job found")
            target_job_id = target_job.id
            target_job_title = target_job.title

        with self.client as c:
            # Login as test candidate
            c.post('/login', data={'email': 'test.candidate@codsoft.org', 'password': 'password123'})

            # Apply
            apply_res = c.post(f'/apply/{target_job_id}', data={
                'cover_note': 'I am excited about this opening!'
            }, follow_redirects=True)
            self.assertEqual(apply_res.status_code, 200)
            self.assertIn(b'submitted successfully', apply_res.data)
            self.assertIn(target_job_title.encode(), apply_res.data)

            # Try applying again (Duplicate check)
            dup_res = c.post(f'/apply/{target_job_id}', data={
                'cover_note': 'Second try'
            }, follow_redirects=True)
            self.assertIn(b'already applied', dup_res.data)
        print("[PASS] Test 6: Job application & duplicate check verified.")

    def test_07_recruiter_login_and_dashboard(self):
        """Test pre-seeded recruiter login and metrics dashboard."""
        with self.client as c:
            response = c.post('/recruiter/login', data={
                'email': 'recruiter@careerhub.com',
                'password': 'recruiter123'
            }, follow_redirects=True)
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'Recruiter Dashboard', response.data)
            self.assertIn(b'Total Jobs Posted', response.data)
            self.assertIn(b'Total Applications', response.data)
        print("[PASS] Test 7: Recruiter login & dashboard verified.")

    def test_08_recruiter_post_and_edit_job(self):
        """Test recruiter posting a new job and editing it."""
        with self.client as c:
            c.post('/recruiter/login', data={
                'email': 'recruiter@careerhub.com',
                'password': 'recruiter123'
            })

            # Post a new job
            post_res = c.post('/recruiter/jobs/new', data={
                'title': 'Senior QA Automation Engineer',
                'company': 'TechNova QA Labs',
                'location': 'Remote',
                'job_type': 'Full-time',
                'salary': '$80,000 - $95,000 / year',
                'description': 'Leading automated testing suites and end-to-end regression.',
                'requirements': 'Selenium, Python, PyTest, CI/CD, Git'
            }, follow_redirects=True)
            self.assertEqual(post_res.status_code, 200)
            self.assertIn(b'published successfully', post_res.data)
            self.assertIn(b'Senior QA Automation Engineer', post_res.data)

            # Retrieve newly created job
            with app.app_context():
                created_job = Job.query.filter_by(title='Senior QA Automation Engineer').first()
                self.assertIsNotNone(created_job)
                created_job_id = created_job.id

            # Edit job
            edit_res = c.post(f'/recruiter/jobs/{created_job_id}/edit', data={
                'title': 'Lead QA Automation Engineer',
                'company': 'TechNova QA Labs',
                'location': 'Remote',
                'job_type': 'Full-time',
                'salary': '$95,000 - $110,000 / year',
                'description': 'Updated responsibilities and leadership scope.',
                'requirements': 'Selenium, Python, PyTest, Jenkins, CI/CD'
            }, follow_redirects=True)
            self.assertEqual(edit_res.status_code, 200)
            self.assertIn(b'updated successfully', edit_res.data)
            self.assertIn(b'Lead QA Automation Engineer', edit_res.data)
        print("[PASS] Test 8: Recruiter Post Job & Edit Job verified.")

    def test_09_recruiter_change_application_status(self):
        """Test recruiter changing candidate status (Pending -> Selected)."""
        with app.app_context():
            recruiter = User.query.filter_by(email='recruiter@careerhub.com').first()
            recruiter_job_ids = [j.id for j in recruiter.jobs]
            app_record = Application.query.filter(Application.job_id.in_(recruiter_job_ids)).first()
            self.assertIsNotNone(app_record)
            app_id = app_record.id

        with self.client as c:
            c.post('/recruiter/login', data={
                'email': 'recruiter@careerhub.com',
                'password': 'recruiter123'
            })

            # Change status to 'Selected'
            update_res = c.post(f'/recruiter/applications/{app_id}/status', data={
                'status': 'Selected'
            }, follow_redirects=True)
            self.assertEqual(update_res.status_code, 200)
            self.assertIn(b'Selected', update_res.data)

        # Verify in DB
        with app.app_context():
            refreshed = db.session.get(Application, app_id)
            self.assertEqual(refreshed.status, 'Selected')
        print(f"[PASS] Test 9: Application status update verified (Selected).")

    def test_10_recruiter_delete_job(self):
        """Test recruiter deleting a job posting."""
        with self.client as c:
            c.post('/recruiter/login', data={
                'email': 'recruiter@careerhub.com',
                'password': 'recruiter123'
            })

            with app.app_context():
                job_to_delete = Job.query.filter_by(title='Lead QA Automation Engineer').first()
                job_id = job_to_delete.id if job_to_delete else None

            if job_id:
                del_res = c.post(f'/recruiter/jobs/{job_id}/delete', follow_redirects=True)
                self.assertEqual(del_res.status_code, 200)
                self.assertIn(b'has been deleted', del_res.data)
        print("[PASS] Test 10: Recruiter Delete Job verified.")


if __name__ == '__main__':
    unittest.main()
