<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.lp-faq-item');
    faqItems.forEach(item => {
      const questionWrapper = item.querySelector('.faq-question-wrapper');
      questionWrapper?.addEventListener('click', function() {
        item.classList.toggle('active');
      });
    });

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('a[href="#offer"]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const offerSection = document.getElementById('offer');
        offerSection?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    return () => {
      observer.disconnect();
    };
  });
</script>

<svelte:head>
  <title>สร้าง Landing Page ขายของใน 1 วัน – Website 1 Wun</title>
  <meta name="description" content="สร้างหน้าขายสินค้า/คอร์ส/บริการของคุณเองใน 1 วัน ไม่ต้องเขียนโค้ด ไม่ต้องจ่ายรายเดือน ใช้ฟรีตลอดชีพ">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<header class="site-header">
  <div class="header-container">
    <img src="/w1w/w1w-logo.webp" alt="Website 1 Wun" class="site-logo">
    <nav class="main-nav">
      <a href="/login" data-sveltekit-preload-data="tap" class="nav-button">Sign In</a>
    </nav>
  </div>
</header>

<!-- Hero Section -->
<section class="hero" id="hero">
  <div class="hero-content">
    <div class="hero-label">สำหรับ Solopreneur ที่อยากขายของออนไลน์</div>
    <h1 class="hero-headline">
      สร้าง <span class="accent-text">Landing Page</span><br>
      ขายของใน 1 วัน<br>
      ไม่ต้องจ่ายรายเดือน
    </h1>
    <p class="hero-subheadline">
      แม้คุณไม่เคยเขียนโค้ด ก็สร้างหน้าขายสินค้า/คอร์ส/บริการได้<br>
      <strong>ใช้ฟรีตลอดชีพ ไม่มีค่า Hosting รายเดือน</strong>
    </p>
    <a href="#offer" class="cta-button cta-primary">
      ดูรายละเอียดข้อเสนอ
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    <div class="hero-trust">
      <span class="trust-item">✓ ไม่ต้องจ่าย Shopify</span>
      <span class="trust-item">✓ ขายได้ทันที</span>
      <span class="trust-item">✓ ใช้ฟรีตลอดชีพ</span>
    </div>
  </div>
</section>

<!-- Problem Section -->
<section class="lp-problem-section">
  <div class="lp-container">
    <h2 class="lp-section-title">คุณกำลังเจอปัญหาพวกนี้อยู่ใช่ไหม?</h2>

    <div class="lp-problem-grid">
      <div class="lp-problem-card fade-in-up">
        <div class="lp-problem-icon">😩</div>
        <h3>มีสินค้า/คอร์ส/บริการ แต่ไม่มีที่ขาย</h3>
        <p>ต้องอาศัย Instagram, Facebook หรือส่งข้อความยาวๆ อธิบาย แทนที่จะมีหน้าขายเป็นของตัวเอง</p>
      </div>

      <div class="lp-problem-card fade-in-up">
        <div class="lp-problem-icon">💸</div>
        <h3>จ่าย Shopify/Website Builder แพงทุกเดือน</h3>
        <p>ค่าใช้จ่ายรายเดือน 1,000-3,000 บาท ทั้งที่ยังไม่ได้ขายอะไรเลย สุดท้ายเลิกใช้เพราะไม่คุ้ม</p>
      </div>

      <div class="lp-problem-card fade-in-up">
        <div class="lp-problem-icon">😕</div>
        <h3>ส่งลิงก์ Instagram ดูไม่น่าเชื่อถือ</h3>
        <p>พอส่งลิงก์ Instagram/Line ให้ลูกค้าดู คนไม่ค่อยไว้ใจ เพราะดูไม่เป็นทางการ</p>
      </div>

      <div class="lp-problem-card fade-in-up">
        <div class="lp-problem-icon">🎯</div>
        <h3>อยากมีหน้าขายที่คุณควบคุมได้ 100%</h3>
        <p>ไม่ต้องพึ่งแพลตฟอร์มคนอื่น ไม่ต้องกลัวโดนแบน อยากแก้อะไรก็แก้เองได้ทันที</p>
      </div>
    </div>
  </div>
</section>

