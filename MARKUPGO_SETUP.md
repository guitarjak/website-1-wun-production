# MarkUpGo Certificate Generation Setup

## Overview

This document explains how to use MarkUpGo for generating professional certificates in your course platform. MarkUpGo is a serverless API that converts HTML to PDF with high quality and reliability.

## What's Been Set Up

### 1. **Environment Configuration**
- **File**: `.env.local`
- **Variable**: `MARKUPGO_API_KEY`
- **Status**: Add your API key here

### 2. **MarkUpGo Service** (`src/lib/markupgo-certificate.ts`)
Core utility functions:
- `generateCertificatePDF()` - Converts HTML to PDF via MarkUpGo API
- `downloadCertificate()` - Browser-side PDF download
- Template population logic with dynamic data

### 3. **Certificate Template** (`public/certificate-template.html`)
Professional certificate design with:
- Custom color scheme matching your brand (Golden, Blue, Cream)
- Decorative borders and corners
- Dynamic placeholders for:
  - `{{recipientName}}` - Student name
  - `{{courseName}}` - Course title
  - `{{completionDate}}` - Date completed
  - `{{courseCode}}` - Optional course code
  - `{{instructor}}` - Instructor name
  - `{{certificateId}}` - Unique certificate ID

### 4. **API Endpoint** (`src/app/api/certificate/generate/route.ts`)
POST endpoint for certificate generation:
- Validates required fields
- Reads and populates template
- Calls MarkUpGo API
- Returns PDF URL

### 5. **Frontend Component** (`src/components/CertificateGenerator.tsx`)
Interactive React component featuring:
- Form for certificate details
- Real-time preview of generated certificates
- One-click download functionality
- Error handling and loading states
- Responsive design matching your brand

### 6. **Generate Page** (`src/app/certificate/generate/page.tsx`)
Ready-to-use page at `/certificate/generate`

## Setup Instructions

### Step 1: Add Your MarkUpGo API Key

1. Go to your MarkUpGo dashboard account
2. Find your API key in the settings/account section
3. Update `.env.local`:
```
MARKUPGO_API_KEY=your_actual_api_key_here
```

### Step 2: Test the Setup

Start your development server:
```bash
npm run dev
```

Navigate to: `http://localhost:3000/certificate/generate`

Fill in the form and click "Generate Certificate"

## API Endpoint Documentation

### POST `/api/certificate/generate`

**Request Body:**
```json
{
  "recipientName": "John Doe",
  "courseName": "Introduction to Web Development",
  "completionDate": "November 21, 2024",
  "certificateId": "CERT-1234567890",
  "instructor": "Jane Smith",
  "courseCode": "WEB101"
}
```

**Required Fields:**
- `recipientName` (string)
- `courseName` (string)
- `completionDate` (string)
- `certificateId` (string)

**Optional Fields:**
- `instructor` (string, defaults to "Course Team")
- `courseCode` (string)

**Response (Success):**
```json
{
  "success": true,
  "pdfUrl": "https://...",
  "message": "Certificate generated successfully"
}
```

**Response (Error):**
```json
{
  "error": "Error message describing the issue"
}
```

## Using the Certificate Generation in Your App

### Option 1: Use the Pre-built Component
```tsx
import CertificateGenerator from '@/components/CertificateGenerator';

export default function Page() {
  return <CertificateGenerator />;
}
```

### Option 2: Call the API Directly
```typescript
const response = await fetch('/api/certificate/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientName: 'John Doe',
    courseName: 'React Basics',
    completionDate: 'November 21, 2024',
    certificateId: 'CERT-123',
  }),
});

const { pdfUrl } = await response.json();
// Use pdfUrl to display or download
```

### Option 3: Use the Service Function (Server-side)
```typescript
import { generateCertificatePDF } from '@/lib/markupgo-certificate';
import fs from 'fs';

const template = fs.readFileSync('public/certificate-template.html', 'utf-8');
const result = await generateCertificatePDF({
  recipientName: 'John Doe',
  courseName: 'React Basics',
  completionDate: 'November 21, 2024',
  certificateId: 'CERT-123',
}, template);

console.log(result.url); // PDF URL
```

