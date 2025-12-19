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

    const dreamItems = document.querySelectorAll('.dream-item');
    dreamItems.forEach(item => observer.observe(item));

    const problemItems = document.querySelectorAll('.problem-item');
    problemItems.forEach(item => observer.observe(item));

    const mechanismCards = document.querySelectorAll('.mechanism-card');
    mechanismCards.forEach(card => observer.observe(card));

    const outcomeListItems = document.querySelectorAll('.outcome-list li');
    outcomeListItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);
    });

    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);
    });

    const comparisonCards = document.querySelectorAll('.comparison-card');
    comparisonCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    const forListItems = document.querySelectorAll('.for-list li');
    forListItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);

      const questionWrapper = item.querySelector('.faq-question-wrapper');
      questionWrapper?.addEventListener('click', function() {
        item.classList.toggle('active');
      });
    });

    const choiceItems = document.querySelectorAll('.choice-item');
    choiceItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.15}s`;
      observer.observe(item);
    });

    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');

    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const heroBottom = heroSection?.offsetTop + heroSection?.offsetHeight;

      if (scrollTop > heroBottom && scrollTop > lastScrollTop) {
        stickyCta?.classList.add('visible');
      } else if (scrollTop < heroBottom) {
        stickyCta?.classList.remove('visible');
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);

    const ctaButtons = document.querySelectorAll('a[href="#checkout"]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const checkoutSection = document.getElementById('checkout');
        checkoutSection?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.3}s`;
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:head>
  <title>Website 1 Wun – Build a Real Website in 1 Day</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/w1w/style.css">
</svelte:head>

<header class="site-header">
  <div class="header-container">
    <img src="/w1w/w1w-logo.png" alt="Website 1 Wun" class="site-logo">
    <nav class="main-nav">
      <a href="/login" class="nav-button">Sign In</a>
    </nav>
  </div>
</header>

<section class="hero" id="hero">
  <div class="hero-content">
    <div class="hero-label">1 เว็บ 1 วัน การันตี</div>
    <h1 class="hero-headline">
      สร้างเว็บ <span class="accent-text"> 1 วัน</span><br>แบบไม่ปวดหัว<br/>ด้วยเงิน 0 บาท!
    </h1>
    <p class="hero-subheadline">
      (แม้คุณจะไม่เคยสร้าง Website มาก่อน)
    </p>
    <a href="#checkout" class="cta-button cta-primary">
      สร้างเว็บไซต์เลย!
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
    <div class="hero-trust">
      <span class="trust-item">✓ ไม่ต้องมีประสบการณ์</span>
      <span class="trust-item">✓ จบภายใน 1 วัน</span>
      <span class="trust-item">✓ การันตีเว็บพร้อมใช้งาน</span>
    </div>
  </div>
  <div class="hero-visual">
    <div class="floating-card card-1">
      <div class="card-header">Your Website</div>
      <div class="card-content">
        <div class="progress-bar"><div class="progress-fill"></div></div>
        <div class="card-status">100% Complete</div>
      </div>
    </div>
    <div class="floating-card card-2">
      <div class="check-icon">✓</div>
      <div class="card-text">Live & Online</div>
    </div>
    <div class="floating-card card-3">
      <div class="card-time">1 Day</div>
    </div>
  </div>
</section>

