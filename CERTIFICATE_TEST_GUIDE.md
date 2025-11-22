# Certificate Download Feature - Testing Guide

## ✅ System Status

Your certificate system is **FULLY INTEGRATED** and ready to test!

**Key Component Status:**
- ✅ API Key: Configured in `.env.local`
- ✅ Dev Server: Running on http://localhost:3001
- ✅ Certificate Eligibility: Working (check logs show "eligible=true")
- ✅ API Endpoint: `/api/certificate/download` created
- ✅ PrintButton: Updated to use MarkUpGo PDF generation
- ✅ Database: All tables ready (certificates, courses, users_profile)

## Quick Test (5 Minutes)

### What You'll Do

1. Log in as a student who completed the course
2. Go to /course page
3. Click "ดูใบรับรองของฉัน" button
4. Click "📥 ดาวน์โหลดใบประกาศนียบัตร" button
5. Verify PDF downloads with correct information

### Step-by-Step

#### Step 1: Access the Application
- Open: http://localhost:3001
- You should see login page or dashboard

#### Step 2: Ensure You Have a Completed Course
**Prerequisite:** You need a test account with:
- ✅ All course lessons completed
- ✅ Homework submitted for each module

**If you don't have a test user:**
1. Create a new account via login/signup
2. Complete all course lessons (mark as complete)
3. Submit homework for each module
4. Then proceed to Step 3

#### Step 3: Navigate to Course Page
```
URL: http://localhost:3001/course
```

**What you should see:**
- Course title and description
- List of all modules and lessons
- Progress bar showing "X / Y บทเรียน"
- At the bottom: Completion message with TWO buttons:
  1. "📥 ดาวน์โหลดใบประกาศนียบัตร" (Gold/yellow button) ← This is new!
  2. "← กลับไปเรียนเพิ่มเติม" (Black button)

**If you don't see the certificate button:**
❌ Course is not fully completed - complete all lessons and homework first

#### Step 4: Click Certificate Button
Click the gold button: **"ดูใบรับรองของฉัน"**

You'll be taken to: http://localhost:3001/certificate

**What you should see:**
- "ยินดีด้วย!" celebration header with emoji
- Beautiful certificate display with:
  - Your name
  - Course title
  - Certificate ID (like COURSE-202411-a1f3)
  - Issue date in Thai format
  - Instructor name
  - Professional design matching your brand colors
- TWO action buttons below:
  1. "📥 ดาวน์โหลดใบประกาศนียบัตร" (Gold button) ← This is the new feature
  2. "← กลับไปเรียนเพิ่มเติม" (Black button)
- Share section below

#### Step 5: Download PDF Certificate
Click the gold button: **"📥 ดาวน์โหลดใบประกาศนียบัตร"**

**Expected Behavior:**
1. Button text changes to: "⏳ กำลังสร้าง PDF..." (loading state)
2. System calls `/api/certificate/download` endpoint
3. Endpoint:
   - Authenticates your user
   - Fetches your certificate data from database
   - Populates HTML template with your info
   - Calls MarkUpGo API to generate PDF
4. Browser downloads PDF file with name like:
   ```
   [YourName]-Certificate-COURSE-202411-a1f3.pdf
   ```
5. Button returns to normal state

**Where to find the PDF:**
- Check your Downloads folder
- File name: `[YourName]-Certificate-COURSE-[ID].pdf`

#### Step 6: Verify PDF Contents
Open the downloaded PDF and verify:
- ✅ Your full name displayed
- ✅ Course title shown
- ✅ Certificate ID matches (COURSE-202411-XXXX format)
- ✅ Issue date in Thai format
- ✅ Instructor name
- ✅ Professional certificate design
- ✅ Matches your brand colors (Golden, Blue, Cream)

## Detailed Feature Testing

### Test 1: Certificate Generation
**Objective:** Verify certificate is created in database

**Steps:**
1. Go to `/certificate` page
2. If first time: certificate should be auto-created
3. If subsequent times: existing certificate should be returned

**How to verify:**
- Check Supabase dashboard
- Navigate to: certificates table
- Look for a row with your user_id
- Column `certificate_number` should have a value like: `COURSE-202411-a1f3`
- Column `issued_at` should have today's date

**Expected Result:** ✅ Certificate row exists with unique ID

---

### Test 2: PDF Download
**Objective:** Verify PDF generates correctly via MarkUpGo

**Steps:**
1. Go to `/certificate` page
2. Click "📥 ดาวน์โหลดใบประกาศนียบัตร"
3. Wait for PDF to download

**What happens behind the scenes:**
```
1. POST /api/certificate/download called
   ↓
2. User authentication verified
   ↓
3. Database query:
   - SELECT certificate FROM certificates WHERE user_id = 'YOUR_ID'
   - JOIN courses to get title & instructor
   - JOIN users_profile to get full_name
   ↓
4. HTML Template populated with:
   - Your full_name
   - Course title
   - Certificate ID
   - Formatted date
   - Instructor name
   ↓
5. MarkUpGo API called:
   - POST https://api.markupgo.com/api/v1/pdf
   - Passes: populated HTML + formatting options
   ↓
6. Response received:
   - { "url": "https://..../cert.pdf" }
   ↓
7. Browser downloads PDF file
```

**Monitoring Tools:**

**Browser Console (F12 → Console Tab):**
```
✅ Calling certificate download API...
✅ Certificate PDF generated: {
  pdfUrl: "https://...",
  certificateNumber: "COURSE-202411-a1f3",
  fileName: "YourName-Certificate-COURSE-202411-a1f3.pdf"
}
✅ PDF downloaded successfully
```

**Server Console (Terminal running npm run dev):**
```
POST /api/certificate/download 200 in XXms
```

**Expected Result:** ✅ PDF downloads successfully

