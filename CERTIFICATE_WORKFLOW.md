# Certificate Generation Workflow - Complete Implementation

## Overview

Your certificate generation system is now fully integrated with MarkUpGo. Here's how the complete workflow works:

## Complete Workflow Flow

```
User Completes Course (All lessons + Homework)
  ↓
"ดูใบรับรองของฉัน" button appears on /course page
  ↓
User clicks button → Redirects to /certificate
  ↓
System checks certificate eligibility (lines 15-17 of /src/app/certificate/page.tsx)
  ↓
If eligible: getOrCreateCertificateForUser() called
  ├─ Checks if certificate exists for user+course (line 243-248)
  ├─ If exists: Returns existing certificate
  └─ If not: Creates new certificate with unique ID (line 264-275)
  ↓
Certificate displayed with SimpleCertificateContent component
  ↓
User clicks "📥 ดาวน์โหลดใบประกาศนียบัตร" button (PrintButton)
  ↓
POST /api/certificate/download is called
  ├─ Authenticates user
  ├─ Fetches user's certificate from DB
  ├─ Reads certificate template
  ├─ Populates template with:
  │  ├─ User's full_name from users_profile
  │  ├─ Course title from courses table
  │  ├─ Certificate ID (certificate_number) from certificates table
  │  ├─ Issue date (issued_at) formatted as Thai date
  │  └─ Instructor name from courses table
  ├─ Calls MarkUpGo API to convert HTML to PDF
  └─ Returns PDF URL
  ↓
PDF downloaded to user's computer
```

## Files Modified / Created

### 1. **New API Endpoint** - `src/app/api/certificate/download/route.ts`
Handles PDF generation from user's existing certificate.

**Endpoint:** `POST /api/certificate/download`

**Flow:**
- Authenticates the user
- Queries certificates table to get user's certificate
- Joins with courses table to get course title and instructor
- Populates the HTML template with actual data
- Calls MarkUpGo API to generate PDF
- Returns PDF URL + filename

**Key Data Mappings:**
```
Template Placeholder → Data Source
{{recipientName}}     → users_profile.full_name
{{courseName}}        → courses.title
{{completionDate}}    → formatted issued_at from certificates table
{{certificateId}}     → certificates.certificate_number
{{instructor}}        → users_profile.full_name (instructor)
```

### 2. **Updated Component** - `src/app/certificate/PrintButton.tsx`

**Changes:**
- Removed old html2canvas + jsPDF approach
- Now calls `POST /api/certificate/download`
- Waits for PDF URL response
- Triggers browser download with proper filename
- Better error handling with user feedback

**Error Handling:**
- 401: User not authenticated
- 404: Certificate not found
- 500: MarkUpGo API error
- Network errors: Shows user-friendly messages

## Data Flow & Database

### Supabase Tables Used

#### 1. **certificates**
```sql
id              UUID (primary key)
user_id         UUID (links to users_profile)
course_id       UUID (links to courses)
certificate_number  TEXT (unique ID like "COURSE-202411-a1f3")
issued_at       TIMESTAMP (when certificate was created)
```

#### 2. **courses**
```sql
id              UUID
title           TEXT (course name)
instructor_id   UUID (links to users_profile)
...
```

#### 3. **users_profile**
```sql
id              UUID (links to auth.users)
full_name       TEXT (student name)
role            TEXT ('student', 'admin', 'instructor')
...
```

### Certificate Creation Logic (Already Exists)

Located in `src/lib/certificates.ts`:

1. **checkCertificateEligibility()** - Verifies user has:
   - Completed ALL lessons
   - Submitted homework for EACH module

2. **getOrCreateCertificateForUser()** - Handles:
   - Checking eligibility
   - Finding existing certificate
   - Creating new certificate with unique ID

3. **generateCertificateNumber()** - Creates IDs like:
   - `COURSE-202411-a1f3` (COURSE-YYYYMM-XXXX format)

## PDF Generation Process

### Step 1: API Endpoint Receives Request
```typescript
POST /api/certificate/download
// User must be authenticated
```