<!-- COMPONENT 1: CORE OFFER -->
<section class="lp-core-offer">
  <div class="lp-container">
    <div class="lp-offer-name">
      <div class="lp-offer-badge">🚀 ข้อเสนอสุดพิเศษ</div>
      <h2 class="lp-offer-title">"Landing Page Builder Bootcamp"</h2>
      <p class="lp-offer-subtitle">ระบบสร้าง Landing Page ขายของแบบครบวงจร</p>
    </div>

    <!-- Transformation Statement -->
    <div class="lp-transformation">
      <p class="lp-transformation-text">
        <strong>จากคนที่ "ไม่มีหน้าขายของตัวเอง"</strong><br>
        กลายเป็น <strong>"เจ้าของ Landing Page มืออาชีพที่พร้อมขาย"</strong><br>
        ภายใน 1 วันเท่านั้น
      </p>
    </div>

    <!-- Core Highlights -->
    <div class="lp-highlights">
      <div class="lp-highlight-card fade-in-up">
        <div class="lp-highlight-header">
          <span class="lp-highlight-number">01</span>
          <h3>ระบบสร้าง Landing Page แบบ Step-by-Step</h3>
        </div>
        <ul class="lp-highlight-bullets">
          <li>เริ่มจาก 0 ไปจนถึงเว็บขึ้นบนอินเตอร์เน็ตจริงๆ</li>
          <li>ไม่ต้องเขียนโค้ดเอง ใช้ AI ช่วยสร้างให้</li>
          <li>มี Template สำเร็จรูปให้เลือกใช้ เอาไปปรับแก้ได้เลย</li>
          <li>วิดีโออธิบายเป็นภาษาคนทั่วไป ไม่ใช้คำศัพท์เทคนิค</li>
        </ul>
      </div>

      <div class="lp-highlight-card fade-in-up">
        <div class="lp-highlight-header">
          <span class="lp-highlight-number">02</span>
          <h3>Landing Page Templates ออกแบบเพื่อขายของโดยเฉพาะ</h3>
        </div>
        <ul class="lp-highlight-bullets">
          <li>5+ Templates สำหรับขายสินค้า/คอร์ส/บริการ</li>
          <li>ออกแบบตามหลักจิตวิทยาการขาย ให้ Conversion สูง</li>
          <li>Responsive ทำงานบนมือถือได้สมบูรณ์</li>
          <li>ปรับแต่งสี ฟอนต์ รูปภาพได้ง่ายๆ</li>
        </ul>
      </div>

      <div class="lp-highlight-card fade-in-up">
        <div class="lp-highlight-header">
          <span class="lp-highlight-number">03</span>
          <h3>Copywriting Framework สำหรับหน้าขาย</h3>
        </div>
        <ul class="lp-highlight-bullets">
          <li>สูตรเขียน Copy ขายแบบมืออาชีพ (Problem-Solution-Proof-Offer)</li>
          <li>AI Prompts พร้อมใช้ ให้ AI เขียน Copy ให้คุณ</li>
          <li>ตัวอย่างคำพูดที่ใช้แล้วได้ผลจริง</li>
          <li>หลักจิตวิทยาการขายที่ใช้ได้ผลในตลาดไทย</li>
        </ul>
      </div>

      <div class="lp-highlight-card fade-in-up">
        <div class="lp-highlight-header">
          <span class="lp-highlight-number">04</span>
          <h3>ระบบเชื่อมต่อการรับเงิน (Payment Integration)</h3>
        </div>
        <ul class="lp-highlight-bullets">
          <li>เชื่อมต่อ Stripe, PayPal ให้รับเงินจากต่างประเทศ</li>
          <li>ใช้ PromptPay QR Code สำหรับลูกค้าไทย</li>
          <li>ตั้งค่าระบบรับเงินอัตโนมัติ ไม่ต้องนั่งเช็คทีละคน</li>
          <li>ส่งใบเสร็จอัตโนมัติหลังลูกค้าจ่ายเงิน</li>
        </ul>
      </div>

      <div class="lp-highlight-card fade-in-up">
        <div class="lp-highlight-header">
          <span class="lp-highlight-number">05</span>
          <h3>Hosting ฟรีตลอดชีพ (GitHub Pages)</h3>
        </div>
        <ul class="lp-highlight-bullets">
          <li>ไม่ต้องจ่ายค่า Hosting รายเดือนเลย</li>
          <li>ความเร็วโหลดหน้าเว็บเร็วระดับโลก</li>
          <li>รองรับ Traffic ได้มหาศาล ไม่ต้องกลัวเว็บล่ม</li>
          <li>ใช้ได้ตลอดชีพ 100% ฟรี</li>
        </ul>
      </div>
    </div>

    <!-- Social Proof -->
    <div class="lp-proof-section fade-in-up">
      <h3 class="lp-proof-title">ตัวอย่างหน้าขายที่นักเรียนสร้างไปจริง</h3>
      <div class="lp-proof-grid">
        <div class="lp-proof-item">
          <img src="/w1w/web-showcase-1.webp" alt="Student Landing Page 1" class="lp-proof-image" loading="lazy">
        </div>
        <div class="lp-proof-item">
          <img src="/w1w/web-showcase-2.webp" alt="Student Landing Page 2" class="lp-proof-image" loading="lazy">
        </div>
        <div class="lp-proof-item">
          <img src="/w1w/web-showcase-3.webp" alt="Student Landing Page 3" class="lp-proof-image" loading="lazy">
        </div>
        <div class="lp-proof-item">
          <img src="/w1w/web-showcase-4.webp" alt="Student Landing Page 4" class="lp-proof-image" loading="lazy">
        </div>
      </div>
      <p class="lp-proof-note">พวกเขาทุกคนไม่เคยเขียนโค้ดมาก่อน แต่มีหน้าขายของตัวเองใน 1 วัน</p>
    </div>
  </div>
</section>

<!-- COMPONENT 2: PRICE (Reveal before bonuses) -->
<section class="lp-price-reveal" id="offer">
  <div class="lp-container">
    <div class="lp-price-anchor">
      <h2 class="lp-price-title">มูลค่าจริงของข้อเสนอนี้คือเท่าไหร่?</h2>

      <div class="lp-comparison-table fade-in-up">
        <div class="lp-comparison-item">
          <div class="lp-comparison-option">จ้างทำเว็บ</div>
          <div class="lp-comparison-price">15,000-50,000 บาท</div>
          <div class="lp-comparison-cons">ต้องรอ 2-4 สัปดาห์ + แก้ไขยาก</div>
        </div>

        <div class="lp-comparison-item">
          <div class="lp-comparison-option">Shopify/Wix</div>
          <div class="lp-comparison-price">1,500 บาท/เดือน</div>
          <div class="lp-comparison-cons">= 18,000 บาท/ปี ตลอดไป</div>
        </div>

        <div class="lp-comparison-item lp-comparison-winner">
          <div class="lp-winner-badge">⭐ คุ้มที่สุด</div>
          <div class="lp-comparison-option">Website 1 Wun</div>
          <div class="lp-comparison-price">1,490 บาท (ครั้งเดียว)</div>
          <div class="lp-comparison-pros">ได้ภายใน 1 วัน + ใช้ฟรีตลอดชีพ</div>
        </div>
      </div>

      <div class="lp-price-box fade-in-up">
        <div class="lp-price-regular">
          <span class="lp-price-label">ราคาปกติ</span>
          <span class="lp-price-amount-old">2,490 บาท</span>
        </div>

        <div class="lp-price-special">
          <span class="lp-price-label">ราคาพิเศษวันนี้</span>
          <span class="lp-price-amount-new">1,490 บาท</span>
          <span class="lp-price-savings">ประหยัด 1,000 บาท</span>
        </div>

        <div class="lp-price-value">
          <p class="lp-value-statement">
            💡 <strong>คิดดูง่ายๆ:</strong> ถ้าคุณขายสินค้าได้แค่ 1 ชิ้นในราคา 1,500 บาท<br>
            คุณก็คืนทุนแล้ว แถมมี Landing Page ไว้ใช้ตลอดชีพ
          </p>
          <p class="lp-value-statement">
            💸 <strong>เทียบกับ Shopify:</strong> คุณประหยัดได้ปีละ 18,000 บาท<br>
            ใน 5 ปี = ประหยัดได้ 90,000 บาท!
          </p>
        </div>

        <a href="https://pay.website1wun.com/website1wun" class="lp-cta-button lp-cta-primary">
          เริ่มสร้าง Landing Page เลย - 1,490 บาท
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <p class="lp-cta-subtext">✓ รับประกันคืนเงิน 30 วัน ✓ เริ่มได้ทันที ✓ ไม่มีค่าใช้จ่ายซ่อนเร้น</p>
      </div>
    </div>
  </div>
