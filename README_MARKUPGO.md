# MarkUpGo Certificate Generation System

Welcome! You now have a complete, production-ready certificate generation system integrated with MarkUpGo.

## 📖 Documentation Index

**📍 START HERE:**
1. **[MARKUPGO_QUICK_START.md](./MARKUPGO_QUICK_START.md)** - 5-minute quick start guide

**📚 COMPREHENSIVE GUIDES:**
2. **[MARKUPGO_SETUP.md](./MARKUPGO_SETUP.md)** - Detailed setup and configuration
3. **[MARKUPGO_INTEGRATION_GUIDE.md](./MARKUPGO_INTEGRATION_GUIDE.md)** - How to integrate with your existing pages
4. **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Complete summary of what's been set up

**💻 CODE REFERENCE:**
5. **[src/lib/certificate-examples.ts](./src/lib/certificate-examples.ts)** - Copy-paste examples for common use cases
6. **[src/lib/markupgo-certificate.ts](./src/lib/markupgo-certificate.ts)** - Core service functions
7. **[src/app/api/certificate/generate/route.ts](./src/app/api/certificate/generate/route.ts)** - API endpoint
8. **[src/components/CertificateGenerator.tsx](./src/components/CertificateGenerator.tsx)** - React component
9. **[public/certificate-template.html](./public/certificate-template.html)** - Certificate design template

## 🚀 Get Started in 3 Steps

### 1. Add Your API Key
Edit `.env.local`:
```
MARKUPGO_API_KEY=your_api_key_from_markupgo_dashboard
```

### 2. Restart Dev Server
```bash
npm run dev
```

### 3. Test Certificate Generation
Visit: **http://localhost:3000/certificate/generate**

Fill out the form and generate your first certificate!

## 📦 What's Included

- ✅ Certificate generation service
- ✅ API endpoint (`POST /api/certificate/generate`)
- ✅ React component with preview and download
- ✅ Beautiful HTML certificate template
- ✅ Full documentation and examples
- ✅ Integration guides for existing pages
- ✅ Responsive design (desktop & mobile)
- ✅ Customizable template matching your brand

## 🎯 Common Tasks

### Generate a Certificate Programmatically
```typescript
const response = await fetch('/api/certificate/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientName: 'John Doe',
    courseName: 'React Fundamentals',
    completionDate: 'November 21, 2024',
    certificateId: 'CERT-123',
    instructor: 'Jane Smith',
    courseCode: 'REACT101'
  }),
});

const { pdfUrl } = await response.json();
```

### Use the React Component
```tsx
import CertificateGenerator from '@/components/CertificateGenerator';

export default function Page() {
  return <CertificateGenerator />;
}
```

### Customize the Certificate
Edit `public/certificate-template.html` to change:
- Colors
- Layout
- Text content
- Add your logo
- Add additional fields

## 🔧 Configuration

**Environment Variables** (in `.env.local`):
- `MARKUPGO_API_KEY` - Your MarkUpGo API key (required)

**API Endpoint**:
- `POST /api/certificate/generate`
- Required: recipientName, courseName, completionDate, certificateId
- Optional: instructor, courseCode

## 📊 Project Structure

```
website-1-wun-production/
├── src/
│   ├── lib/
│   │   ├── markupgo-certificate.ts         (Core service)
│   │   └── certificate-examples.ts         (Examples)
│   ├── app/
│   │   ├── api/certificate/generate/       (API endpoint)
│   │   └── certificate/generate/           (Standalone page)
│   └── components/
│       └── CertificateGenerator.tsx        (React component)
├── public/
│   └── certificate-template.html           (Certificate design)
└── Documentation files (README_MARKUPGO.md, MARKUPGO_*.md, etc.)
```

## 🎨 Branding

The certificate uses your project's colors:
- **Golden**: #febf00 (Primary buttons)
- **Blue**: #4a71f6 (Secondary elements)
- **Dark**: #000001 (Text)
- **Cream**: #faf8f5 (Background)

These match your existing design guidelines.

## 💾 Storing Certificates

Recommended: Store PDF URLs in Supabase

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

## 🧪 Testing

### Test the Standalone Page
1. Navigate to `/certificate/generate`
2. Fill in the form
3. Click "Generate Certificate"
4. Preview should appear below the form
5. Click "Download PDF" to save

### Test the API
```bash
curl -X POST http://localhost:3000/api/certificate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Test User",
    "courseName": "Test Course",
    "completionDate": "November 21, 2024",
    "certificateId": "TEST-123"
  }'
```

## 🔗 Integration with Existing Pages

Your project already has certificate pages at `/certificate/`.

See `MARKUPGO_INTEGRATION_GUIDE.md` for:
- Replacing print with PDF download
- Adding PDF generation to existing pages
- Automating certificate generation on course completion
- Sending certificates via email

## 📱 Features

- ✅ Professional certificate design
- ✅ PDF generation via MarkUpGo
- ✅ Real-time preview
- ✅ One-click download
- ✅ Customizable template
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ API endpoint documentation

## 🆘 Troubleshooting

**API Key not working?**
1. Verify key in `.env.local`
2. Restart dev server
3. Check MarkUpGo dashboard

**Certificate not generating?**
1. Check browser console for errors
2. Verify all required fields are provided
3. Test API endpoint with curl

**PDF not showing?**
1. Try opening PDF URL directly
2. Check CORS settings
3. Verify MarkUpGo service is up

## 📚 Additional Resources

- **MarkUpGo Docs**: https://markupgo.com/docs
- **MarkUpGo API**: https://markupgo.com/docs/api/introduction
- **Next.js Docs**: https://nextjs.org/docs
- **Your Design Guide**: `/public/design-guideline.html`

## 🎓 Learning Path

1. **Day 1**: Read MARKUPGO_QUICK_START.md, test `/certificate/generate`
2. **Day 2**: Read MARKUPGO_SETUP.md, customize certificate template
3. **Day 3**: Read MARKUPGO_INTEGRATION_GUIDE.md, integrate with existing pages
4. **Day 4+**: Review examples in certificate-examples.ts for advanced usage

## 💡 Tips

- **Batch generation**: See `batchGenerateCertificates()` in examples
- **Custom IDs**: Use `generateCertificateId()` helper function
- **Validation**: Use `validateCertificateData()` before API calls
- **Storage**: Save PDF URLs to Supabase for archival
- **Automation**: Trigger generation on course completion events

## ✅ Implementation Checklist

- [ ] Add MARKUPGO_API_KEY to .env.local
- [ ] Restart development server
- [ ] Test /certificate/generate page
- [ ] Generate and download test certificate
- [ ] Review certificate template
- [ ] Plan integration with course completion
- [ ] Create Supabase table for certificates (optional)
- [ ] Integrate with existing certificate pages
- [ ] Test with real student data
- [ ] Deploy to production

## 🚀 Next Steps

1. **Immediate**: Add your API key and test the page
2. **This week**: Integrate with your existing certificate flow
3. **This month**: Automate certificate generation on course completion
4. **Future**: Add email delivery, certificate verification, batch generation

## 📞 Support

For issues with:
- **Setup**: Check MARKUPGO_SETUP.md
- **Integration**: Check MARKUPGO_INTEGRATION_GUIDE.md
- **Code examples**: Check certificate-examples.ts
- **MarkUpGo API**: Visit https://markupgo.com/docs

---

**Everything is ready!** 

Start with **[MARKUPGO_QUICK_START.md](./MARKUPGO_QUICK_START.md)** to begin.

Happy certificate generating! 🎉