<section class="problem-intro">
  <div class="container">
    <div class="problem-intro-content">
      <p class="intro-text" style="font-size: 2rem; font-weight: 800; color: var(--dark); margin-bottom: 2rem;">สต๊อป...หยุดก่อน</p>

      <p class="intro-text" style="font-size: 1.3rem; margin-bottom: 2.5rem;">
        ก่อนที่คุณจะอ่านต่อ ผมอยากถามอะไรสักอย่าง:
      </p>

      <p class="intro-text" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 3rem;">
        คุณกำลังเป็น Solopreneur, Freelancer, หรือพนักงานประจำ<br>
        ที่กำลังพยายามสร้างรายได้เสริม อยู่หรือเปล่าครับ?
      </p>

      <p class="intro-text" style="font-size: 1.3rem; margin-bottom: 2rem;">แล้วคุณมีปัญหาเหล่านี้รึเปล่า...</p>

      <div class="problem-result" style="background: rgba(16, 185, 129, 0.08); border: 2px solid rgba(16, 185, 129, 0.2); margin-bottom: 2rem;">
        <p style="font-size: 1.2rem;"><b>คุณมี:</b><br>
          ✓ Skill ที่เก่ง (กว่าค่าเฉลี่ย)<br>
          ✓ Portfolio ในหัว (หรือในคอม)<br>
          ✓ ลูกค้าที่ชอบผลงานคุณ<br>
          ✓ ความฝันที่อยากทำสิ่งที่ตัวเองชอบ</p>
      </div>

      <div class="problem-result">
        <p style="font-size: 1.2rem;"><b>แต่คุณไม่มี:</b><br>
          ✗ เว็บไซต์ที่ให้คนเข้ามาดูว่าคุณทำอะไร<br>
          ✗ หน้า Landing Page ที่ส่งให้ลูกค้าตอนแนะนำตัว<br>
          ✗ พื้นที่เพื่อจะโชว์ว่าคุณเป็นมืออาชีพจริง</p>
      </div>

      <p class="section-transition">ผลคือ...</p>

      <div class="pain-points">
        <div class="pain-point">
          <div class="pain-header">ทุกครั้งที่มีคนถาม "คุณทำอะไร?"</div>
          <p>คุณต้องพิมพ์ยาวๆ อธิบายไปอีกรอบ<br>
          <span class="pain-detail">(แทนที่จะส่งลิงก์เดียวจบ)</span></p>
        </div>

        <div class="pain-point">
          <div class="pain-header">ทุกครั้งที่มีโอกาสดีๆ เข้ามา</div>
          <p>คุณดูไม่น่าเชื่อถือพอ<br>
          <span class="pain-detail">(เพราะคนอื่นมีเว็บแต่คุณไม่มี)</span></p>
        </div>

        <div class="pain-point">
          <div class="pain-header">ทุกครั้งที่ลูกค้าสนใจและขอดู</div>
          <p>คุณอึกอักแล้วบอกว่า...เดี๋ยวส่งให้นะ<br>
          <span class="pain-detail">(แทนที่จะได้ขายงานเลย)</span></p>
        </div>
      </div>

      <div class="worst-reveal">
        <div class="reveal-question">และที่แย่ที่สุดคืออะไรรู้ไหมครับ?</div>
        <div class="reveal-answer">
          <p>ทุกวันนี้มันไม่ยากอย่างที่คิด ไม่ต้องเขียนโค้ด ไม่ต้องใช้เงินหลักหมื่น</p>
          <p class="reveal-truth">แค่รู้วิธีที่ถูกต้อง คุณก็มีเว็บได้ภายใน 1 วัน</p>
          <p class="reveal-pain">(แต่ไม่มีใครบอกคุณว่าทำยังไง)</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="choices-section">
  <div class="container">
    <div class="choices-header">
      <p class="choices-intro">โอเค ถึงตอนนี้<br>เราจะมีอยู่ 4 ทางเลือก</p>
    </div>

    <div class="choices-journey">
      <!-- Choice 1 -->
      <div class="choice-item choice-flawed">
        <div class="choice-number">1</div>
        <div class="choice-content">
          <div class="choice-title">
            <h3>ทางเลือกที่ 1: จ้างคนทำ</h3>
            <span class="choice-promise">คุณจะได้เว็บ</span>
          </div>
          <div class="choice-reality">
            <span class="reality-label">แต่:</span>
            <ul class="reality-list">
              <li>ใช้เวลาเป็นอาทิตย์</li>
              <li>แก้ทีนึงต้องรอนาน</li>
              <li>สุดท้ายเว็บไม่ใช่ของคุณจริงๆ</li>
            </ul>
          </div>
        </div>
        <div class="choice-verdict verdict-bad">×</div>
      </div>

      <!-- Choice 2 -->
      <div class="choice-item choice-flawed">
        <div class="choice-number">2</div>
        <div class="choice-content">
          <div class="choice-title">
            <h3>ทางเลือกที่ 2: ซื้อคอร์สทั่วไป</h3>
            <span class="choice-promise">คุณจะได้ความรู้</span>
          </div>
          <div class="choice-reality">
            <span class="reality-label">แต่:</span>
            <ul class="reality-list">
              <li>วิดีโอยาวกว่ากำแพงเมืองจีน</li>
              <li>ดูแล้วจบวันก็ยังไม่มีเว็บ</li>
              <li>ต้องคิดเองว่าจะเอาอะไรมาใช้</li>
            </ul>
          </div>
        </div>
        <div class="choice-verdict verdict-bad">×</div>
      </div>

      <!-- Choice 3 -->
      <div class="choice-item choice-flawed">
        <div class="choice-number">3</div>
        <div class="choice-content">
          <div class="choice-title">
            <h3>ทางเลือกที่ 3: ยังไม่ทำ</h3>
            <span class="choice-promise">ไม่เสียเงิน</span>
          </div>
          <div class="choice-reality">
            <span class="reality-label">แต่:</span>
            <ul class="reality-list">
              <li>ยังไม่มีเว็บเหมือนเดิม</li>
              <li>ความมั่นใจลดลงเรื่อยๆ</li>
              <li>โอกาสผ่านไปเฉยๆ</li>
            </ul>
          </div>
        </div>
        <div class="choice-verdict verdict-bad">×</div>
      </div>

      <!-- Choice 4 - The Winner -->
      <div class="choice-item choice-winner">
        <div class="winner-badge">ทางที่ดีที่สุด</div>
        <div class="choice-number choice-number-golden">4</div>
        <div class="choice-content">
          <div class="choice-title">
            <h3>ทางเลือกที่ 4: Website 1 Wun</h3>
            <span class="choice-tagline">ไม่ใช่ทางลัด แต่<strong style="color: var(--dark);">สั้นและเวิร์คสุด</strong></span>
          </div>
          <div class="choice-benefits">
            <ul class="benefits-list">
              <li>
                <svg class="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ใช้เวลา 1 วัน
              </li>
              <li>
                <svg class="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ได้เว็บที่ใช้งานได้จริง
              </li>
              <li>
                <svg class="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor"/>
                  <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                เข้าใจและต่อยอดได้จริง
              </li>
            </ul>
          </div>
        </div>
        <div class="choice-verdict verdict-good">✓</div>
      </div>
    </div>
  </div>
