# My Course Platform

A modern, full-featured learning management system built with Next.js and Supabase. Designed for educators to create, manage, and deliver structured courses with sequential lesson unlocking, homework assignments, and completion certificates.

## 🎯 Project Overview

**My Course Platform** is a simple yet powerful one-course learning platform that enables educators to:
- Create structured courses with modules and lessons
- Manage student progress and track completion
- Collect and grade homework assignments
- Issue certificates upon course completion
- Administer users and course content from a dedicated dashboard

The platform supports both **Student** and **Admin** roles with role-based access controls. Students can progress through lessons sequentially, submit homework, and earn certificates. Admins can manage all courses, modules, lessons, users, and homework submissions.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Rich Text Editor**: Tiptap
- **Video Hosting**: BunnyStream (embedded via iframe)
- **Deployment**: Vercel (recommended)

## ✨ Features

### Student Features
- **User Authentication**: Secure registration and login
- **Course Browsing**: View available courses with modules and lessons
- **Sequential Lesson Unlocking**: Progress through lessons in order
- **Lesson Tracking**: Mark lessons as complete and track progress
- **Homework Submission**: Submit homework for each module (multiple submissions allowed)
- **Certificates**: Earn completion certificates upon finishing all lessons and homework
- **Profile Management**: View and manage personal information

### Admin Features
- **Dashboard**: Overview of users, courses, submissions, and pending homework
- **Course Management**: Create, edit, and delete courses
- **Module Management**: Create, edit, and delete course modules with automatic ordering
- **Lesson Management**: Create, edit, and delete lessons with content editing
- **Video Integration**: Embed videos from BunnyStream directly in lessons
- **User Management**: Create, view, edit, and manage user accounts
- **Homework Review**: View and grade student submissions with feedback
- **Role Management**: Assign and manage user roles (student, admin, instructor)