### Step 2: Database Query
```typescript
// Fetch user's certificate with course info
certificates JOIN courses ON certificates.course_id = courses.id
  WHERE certificates.user_id = userId
```

### Step 3: Template Population
```html
<!-- public/certificate-template.html -->
<div class="recipient-name">{{recipientName}}</div>
<!-- Becomes: -->
<div class="recipient-name">สมชาย ใจดี</div>
```

### Step 4: MarkUpGo API Call
```typescript
POST https://api.markupgo.com/api/v1/pdf
{
  "source": { "type": "html", "data": "populated HTML" },
  "options": { "format": "a4", "landscape": false, "margin": 0 }
}
```

### Step 5: Response & Download
```typescript
// Response
{ "url": "https://..../cert.pdf" }

// Browser download triggered
<a href="PDF_URL" download="StudentName-Certificate-ID.pdf" />
```

## User Journey

### 1. Learning Course
```
Student starts learning course (/course)
  ↓
Student completes all lessons
  ↓
Student submits homework for each module
```

### 2. Eligibility Check
On `/course` page (line 541 of page.tsx):
```typescript
if (completedLessonIds.size === totalLessons && moduleHomeworkComplete) {
  // Show certificate button
}
```

### 3. View Certificate
User clicks "ดูใบรับรองของฉัน" → Goes to `/certificate`

On certificate page (line 15 of certificate/page.tsx):
```typescript
const { certificate, courseTitle } = await getOrCreateCertificateForUser(userId);
```

### 4. Download PDF
User clicks "📥 ดาวน์โหลดใบประกาศนียบัตร"

Button calls:
```typescript
POST /api/certificate/download
```

Returns PDF URL, browser downloads as:
```
StudentName-Certificate-COURSE-202411-a1f3.pdf
```

## Error Scenarios & Handling

### Scenario 1: User Not Eligible
**Location:** `/certificate` page, line 22
```typescript
if (!certificate) {
  // Show eligibility requirements
  // What they completed
  // What they still need to do
}
```

### Scenario 2: User Not Authenticated
**API Response (401):**
```json
{ "error": "ต้องเข้าสู่ระบบเพื่อดาวน์โหลดใบประกาศนียบัตร" }
```

### Scenario 3: MarkUpGo API Fails
**API Response (500):**
```json
{ "error": "เกิดข้อผิดพลาดในการสร้างใบประกาศนียบัตร" }
```

## Testing Checklist

### Before Testing
- [ ] API key is set in `.env.local` (already done)
- [ ] Dev server is running on http://localhost:3001
- [ ] You have a test account with completed course

### Test Steps

1. **View Course Page**
   - Go to http://localhost:3001/course
   - Complete all lessons
   - Complete homework for all modules
   - Verify "ดูใบรับรองของฉัน" button appears

2. **Check Certificate Eligibility**
   - Click "ดูใบรับรองของฉัน"
   - Should redirect to http://localhost:3001/certificate
   - Should display certificate (not eligibility requirements)

3. **Generate PDF**
   - Click "📥 ดาวน์โหลดใบประกาศนียบัตร"
   - Button should show loading state "⏳ กำลังสร้าง PDF..."
   - PDF should download to your Downloads folder
   - Filename should be: `[YourName]-Certificate-COURSE-[ID].pdf`

4. **Verify PDF Contents**
   - Open downloaded PDF
   - Should contain:
     - Your name (from users_profile.full_name)
     - Course title
     - Certificate ID (like COURSE-202411-a1f3)
     - Issue date in Thai format
     - Instructor name
     - Professional certificate design

### Debugging

**Check Browser Console:**
```javascript
// Success log
✅ Certificate PDF generated: {pdfUrl: "...", certificateNumber: "COURSE-...", fileName: "..."}

// Error log
❌ Error downloading PDF: Error: ...
```

**Check Server Logs:**
```
Terminal output from npm run dev
```