</section>

<div class="section-divider"></div>

<section class="who-am-i">
  <div class="container">
    <div class="who-am-i-content">
      <div class="who-am-i-header">
        <div class="author-badge">👋 สวัสดีค้าบ ผมกีตาร์เอง</div>
        <h2>ผมก็เคยอยู่ในจุดเดียวกับเพื่อนๆ มาก่อน</h2>
      </div>

      <div class="who-am-i-grid">
        <div class="author-image">
          <img src="/w1w/guitar-dsp-square.png" alt="Guitar - Dead Simple Productivity" class="author-photo">
        </div>

        <div class="author-story">
          <p class="story-text">เมื่อ 6 ปีก่อนช่วงที่ผมกำลังก้าวเข้าสู่การสร้างรายได้เสริมบนโลกออนไลน์ ผมหาวิธีทำ Website หลายรูปแบบมาก และเนื่องจากยังเรียนอยู่ เลยพยายามหาที่มันค่าใช้จ่ายต่ำที่สุด (พูดง่ายๆ คือฟรีนั่นแหละ ฮ่าา)</p>

          <p class="story-text">เลยมาเจอกับวิธีทำ Static Website ตอนนั้นผมว้าวมาก เพราะไม่เคยรู้เลยว่าเราสามารถสร้างเว็บขึ้นบนโลกออนไลน์เพื่อโชว์ผลงาน โฆษณาร้าน สร้างหน้าขายสินค้า (Salespage) แบบฟรีได้ ข้อจำกัดตอนนั้นคือต้องเขียนโค้ดเป็น</p>

          <p class="story-text">ผมก็ไม่ใช่คนเก่งหรอกครับ เลยไปก๊อปโค้ดของคนนู้นคนนี้มาปนๆ เป็นเว็บของตัวเอง (ใช่ครับ มันออกมาตลกมาก55+) แต่ตัดภาพมาทุกวันนี้ เรามี AI แล้ว ขั้นตอนนี้ง่ายกว่าเดิม 99% เหลือแค่เรา "รู้วิธีสั่ง" และ "รู้วิธีทำ"</p>

          <p class="story-text">ช่วงนั้นผมเสียเวลาไปเป็นปีๆ เพื่อศึกษาเรื่องพวกนี้ (หมกมุ่นเนอะ ฮ่าา) และผมจะโคตรดีใจเลยถ้าวันนั้นมีคนสอนทุกอย่างนี้ได้ ภายใน 1 วัน</p>

          <div class="story-highlight">
            <p><strong>เลยเป็นที่มาของโปรเจกต์ Website 1 Wun</strong> — ที่เพื่อนๆ กำลังอ่านนี่แหละครับ คอร์สสั้นที่กระชับ เรียบง่าย  เป้าหมายเดียวคือสามารถทำให้เพื่อนๆ มีเว็บของตัวเองได้ภายใน 1 วันจริงๆ ไม่ต้องเสียเวลาชีวิตแบบผม (ผมเสียมาให้แล้ว แฮ่)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="student-showcase">
  <div class="container">
    <div class="showcase-header">
      <div class="showcase-label">See Our Work!</div>
      <h2>ตัวอย่างของเพื่อนๆ ที่ทำไป</h2>
      <p class="showcase-subtitle">ไม่มีพื้นฐาน ไม่เคยเขียนโค้ด เย้</p>
    </div>

    <div class="showcase-grid">
      <div class="showcase-item" style="animation-delay: 0.1s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-1.png" alt="Student Website 1" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.2s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-2.png" alt="Student Website 2" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.3s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-3.png" alt="Student Website 3" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.4s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-4.png" alt="Student Website 4" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.5s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-5.png" alt="Student Website 5" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.6s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-6.png" alt="Student Website 6" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.7s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-7.png" alt="Student Website 7" class="showcase-image">
        </div>
      </div>

      <div class="showcase-item" style="animation-delay: 0.8s">
        <div class="showcase-image-wrapper">
          <img src="/w1w/web-showcase-8.png" alt="Student Website 8" class="showcase-image">
        </div>
      </div>

    </div>
  </div>