</section>

<!-- COMPONENT 3: BONUSES (More valuable than product) -->
<section class="lp-bonuses">
  <div class="lp-container">
    <h2 class="lp-bonuses-title">แต่รอก่อน...คุณจะได้รับโบนัสพิเศษเหล่านี้ด้วย!</h2>
    <p class="lp-bonuses-subtitle">(มูลค่ารวมกว่า 8,000 บาท แต่คุณได้ฟรี!)</p>

    <div class="lp-bonus-items">
      <!-- Bonus 1 -->
      <div class="lp-bonus-card fade-in-up">
        <div class="lp-bonus-header">
          <span class="lp-bonus-badge">Bonus #1</span>
          <span class="lp-bonus-value">มูลค่า 1,500 บาท</span>
        </div>
        <h3 class="lp-bonus-title">50+ AI Prompts Library สำหรับสร้างเว็บ</h3>
        <ul class="lp-bonus-features">
          <li><strong>Copywriting Prompts:</strong> สั่ง AI เขียน Headline, CTA, Product Description</li>
          <li><strong>Design Prompts:</strong> สร้าง Hero Section, Pricing Table, Testimonial Cards</li>
          <li><strong>Code Prompts:</strong> แก้บั๊ก, ปรับ Layout, เพิ่มฟีเจอร์</li>
          <li><strong>SEO Prompts:</strong> เขียน Meta Description, Title Tags</li>
        </ul>
        <p class="lp-bonus-format">📄 PDF + Notion Template (Copy & Paste ได้เลย)</p>
      </div>

      <!-- Bonus 2 -->
      <div class="lp-bonus-card fade-in-up">
        <div class="lp-bonus-header">
          <span class="lp-bonus-badge">Bonus #2</span>
          <span class="lp-bonus-value">มูลค่า 2,000 บาท</span>
        </div>
        <h3 class="lp-bonus-title">High-Converting Sales Page Template</h3>
        <ul class="lp-bonus-features">
          <li><strong>Template ที่สร้างรายได้จริง:</strong> หน้าเพจนี้ที่คุณกำลังอ่านอยู่ (ทำรายได้ 6 หลักใน 1 สัปดาห์)</li>
          <li><strong>ครบทุกส่วน:</strong> Hero, Problem, Solution, Testimonials, FAQ, Pricing</li>
          <li><strong>เอาไปแก้เป็นของคุณ:</strong> เปลี่ยนข้อความ รูป สี ได้ทันที</li>
          <li><strong>ใช้ได้กับทุกธุรกิจ:</strong> ขายคอร์ส ขายสินค้า ขายบริการ</li>
        </ul>
        <p class="lp-bonus-format">💻 Full Source Code + วิดีโอสอนวิธีใช้</p>
      </div>

      <!-- Bonus 3 -->
      <div class="lp-bonus-card fade-in-up">
        <div class="lp-bonus-header">
          <span class="lp-bonus-badge">Bonus #3</span>
          <span class="lp-bonus-value">มูลค่า 1,200 บาท</span>
        </div>
        <h3 class="lp-bonus-title">Payment Integration Masterclass (45 นาที)</h3>
        <ul class="lp-bonus-features">
          <li><strong>Stripe Setup:</strong> รับเงินจากต่างประเทศด้วย Credit Card</li>
          <li><strong>PayPal Integration:</strong> เชื่อมต่อ PayPal เพื่อรับเงินทั่วโลก</li>
          <li><strong>PromptPay QR Code:</strong> สร้าง QR Code สำหรับลูกค้าไทย</li>
          <li><strong>Automatic Email Receipts:</strong> ส่งใบเสร็จอัตโนมัติ</li>
        </ul>
        <p class="lp-bonus-format">🎥 Video Tutorial + Step-by-step PDF</p>
      </div>

      <!-- Bonus 4 -->
      <div class="lp-bonus-card fade-in-up">
        <div class="lp-bonus-header">
          <span class="lp-bonus-badge">Bonus #4</span>
          <span class="lp-bonus-value">มูลค่า 3,000 บาท</span>
        </div>
        <h3 class="lp-bonus-title">Lifetime Access to Facebook Community</h3>
        <ul class="lp-bonus-features">
          <li><strong>ถาม-ตอบตลอดชีพ:</strong> ติดปัญหาอะไรก็ถามได้ในกลุ่ม</li>
          <li><strong>แชร์ผลงาน:</strong> โชว์หน้าขายของคุณ รับ Feedback</li>
          <li><strong>เรียนรู้จากคนอื่น:</strong> ดูวิธีแก้ปัญหาของคนอื่น</li>
          <li><strong>Updates ตลอดชีพ:</strong> ได้รับ Tips ใหม่ๆ ทุกสัปดาห์</li>
        </ul>
        <p class="lp-bonus-format">👥 Private Facebook Group (เข้าได้ทันทีหลังซื้อ)</p>
      </div>

      <!-- Bonus 5 - BEST FOR LAST -->
      <div class="lp-bonus-card lp-bonus-ultimate fade-in-up">
        <div class="lp-bonus-header">
          <span class="lp-bonus-badge lp-bonus-ultimate-badge">🔥 Ultimate Bonus</span>
          <span class="lp-bonus-value lp-bonus-ultimate-value">ของขวัญพิเศษ (ซื้อไม่ได้)</span>
        </div>
        <h3 class="lp-bonus-title">1-on-1 Landing Page Review Session (30 นาที)</h3>
        <p class="lp-bonus-exclusive">⚠️ โบนัสนี้ไม่มีขาย ได้แค่ใน offer นี้เท่านั้น</p>
        <ul class="lp-bonus-features">
          <li><strong>Review หน้าขายของคุณแบบ 1-on-1:</strong> ผม (กีตาร์) จะดูหน้าขายของคุณเองและบอกว่าต้องปรับอะไรบ้าง</li>
          <li><strong>Conversion Optimization Tips:</strong> แนะนำวิธีเพิ่ม Conversion Rate</li>
          <li><strong>Copywriting Feedback:</strong> ปรับแก้คำพูดให้ขายดีขึ้น</li>
          <li><strong>ทำได้ภายใน 1 เดือนหลังซื้อ:</strong> จองเวลาได้ทันทีหลังสร้างเว็บเสร็จ</li>
        </ul>
        <p class="lp-bonus-format">💎 Google Meet Session (30 นาที) - สำหรับ 100 คนแรกเท่านั้น</p>
        <p class="lp-bonus-why">
          <strong>ทำไมให้ฟรี?</strong> เพราะผมอยากเก็บ Feedback จากการใช้งานจริง<br>
          และอยากช่วยให้คุณประสบความสำเร็จจริงๆ
        </p>
      </div>
    </div>

    <!-- Total Value Calculation -->
    <div class="lp-value-stack fade-in-up">
      <h3 class="lp-stack-title">รวมมูลค่าทั้งหมด:</h3>
      <div class="lp-stack-items">
        <div class="lp-stack-item">
          <span class="lp-stack-name">Landing Page Builder Bootcamp</span>
          <span class="lp-stack-value">2,490 บาท</span>
        </div>
        <div class="lp-stack-item">
          <span class="lp-stack-name">50+ AI Prompts Library</span>
          <span class="lp-stack-value">1,500 บาท</span>
        </div>
        <div class="lp-stack-item">
          <span class="lp-stack-name">High-Converting Sales Page Template</span>
          <span class="lp-stack-value">2,000 บาท</span>
        </div>
        <div class="lp-stack-item">
          <span class="lp-stack-name">Payment Integration Masterclass</span>
          <span class="lp-stack-value">1,200 บาท</span>
        </div>
        <div class="lp-stack-item">
          <span class="lp-stack-name">Lifetime Facebook Community</span>
          <span class="lp-stack-value">3,000 บาท</span>
        </div>
        <div class="lp-stack-divider"></div>
        <div class="lp-stack-total">
          <span class="lp-stack-name"><strong>มูลค่ารวมทั้งหมด</strong></span>
          <span class="lp-stack-value lp-stack-total-value">10,190 บาท</span>
        </div>
        <div class="lp-stack-today">
          <span class="lp-stack-name"><strong>ราคาที่คุณจ่ายวันนี้</strong></span>
          <span class="lp-stack-value lp-stack-today-value">1,490 บาท</span>
        </div>
      </div>
      <p class="lp-stack-note">คุณประหยัดไป 8,700 บาท (ลด 85%!)</p>
    </div>
  </div>
