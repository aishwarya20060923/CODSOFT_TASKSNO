# EduManage - Student Management System
### CodSoft Full-Stack Web Development Internship • Task 1

![EduManage Banner](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80)

EduManage is a modern, full-stack educational management platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. It eliminates cumbersome paperwork and manual student record-keeping by providing dedicated, role-based dashboards for **Administrators**, **Teachers**, and **Students**.

---

## 🌟 Key Features

### 1. 🛡️ Administrator Dashboard (`/admin`)
- **Institutional Telemetry**: Live KPI cards for total enrolled students, appointed faculty, campus attendance rate, and fee realization metrics.
- **Student Admissions Directory**: Searchable and filterable student roster with quick student enrollment modal.
- **Faculty Management**: Track academic departments, designations, assigned courses, and appoint new instructors.
- **Curriculum & Classes**: Overview of class sections, assigned home-room advisers, and subject schedules.
- **Institutional Fee Accounting**: Real-time fee ledger, invoice creation, and payment verification.

### 2. 👨‍🏫 Faculty / Teacher Portal (`/teacher`)
- **Teaching Overview**: Instant access to assigned cohorts and daily class timetable.
- **Interactive Daily Attendance Marker**: Select class and calendar date, mark students as **Present**, **Absent**, or **Late** with one-click batch options ("Mark All Present"), and record tardy notes.
- **Examination & Gradebook**: Record subject evaluation marks (0–100) with automatic, real-time letter grade calculation (A+, A, B, C, F), class averages, and publish marks with instant feedback.

### 3. 🎓 Student Portal (`/student`)
- **Personalized Student Dashboard**: View GPA standing, attendance compliance, and upcoming exam schedules.
- **Official Attendance History**: Track attendance compliance percentage with day-by-day logs and teacher notes.
- **Semester Academic Report Card**: Formal institutional report card with subject scores, maximum marks, final standing, and a **Print / Download Transcript** button.
- **Fee Receipts & Online Payment**: View fee breakdowns (Tuition, Lab, Sports), paid receipts, and clear pending dues with a simulated payment gateway.

### 4. ⚡ Instant Demo Role Switcher
- A convenient role switcher in the top navigation allows seamless toggling between **Admin**, **Teacher**, and **Student** views without cumbersome logout cycles — perfect for video demonstrations!

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Server Actions)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Database & ORM**: Prisma ORM with SQLite (100% compatible with PostgreSQL / Supabase / Neon)
- **Tooling**: Node.js, `tsx` for automated database seeding

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/CODSOFT_TASK1.git
cd CODSOFT_TASK1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database & Seed Mock Data
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts Pre-loaded

| Role | Name | Email / Roll | Key Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Anandita Verma | `admin@edumanage.edu.in` | Full institutional oversight, admissions, faculty, and fee accounting |
| **Teacher** | Prof. Rajesh Sharma | `rajesh.sharma@edumanage.edu.in` | Class advisory, daily attendance register, exam grading |
| **Student** | Aarav Sharma | `STU-2026-001` | Grades transcript, attendance compliance, UPI/Net Banking fee payment portal |

---

## 📹 Video Walkthrough Script (For LinkedIn Submission)

Here is a 2-3 minute script you can follow when recording your screen for the CodSoft task submission:

1. **Introduction (0:00 - 0:30)**:
   - Introduce yourself and mention you are showcasing **Task 1: Student Management System** for your **CodSoft Full-Stack Web Development Internship**.
   - Show the Landing Page (`/`) and highlight the tech stack (Next.js, TypeScript, Tailwind CSS, Prisma).

2. **Admin Portal Demo (0:30 - 1:15)**:
   - Click **Admin** on the top role switcher.
   - Show the analytics cards (Total students, faculty count, fee collection).
   - Navigate to **Students Directory** to demonstrate search and the "Enroll New Student" modal.
   - Show the **Fee Management** ledger.

3. **Teacher Portal Demo (1:15 - 1:55)**:
   - Switch to **Teacher** via the top switcher.
   - Open the **Daily Attendance** register, click **Mark All Present**, change one student to "Late" with a note, and hit **Save Register**.
   - Open **Exams & Gradebook**, show dynamic letter grade calculation when updating marks, and click **Save & Publish**.

4. **Student Portal Demo (1:55 - 2:30)**:
   - Switch to **Student** (Alex Morgan).
   - View the GPA card and personal attendance log.
   - Show the **Official Academic Report Card** and the print view.
   - Go to **Fees & Invoices**, click **Pay Online Now**, confirm payment, and watch the status change to **PAID** instantly.

5. **Conclusion (2:30 - 2:45)**:
   - Thank CodSoft for the opportunity and share your GitHub repository link.
   - Post on LinkedIn with hashtags `#codsoft #internship #webdevelopment #fullstack`.