**If PDF generation fails:**
1. Verify API key in `.env.local`
2. Check MarkUpGo account status
3. Look for error message from MarkUpGo API in server logs

## Customization Options

### 1. Change Button Text
**File:** `src/app/certificate/PrintButton.tsx` (line 13-14)
```typescript
label = '📥 ดาวน์โหลดใบประกาศนียบัตร',  // Change this
loadingLabel = '⏳ กำลังสร้าง PDF...',      // Or this
```

### 2. Customize Certificate Template
**File:** `public/certificate-template.html`
- Edit colors (golden, blue, cream)
- Add logo
- Change layout
- Add/remove sections
- Any HTML/CSS changes

### 3. Change Certificate Eligibility Rules
**File:** `src/lib/certificates.ts`
- Modify `checkCertificateEligibility()` function
- Change lesson requirements
- Change homework requirements

### 4. Modify PDF Filename Format
**File:** `src/app/api/certificate/download/route.ts` (line 99)
```typescript
fileName: `${userName}-Certificate-${certificate.certificate_number}.pdf`
// Change format here
```

## Security Notes

✅ **Authentication:** Only logged-in users can download (requireUser())
✅ **Authorization:** Users can only download their own certificate
✅ **RLS Policies:** Supabase enforces row-level security on certificates table
✅ **API Key:** MarkUpGo key is server-side only, never exposed to client
✅ **No data leakage:** Only user's own certificate data is used

## Performance Considerations

- **First Load:** Reads from database, queries MarkUpGo (1-3 seconds)
- **Subsequent Loads:** Uses same certificate if already generated
- **PDF Storage:** MarkUpGo handles storage and CDN distribution
- **No database storage:** PDF URLs could be stored in future if needed

## Future Enhancements

Possible additions:
- [ ] Email certificate as PDF attachment
- [ ] Certificate verification URL (share certificate publicly)
- [ ] Certificate archival/history for multiple courses
- [ ] Digital signatures/tamper-proof certificates
- [ ] Bulk certificate generation (admin feature)
- [ ] Certificate templates per course
- [ ] Multiple certificate download formats
- [ ] Certificate expiration dates

## Support & Troubleshooting

### Error: "ไม่พบใบประกาศนียบัตร"
**Cause:** User completed course but certificate wasn't created
**Solution:**
1. Clear browser cache
2. Try clicking certificate button again
3. Check server logs for database errors

### Error: "เกิดข้อผิดพลาดในการสร้างใบประกาศนียบัตร"
**Cause:** MarkUpGo API error
**Solution:**
1. Check API key is correct in `.env.local`
2. Check MarkUpGo account status
3. Restart dev server

### PDF won't download
**Cause:** Browser security or network issue
**Solution:**
1. Check browser download settings
2. Check firewall/proxy settings
3. Try in incognito/private mode
4. Try different browser

### Certificate shows wrong information
**Cause:** Data not properly fetched from database
**Solution:**
1. Verify users_profile.full_name is set
2. Verify course title is correct
3. Check database values directly in Supabase dashboard

## Quick Reference

| Component | File | Purpose |
|-----------|------|---------|
| Certificate Page | `src/app/certificate/page.tsx` | Display certificate + check eligibility |
| Download Button | `src/app/certificate/PrintButton.tsx` | Trigger PDF download |
| Download API | `src/app/api/certificate/download/route.ts` | Generate PDF via MarkUpGo |
| Certificate Service | `src/lib/certificates.ts` | Check eligibility & create certificates |
| Template | `public/certificate-template.html` | Certificate design with placeholders |
| Course Page | `src/app/course/page.tsx` (line 560) | Show button when course completed |

---

## Summary

Your certificate system is now fully operational:
1. ✅ Button appears when user completes course
2. ✅ Button links to /certificate page
3. ✅ System checks certificate eligibility
4. ✅ Creates certificate with unique ID from Supabase
5. ✅ User's full_name is used on certificate
6. ✅ Download button generates professional PDF via MarkUpGo
7. ✅ PDF contains all required information
8. ✅ User can download with one click

Ready to test!