</section>

<!-- COMPONENT 4: SCARCITY -->
<section class="lp-scarcity">
  <div class="lp-container">
    <div class="lp-scarcity-box fade-in-up">
      <div class="lp-scarcity-badge">⏰ ข้อเสนอจำกัด</div>
      <h2 class="lp-scarcity-title">ทำไมต้องตัดสินใจเร็ว?</h2>

      <div class="lp-scarcity-reasons">
        <div class="lp-scarcity-reason">
          <div class="lp-scarcity-icon">🎯</div>
          <div class="lp-scarcity-content">
            <h3>ราคา 1,490 บาท สำหรับ 100 คนแรกเท่านั้น</h3>
            <p>หลังจากนั้นราคาจะกลับไปเป็น 2,490 บาท (เพิ่มขึ้น 1,000 บาท)<br>
            เพราะผมต้องการเก็บ Feedback จากกลุ่มแรกเพื่อปรับปรุงคอร์ส</p>
          </div>
        </div>

        <div class="lp-scarcity-reason">
          <div class="lp-scarcity-icon">💎</div>
          <div class="lp-scarcity-content">
            <h3>1-on-1 Review Session สำหรับ 100 คนแรกเท่านั้น</h3>
            <p>โบนัสสุดพิเศษนี้ <strong>ไม่มีขาย</strong> และจะให้เฉพาะคน 100 คนแรกเท่านั้น<br>
            เพราะผมทำได้แค่เดือนละ 20-30 คน (เวลาจำกัด)</p>
          </div>
        </div>

        <div class="lp-scarcity-reason">
          <div class="lp-scarcity-icon">⚡</div>
          <div class="lp-scarcity-content">
            <h3>ทุกวันที่รอ = เสียโอกาสขาย</h3>
            <p>ลองคิดดู: ถ้าคุณมีหน้าขายของตัวเองตั้งแต่วันนี้<br>
            คุณอาจจะขายได้แล้ว 5-10 ชิ้นในเดือนนี้ = 7,500-15,000 บาท<br>
            <strong>การรอคือการเสียโอกาสหาเงิน</strong></p>
          </div>
        </div>
      </div>

      <div class="lp-scarcity-cta">
        <a href="https://pay.website1wun.com/website1wun" class="lp-cta-button lp-cta-urgent">
          ล็อคราคา 1,490 บาท เลย (เหลือที่นั่งจำกัด)
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <p class="lp-cta-subtext">⚡ เข้าถึงได้ทันที ไม่ต้องรอ</p>
      </div>
    </div>
  </div>
</section>

