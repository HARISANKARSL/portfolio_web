# 🔐 Admin Dashboard - Quick Start Guide

## Overview
Your portfolio now has a complete admin dashboard system with:
- ✅ Cookie-based authentication (no localStorage)
- ✅ Protected routes (admin-only access)
- ✅ Dashboard sidebar layout
- ✅ 4 management pages (Skills, Experience, Projects, Team)
- ✅ Full CRUD operations (Add, Edit, Delete)
- ✅ Mobile-responsive design

---

## 🎯 How to Use

### Step 1: Access Login Page
```
Click "Login" button in the top-right (desktop) or navigation (mobile)
URL: http://localhost:5173/login
```

### Step 2: Login (Demo)
```
Email: any valid email format (e.g., user@example.com)
Password: any password (demo mode accepts anything)
Click "Login" → Redirects to admin dashboard
```

### Step 3: Access Admin Pages

**Desktop:** 
- Use fixed sidebar on the left
- Navigate between: Skills, Experience, Projects, Team

**Mobile:**
- Click hamburger menu icon
- Select page from drawer menu

---

## 📄 Admin Pages

### Skills Management (`/admin/skills`)
- **Add Skill:** Click "+ Add Skill" button
- **Form Fields:**
  - Skill Name (e.g., "React", "TypeScript")
  - Category (Frontend, Backend, Database, DevOps, Language, Tool)
  - Proficiency Level (Beginner, Intermediate, Advanced, Expert)
- **Actions:** Edit or Delete each skill
- **Display:** Table view with all skills

### Experience Management (`/admin/experience`)
- **Add Experience:** Click "+ Add Experience" button
- **Form Fields:**
  - Company name (required)
  - Position (required)
  - Start Date (month/year, required)
  - End Date (auto-hidden if "Current Role" checked)
  - Description (required)
  - Is Current Role (checkbox)
- **Status Badge:** Shows "Current" or "Previous"
- **Actions:** Edit or Delete each entry

### Projects Management (`/admin/projects`)
- **Add Project:** Click "+ Add Project" button
- **Form Fields:**
  - Project Title (required)
  - Description (required)
  - Technologies (comma-separated, required)
  - Image URL (optional)
  - Live URL (optional - clickable link)
  - GitHub URL (optional - clickable link)
- **Display:** Technologies shown as tags
- **Actions:** Edit or Delete each project

### Team Management (`/admin/team`)
- View current team members
- Future: Add team management features

---

## 🔐 Auth Flow

### Login Process
1. User clicks "Login" in navbar
2. Enters email & password
3. System validates (demo: accepts all)
4. **Stores in cookies:**
   - `token` (expires: 1 hour)
   - `refresh_token` (expires: 7 days)
5. Redirects to `/admin/skills`

### Protected Routes
```
ProtectedRoute component checks:
✓ Is token in cookies?
  ├─ YES → Allow access to admin page
  └─ NO → Redirect to /login
```

### Logout Process
1. Click "Logout" button in dashboard sidebar
2. Clears all cookies
3. Redirects to `/login`

---

## 🗂️ File Structure

```
src/
├── components/
│   ├── ProtectedRoute.tsx       ← Auth guard wrapper
│   ├── DashboardLayout.tsx      ← Admin layout with sidebar
│   ├── DesktopNav.tsx           ← Updated with Login button
│   └── MobileNav.tsx            ← Updated with Admin link
├── pages/
│   ├── Login.tsx                ← Updated with cookies
│   └── admin/
│       ├── Skills.tsx           ← Skills management
│       ├── Experience.tsx       ← Experience management
│       ├── Projects.tsx         ← Projects management
│       └── Team.tsx             ← Team management
└── App.tsx                      ← Updated with admin routes

services/
└── authService.ts               ← Cookie utilities (already existed)
```

---

## 🛣️ Route Structure

### Public Routes (No login required)
```
/               → Home page
/login          → Login page
/about          → About page
/skills         → Skills showcase
/projects       → Projects showcase
/analytics      → Analytics
/contact        → Contact page
```

### Admin Routes (Login required)
```
/admin/skills       ← Protected: Manage skills
/admin/experience   ← Protected: Manage experience
/admin/projects     ← Protected: Manage projects
/admin/team         ← Protected: Team management
```

---

## 💾 Data Storage

**Current:** Local state (data resets on page refresh)
**To Persist:** Connect to backend API

### Example API Integration
```typescript
// In Login.tsx - Replace demo logic with:
const response = await authService.login({ email, password });
authService.storeTokenData(
  response.access_token, 
  response.refresh_token
);

// In Skills.tsx - Add API calls:
const addSkillAPI = async (skill) => {
  const response = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authService.getCurrentToken()}` },
    body: JSON.stringify(skill)
  });
  return response.json();
};
```

---

## 🎨 Features Included

✅ **Desktop Sidebar**
- Fixed left sidebar (768px width on desktop)
- Smooth navigation between admin pages
- Logout button at bottom

✅ **Mobile Menu**
- Hamburger menu icon
- Slide-out drawer menu
- Close on navigation

✅ **Forms**
- Modal dialogs for add/edit
- Form validation
- Success/error messages

✅ **Tables**
- Responsive table layout
- Edit/Delete action buttons
- Empty state message

✅ **Authentication**
- Cookie-based (not localStorage)
- Token expiration handling
- Auto redirect on unauthorized access

---

## 🚀 Next Steps

### To Connect with Backend:
1. Update `authService.login()` to call your API
2. Update form handlers to call API endpoints
3. Add error handling for API failures
4. Implement token refresh logic

### To Add More Features:
- Search functionality in tables
- Pagination for large datasets
- Bulk delete/export
- Image upload for projects
- Drag-and-drop reordering

---

## 🆘 Troubleshooting

**Issue:** Can't access admin pages after login
- Clear browser cookies: Settings → Cookies → Delete all
- Try login again

**Issue:** Login button not showing
- Make sure `authService.isAuthenticated()` is working
- Check browser DevTools → Console for errors

**Issue:** Data not persisting
- This is expected in demo mode (local state only)
- Connect to backend API to persist data

**Issue:** Styling looks off
- Make sure Tailwind CSS is loaded
- Check DevTools → Elements → Computed styles

---

## 📝 Code Examples

### Login with Real API
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authService.login({ email, password });
    authService.storeTokenData(
      response.access_token, 
      response.refresh_token
    );
    navigate("/admin/skills");
  } catch (error) {
    setError("Invalid credentials");
  }
};
```

### Protect a Route
```typescript
<Route
  path="/admin/skills"
  element={
    <ProtectedRoute>
      <SkillsAdmin />
    </ProtectedRoute>
  }
/>
```

### Check Auth Status
```typescript
import { authService } from "@/services/authService";

const isLoggedIn = authService.isAuthenticated();
const token = authService.getCurrentToken();
authService.logout(); // Clear cookies and redirect
```

---

## ✨ You're All Set!

Your admin dashboard is ready to use. Start by:
1. Running `npm run dev`
2. Clicking "Login" in the navbar
3. Accessing the Skills management page
4. Adding your first skill!

Happy coding! 🚀