## Data Storage Recommendations

Since you don't want to pay for additional services, store certificate data in Supabase:

### Suggested Table Structure
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  recipient_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  completion_date TIMESTAMP NOT NULL,
  certificate_id TEXT UNIQUE NOT NULL,
  instructor_name TEXT,
  course_code TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Creating a Certificate (Example Query)
```typescript
// After course completion
const { data, error } = await supabase
  .from('certificates')
  .insert({
    student_id: user.id,
    course_id: course.id,
    recipient_name: user.full_name,
    course_name: course.title,
    completion_date: new Date().toISOString(),
    certificate_id: `CERT-${Date.now()}`,
    instructor_name: course.instructor_name,
    course_code: course.code,
  });
```

## Customizing the Certificate Design

The certificate template is in `public/certificate-template.html`. You can customize:

### Colors (from your design system)
- Primary: `#febf00` (Golden)
- Secondary: `#4a71f6` (Blue)
- Text: `#000001` (Dark)
- Background: `#faf8f5` (Cream Light)

### Fonts
- Already uses Poppins from Google Fonts (matches your system)

### Layout
- Current: A4 landscape (customizable via MarkUpGo API)
- Edit the HTML to change structure, add logos, etc.

### Adding a Logo
Replace the "Website 1 Wun" text section with:
```html
<img src="https://your-domain.com/logo.png" alt="Logo" class="logo">
```

## MarkUpGo API Limits & Best Practices

### Rate Limits
- Check your plan for API call limits
- Free tier typically allows reasonable monthly usage
- Contact support for higher limits

### Performance
- Generation typically takes 1-3 seconds
- Longer timeouts may be needed for complex designs
- Consider caching PDFs if same certificate is requested multiple times

### Cost Considerations
- Free tier usually includes hundreds of conversions per month
- No storage costs (PDFs hosted on MarkUpGo servers)
- Can generate on-demand without infrastructure

## Troubleshooting

### Certificate Generation Fails
1. Verify `MARKUPGO_API_KEY` is set in `.env.local`
2. Check MarkUpGo dashboard for API status
3. Ensure all required fields are provided in the request
4. Check browser console for error messages

### PDF Preview Not Showing
1. Verify CORS is enabled for your domain on MarkUpGo
2. Try opening PDF URL directly in browser
3. Check that MarkUpGo API returned a valid URL

### Custom Font Issues
- Use web fonts (Google Fonts) or system fonts
- Avoid local file paths in templates

## Future Enhancements

- [x] Basic certificate generation
- [ ] Multiple certificate templates
- [ ] Email delivery of certificates
- [ ] Certificate verification system
- [ ] Batch certificate generation
- [ ] Digital signatures
- [ ] Certificate database integration
- [ ] Certificate archive/history

## Support

- MarkUpGo Docs: https://markupgo.com/docs
- MarkUpGo API: https://markupgo.com/docs/api/introduction
- Your Supabase Dashboard: https://app.supabase.com

## Files Created

```
src/
├── lib/
│   └── markupgo-certificate.ts        (Service functions)
├── app/
│   ├── api/
│   │   └── certificate/
│   │       └── generate/
│   │           └── route.ts            (API endpoint)
│   └── certificate/
│       └── generate/
│           └── page.tsx                (Front-end page)
└── components/
    └── CertificateGenerator.tsx        (React component)

public/
└── certificate-template.html           (Certificate design)

.env.local                              (Updated with MARKUPGO_API_KEY)
```

## Next Steps

1. Add your MarkUpGo API key to `.env.local`
2. Test the `/certificate/generate` page
3. Integrate into your course completion flow
4. Create Supabase table for certificate records
5. Add certificate generation logic to course completion handlers
6. Customize template design as needed