</section>

<section class="social-proof">
  <div class="social-proof-header">
    <h2>และถ้ายังคิดว่ามันยาก</h2>
    <p>ลองฟังจากเสียงเพื่อนๆ ดูได้เลยค้าบ เย้ๆ</p>
  </div>

  <div class="testimonials-marquee">
    <div class="testimonials-track">
      <!-- Row 1 -->
      <div class="testimonial-mini-card">
        <img src="/w1w/images/1.png" alt="Testimonial 1" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/2.png" alt="Testimonial 2" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/3.png" alt="Testimonial 3" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/4.png" alt="Testimonial 4" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/5.png" alt="Testimonial 5" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/6.png" alt="Testimonial 6" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/7.png" alt="Testimonial 7" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/8.png" alt="Testimonial 8" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/9.png" alt="Testimonial 9" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/10.png" alt="Testimonial 10" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/11.png" alt="Testimonial 11" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/12.png" alt="Testimonial 12" class="testimonial-img">
      </div>

      <!-- Duplicate for seamless loop -->
      <div class="testimonial-mini-card">
        <img src="/w1w/images/1.png" alt="Testimonial 1" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/2.png" alt="Testimonial 2" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/3.png" alt="Testimonial 3" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/4.png" alt="Testimonial 4" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/5.png" alt="Testimonial 5" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/6.png" alt="Testimonial 6" class="testimonial-img">
      </div>
    </div>
  </div>

  <div class="testimonials-marquee testimonials-marquee-reverse">
    <div class="testimonials-track">
      <!-- Row 2 (reverse direction) -->
      <div class="testimonial-mini-card">
        <img src="/w1w/images/13.png" alt="Testimonial 13" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/14.png" alt="Testimonial 14" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/15.png" alt="Testimonial 15" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/16.png" alt="Testimonial 16" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/17.png" alt="Testimonial 17" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/18.png" alt="Testimonial 18" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/19.png" alt="Testimonial 19" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/20.png" alt="Testimonial 20" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/21.png" alt="Testimonial 21" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/22.png" alt="Testimonial 22" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/23.png" alt="Testimonial 23" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/24.png" alt="Testimonial 24" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/25.png" alt="Testimonial 25" class="testimonial-img">
      </div>

      <!-- Duplicate for seamless loop -->
      <div class="testimonial-mini-card">
        <img src="/w1w/images/13.png" alt="Testimonial 13" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/14.png" alt="Testimonial 14" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/15.png" alt="Testimonial 15" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/16.png" alt="Testimonial 16" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/17.png" alt="Testimonial 17" class="testimonial-img">
      </div>
      <div class="testimonial-mini-card">
        <img src="/w1w/images/18.png" alt="Testimonial 18" class="testimonial-img">
      </div>
    </div>
  </div>