### Admin API Endpoints
- **User Management API**: Create, list, update, and delete users programmatically
- **Course Management API**: Manage courses via API endpoints
- **Module Management API**: Manage modules via API endpoints
- **Lesson Management API**: Manage lessons via API endpoints
- **Authentication**: Secure API access using service role keys

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Supabase Account**: Free tier available at [supabase.com](https://supabase.com)
- **BunnyStream Account**: For video hosting (optional, for video features)
- **Vercel Account**: For deployment (optional)

## 🚀 Setup Instructions (Local Development)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-course-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from Settings > API
3. Note your **Service Role Key** (keep this secret!)

### 4. Set Up the Database

1. In the Supabase dashboard, go to the **SQL Editor**
2. Create a new query and copy the contents of `schema.sql` from this repository
3. Execute the query to create all tables and triggers
4. Then copy the contents of `rls_policies_production.sql` and execute it to enable Row-Level Security policies

**Note**: The schema includes the following tables:
- `users_profile` - User profiles and roles
- `courses` - Course definitions
- `modules` - Course modules
- `lessons` - Individual lessons
- `lesson_progress` - Student progress tracking
- `homework_submissions` - Student homework and grades
- `certificates` - Course completion certificates

### 5. Enable Row-Level Security (RLS)

1. Navigate to **Settings > Database > RLS** in Supabase
2. Verify that RLS policies from `rls_policies_production.sql` are applied
3. Ensure policies restrict access appropriately:
   - Students can only view their own progress and submissions
   - Admins can view all data

### 6. Set Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 7. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 8. Create Your First Admin User

1. Navigate to [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Register an account with a valid email and password
3. After registration, manually update your user in Supabase:
   - Go to **Settings > Auth > Users** in your Supabase project
   - Find your user
   - Go to the `users_profile` table and update your `role` to `'admin'`

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (public) | `https://xyz123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous API key (public) | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (private, keep secret!) | `eyJhbGciOiJIUzI1NiIs...` |

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## 📦 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New > Project**
3. Select your GitHub repository
4. Click **Import**

### 3. Set Environment Variables

1. In the Vercel project settings, go to **Settings > Environment Variables**
2. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Click **Deploy**

### 4. Verify Deployment

- Your app will be live at a `.vercel.app` URL
- Test login and course functionality
- Verify environment variables are correctly set

## 📖 How to Use

### For Students

1. **Register & Login**
   - Go to [/auth/register](http://localhost:3000/auth/register) to create an account
   - Go to [/auth/login](http://localhost:3000/auth/login) to log in

2. **Access Your Profile**
   - Click the user menu and select "Profile" to view your information

3. **View Available Courses**
   - Navigate to the course page to see all available modules and lessons

4. **Progress Through Lessons**
   - Lessons must be completed sequentially
   - Click "Mark as Complete" to progress
   - Watch embedded videos and read lesson content

5. **Submit Homework**
   - After reading each module's lessons, submit homework from the module page
   - You can submit multiple times (latest submission is graded)

6. **Earn Your Certificate**
   - Once all lessons are marked complete and all homework is graded, your certificate will be issued
   - View and print your certificate from the certificate page

### For Admins

1. **Access Admin Dashboard**
   - Log in with an admin account
   - Click the menu and select "Admin Dashboard"

2. **Create a Course**
   - Go to **Course Management**
   - Click "Create Course"
   - Enter course title and description
   - You will automatically be assigned as the instructor

3. **Add Modules to Course**
   - Open the course
   - Click "Add Module"
   - Enter module title and description
   - Modules are automatically ordered

4. **Add Lessons to Module**
   - Open a module
   - Click "Add Lesson"
   - Enter lesson title and description
   - Add lesson content (rich text editor)
   - Optionally add a BunnyStream video embed URL

5. **Manage Users**
   - Go to **User Management**
   - View all registered users
   - Create new users (via admin panel or API)
   - Edit user roles and information
   - Deactivate users

6. **Review & Grade Homework**
   - Go to **Homework Review**
   - View pending and graded submissions
   - Filter by status (pending, graded, etc.)
   - Add feedback and grades to submissions

## 🔌 API Endpoints for Automation

All admin API endpoints require authentication. You can authenticate with:
- **Session Cookie** (via browser login), or
- **Bearer Token** (using `SUPABASE_SERVICE_ROLE_KEY`)

### User Management Endpoints

#### List All Users
```
GET /api/admin/users?limit=10&offset=0
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

**Query Parameters (all optional):**
- `limit` (default: 10, max: 100) - Results per page
- `offset` (default: 0) - Pagination offset
- `role` - Filter by role: `admin`, `student`, `instructor`
- `is_active` - Filter by status: `true` or `false`
- `search` - Search by email or full_name (partial match)
- `sort_by` - Sort field: `created_at`, `email`, `full_name` (default: `created_at`)
- `sort_order` - Sort direction: `asc` or `desc` (default: `desc`)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-here",
      "email": "student@example.com",
      "full_name": "John Doe",
      "role": "student",
      "created_at": "2024-01-15T10:30:00Z",
      "is_active": true
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

**Examples:**
```bash
# Get first 10 users sorted by creation date
GET /api/admin/users?limit=10&offset=0

# Get all students
GET /api/admin/users?role=student&limit=100

# Search by email
GET /api/admin/users?search=john@example.com

# Get active admins sorted by name
GET /api/admin/users?role=admin&is_active=true&sort_by=full_name&sort_order=asc
```

For detailed usage examples and n8n integration, see [GET_USERS_API_GUIDE.md](./GET_USERS_API_GUIDE.md)

#### Create a New User
```
POST /api/admin/users
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "full_name": "Jane Doe",
  "role": "student"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "newuser@example.com",
  "full_name": "Jane Doe",
  "role": "student",
  "created_at": "2024-01-20T14:20:00Z",
  "is_active": true
}
```

#### Update a User
```
PATCH /api/admin/users/[userId]
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

**Request Body:**
```json
{
  "full_name": "Jane Smith",
  "role": "admin",
  "is_active": true
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "newuser@example.com",
  "full_name": "Jane Smith",
  "role": "admin",
  "created_at": "2024-01-20T14:20:00Z",
  "is_active": true
}
```

#### Delete a User
```
DELETE /api/admin/users/[userId]
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "id": "uuid-here"
}
```

### Course Management Endpoints

#### Create a Course
```
POST /api/admin/courses
```

**Request Body:**
```json
{
  "title": "Web Development 101",
  "description": "Learn the basics of web development"
}
```

#### Get Course Details
```
GET /api/admin/courses/[courseId]
```

#### Update a Course
```
PATCH /api/admin/courses/[courseId]
```

**Request Body:**
```json
{
  "title": "Advanced Web Development",
  "description": "Master web development"
}
```

### Module Management Endpoints

#### Create a Module
```
POST /api/admin/modules
```

**Request Body:**
```json
{
  "course_id": "course-uuid",
  "title": "Introduction to HTML",
  "description": "Learn HTML basics"
}
```

#### Get Module Details
```
GET /api/admin/modules/[moduleId]
```

#### Update a Module
```
PATCH /api/admin/modules/[moduleId]
```

### Lesson Management Endpoints

#### Create a Lesson
```
POST /api/admin/lessons
```

**Request Body:**
```json
{
  "module_id": "module-uuid",
  "title": "HTML Tags and Structure",
  "description": "Learn about HTML tags",
  "content": "<h1>Welcome</h1><p>HTML basics...</p>",
  "bunny_embed_url": "https://iframe.mediadelivery.net/embed/..."
}
```

#### Get Lesson Details
```
GET /api/admin/lessons/[lessonId]
```

#### Update a Lesson
```
PATCH /api/admin/lessons/[lessonId]
```

### Student Progress Endpoints

#### Mark Lesson as Complete
```
POST /api/progress/lesson
```

**Request Body:**
```json
{
  "lessonId": "lesson-uuid",
  "completed": true
}
```

### Homework Endpoints

#### Submit Homework
```
POST /api/homework
```

**Request Body:**
```json
{
  "moduleId": "module-uuid",
  "content": "My homework submission text..."
}
```

**Response:**
```json
{
  "id": "submission-uuid",
  "user_id": "user-uuid",
  "module_id": "module-uuid",
  "submitted_at": "2024-01-20T16:45:00Z",
  "status": "pending"
}
```

## 📋 Database Schema

The application uses the following main tables in Supabase PostgreSQL:

- **`users_profile`** - User accounts and roles
- **`courses`** - Course definitions
- **`modules`** - Course modules (contains lessons)
- **`lessons`** - Individual lessons within modules
- **`lesson_progress`** - Tracks student progress through lessons
- **`homework_submissions`** - Student homework with grades and feedback
- **`certificates`** - Issued certificates upon course completion

See `schema.sql` for the complete database schema.

## 🔒 Security Features

- **Row-Level Security (RLS)**: Policies enforce that students can only access their own data
- **Authentication**: Supabase Auth with email/password
- **Authorization**: Role-based access control (student, admin, instructor)
- **API Security**: Service role keys required for admin API operations
- **Environment Variables**: Sensitive keys kept private in `.env.local`

## 🚧 Future Improvements

- **Multi-course Support**: Allow students to enroll in multiple courses
- **Real-time Notifications**: Notify admins of new submissions or students of grades
- **Advanced Analytics**: Dashboard with course completion rates and student performance metrics
- **Discussion Forums**: Allow students to ask questions and interact in course-specific forums
- **Quizzes & Tests**: Add automated quizzes with instant feedback
- **Bulk User Import**: CSV upload for importing student lists
- **Email Notifications**: Automated emails for certificate issuance and homework reminders
- **Mobile App**: React Native app for iOS and Android
- **Payment Integration**: Support course enrollment fees with Stripe
- **Peer Review**: Students review each other's homework assignments
- **Content Versioning**: Track and restore previous versions of lessons
- **Advanced Search**: Full-text search across course content

## 📞 Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

## 📄 License

This project is provided as-is. Feel free to modify and use it for your learning platform.

---

**Last Updated**: November 2024
**Built with Next.js 16 and Supabase**