<!-- COMPONENT 5: RISK REVERSAL -->
<section class="lp-guarantee">
  <div class="lp-container">
    <div class="lp-guarantee-box fade-in-up">
      <div class="lp-guarantee-badge">💯 รับประกัน 100%</div>
      <h2 class="lp-guarantee-title">คุณไม่มีความเสี่ยงเลย (จริงๆ)</h2>

      <!-- Money-back Guarantee -->
      <div class="lp-guarantee-main">
        <div class="lp-guarantee-icon">🛡️</div>
        <h3>รับประกันคืนเงิน 100% ภายใน 30 วัน</h3>
        <p class="lp-guarantee-text">
          ถ้าคุณเข้าคอร์ส ทำตามทุก Step แล้ว<strong>ยังไม่มี Landing Page</strong><br>
          หรือรู้สึกว่า<strong>ไม่คุ้มค่าเงินที่จ่ายไป</strong><br>
          แค่ส่งข้อความมาหาผมใน 30 วัน<br>
          <strong>ผมคืนเงินให้ 100% ไม่ถามว่าทำไม</strong>
        </p>
      </div>

      <!-- Better-than-money-back Guarantee -->
      <div class="lp-guarantee-conditional">
        <div class="lp-guarantee-conditional-badge">⭐ Conditional Guarantee</div>
        <h3>"ถ้าคุณทำตามแล้วไม่มีเว็บ ผมทำให้ฟรี"</h3>
        <p class="lp-guarantee-text">
          ถ้าคุณทำตามทุกขั้นตอนในคอร์สแล้ว<strong>ยังสร้างเว็บไม่สำเร็จ</strong><br>
          <strong>ผมจะสร้างเว็บให้คุณฟรี</strong> (มูลค่า 15,000+ บาท)<br>
          คุณได้ทั้งเงินคืน + เว็บฟรี = <strong>ไม่มีทางเสียอยู่แล้ว</strong>
        </p>
      </div>

      <!-- Other Risk Mitigation -->
      <div class="lp-guarantee-risks">
        <h3>เรายังช่วยลดความเสี่ยงอื่นๆ ให้คุณ:</h3>
        <div class="lp-risk-grid">
          <div class="lp-risk-item">
            <div class="lp-risk-icon">⏰</div>
            <h4>เสี่ยงเรื่องเวลา</h4>
            <p>จบภายใน 1 วัน ไม่ใช่หลายเดือน<br><strong>เสียเวลาแค่ 6-8 ชม.</strong></p>
          </div>
          <div class="lp-risk-item">
            <div class="lp-risk-icon">💸</div>
            <h4>เสี่ยงเรื่องเงิน</h4>
            <p>ไม่มีค่าใช้จ่ายรายเดือน<br><strong>จ่ายครั้งเดียว ใช้ตลอดชีพ</strong></p>
          </div>
          <div class="lp-risk-item">
            <div class="lp-risk-icon">🤷</div>
            <h4>เสี่ยงว่าทำไม่เป็น</h4>
            <p>มีกลุ่ม Support ตลอดชีพ<br><strong>ถามได้ตลอด 24/7</strong></p>
          </div>
          <div class="lp-risk-item">
            <div class="lp-risk-icon">🔧</div>
            <h4>เสี่ยงว่าจะแก้ไม่เป็น</h4>
            <p>เว็บเป็นของคุณ 100%<br><strong>แก้ไขได้ตลอดเวลา</strong></p>
          </div>
        </div>
      </div>

      <!-- Worst Case Scenario -->
      <div class="lp-worst-case">
        <h3>สถานการณ์เลวร้ายที่สุดคืออะไร?</h3>
        <div class="lp-worst-case-scenarios">
          <div class="lp-scenario">
            <span class="lp-scenario-label">ถ้าคุณลองทำ:</span>
            <span class="lp-scenario-result">ได้เว็บ + ได้ทักษะใหม่ + อาจได้รายได้เพิ่ม</span>
          </div>
          <div class="lp-scenario lp-scenario-neutral">
            <span class="lp-scenario-label">ถ้าทำไม่สำเร็จ:</span>
            <span class="lp-scenario-result">ได้เงินคืน 100% + ได้เว็บฟรี (ผมทำให้)</span>
          </div>
          <div class="lp-scenario lp-scenario-bad">
            <span class="lp-scenario-label">ถ้าคุณไม่ทำอะไร:</span>
            <span class="lp-scenario-result">ยังไม่มีหน้าขาย ยังต้องจ่ายรายเดือน ยังส่งลิงก์ IG อยู่</span>
          </div>
        </div>
        <p class="lp-worst-case-conclusion">
          <strong>แม้ในกรณีเลวร้ายที่สุด คุณก็ไม่เสียอะไรเลย</strong><br>
          แต่ถ้าไม่ลอง <strong>คุณจะไม่มีทางรู้ว่าชีวิตจะดีขึ้นได้แค่ไหน</strong>
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Final CTA -->
<section class="lp-final-cta">
  <div class="lp-container">
    <div class="lp-final-box fade-in-up">
      <h2>ตอนนี้คุณมี 2 ทางเลือก:</h2>

      <div class="lp-choice-grid">
        <div class="lp-choice lp-choice-bad">
          <div class="lp-choice-icon">❌</div>
          <h3>ทางเลือกที่ 1: ไม่ทำอะไร</h3>
          <ul>
            <li>ยังไม่มีหน้าขายของตัวเอง</li>
            <li>ต้องส่งลิงก์ IG/FB ที่ดูไม่เป็นทางการ</li>
            <li>เสียโอกาสขายทุกวัน</li>
            <li>จ่ายค่า Shopify/Wix รายเดือนต่อไป</li>
            <li>3 เดือนผ่านไป ยังไม่มีอะไรเปลี่ยน</li>
          </ul>
        </div>

        <div class="lp-choice lp-choice-good">
          <div class="lp-choice-icon">✅</div>
          <h3>ทางเลือกที่ 2: เริ่มวันนี้</h3>
          <ul>
            <li>มีหน้าขายของตัวเองภายใน 1 วัน</li>
            <li>ส่งลิงก์ให้ลูกค้าได้อย่างมั่นใจ</li>
            <li>เริ่มขายได้ทันที ไม่ต้องรอ</li>
            <li>ไม่ต้องจ่ายค่ารายเดือนอีกต่อไป</li>
            <li>ใช้ทักษะนี้ได้ตลอดชีวิต</li>
          </ul>
        </div>
      </div>

      <div class="lp-final-cta-button">
        <a href="https://pay.website1wun.com/website1wun" class="lp-cta-button lp-cta-final">
          เริ่มสร้าง Landing Page ตอนนี้เลย - 1,490 บาท
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <p class="lp-cta-reminder">
          ✓ ราคา 1,490 บาท (100 คนแรก)<br>
          ✓ 1-on-1 Review Session (ซื้อไม่ได้)<br>
          ✓ รับประกันคืนเงิน 30 วัน<br>
          ✓ เข้าได้ทันที ไม่ต้องรอ
        </p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="lp-faq">
  <div class="lp-container">
    <h2 class="lp-faq-title">คำถามที่ถามบ่อย</h2>
    <div class="lp-faq-list">
      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ผมไม่เคยเขียนโค้ดเลย ทำได้จริงหรอ?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ได้แน่นอนครับ! นักเรียนของผม 90% ไม่เคยเขียนโค้ดมาก่อน แต่ทำได้หมด เพราะผมใช้ AI ช่วยเขียนโค้ดให้ คุณแค่สั่งและปรับแต่งเท่านั้น ทุกอย่างอธิบายด้วยภาษาคนทั่วไป ไม่ใช้คำศัพท์เทคนิค
        </p>
      </div>

      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ต้องจ่ายค่า Hosting รายเดือนไหม?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ไม่ต้องเลยครับ! ผมจะสอนให้คุณใช้ GitHub Pages ซึ่งเป็น Hosting ฟรีตลอดชีพ ไม่มีค่าใช้จ่ายรายเดือน รองรับ Traffic ได้เยอะมาก ความเร็วก็ดีด้วย นี่คือเหตุผลที่ผมบอกว่าคุณประหยัดได้ปีละ 18,000 บาท
        </p>
      </div>

      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ใช้เวลาจริงๆ นานแค่ไหน?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ถ้าทำติดกันไม่หยุด ประมาณ 6-8 ชั่วโมง คนไหนเร็วก็เสร็จภายใน 4-5 ชม. คนที่ช้าหน่อยก็ 8-10 ชม. แต่ที่สำคัญคือจบภายใน 1 วันได้จริงๆ ครับ ไม่ใช่หลายสัปดาห์หรือหลายเดือน
        </p>
      </div>

      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">เชื่อมต่อระบบรับเงินได้จริงไหม?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ได้เลยครับ! มี Bonus เฉพาะเรื่องนี้เลย ผมจะสอนวิธีเชื่อมต่อ Stripe (Credit Card), PayPal, และ PromptPay QR Code รับเงินอัตโนมัติ ส่งใบเสร็จอัตโนมัติได้ด้วย
        </p>
      </div>

      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">เข้าดูคอร์สได้นานแค่ไหน?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ตลอดชีพครับ! ซื้อครั้งเดียว ดูได้ตลอดไป และถ้ามี Update ใหม่ๆ คุณก็จะได้รับฟรีด้วย รวมถึง Facebook Group ก็เข้าได้ตลอดชีพเช่นกัน
        </p>
      </div>

      <div class="lp-faq-item fade-in-up">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ทำไมถึงให้ 1-on-1 Review ฟรี?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          เพราะผมอยากเก็บ Feedback จากการใช้งานจริง และอยากให้คุณประสบความสำเร็จจริงๆ ครับ ผมเชื่อว่าถ้าคุณสำเร็จ คุณก็จะแนะนำคนอื่นต่อ ซึ่งเป็น Win-Win สำหรับทั้งคู่ แต่ทำได้แค่ 100 คนแรกเท่านั้น เพราะเวลาจำกัด
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="lp-footer">
  <div class="lp-container">
    <p>&copy; 2025 Website 1 Wun. All rights reserved.</p>
  </div>