---

### Test 3: Data Accuracy
**Objective:** Verify all certificate data is correct

**Steps:**
1. Download PDF (as above)
2. Open PDF and check each field:

| Field | Should Show | From Database |
|-------|-------------|---------------|
| Student Name | Your full name | users_profile.full_name |
| Course Title | Your course name | courses.title |
| Certificate ID | Like COURSE-202411-a1f3 | certificates.certificate_number |
| Issue Date | Today in Thai format | certificates.issued_at (formatted) |
| Instructor | Course instructor name | users_profile.full_name (instructor) |

**How to verify in database:**
1. Open Supabase dashboard
2. View `certificates` table → Find your row
3. Note: `certificate_number` value
4. View `courses` table → Find corresponding course
5. Note: `title` and `instructor_id` values
6. View `users_profile` table → Find instructor by ID
7. Note: `full_name` value
8. Open downloaded PDF
9. Verify all values match

**Expected Result:** ✅ All data matches database

---

### Test 4: Multiple Downloads
**Objective:** Verify same certificate doesn't get created twice

**Steps:**
1. First download: Download PDF once (certificate created)
2. Second download: Go back to `/certificate` page
3. Third download: Click button again, download another PDF

**What should happen:**
- Both PDFs should have SAME certificate ID
- Both downloads should succeed
- Database should only have ONE certificate row for this user

**How to verify:**
1. Open both PDF files
2. Check certificate IDs - should be IDENTICAL
3. Check Supabase dashboard
4. Count rows in certificates table for your user_id
5. Should have EXACTLY 1 row

**Expected Result:** ✅ No duplicate certificates created

---

### Test 5: Error Handling
**Objective:** Verify errors are handled gracefully

#### Test 5a: Not Authenticated
**Steps:**
1. Log out
2. Try accessing `/certificate` directly via URL
3. Should be redirected to login

**Expected Result:** ✅ Redirects to login page

#### Test 5b: Incomplete Course
**Steps:**
1. Create new user account
2. Don't complete all lessons
3. Try accessing `/certificate`

**Expected Result:** ✅ Shows eligibility requirements, not certificate

#### Test 5c: Missing API Key (Simulate)
**Steps:**
1. Open .env.local
2. Temporarily remove or corrupt MARKUPGO_API_KEY
3. Try downloading certificate
4. Check browser console and error message

**Expected Result:** ✅ Shows error message about PDF generation

---

## Troubleshooting

### Problem 1: Button Not Showing
**Symptom:** "ดูใบรับรองของฉัน" button doesn't appear at bottom of /course

**Possible Causes:**
1. Course not completed
2. Not logged in
3. Browser cache

**Solution:**
1. Verify all lessons marked as completed
2. Verify homework submitted for all modules
3. Refresh page (Ctrl+R)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Logout and login again

---

### Problem 2: Certificate Download Fails
**Symptom:** Button shows loading, then nothing happens

**Possible Causes:**
1. API key not configured
2. MarkUpGo service down
3. Network issue

**Solution:**
1. Check .env.local has `MARKUPGO_API_KEY=926797b8-26f5-4015-ba35-101ffa657046`
2. Check server logs for errors
3. Try in different browser
4. Check firewall/proxy settings

**Debug Steps:**
1. Open browser F12 → Console tab
2. Try downloading again
3. Look for error messages
4. Note the error and check troubleshooting guide

---

### Problem 3: Wrong Information on PDF
**Symptom:** PDF shows wrong name, course, or instructor

**Possible Causes:**
1. Database data is incorrect
2. Template placeholders not matching

**Solution:**
1. Check Supabase dashboard values
2. Verify users_profile.full_name is set correctly
3. Verify courses.title is correct
4. Ask admin to correct database data

---

### Problem 4: PDF Won't Open
**Symptom:** PDF downloads but can't open

**Possible Causes:**
1. File corrupted in download
2. PDF reader not installed
3. Browser blocked download

**Solution:**
1. Try downloading again
2. Check download settings in browser
3. Try opening with different PDF reader
4. Try in different browser
5. Try in incognito/private mode

---

## Success Criteria Checklist

### ✅ You've successfully tested if:

- [ ] You can see "ดูใบรับรองของฉัน" button when course is completed
- [ ] Button takes you to `/certificate` page
- [ ] Certificate is displayed with your information
- [ ] PDF download button is visible
- [ ] Clicking download button shows loading state
- [ ] PDF downloads to your computer
- [ ] PDF filename contains your name and certificate ID
- [ ] PDF opens and displays correctly
- [ ] PDF shows correct student name
- [ ] PDF shows correct course title
- [ ] PDF shows correct certificate ID
- [ ] PDF shows correct issue date
- [ ] PDF shows correct instructor name
- [ ] PDF has professional design matching your brand
- [ ] Downloading again doesn't create new certificate
- [ ] Error messages are user-friendly if something goes wrong

### 🎉 All checks passed? Perfect!

Your certificate generation system is **fully functional** and ready for production use.

---

## Performance Expectations

**Typical Timings:**
- Load `/certificate` page: 1-2 seconds
- Generate PDF: 1-3 seconds (depends on MarkUpGo)
- Download PDF: Instant
- **Total time:** 2-5 seconds from button click to file downloaded

---

## Next Steps

1. **Test thoroughly** using this guide
2. **Share** with a few real users to test
3. **Collect feedback** on UI/UX
4. **Monitor** logs for any errors
5. **Document** any issues you find
6. **Deploy** to production when confident

---

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Check **Browser Console** (F12) for error messages
3. Check **Server Logs** (terminal running npm run dev)
4. Check **Supabase Dashboard** for data verification
5. Review **CERTIFICATE_WORKFLOW.md** for technical details

---

Happy Testing! 🎉
