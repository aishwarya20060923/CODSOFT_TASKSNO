# CareerHub - Modern Job Portal Web Application
### CODSOFT Web Development Internship — Task 3

A clean, modern, responsive, and fully functional Job Portal web application connecting job seekers and employers. Built with Python Flask, SQLite (SQLAlchemy), and vanilla HTML5, CSS3, and JavaScript.

---

## 🌟 Key Features

### 👤 For Candidates (Job Seekers)
- **Browse & Search Jobs**: Explore all active job vacancies with dynamic search by keyword/title, location filter, and employment type filter (Full-time, Part-time, Remote, Contract, Internship).
- **Detailed Job Views**: Review full role descriptions, required skills, compensation tags, and company details.
- **Candidate Authentication**: Secure registration and login with encrypted passwords.
- **Candidate Profile Management**: Maintain full name, contact information, skills list, education, experience, and uploaded resume.
- **Job Applications**: 1-click application submission with duplicate application prevention.
- **Application Status Tracking**: Live dashboard tracker showing whether applications are **Pending**, **Shortlisted**, **Selected**, or **Rejected**.

### 🏢 For Recruiters (Employers)
- **Dedicated Recruiter Portal**: Secure recruiter sign-in and account registration.
- **Pre-seeded Demo Recruiter**: Ready-to-test recruiter account seeded automatically (`recruiter@careerhub.com` / `recruiter123`).
- **Recruiter KPI Dashboard**: Quick overview metrics for Total Jobs Posted, Total Applications Received, Pending Reviews, and Selected Candidates.
- **Job Management (CRUD)**:
  - Post new job listings with titles, company, location, salary, descriptions, and required skills.
  - Edit existing job openings.
  - Delete obsolete job listings with confirmation guards.
- **Application Management**:
  - Filter applicants by specific job opening or recruitment status.
  - Review candidate profile, email, phone number, and skills.
  - Download or view attached resumes.
  - Update candidate status directly (**Pending**, **Shortlisted**, **Selected**, **Rejected**).

---

## 🛠️ Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Backend** | Python 3.11+, Flask 3.1+ | Lightweight, fast, easy to run locally without complex setup |
| **Database** | SQLite + Flask-SQLAlchemy | Zero configuration, self-contained file database, clean ORM models |
| **Frontend** | HTML5, CSS3, JavaScript (ES6) | Pure modern vanilla web technologies; responsive mobile/desktop layout |
| **Security** | Werkzeug Security | Industry-standard password hashing (`pbkdf2:sha256`) & session cookies |

---

## 📁 Project Structure

```
CODSOFT_TASK3_CAREERHUB/
│
├── app.py                     # Main Flask application, routes, ORM models, auth guards & seeder
├── requirements.txt           # Python package dependencies
├── database/
│   └── careerhub.db           # SQLite database file (auto-generated on initial launch)
│
├── templates/
│   ├── base.html              # Base layout with navbar, alerts, footer & theme styling
│   ├── index.html             # Homepage: hero search, platform statistics, featured jobs
│   ├── jobs.html              # Job listings directory with filters & job cards
│   ├── job_details.html       # Full job description, required skills & apply form
│   ├── login.html             # Candidate login page (with demo credentials helper)
│   ├── register.html          # Candidate registration page
│   ├── candidate_dashboard.html # Candidate portal & live application tracker
│   ├── profile.html           # Candidate profile & resume upload editor
│   ├── recruiter_login.html   # Recruiter login page (with 1-click demo autofill)
│   ├── recruiter_register.html# Recruiter account signup
│   ├── recruiter_dashboard.html # Recruiter dashboard with metrics & recent applications
│   ├── recruiter_jobs.html    # Recruiter manage jobs: edit, delete & applicant counts
│   ├── post_job.html          # Post new job vacancy form
│   ├── edit_job.html          # Edit job vacancy form
│   └── applications.html      # Recruiter candidate review board & status updater
│
├── static/
│   ├── css/
│   │   └── style.css          # Clean corporate blue theme, responsive grid/flexbox
│   ├── js/
│   │   └── script.js          # Navbar toggle, auto-dismissing alerts, file upload labels
│   └── uploads/
│       └── resumes/           # Storage directory for candidate resumes
│
└── README.md                  # Comprehensive project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Python 3.8+** installed on your system.
Verify with:
```bash
python --version
```

### 2. Navigate to Project Directory
```bash
cd CODSOFT_TASK3_CAREERHUB
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

*(The database and 5 realistic sample jobs will be created automatically on first run!)*

---

## 🔑 Demo Credentials

To test both sides of the recruitment portal immediately:

### 🏢 Recruiter Account (Pre-seeded)
- **Email**: `recruiter@careerhub.com`
- **Password**: `recruiter123`
- *Access*: Full access to Post Jobs, Manage Jobs, View Applications, and Change Application Status.

### 👤 Candidate Account (Pre-seeded)
- **Email**: `alex.seeker@example.com`
- **Password**: `candidate123`
- *Access*: View Dashboard, Edit Profile, Download Sample Resume, Apply for Jobs, Track Application Status.

*(You can also register brand new Candidate or Recruiter accounts at any time via the registration pages!)*

---

## 🔄 User Workflows & Testing Guide

### Candidate Workflow
1. Go to `http://127.0.0.1:5000/`.
2. Click **Find Jobs** to search or filter by location (e.g. *Remote*) or type (*Full-time*).
3. Click **View Details** on any job card to read the role overview and qualifications.
4. Click **Job Seeker Login** (or **Register**) and log in with `alex.seeker@example.com` / `candidate123`.
5. Return to the job details page and click **Submit Application** (with an optional note).
6. Go to **My Dashboard** to verify that your application appears under **My Submitted Applications** with status **Pending** or **Shortlisted**.
7. Navigate to **My Profile** to update your contact details, skills, and upload a new resume.

### Recruiter Workflow
1. Click **Recruiter Portal** at top-right (or go to `http://127.0.0.1:5000/recruiter/login`).
2. Click the green **Auto-fill Recruiter Credentials** button and submit.
3. On the **Recruiter Dashboard**, observe:
   - Total Jobs Posted
   - Total Applications
   - Pending Reviews
   - Selected Candidates
4. Click **Post New Job** to publish a new vacancy.
5. Go to **Manage Jobs** to view all active openings, edit specs, or remove listings.
6. Click **All Applications** (or select a specific job) to review applicant details and resume files.
7. Change candidate application status via the dropdown (**Pending** ➔ **Shortlisted** ➔ **Selected** / **Rejected**).
8. Verify that the updated status instantly reflects on both the recruiter dashboard and the candidate's dashboard!

---

## 🔒 Security & Validation Details

- **Password Encryption**: All passwords stored using Werkzeug's secure hashing (`generate_password_hash`).
- **Session Protection**: Custom `@login_required`, `@candidate_required`, and `@recruiter_required` route decorators.
- **Duplicate Prevention**: Database-level unique constraint on `(job_id, candidate_id)` prevents accidental repeat applications.
- **Upload Safety**: Filenames sanitized using `secure_filename()` with allowed extension filtering (`.pdf`, `.doc`, `.docx`, `.txt`).

---

## 📜 Internship Declaration
This project is built exclusively for **CODSOFT Task 3 Web Development Internship**. It fulfills all functional specifications, UI guidelines, and architectural standards without external paid dependencies.
Updated for CODSOFT Task 3 submission.

