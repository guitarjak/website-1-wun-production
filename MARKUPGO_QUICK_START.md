# MarkUpGo Quick Start

## 🎯 What You Have Now

Your project is fully set up to generate professional certificates with MarkUpGo. No additional services needed—everything integrates with your existing Supabase backend.

## 🚀 Getting Started (5 Minutes)

### 1. Add Your API Key
Edit `.env.local`:
```
MARKUPGO_API_KEY=paste_your_key_here
```

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Test Certificate Generation
Navigate to: **http://localhost:3000/certificate/generate**

Fill the form and click "Generate Certificate" ✓

## 📁 What Was Created

| File | Purpose |
|------|---------|
| `src/lib/markupgo-certificate.ts` | Core PDF generation service |
| `src/app/api/certificate/generate/route.ts` | API endpoint for generating PDFs |
| `src/components/CertificateGenerator.tsx` | Ready-to-use React component |
| `src/app/certificate/generate/page.tsx` | Standalone certificate generator page |
| `public/certificate-template.html` | Beautiful certificate design |
| `.env.local` | Updated with `MARKUPGO_API_KEY` |

## 💻 Usage Examples

### Quick API Call
```typescript
const response = await fetch('/api/certificate/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientName: 'John Doe',
    courseName: 'Web Development',
    completionDate: 'November 21, 2024',
    certificateId: 'CERT-123',
  }),
});

const { pdfUrl } = await response.json();
console.log('Certificate:', pdfUrl);
```

### Use Pre-built Component
```tsx
import CertificateGenerator from '@/components/CertificateGenerator';

export default function Page() {
  return <CertificateGenerator />;
}
```

## 🔗 Integration with Your Certificate System

Your existing `/certificate` pages can now generate PDFs instead of using print.

**See**: `MARKUPGO_INTEGRATION_GUIDE.md` for detailed integration steps.

## 🎨 Certificate Design

Your certificate matches your brand colors:
- **Golden**: `#febf00` (Primary)
- **Blue**: `#4a71f6` (Secondary)
- **Dark**: `#000001` (Text)
- **Cream**: `#faf8f5` (Background)

Edit `public/certificate-template.html` to customize.

## 📊 Store Certificates in Supabase

Recommended table structure:
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  course_id UUID,
  recipient_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  completion_date TIMESTAMP NOT NULL,
  certificate_id TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Test the API

```bash
curl -X POST http://localhost:3000/api/certificate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Jane Smith",
    "courseName": "React Fundamentals",
    "completionDate": "November 21, 2024",
    "certificateId": "CERT-2024-001"
  }'
```

## ⚙️ Environment Setup Summary

Your `.env.local` now has:
```
NEXT_PUBLIC_SUPABASE_URL=... ✓ (existing)
NEXT_PUBLIC_SUPABASE_ANON_KEY=... ✓ (existing)
SUPABASE_SERVICE_ROLE_KEY=... ✓ (existing)
ADMIN_BEARER_TOKEN=... ✓ (existing)
MARKUPGO_API_KEY=... ← Add your key here
```

## 🔧 Configuration

### Required Fields in Request
- `recipientName`
- `courseName`
- `completionDate`
- `certificateId`

### Optional Fields
- `instructor` (defaults to "Course Team")
- `courseCode`

## 📚 Full Documentation

- **Setup Guide**: `MARKUPGO_SETUP.md`
- **Integration Guide**: `MARKUPGO_INTEGRATION_GUIDE.md`
- **MarkUpGo API**: https://markupgo.com/docs/api/introduction

## ✅ Checklist

- [ ] Add `MARKUPGO_API_KEY` to `.env.local`
- [ ] Restart dev server
- [ ] Test `/certificate/generate` page
- [ ] Generate a test certificate
- [ ] Download and verify PDF
- [ ] Plan integration with existing certificate pages
- [ ] Create Supabase certificates table (optional but recommended)
- [ ] Integrate API calls into your course completion flow

## 🎓 Next Steps

1. **Immediate**: Add API key and test the page
2. **Short-term**: Integrate with your existing certificate pages
3. **Long-term**: Auto-generate certificates on course completion
4. **Future**: Add certificate verification, email delivery, etc.

## 🆘 Need Help?

Check the error message in:
1. Browser console (DevTools)
2. Terminal output
3. API response

Common issues:
- **API Key missing**: Add to `.env.local` and restart
- **PDF not showing**: Verify MarkUpGo account is active
- **Template errors**: Check placeholder names match

## 📞 Support

- MarkUpGo Support: https://markupgo.com/docs
- Your Account: You already have access!
- No additional costs: Everything included in your plan

---

**You're all set!** Start generating beautiful certificates now. 🎉
