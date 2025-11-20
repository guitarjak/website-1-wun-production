import { redirect } from 'next/navigation';
import { getCurrentUserWithProfile } from '@/lib/auth';

const targetAudience = [
  'คนที่อยากมี เว็บไซต์ส่วนตัว ของตัวเองแต่ไม่รู้จะเริ่มตรงไหน',
  'คนที่อยากทำ Static Website แบบง่าย เร็ว โหลดไว',
  'คนที่เคยเสียตังจ้างทำเว็บแล้วไม่ได้ดั่งใจซักที',
  'คนทำธุรกิจที่อยากมีหน้าเว็บให้ลูกค้าดู',
  'คนที่เบื่อกับการจ่ายรายเดือนเพื่อมีเว็บไซต์',
  'คนที่อยากสร้าง Landing Page / Sales Page แบบเร็วๆ',
  'คนที่อยากเรียนพื้นฐานเว็บให้ใช้งาน AI ได้เก่งขึ้น (สั่ง AI ยังไงให้ตรงใจ)',
];

const outcomes = [
  'เว็บไซต์จริงพร้อมออนไลน์ เปิดให้คนเข้าดูได้ทันที',
  'เข้าใจโครงสร้างเว็บแบบง่ายๆ ไม่ต้องกลัวคำว่า HTML/CSS/JS',
  'รู้วิธีใช้ AI สร้างเว็บเร็วขึ้น 10 เท่า พร้อม Prompt ที่ใช้ได้ทันที',
  'Deploy เว็บขึ้น GitHub Pages หรือ Vercel แบบมืออาชีพ ฟรีทั้งคู่',
  'ปรับแต่งเว็บได้เอง เปลี่ยนรูป สี ข้อความ ใส่ Section เพิ่มได้หมด ไม่ต้องง้อใคร',
];

const modules = [
  {
    title: 'Module 1 — ภาพรวมและสิ่งที่ต้องรู้',
    items: [
      'ทำไมเราต้องมีเว็บไซต์? โดยเฉพาะคนธรรมดา',
      'เว็บไซต์สมัยก่อน vs สมัยนี้',
      'สิ่งที่เราจะสร้างกัน ฉบับรวบรัด',
      'ภาพรวมของเครื่องมือที่ต้องใช้',
    ],
  },
  {
    title: 'Module 2 — เตรียมสนามเด็กเล่น',
    items: [
      'ลง Node.js / Gemini CLI / Qwen CLI',
      'ใช้ Terminal หรือ Command Prompt แบบไม่งง',
      'สร้าง Website “Hello World” ของเรา!',
    ],
  },
  {
    title: 'Module 3 — ปรับแต่งเว็บของเรา',
    items: [
      'โครงสร้างไฟล์เว็บแบบง่าย',
      'ใช้ Stitch ช่วยออกแบบ',
      'แก้ไขภาพ ข้อความ ลิงก์ หน้าต่างๆ',
    ],
  },
  {
    title: 'Module 4 — เอาขึ้นโชว์เพื่อนบนอินเทอร์เน็ต',
    items: [
      'สร้างบัญชี GitHub และติดตั้ง Desktop',
      'สร้าง Repo และ Deploy ขึ้นจริง',
    ],
  },
  {
    title: 'Module 5 — เพิ่มความโปรด้วย Custom Domain',
    items: [
      'โดเมนคืออะไร (ฉบับเด็ก 5 ขวบ)',
      'ซื้อโดเมน (Namecheap / Hostinger)',
      'เชื่อม DNS กับ GitHub Pages + เปิด SSH',
    ],
  },
  {
    title: 'Module 6 — สิ่งอื่นๆ ที่ควรรู้',
    items: [
      'เก็บ guideline.html ให้ดีไซน์นิ่ง',
      'เพิ่ม Form รับข้อมูล',
      'ตั้งชื่อไฟล์/สำรองข้อมูล/SEO เบื้องต้น',
    ],
  },
];

const reasons = [
  'คนส่วนใหญ่มีไอเดีย แต่รอให้พร้อมก่อน จนไม่ได้เริ่มซักที',
  'เราออกแบบคอร์สให้ “เริ่ม–ทำ–จบ” ในวันเดียว ไม่ต้องจำเยอะ ไม่ต้องเรียนทฤษฎี',
  'Dead Simple (ง่ายชิบหาย) จับมือทำ สอนสั่ง AI ให้คุณด้วย',
];

const teachingStyles = [
  'ไม่ใช้ศัพท์โปรแกรมเมอร์เวอร์',
  'เน้นทำได้จริง ไม่ใช่แค่เข้าใจ',
  'สั่ง AI ยังไงให้ได้เว็บไซต์แบบที่อยากได้',
  'อธิบายแบบคนทำจริง ไม่ใช่ทฤษฎีในหนังสือ',
];

const postCourseSkills = [
  'สร้างเว็บไซต์ให้เพื่อน/ลูกค้าได้',
  'ทำ Landing Page หรือ Sales Page ของธุรกิจตัวเอง',
  'เริ่มสาย Web Dev หรือ Product Builder ได้ง่ายขึ้น',
  'สั่ง AI ให้สร้างโค้ดให้คุณแบบ Professional',
  'ต่อยอดเป็น Blog, Form, Portfolio หรือระบบอื่นๆ ได้เอง',
];

const priceInfo = {
  amount: '1,690 บาท',
  includes: 'รวมเนื้อหา + ตัวอย่างเว็บ + Prompt + Template + Support',
};