</section>



<section class="value-stack">
  <div class="container">
    <div class="section-header centered">
      <div class="hero-label">สิ่งที่เราจะได้รับ</div>
      <h2>Website 1 Wun ฉบับเต็ม</h2>
    </div>
    <div class="value-items">
      <div class="value-item">
        <div class="value-info">
          <h3>Challenge Website 1 Wun</h3>
          <p>ตั้งแต่เริ่มจาก 0 ไปจนถึงเอาเว็บไซต์ขึ้นบนอินเตอร์เน็ต ผมจะพาคุณไปลุยเอง เหมือนเดิมตามคอนเซปต์เพจ Dead Simple Productivity อธิบายง้ายง่าย ไม่ยืดเยื้อ ไม่ใช้คำศัพท์มนุษย์ต่างดาว จบวันคุณมีเว็บ นี่คือคำสัญญาครับ</p>
        </div>
      </div>
      <div class="value-item">
        <div class="value-info">
          <h3>w1w Landing Page Template</h3>
          <p>ช่ายย Template ของหน้านี้แหละ รู้ไหมว่า Landing Page ที่จูนมาดีๆ เสมือนพนักงานขายตัวเต็งของเราเลยครับ หน้า Landing Page อันนี้สร้างรายได้ 6 หลักภายใน 1 อาทิตย์หลังเปิดตัว คุณเอาไปแก้เป็นของตัวเองได้เลย เย้ </p>
        </div>
      </div>
      <div class="value-item">
        <div class="value-info">
          <h3>Website Templates Sources</h3>
          <p>ใครไม่ถนัดดีไซน์จริงๆ แม้แต่ภาพในหัวก็ยังคิดไม่ออก ไม่รู้จะสั่ง AI ยังไง ไม่รู้จะเริ่มจากทางไหน ผมรวมที่โหลด Template เว็บไว้ให้แล้ว เราโหลดมา ใช้ Step ที่สอนในคลาสแก้ๆ เป็นของตัวเองได้เลย</p>
        </div>
      </div>
      <div class="value-item bonus">
        <div class="bonus-badge">Bonus #1</div>
        <div class="value-info">
          <h3>Website Prompting Guide</h3>
          <p>สำหรับคนที่พอมีไอเดียในหัวอยู่บ้าง อยากจะให้ AI สร้างตามที่เราคิด ผมมีคู่มือสั้นๆ โชว์ให้ดูว่าเวลาผมดราฟหน้าเว็บไซต์หน้านึงผมเริ่มยังไง สามารถนำไปใช้ได้เช่นกันค้าบ</p>
        </div>
      </div>
      <div class="value-item bonus">
        <div class="bonus-badge">Bonus #2</div>
        <div class="value-info">
          <h3>Facebook Group Support</h3>
          <p>ไม่ต้องกลัวว่าจะเดินทางคนเดียว เพราะเราเดินเป็นกลุ่ม เย้ ติดตรงไหน ไม่เข้าใจตรงไหน หรืออยากแชร์อะไร สามารถสอบถามพูดคุยกันในกลุ่มได้เลยค้าบ</p>
        </div>
      </div>
    </div>
    <div class="value-total">
      <div class="value-calculation">
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; color: white;">
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          <strong style="font-size: 2rem; color: #febf00;">1,990 บาท</strong><br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          คือราคาที่ผมตั้งไว้<br>สำหรับ Website 1 Wun<br>
          คุณจะสามารถเอาไปใช้สร้าง<br>เว็บไซต์ของตัวเอง<br>
          เอาไปรับงานลูกค้า <br>(คนเดียวก็คืนทุนแล้ว ฮ่าา)<br>
          และใช้ต่อแบบฟรีๆ<br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          แค่คุณสร้างได้เว็บนึง<br>
          ใช้ฟรีตลอดชีพ ก็ถือว่าคุ้มมากแล้ว<br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          แต่ก่อนที่คุณจะกดตัดสินใจ<br>
          ผมอยากเล่าอะไรให้ฟังนิดนึงครับ<br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          ผมอยากเก็บ Feedback เพิ่ม<br>
          เลยอยากให้สิทธิ์พิเศษกับคนกลุ่มแรก<br>
          คนที่ลงมือทำจริงๆ เอาไปใช้จริง<br>
          แล้วเอาฟีดแบ็กมาปรับให้มันดีขึ้นไปอีก<br>
          (คิดไว้ว่าแค่ 100 คนแรกเท่านั้น)<br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          ถ้าคุณโอเคกับการเริ่มไปพร้อมกัน<br>
          ราคานี้คือคำขอบคุณจากผมครับ<br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          <strong style="font-size: 2rem; color: #febf00;">1,490 บาท</strong><br>
          <strong style="font-size: 2rem; color: #febf00;">.</strong><br>
          กับเว็บที่คุณจะได้ใช้ไปตลอดชีวิต<br>
          ถือว่าเลี้ยงชาบู You & I ผมมื้อนึง (ฮ่าา) 😄
        </p>
      </div>
      <a href="#checkout" class="cta-button cta-primary">Get Website 1 Wun Now</a>
    </div>
  </div>