</footer>

<style>
  /* === RESET & BASE === */
  :global(body),
  :global(*) {
    font-family: 'Prompt', sans-serif !important;
  }

  :global(body) {
    overflow-x: hidden;
  }

  /* === UTILITY CLASSES === */
  .fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  :global(.fade-in-up.visible) {
    opacity: 1;
    transform: translateY(0);
  }

  /* === CONTAINER === */
  .lp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* === SECTION SPACING === */
  section {
    padding: 80px 20px;
  }

  @media (max-width: 768px) {
    section {
      padding: 60px 20px;
    }
  }

  /* === TYPOGRAPHY === */
  .lp-section-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    text-align: center;
    margin-bottom: 3rem;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    .lp-section-title {
      font-size: 2rem;
    }
  }

  /* === PROBLEM SECTION === */
  .lp-problem-section {
    background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  }

  .lp-problem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .lp-problem-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .lp-problem-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  .lp-problem-icon {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  .lp-problem-card h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .lp-problem-card p {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  /* === CORE OFFER SECTION === */
  .lp-core-offer {
    background: var(--cream-light);
  }

  .lp-offer-name {
    text-align: center;
    margin-bottom: 3rem;
  }

  .lp-offer-badge {
    display: inline-block;
    background: var(--golden);
    color: var(--dark);
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .lp-offer-title {
    font-size: 3rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  .lp-offer-subtitle {
    font-size: 1.3rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .lp-offer-title {
      font-size: 2rem;
    }
    .lp-offer-subtitle {
      font-size: 1.1rem;
    }
  }

  /* Transformation */
  .lp-transformation {
    background: linear-gradient(135deg, var(--golden) 0%, #fcd34d 100%);
    padding: 3rem;
    border-radius: 24px;
    text-align: center;
    margin-bottom: 4rem;
    box-shadow: 0 8px 32px rgba(254, 191, 0, 0.3);
  }

  .lp-transformation-text {
    font-size: 1.4rem;
    line-height: 1.8;
    color: var(--dark);
  }

  @media (max-width: 768px) {
    .lp-transformation {
      padding: 2rem;
    }
    .lp-transformation-text {
      font-size: 1.1rem;
    }
  }

  /* Highlights */
  .lp-highlights {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .lp-highlight-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    border-left: 6px solid var(--golden);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  .lp-highlight-header {
    margin-bottom: 1.5rem;
  }

  .lp-highlight-number {
    display: inline-block;
    background: var(--golden);
    color: var(--dark);
    padding: 0.3rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .lp-highlight-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark);
    line-height: 1.4;
  }

  .lp-highlight-bullets {
    list-style: none;
    padding: 0;
  }

  .lp-highlight-bullets li {
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 0.75rem;
    padding-left: 2rem;
    position: relative;
  }

  .lp-highlight-bullets li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--golden);
    font-weight: 700;
    font-size: 1.2rem;
  }

  /* Proof Section */
  .lp-proof-section {
    margin-top: 4rem;
    text-align: center;
  }

  .lp-proof-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 2rem;
  }

  .lp-proof-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .lp-proof-item {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .lp-proof-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .lp-proof-note {
    font-size: 1.1rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  /* === PRICE REVEAL SECTION === */
  .lp-price-reveal {
    background: white;
  }

  .lp-price-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    text-align: center;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-price-title {
      font-size: 2rem;
    }
  }

  /* Comparison Table */
  .lp-comparison-table {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .lp-comparison-item {
    background: #f9f9f9;
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    border: 2px solid #e0e0e0;
  }

  .lp-comparison-winner {
    background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
    border: 3px solid var(--golden);
    transform: scale(1.05);
    position: relative;
  }

  .lp-winner-badge {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--golden);
    color: var(--dark);
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .lp-comparison-option {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
  }

  .lp-comparison-price {
    font-size: 2rem;
    font-weight: 800;
    color: var(--golden);
    margin-bottom: 1rem;
  }

  .lp-comparison-cons {
    font-size: 0.95rem;
    color: #ef4444;
  }

  .lp-comparison-pros {
    font-size: 0.95rem;
    color: #10b981;
    font-weight: 600;
  }

  /* Price Box */
  .lp-price-box {
    background: linear-gradient(135deg, var(--dark) 0%, #1a1a1a 100%);
    padding: 3rem;
    border-radius: 24px;
    color: white;
    text-align: center;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  }

  .lp-price-regular {
    margin-bottom: 1rem;
  }

  .lp-price-label {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .lp-price-amount-old {
    font-size: 2rem;
    font-weight: 600;
    text-decoration: line-through;
    opacity: 0.6;
  }

  .lp-price-special {
    margin-bottom: 2rem;
  }

  .lp-price-amount-new {
    display: block;
    font-size: 4rem;
    font-weight: 800;
    color: var(--golden);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .lp-price-savings {
    display: inline-block;
    background: var(--golden);
    color: var(--dark);
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .lp-price-box {
      padding: 2rem;
    }
    .lp-price-amount-new {
      font-size: 3rem;
    }
  }

  .lp-price-value {
    background: rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    text-align: left;
  }

  .lp-value-statement {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .lp-value-statement:last-child {
    margin-bottom: 0;
  }

  /* CTA Button */
  .lp-cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--golden);
    color: var(--dark);
    padding: 1.25rem 2.5rem;
    border-radius: 12px;
    font-size: 1.3rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(254, 191, 0, 0.4);
  }

  .lp-cta-button:hover {
    background: #fcd34d;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(254, 191, 0, 0.6);
  }

  .lp-cta-subtext {
    margin-top: 1rem;
    font-size: 0.95rem;
    opacity: 0.8;
  }

  /* === BONUSES SECTION === */
  .lp-bonuses {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  .lp-bonuses-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    text-align: center;
    margin-bottom: 1rem;
  }

  .lp-bonuses-subtitle {
    font-size: 1.3rem;
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-bonuses-title {
      font-size: 2rem;
    }
    .lp-bonuses-subtitle {
      font-size: 1.1rem;
    }
  }

  .lp-bonus-items {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .lp-bonus-card {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    border-top: 4px solid var(--blue);
  }

  .lp-bonus-ultimate {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-top: 4px solid var(--golden);
    box-shadow: 0 8px 32px rgba(254, 191, 0, 0.3);
  }

  .lp-bonus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .lp-bonus-badge {
    background: var(--blue);
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .lp-bonus-ultimate-badge {
    background: var(--golden);
    color: var(--dark);
  }

  .lp-bonus-value {
    background: rgba(0, 0, 0, 0.05);
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--dark);
  }

  .lp-bonus-ultimate-value {
    background: var(--dark);
    color: var(--golden);
  }

  .lp-bonus-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .lp-bonus-exclusive {
    background: var(--golden);
    color: var(--dark);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .lp-bonus-features {
    list-style: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }

  .lp-bonus-features li {
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin-bottom: 1rem;
    padding-left: 2rem;
    position: relative;
  }

  .lp-bonus-features li::before {
    content: "🎁";
    position: absolute;
    left: 0;
    font-size: 1.2rem;
  }

  .lp-bonus-format {
    background: rgba(0, 0, 0, 0.05);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 1rem;
  }

  .lp-bonus-why {
    background: rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--dark);
    font-style: italic;
  }

  /* Value Stack */
  .lp-value-stack {
    background: white;
    padding: 3rem;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .lp-stack-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--dark);
    text-align: center;
    margin-bottom: 2rem;
  }

  .lp-stack-items {
    max-width: 600px;
    margin: 0 auto;
  }

  .lp-stack-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .lp-stack-name {
    font-size: 1.05rem;
    color: var(--text-secondary);
  }

  .lp-stack-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dark);
  }

  .lp-stack-divider {
    height: 2px;
    background: var(--golden);
    margin: 1.5rem 0;
  }

  .lp-stack-total {
    border-bottom: none;
    padding: 1.5rem 0 0.5rem 0;
  }

  .lp-stack-total-value {
    font-size: 1.8rem;
    color: #ef4444;
    text-decoration: line-through;
  }

  .lp-stack-today {
    border-bottom: none;
    padding: 0.5rem 0;
  }

  .lp-stack-today-value {
    font-size: 2.5rem;
    color: var(--golden);
    font-weight: 800;
  }

  .lp-stack-note {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    color: #10b981;
    margin-top: 1.5rem;
  }

  /* === SCARCITY SECTION === */
  .lp-scarcity {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  }

  .lp-scarcity-box {
    background: white;
    padding: 3rem;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .lp-scarcity-badge {
    display: inline-block;
    background: #ef4444;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .lp-scarcity-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-scarcity-box {
      padding: 2rem;
    }
    .lp-scarcity-title {
      font-size: 2rem;
    }
  }

  .lp-scarcity-reasons {
    text-align: left;
    margin-bottom: 3rem;
  }

  .lp-scarcity-reason {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
    align-items: flex-start;
  }

  .lp-scarcity-icon {
    font-size: 3rem;
    flex-shrink: 0;
  }

  .lp-scarcity-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 0.75rem;
  }

  .lp-scarcity-content p {
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  .lp-cta-urgent {
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  }

  .lp-cta-urgent:hover {
    background: #dc2626;
    box-shadow: 0 8px 30px rgba(239, 68, 68, 0.6);
  }

  /* === GUARANTEE SECTION === */
  .lp-guarantee {
    background: white;
  }

  .lp-guarantee-box {
    max-width: 900px;
    margin: 0 auto;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    padding: 3rem;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .lp-guarantee-badge {
    display: inline-block;
    background: #10b981;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .lp-guarantee-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    text-align: center;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-guarantee-box {
      padding: 2rem;
    }
    .lp-guarantee-title {
      font-size: 2rem;
    }
  }

  .lp-guarantee-main {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  .lp-guarantee-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .lp-guarantee-main h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
  }

  .lp-guarantee-text {
    font-size: 1.15rem;
    color: var(--text-secondary);
    line-height: 1.9;
  }

  .lp-guarantee-conditional {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 2.5rem;
    border-radius: 16px;
    text-align: center;
    margin-bottom: 2rem;
  }

  .lp-guarantee-conditional-badge {
    display: inline-block;
    background: var(--golden);
    color: var(--dark);
    padding: 0.5rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .lp-guarantee-conditional h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 1rem;
  }

  .lp-guarantee-risks {
    margin-bottom: 2rem;
  }

  .lp-guarantee-risks h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--dark);
    text-align: center;
    margin-bottom: 2rem;
  }

  .lp-risk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .lp-risk-item {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
  }

  .lp-risk-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .lp-risk-item h4 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 0.5rem;
  }

  .lp-risk-item p {
    font-size: 0.95rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .lp-worst-case {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
  }

  .lp-worst-case h3 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--dark);
    text-align: center;
    margin-bottom: 2rem;
  }

  .lp-worst-case-scenarios {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .lp-scenario {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-radius: 12px;
    background: #f0fdf4;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .lp-scenario-neutral {
    background: #fef3c7;
  }

  .lp-scenario-bad {
    background: #fee2e2;
  }

  .lp-scenario-label {
    font-weight: 600;
    color: var(--dark);
    flex: 0 0 auto;
  }

  .lp-scenario-result {
    font-weight: 500;
    color: var(--text-secondary);
    flex: 1 1 auto;
  }

  .lp-worst-case-conclusion {
    font-size: 1.15rem;
    line-height: 1.8;
    text-align: center;
    color: var(--dark);
  }

  /* === FINAL CTA SECTION === */
  .lp-final-cta {
    background: linear-gradient(135deg, var(--dark) 0%, #1a1a1a 100%);
    color: white;
  }

  .lp-final-box {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
  }

  .lp-final-box h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-final-box h2 {
      font-size: 2rem;
    }
  }

  .lp-choice-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .lp-choice {
    background: rgba(255, 255, 255, 0.05);
    padding: 2.5rem;
    border-radius: 20px;
    text-align: left;
  }

  .lp-choice-good {
    background: rgba(254, 191, 0, 0.15);
    border: 2px solid var(--golden);
  }

  .lp-choice-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .lp-choice h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .lp-choice ul {
    list-style: none;
    padding: 0;
  }

  .lp-choice ul li {
    font-size: 1.05rem;
    line-height: 1.8;
    margin-bottom: 0.75rem;
    padding-left: 2rem;
    position: relative;
    opacity: 0.9;
  }

  .lp-choice-bad ul li::before {
    content: "✗";
    position: absolute;
    left: 0;
    color: #ef4444;
    font-weight: 700;
  }

  .lp-choice-good ul li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--golden);
    font-weight: 700;
  }

  .lp-final-cta-button {
    margin-top: 3rem;
  }

  .lp-cta-final {
    font-size: 1.4rem;
    padding: 1.5rem 3rem;
  }

  @media (max-width: 768px) {
    .lp-cta-final {
      font-size: 1.2rem;
      padding: 1.25rem 2rem;
    }
  }

  .lp-cta-reminder {
    margin-top: 1.5rem;
    font-size: 1.05rem;
    line-height: 1.8;
    opacity: 0.9;
  }

  /* === FAQ SECTION === */
  .lp-faq {
    background: var(--cream-light);
  }

  .lp-faq-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--dark);
    text-align: center;
    margin-bottom: 3rem;
  }

  @media (max-width: 768px) {
    .lp-faq-title {
      font-size: 2rem;
    }
  }

  .lp-faq-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .lp-faq-item {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .faq-question-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    gap: 1rem;
  }

  .faq-question {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--dark);
    margin: 0;
  }

  .faq-toggle {
    font-size: 2rem;
    font-weight: 300;
    color: var(--golden);
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  :global(.lp-faq-item.active) .faq-toggle {
    transform: rotate(45deg);
  }

  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    font-size: 1.05rem;
    color: var(--text-secondary);
    line-height: 1.8;
    margin: 0;
    padding-top: 0;
  }

  :global(.lp-faq-item.active) .faq-answer {
    max-height: 500px;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  /* === FOOTER === */
  .lp-footer {
    background: var(--dark);
    color: white;
    text-align: center;
    padding: 2rem;
  }

  .lp-footer p {
    margin: 0;
    opacity: 0.7;
  }
</style>