export default async function Home() {
  const currentUser = await getCurrentUserWithProfile();

  if (currentUser) {
    redirect('/course');
  }

  return (
    <div className="bg-[#efe3d4] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="bg-white/90 rounded-3xl shadow-xl border border-[var(--border-light)] p-6 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-tertiary)]">⭐ คอร์ส Website 1 วัน</p>
          <h1 className="text-4xl sm:text-5xl font-black mt-4 mb-4" style={{ color: 'var(--text-primary)' }}>
            สร้างเว็บไซต์แรกของคุณภายใน <span className="line-through text-gray-400">1 เดือน</span> <span style={{ color: 'var(--golden)' }}>1 วัน</span>
          </h1>
          <p className="text-lg sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
            ไม่ต้องเขียนโค้ด ไม่ต้องมีพื้นฐาน! แค่มีอินเทอร์เน็ต + ความกระหายอยากลอง (ฮ่าๆ) ก็มีเว็บไซต์ของตัวเองได้ภายในวันเดียว
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              'คุณไม่จำเป็นต้องเป็นโปรแกรมเมอร์',
              'คุณไม่จำเป็นต้องเรียนเป็นเดือน',
              'ไม่ต้องมีโน๊ตบุ๊คแพง ๆ',
              'โอ้ววว ไฟลู๊กก 🚀',
            ].map((item) => (
              <div key={item} className="p-4 rounded-2xl border" style={{ borderColor: 'var(--border-light)', background: '#f9fafb' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-[var(--border-light)] p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-[var(--text-tertiary)]">🎯 คอร์สนี้เหมาะกับใคร?</p>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>สำหรับคนที่อยากมีเว็บไซต์ของตัวเอง...แบบไม่ต้องง้อใคร</h2>
            </div>
            <ul className="grid md:grid-cols-2 gap-4">
              {targetAudience.map((aud) => (
                <li key={aud} className="flex gap-3 p-4 rounded-2xl border bg-[#fdfaf3]" style={{ borderColor: 'var(--border-light)' }}>
                  <span>✅</span>
                  <p>{aud}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-[var(--border-light)] p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[var(--text-tertiary)]">⚡ ผลลัพธ์ที่คุณจะได้ใน 1 วัน</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>จบคอร์ส = มีเว็บไซต์จริง + ใช้ AI เป็น</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {outcomes.map((outcome, index) => (
              <div key={outcome} className="p-5 rounded-2xl border bg-white" style={{ borderColor: 'var(--border-light)' }}>
                <p className="font-semibold mb-2" style={{ color: 'var(--golden)' }}>✅ {index + 1}</p>
                <p>{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-[var(--border-light)] p-6 sm:p-10 space-y-6">
          <div>
            <p className="text-sm font-semibold text-[var(--text-tertiary)]">📦 ภายในคอร์สประกอบด้วยอะไรบ้าง?</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>6 Modules ดีดตัวจาก 0 ถึงเว็บจริง</h2>
          </div>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.title} className="p-5 rounded-2xl border" style={{ borderColor: 'var(--border-light)', background: '#faf7ef' }}>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{module.title}</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {module.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-[var(--border-light)] p-6 sm:p-10 grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[var(--text-tertiary)]">🌱 ทำไมต้อง Website 1 วัน?</p>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>เริ่ม–ทำ–จบ ภายในวันเดียว</h2>
            <ul className="space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3">
                  <span>✨</span>
                  <p>{reason}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-[var(--text-tertiary)]">💬 เหมาะกับคนที่อยาก...</p>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                สร้างแบรนด์ • ทำออนไลน์ • เริ่มธุรกิจ • ขายของ • สร้าง Portfolio • สร้างตัวตนบนโลกออนไลน์
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-tertiary)]">🧠 สไตล์การสอนของผม</p>
              <ul className="space-y-2">
                {teachingStyles.map((style) => (
                  <li key={style} className="flex gap-3">
                    <span>🧠</span>
                    <p>{style}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-[var(--border-light)] p-6 sm:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-[var(--text-tertiary)]">🚀 พอเรียนจบ คุณจะทำอะไรได้บ้าง?</p>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>เปิดโอกาสใหม่ได้ทันที</h2>
              <ul className="space-y-3">
                {postCourseSkills.map((skill) => (
                  <li key={skill} className="flex gap-3">
                    <span>🚀</span>
                    <p>{skill}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#fff5d6] border border-[var(--border-light)] rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-tertiary)]">🏷️ ราคาแนะนำของคอร์ส</p>
                <h3 className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>{priceInfo.amount}</h3>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{priceInfo.includes}</p>
              </div>
              <div className="mt-6">
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>พร้อมมีเว็บไซต์แรกของคุณใน 1 วันหรือยัง?</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ถ้าคุณยังไม่มีเว็บเป็นของตัวเอง ตอนนี้คือเวลาเริ่มต้นที่ง่ายที่สุดในชีวิต
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-white rounded-3xl shadow-xl border border-[var(--border-light)] p-6 sm:p-10">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            พร้อมมีเว็บไซต์แรกใน 1 วันแล้วหรือยัง?
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            คอร์ส Website 1 วัน — ทำตามทีละขั้นตอน ได้เว็บของคุณแน่นอน 💻✨
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 justify-center">
            <span className="text-sm uppercase tracking-[0.2em] font-semibold text-[var(--text-tertiary)]">จบคอร์ส = มีเว็บจริง</span>
            <div className="h-1 w-12 bg-[var(--golden)] rounded-full" />
            <span className="text-sm uppercase tracking-[0.2em] font-semibold text-[var(--text-tertiary)]">เริ่ม–ทำ–จบในวันเดียว</span>
          </div>
        </section>
      </div>
    </div>
  );
}