</section>

<section class="guarantee">
  <div class="container">
    <div class="guarantee-content">

      <h2 class="guarantee-title">ผมสัญญาว่า...</h2>

      <div class="guarantee-promise">
        <p>จบวันนี้ คุณจะมีเว็บไซต์ไว้โชว์ผลงานได้<br>
        ทำหน้าโชว์สินค้าได้ ทำเว็บบริษัทเล็กๆ ได้</p>
      </div>

      <div class="guarantee-body">
        <p>คุณเชื่อไหม ผมไม่อยากได้เงินใครเลยถ้าเขาไม่เต็มใจให้</p>

        <p>ผมไม่ชอบมากๆ ถ้าซื้ออะไรแล้วมันไม่ได้ผลลัพท์ตามที่สัญญา</p>

        <p>และผมบอกกับภรรยาผมเสมอว่า<br>
        <i><u>"ผมไม่ชอบอะไร ผมก็จะไม่ทำกับคนอื่นแบบนั้น"</u></i></p>

        <p>ถ้าทั้งหมดนี้มันยากเกินไป คุณมองว่าผมสอนไม่เข้าใจจริงๆ<br>
        ให้ผลลัพท์ไม่ได้จริงๆ จบวันนี้คุณไม่มีเว็บไซต์</p>

        <p>ทักเข้ามาหาผมทางเพจได้เลย<br>
        <strong>ผมยินดีคืนเงินให้ 100%</strong><br>
        (แบบไม่โกรธด้วยค้าบ)</p>
      </div>

      <div class="guarantee-signature">
        <div class="signature-name">กีตาร์</div>
        <div class="signature-role">ผู้ก่อตั้ง Website 1 Wun</div>
      </div>

    </div>
  </div>
</section>

<section class="faq">
  <div class="container">
    <div class="section-header centered">
      <h2>คำถามที่ถามบ่อย (FAQs)</h2>
      <p>ตอบทุกข้อสงสัยก่อนตัดสินใจ</p>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ผมไม่เคยเขียนโค้ดเลย จะทำได้จริงหรอ?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ได้เลยครับ! นี่คือจุดประสงค์หลักของ Website 1 Wun เลย ผมออกแบบให้คนที่ไม่มีพื้นฐานเลยก็ทำได้ ด้วยการใช้ AI ช่วย และมีขั้นตอนแบบ step-by-step ที่ชัดเจนมาก คุณแค่ทำตามได้ก็จบแล้ว
        </p>
      </div>
      <div class="faq-item">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ใช้เวลาจริงๆ นานแค่ไหน?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ถ้าทำติดกันไม่หยุดประมาณ 4-6 ชั่วโมง แต่ส่วนใหญ่แบ่งทำในวันเดียว คนไหนเร็วก็เสร็จภายใน 3-4 ชม. ถ้าช้าหน่อยก็ประมาณ 6-8 ชม. แต่ที่สำคัญคือจบภายใน 1 วันจริงๆ ครับ
        </p>
      </div>
      <div class="faq-item">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">มีค่าใช้จ่ายซ่อนเร้นไหม? (โฮสติ้ง โดเมน อะไรพวกนี้)</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ในคอร์สผมจะสอนวิธีทำให้เว็บขึ้นออนไลน์ฟรี 100% โดยใช้ GitHub Pages ซึ่งไม่มีค่าใช้จ่ายเลย ส่วนโดเมนถ้าอยากได้แบบ yourbrand.com ก็ซื้อได้ราคาปีละ 300-500 บาท แต่ไม่จำเป็นเลยถ้ายังไม่อยากลงทุน
        </p>
      </div>
      <div class="faq-item">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">ถ้าทำไม่เสร็จใน 1 วันละ?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ไม่ต้องกังวลครับ มีกลุ่ม Facebook Support ให้ถามได้ตลอด และถ้าติดจริงๆ ผมพร้อมช่วยให้ทำเสร็จ นี่คือ Guarantee ของผม ผมจะไม่ปล่อยให้คุณไม่มีเว็บครับ
        </p>
      </div>
      <div class="faq-item">
        <div class="faq-question-wrapper">
          <h3 class="faq-question">เข้าดูได้นานแค่ไหน?</h3>
          <span class="faq-toggle">+</span>
        </div>
        <p class="faq-answer">
          ตลอดชีพครับ! ซื้อครั้งเดียว ใช้ได้ตลอดไป ไม่มีค่าใช้จ่ายรายเดือน และถ้ามี update ใหม่ๆ คุณก็จะได้รับฟรีด้วย
        </p>
      </div>
    </div>
  </div>
</section>

<section class="final-cta" id="checkout">
  <div class="container">
    <div class="final-cta-content">
      <h2>อะ มาถึงตอนนี้...</h2>
      <p class="final-cta-text">
        คุณอาจจะเลือกใช้เวลาอีก 1 เดือนเพื่อหาข้อมูล หาไกด์ต่างๆ และยังไม่มีเว็บซีกที<br>
        หรือคุณสามารถสร้างเว็บเสร็จได้ภายในวันนี้เลย
      </p>
      <div class="final-cta-box">
        <div class="final-offer">
          <div class="offer-title">Website 1 Wun</div>
          <div class="offer-description">Complete 1-Day Build System</div>
          <div class="offer-price">
            <span class="offer-price-original">1,990 THB</span>
            <span class="offer-price-amount">1,490 THB</span>
            <span class="offer-price-note">(ราคาพิเศษ founder price)</span>
          </div>
        </div>
        <div class="summary-section">
          <p class="summary-title">สรุปสั้นๆ หลังจบวันนี้ ผลลัพท์มีอยู่ 2 ทาง</p>
          <div class="summary-options">
            <p class="summary-option"><strong>1.</strong> คุณมีเว็บไซต์พร้อมโชว์ของ โชว์ผลงาน</p>
            <p class="summary-option"><strong>2.</strong> คุณไม่ชอบ เสียเวลาแค่ 1 วัน (ผมคืนเงินให้)</p>
          </div>
          <p class="summary-question">แฟร์มั้ยครับ?</p>
        </div>
        <a href="#checkout" class="cta-button cta-primary large">อยากสร้าง Website แล้วว</a>
      </div>
      <p style="margin-top: 48px; font-size: 14px; color: rgba(255, 255, 255, 0.4); text-align: center;">&copy; 2025 Website 1 Wun. All rights reserved.</p>
    </div>
  </div>
</section>

<style>
  :global(body),
  :global(*) {
    font-family: 'Prompt', sans-serif !important;
  }

  :global(body) {
    overflow-x: hidden;
  }
</style>
