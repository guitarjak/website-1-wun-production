<script>
  import { onMount } from "svelte";

  onMount(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      item.querySelector(".faq-q")?.addEventListener("click", () => {
        const open = item.classList.contains("open");
        faqItems.forEach((i) => i.classList.remove("open"));
        if (!open) item.classList.add("open");
      });
    });

    // Bunny player anti-seek guard: block seeking ahead past watched position.
    /** @type {number} */
    let maxWatchedSeconds = 0;
    /** @type {boolean} */
    let antiSeekSetupDone = false;
    /** @type {any} */
    let antiSeekPlayer;

    const trySetupAntiSeek = () => {
      if (antiSeekSetupDone) return true;

      const iframe = document.getElementById("hero-bunny-player");
      const win =
        /** @type {Window & { playerjs?: { Player: new (el: Element) => any } }} */ (
          window
        );
      if (!iframe || !win.playerjs?.Player) return false;

      antiSeekPlayer = new win.playerjs.Player(iframe);
      antiSeekPlayer.on("ready", () => {
        antiSeekPlayer.on(
          "timeupdate",
          (/** @type {{ seconds?: number }} */ data) => {
            const seconds =
              typeof data?.seconds === "number" ? data.seconds : 0;
            if (seconds > maxWatchedSeconds) maxWatchedSeconds = seconds;
          },
        );

        antiSeekPlayer.on("seeked", () => {
          antiSeekPlayer.getCurrentTime((/** @type {number} */ currentTime) => {
            if (typeof currentTime !== "number") return;

            // Allow tiny jitter but disallow jumping ahead.
            if (currentTime > maxWatchedSeconds + 0.75) {
              antiSeekPlayer.setCurrentTime(maxWatchedSeconds);
              return;
            }

            if (currentTime > maxWatchedSeconds) {
              maxWatchedSeconds = currentTime;
            }
          });
        });
      });

      antiSeekSetupDone = true;
      return true;
    };

    const setupInterval = window.setInterval(() => {
      if (trySetupAntiSeek()) {
        window.clearInterval(setupInterval);
      }
    }, 200);

    const setupTimeout = window.setTimeout(() => {
      window.clearInterval(setupInterval);
    }, 10000);

    return () => {
      obs.disconnect();
      window.clearInterval(setupInterval);
      window.clearTimeout(setupTimeout);
    };
  });
</script>

<svelte:head>
  <title>Online Vending Machine — สร้างตู้ขาย Digital Product ของคุณ</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <script
    src="https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js"
  ></script>
</svelte:head>

<!-- ═══════════════════════════════════
     HERO
═══════════════════════════════════ -->
<section class="hero">
  <div class="wrap">
    <span class="eyebrow reveal">Online Vending Machine</span>
    <h1 class="heading-xl reveal d1">
      สร้าง<span class="hero-highlight">ตู้ขาย Digital Product</span><br
      />ของเราเองภายใน 1 วัน
    </h1>
    <p class="body-lg reveal d2">
      สร้างพื้นที่ขายสินค้าออนไลน์ของตัวเองพร้อมระบบรับเงินและส่งสินค้าอัตโนมัติเมื่อลูกค้าชำระเงิน
      ฉบับไม่ต้องเก่งคอมก็ทำตามได้แน่นอน
    </p>
    <p class="sub-guarantee reveal d3">
      (ปล. สร้างเสร็จแล้ว <strong>ใช้ฟรีตลอดชีพ</strong>
      <u>ไม่ต้องเสียรายเดือน</u>เลย)
    </p>

    <div class="vsl reveal d4">
      <div style="position:relative;padding-top:56.25%;">
        <iframe
          id="hero-bunny-player"
          src="https://iframe.mediadelivery.net/embed/491305/bc6a1ec4-32e0-482a-af3a-da2f64ec02f8?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
          loading="lazy"
          style="border:0;position:absolute;top:0;height:100%;width:100%;"
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowfullscreen
          title="Online Vending Machine Intro Video"
        ></iframe>
      </div>
    </div>

    <div class="reveal" style="transition-delay:.4s;">
      <a href="#pricing" class="btn btn--lg">พร้อมลุยแล้ว!</a>
    </div>

    <div class="hero-proof reveal" style="transition-delay:.48s;">
      <div class="hero-avatars">
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-1.png"
          alt="รูปโปรไฟล์รีวิว 1"
          loading="lazy"
        />
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-2.png"
          alt="รูปโปรไฟล์รีวิว 2"
          loading="lazy"
        />
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-3.png"
          alt="รูปโปรไฟล์รีวิว 3"
          loading="lazy"
        />
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-4.png"
          alt="รูปโปรไฟล์รีวิว 4"
          loading="lazy"
        />
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-5.png"
          alt="รูปโปรไฟล์รีวิว 5"
          loading="lazy"
        />
        <img
          class="avatar-circle"
          src="/ovm/testi-profile-6.png"
          alt="รูปโปรไฟล์รีวิว 6"
          loading="lazy"
        />
      </div>
      <span class="hero-proof-text"
        >การันตีด้วยผู้เรียนที่พึงพอใจมากกว่า 100+ คน</span
      >
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ═══════════════════════════════════
     SOCIAL PROOF (FIRST)
═══════════════════════════════════ -->
<section class="alt">
  <div class="wrap--wide">
    <div class="section-header reveal">
      <h2 class="heading-lg">เสียงจากเพื่อนๆ</h2>
    </div>
    <div class="t-grid-3">
      <div class="t-card reveal d1">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          เนื้อหาที่อาจารย์กีตาร์ได้เรียบเรียงไว้นั้นดีมากๆ ใช้ภาษาที่เข้าใจ
          ง่าย ความซับซ้อนกำลังพอดี ไม่น้อยเกิน ไม่มากเกิน เวลาทำตาม แล้วเกิด
          Aha! moment เป็นระยะๆ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-10.png"
            alt="Nattapong Pasert"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Nattapong Pasert</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
      <div class="t-card reveal d2">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          ก่อนอื่นเลย อยากจะขอขอบคุณ คุณกีต้าร์ ที่ตั้งใจทำสื่อการสอน
          ดีๆแบบนี้นะครับ ผมติดตามมาตั้งแต่ ebook n8n แล้วครับ ชื่นชอบการถ่ายทอด
          เรื่องยากให้เข้าใจง่ายของคุณกีต้าร์ รอบนี้เลยตั้งใจเรียนเลย
          ผมกำลังสนใจเรื่อง vibe coding และได้ทดลองใช้ Google Antigravity ทำ
          WebApp ใช้งานเองได้แล้วครับ หลังจากงมกับ lovable มาพักใหญ่
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-8.png"
            alt="Art Tamrongsak Choeisa-ard"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Art Tamrongsak Choeisa-ard</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
      <div class="t-card reveal d3">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          ชอบที่สอนแบบทำตามได้เลย ไม่ต้องเขียนโค้ดอะไรให้วุ่นวาย
          สอนแบบเหมือนจับมือทำถ้าละเอียดกว่านี้คือทำให้แล้ววว ปวดหัว
          อย่างเดียวคือตอนเลือกแบบที่อยากได้เพราะอยากได้ไปหมด
          สอนใช้เครื่องมือครบ และเอาไปต่อยอดใช้งานจริงได้ แค่นี้ก็มี
          บ้านเป็นของตัวเองแล้ว เย้ๆ ขอบคุณที่เปิดคลาสสอนครับเปิดโลก
          และเอาไปต่อยอดได้เยอะจริงๆครับ จะใช้เว็บนี้ขายงานจริงๆครับ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-9.png"
            alt="เพจแป๊ะยิ้มเล่าเรื่อง"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">เพจแป๊ะยิ้มเล่าเรื่อง</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════
     MY STORY
═══════════════════════════════════ -->
<section>
  <div class="wrap">
    <div class="section-header reveal">
      <h2 class="heading-lg">ถึงคุณคนที่กำลังวิ่งตามความฝัน...</h2>
    </div>

    <div class="story-body">
      <p class="reveal">
        ถ้าคุณกำลังหาอะไรบางอย่างที่ใช้เวลาแค่ <strong>1 วัน</strong>ในการทำ
      </p>
      <p class="reveal">
        และสามารถเป็นพื้นฐานของการสร้างรายได้เสริม<strong
          >หลักหมื่นถึงหลักแสน</strong
        >ต่อเดือนได้...
      </p>

      <p><strong>คุณมาถูกที่แล้ว</strong> เดี๋ยวผมเล่าให้ฟัง</p>

      <p class="reveal">ผมชื่อกีตาร์ครับ เมื่อ 10 เดือนก่อน</p>
      <p class="reveal">ผมเป็นพนักงานประจำธรรมดาๆ คนนึงเหมือนเพื่อนๆ นี่แหละ</p>
      <p class="reveal">ทำตำแหน่งผู้ประสานงาน วิ่งไปหาคนนู้นคนนี้ทั้งวัน</p>
      <p class="reveal">เลิกงานมาก็<strong>เหนื่อยและท้อกับชีวิต</strong></p>
      <p class="reveal">แต่ในหัวคิดอย่างเดียวว่า…</p>

      <p>
        "ทำยังไงให้มีรายได้เพิ่ม โดย<strong>ไม่ต้องเอาเวลาของเราไปแลก</strong
        >นะ?"
      </p>

      <p class="reveal">ผมกับเพื่อนๆ ที่ทำงานลองกันมาหลายอย่าง</p>
      <p class="reveal">ทำคลิป TikTok ทำเพจ</p>
      <p class="reveal">รับงานเสริม เขียน eBook ขาย</p>
      <p class="reveal">มีคนสนใจนะ มีคนทักมาบ้าง</p>
      <p class="reveal">มีรายได้เข้ามานิดหน่อย</p>
      <p class="reveal">แต่ปัญหาคือ…</p>
      <p class="reveal">ด้วยความที่เรายังทำงานประจำ</p>
      <p class="reveal"><strong>เวลามันไม่ได้</strong> ผมต้องมาคอยตอบแชท</p>
      <p class="reveal">
        คอยอธิบายสินค้า <strong>ถ้าตอบช้าลูกค้าก็หายอีก</strong>
      </p>

      <div class="img-slot reveal">
        <img
          src="/ovm/customer-needs.png"
          alt="ภาพแสดงความต้องการของลูกค้าที่ลดลงเมื่อเวลาผ่านไป"
        />
      </div>

      <p class="reveal">จนวันนึงผมเริ่มตั้งคำถามใหม่ว่า…</p>

      <p>
        "ถ้าเราทำเหมือน<strong>ตู้ขายของอัตโนมัติ</strong
        >แต่มาอยู่บนโลกออนไลน์ได้ไหมนะ?"
      </p>

      <p class="reveal">
        เจ้าของเต่าบินไม่เคยต้องอยู่ตรงนั้นเลย แต่ก็ยังขายน้ำได้
      </p>
      <p class="reveal">เราทำแบบนั้นบนออนไลน์มั่งได้มั้ย</p>

      <div class="img-slot reveal">
        <img
          src="/ovm/online-vending-machine.png"
          alt="ภาพเปรียบเทียบตู้ขายของจริงกับตู้ขายของออนไลน์"
        />
      </div>

      <p class="reveal">
        ผมเริ่มศึกษาการสร้าง<strong>ระบบขายแบบอัตโนมัติ</strong>
      </p>
      <p class="reveal">
        ด้วยความที่ไม่ได้มาสายเทค เลยลองทำผิดๆ ถูกๆ อยู่เป็นปี
      </p>
      <p class="reveal">เสียเงินลองนู่นนี่ไปก็เป็นแสน</p>
      <p class="reveal">จนวันนี้ร้านออนไลน์เล็กๆ ของผมที่ขาย ebook หลักร้อย</p>
      <p class="reveal"><strong>สร้างรายได้แซงงานประจำแล้ว</strong></p>
      <p class="reveal">
        ผมได้ลาออกเพื่อมาใช้<strong>ชีวิตแบบที่เคยฝันไว้</strong>เลย
      </p>

      <div class="img-slot reveal">
        <img src="/ovm/sales-screenshot.png" alt="ภาพรายงานยอดขายรายเดือน" />
      </div>

      <p class="reveal">ผมรู้ คุณอาจจะมีคำถาม</p>
      <p class="reveal"><u>"ถ้าพี่ไม่มีสินค้าละ มันจะเหมาะมั้ย?"</u></p>
      <p class="reveal">ผมตอบแบบนี้ครับ การเริ่มอะไรซักอย่าง</p>
      <p class="reveal">
        มันจะ<strong>ง่ายขึ้นเยอะ</strong>เลยถ้าเราไม่มีค่าใช้จ่ายตามมากดดัน
      </p>
      <p class="reveal">และระบบตู้ขายสินค้าออนไลน์ที่เราจะสร้างกันนี้</p>
      <p class="reveal">
        <u><strong>ไม่มีค่าใช้จ่ายรายเดือนเลยซักบาท</strong></u>
      </p>
      <p class="reveal">
        มันจะซื้อเวลาให้เราได้<strong>ลองโน่นลองนี่เต็มที่</strong>เลย
      </p>
      <p class="reveal">
        และถ้าคุณมีของขายอยู่แล้ว แต่ขายทาง Platform อื่นอยู่
      </p>
      <p class="reveal">โห...<u><strong>ยิ่งเหมาะเลย</strong></u></p>
      <p class="reveal">
        เพราะนี่จะเป็นพื้นที่ของคุณจริงๆ ชอบดีไซน์แบบไหน แต่งเองได้เลย
      </p>
      <p class="reveal"><strong>บ่งบอกความเป็นเราได้เต็มที่</strong></p>
      <p class="reveal">
        และที่สำคัญที่สุด มันจะ<strong>ไม่มีใครสามารถปิดร้านคุณได้</strong>
      </p>

      <br />

      <p class="reveal">
        ถ้าคุณเป็นคนที่:<br />
        → อยากเปลี่ยน<strong>ความรู้ในหัวเป็นเงิน</strong><br />
        → อยากมี<strong>พื้นที่ขายสินค้าออนไลน์ของตัวเอง</strong><br />
        → อยากรู้ว่า<strong
          >การตื่นมาแล้วมีแจ้งเตือนเงินเข้ามันรู้สึกยังไง</strong
        ><br />
        → ไม่อยากนั่ง<strong>จ่ายค่าระบบรายเดือน</strong><br />
        → ไม่อยาก<strong>เสียเงินเสียเวลา</strong>ไปลองผิดลองถูก
      </p>
      <div class="callout reveal">
        <p><strong>Online Vending Machine คือคำตอบสำหรับคุณเลยครับ</strong></p>
      </div>

      <p class="reveal">
        ผมมั่นใจว่า<u><strong>คุณต้องรัก</strong></u>มันแน่นอน
      </p>
      <p class="reveal">แล้วเจอกันข้างในค้าบ :)</p>
      <p class="reveal">กีตาร์</p>

      <div style="text-align:center; margin-top: 56px;" class="reveal">
        <a href="#pricing" class="btn btn--lg">พร้อมลุยแล้ววว</a>
      </div>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ═══════════════════════════════════
     MORE TESTIMONIALS
═══════════════════════════════════ -->
<section class="alt">
  <div class="wrap--wide">
    <div class="section-header reveal">
      <h2 class="heading-lg">เพื่อนๆ พูดไว้แบบนี้</h2>
    </div>
    <div class="t-grid-2">
      <div class="t-card reveal d1">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          สอนเข้าใจง่ายมากค่ะ เปิดโลกเลยจริงๆ ทำตามได้ไม่ยาก 1 วันก็
          สามารถทำได้เลยจริงๆ ขอบคุณมากๆเลยค่ะ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-7.png"
            alt="ตุ๊รูเหรี่ยง ก๋ากะ"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">ตุ๊รูเหรี่ยง ก๋ากะ</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
      <div class="t-card reveal d2">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          เป็นการสอนที่เข้าใจง่าย ถึงแม้ว่าจะไม่ได้จบสายนี้
          แต่คุณกีต้าร์สอนให้เข้าใจได้โดยง่ายค่ะ และที่สำคัญ สามารถนำไปใช้
          ต่อยอดได้จริงด้วย อยากให้มีสอนเพิ่มอีกๆ ค่าา 555
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-11.png"
            alt="Supamas Wongpaisarn"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Supamas Wongpaisarn</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════
     WHAT YOU GET / PRICING
═══════════════════════════════════ -->
<section id="pricing">
  <div class="wrap">
    <div class="section-header reveal">
      <h2 class="heading-lg">สิ่งที่คุณจะได้รับ</h2>
    </div>

    <div class="offer-list">
      <!-- Main course -->
      <div class="offer-card dark reveal">
        <div>
          <span class="offer-badge">คอร์สหลัก</span>
          <h3 class="offer-title">Online Vending Machine Course</h3>
          <ul class="offer-feats">
            <li>วิดีโอแบบจับมือทำ อธิบายฉบับคนไม่ใช่สายเทค</li>
            <li>พื้นฐานของการสร้าง "ตู้ขายสินค้าออนไลน์"</li>
            <li>นำไปต่อยอดเป็นเว็บอื่นๆ ได้อีกเท่าที่จะจินตนาการได้</li>
            <li>รู้วิธีติดตั้ง AI และใช้งานมันเยี่ยงทาส (ฮ่าา)</li>
            <li>เข้าใจการเอาร้านขึ้นโลกออนไลน์แบบฟรี</li>
          </ul>
        </div>
        <div class="offer-price">
          <span class="strike">5,950 บาท</span>
          <span class="val">รวมในแพ็กเกจ</span>
        </div>
      </div>

      <!-- Bonus 1 -->
      <div class="offer-card reveal">
        <div>
          <span class="offer-badge">โบนัส #1</span>
          <h3 class="offer-title">Bonus Automation Template</h3>
          <ul class="offer-feats">
            <li>พ่วงระบบ Automation รับเงิน + ส่งสินค้า 24/7</li>
            <li>ขายสินค้าหลายตัว? ไม่มีปัญหา มี Template พร้อมติดตั้ง</li>
            <li>ใช้ฟรีตลอดชีพ ไม่ต้องติดตั้งให้ยุ่งยาก</li>
            <li>ประหยัดเวลาชีวิตและพลังงานสมองคุณแบบมหาศาล</li>
          </ul>
        </div>
        <div class="offer-price">
          <span class="strike">15,000 บาท</span>
          <span class="val">ฟรี!</span>
        </div>
      </div>

      <!-- Bonus 2 -->
      <div class="offer-card reveal">
        <div>
          <span class="offer-badge">โบนัส #2</span>
          <h3 class="offer-title">Support Group</h3>
          <ul class="offer-feats">
            <li>เพื่อให้ไม่เหงา คุณไม่ได้เดินคนเดียวแน่นอน</li>
            <li>มีกลุ่มไว้พูดคุยสอบถาม ระดมไอเดีย หาเพื่อน</li>
            <li>
              คำถาม หรือ อะไรที่อยากทำได้แล้วรีเควสเยอะ ผม Update ในคอร์สให้
            </li>
          </ul>
        </div>
        <div class="offer-price">
          <span class="strike">4,590 บาท</span>
          <span class="val">ฟรี!</span>
        </div>
      </div>

      <!-- Bonus 3 -->
      <div class="offer-card reveal">
        <div>
          <span class="offer-badge">โบนัส #3</span>
          <h3 class="offer-title">Bonus Website Template</h3>
          <ul class="offer-feats">
            <li>
              ไม่มีไอเดีย ไม่ต้องกลัวเริ่มไม่ถูกค้าบ เริ่มจาก Template ได้เลย
            </li>
            <li>
              หน้าขายของ เว็บบริษัท เว็บส่วนตัว ผมชี้แหล่งโหลด Template ฟรีเพียบ
            </li>
            <li>
              ผม Template เว็บที่ยอดขายหลักล้านมาแกะให้ดูด้วย ลอกไปใช้ได้เลย
            </li>
          </ul>
        </div>
        <div class="offer-price">
          <span class="strike">2,950 บาท</span>
          <span class="val">ฟรี!</span>
        </div>
      </div>
    </div>
    <!-- /offer-list -->

    <!-- Pricing summary -->
    <div class="price-box reveal" id="early-bird">
      <span class="price-tag">Early Bird — 87% OFF</span>
      <p class="price-original">มูลค่ารวมทั้งหมด <span>28,950 บาท</span></p>
      <div class="price-row">
        <span class="label">ราคาพิเศษสำหรับคุณ</span>
        <span class="amount">3,790</span>
        <span class="unit">บาท</span>
      </div>
      <p class="price-note">
        สำหรับ <strong>200 คนแรก</strong> เท่านั้น — พร้อมรับ Special Bonus พิเศษเพิ่ม
      </p>
      <a href="#early-bird" class="btn btn--lg">รับราคา Early Bird พร้อมโบนัส</a
      >
    </div>

    <!-- Special bonus -->
    <div class="special-bonus reveal">
      <span class="eyebrow">Special Bonus — 200 คนแรกเท่านั้น</span>
      <h3 class="heading-md">Backdoor Walkthrough</h3>
      <ul class="sb-list">
        <li>ผมจะพาคุณดูหลังบ้านว่าผมทำยังไง พ่วงอะไรมั่ง</li>
        <li>ยิงโฆษณายังไง ขายได้เท่าไหร่ และคุณควรไปทางไหน</li>
        <li>เพื่อเป็นแรงบันดาลใจ และคุณสามารถนำไปประยุกต์ใช้เองได้</li>
      </ul>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ═══════════════════════════════════
     GUARANTEE
═══════════════════════════════════ -->
<section class="alt">
  <div class="wrap">
    <div class="guarantee-inner reveal">
      <div class="guarantee-icon">🛡️</div>
      <h2 class="heading-lg">รับรองว่าคุณต้องรัก OVM</h2>
      <p>
        ถ้าคุณอ่านมาถึงตรงนี้ ผมว่าคุณสนใจจริงๆ แหละ
        แต่อาจจะไม่มั่นใจว่าจะทำได้จริงไหม
        <br /><br />
        ผมสัญญาแบบนี้ครับ
        <br /><br />
        ภายใน 14 วันถ้าคุณนั่งเรียน OVM และคุณรู้สึกว่าทำไม่ได้จริงๆ เรียนไปทั้งหมดแล้ว
        มันยากไป คุณยังไม่มีร้านของตัวเอง ผมไม่อยากได้เงินคุณเลยถ้าผมส่งมอบสิ่งที่สัญญาไว้ไม่ได้
        ฉะนั้นไม่ต้องกลัวครับ ทักเข้ามาหาผมได้เลยครับ ผมยินดีคืนเงินให้ 100% แบบไม่โกรธกันเลย
        :)
      </p>
    </div>
  </div>
</section>

<div class="rule"></div>

<!-- ═══════════════════════════════════
     FINAL TESTIMONIALS
═══════════════════════════════════ -->
<section class="alt">
  <div class="wrap--wide">
    <div class="section-header reveal">
      <h2 class="heading-lg">รีวิวจากเพื่อนๆ</h2>
    </div>
    <div class="t-grid-3">
      <div class="t-card reveal d1">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          ผมชอบคอร์สนีมากเลยครับ เพราะว่าพี่กีต้าร์ สอนแบบจับมือทำมาก ๆ
          มากขนาดที่แบบว่าคนไม่มีความรู้แบบ ผมก็เริ่มทำเองได้
          อยากให้มีคอร์สแบบนี้เรื่อยๆ เลยครับ ไว้มีงาน
          ประจำแล้วจะมาอุดหนุนหนังสือและงานอื่นๆ อีกนะครับ ปล. ตอน แรก ๆ
          ไม่เชื่อว่าจะเป็นคอร์สที่สอนจริงจังและให้ความรู้ได้ขนาดนี้ ขอบคุณมาก ๆ
          อีกครั้งนะครับ เว็บเราเอาไปเป็นเคสได้เลยค้าบ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-6.png"
            alt="Voraphon Aroonsamran"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Voraphon Aroonsamran</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
      <div class="t-card reveal d2">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          สอนละเอียดดีครับชอบมากครับ ปล.ถ้ามีเปิดอีก ขอเป็นนักเรียนอีกนะครับ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-12.png"
            alt="Kitti Seangjai"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Kitti Seangjai</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
      <div class="t-card reveal d3">
        <div class="t-stars">★★★★★</div>
        <p class="t-text">
          สอนง่าย ๆ ทำตามได้จริง มีหน้าจอประกอบ เห็นขั้น ตอนต่างๆ วนดูซ้ำได้
          ดีที่สอนเป็น คลิป ฟังวนไปมา ดูซ้ำ ทำตาม จนได้ครับ
        </p>
        <div class="t-author">
          <img
            class="t-author-avatar"
            src="/ovm/testi-profile-13.png"
            alt="Chanon Varun"
            loading="lazy"
          />
          <div class="t-author-meta">
            <p class="t-author-name">Chanon Varun</p>
            <p class="t-author-role">ผู้เรียน OVM</p>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align:center; margin-top: 56px;" class="reveal">
      <a href="#early-bird" class="btn btn--lg">พร้อมลุยแล้ว</a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════
     FAQ
═══════════════════════════════════ -->
<section>
  <div class="wrap">
    <div class="section-header faq-header reveal">
      <span class="eyebrow">FAQ</span>
      <h2 class="heading-lg">คำถามที่พบบ่อย</h2>
    </div>

    <div class="faq-list reveal">
      <div class="faq-item">
        <button class="faq-q">
          ไม่มีพื้นฐานจะทำได้จริงไหม
          <span class="faq-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">
            ได้แน่นอนครับ คอร์สนี้ออกแบบมาสำหรับคนที่ไม่มีพื้นฐานเทคนิคโดยเฉพาะ
            สอนแบบจับมือทำทุกขั้นตอน ทำตามได้เลยทันที
            ไม่ต้องมีความรู้ด้านเทคนิคใดๆ มาก่อนเลย
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q">
          ไม่เก่งโค้ดเลย ทำได้หรือเปล่า
          <span class="faq-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">
            ไม่ต้องเขียนโค้ดเลยครับ! คอร์สนี้ใช้ AI ช่วยทำงานแทน
            เน้นให้คุณสร้างระบบขายได้จริงโดยไม่ต้องงมเรื่องโปรแกรมมิ่งเลยแม้แต่บรรทัดเดียว
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q">
          ต้องมีคอมพิวเตอร์ไหม
          <span class="faq-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">
            แนะนำให้ใช้คอมพิวเตอร์หรือแล็ปท็อปครับ
            เพราะการสร้างเว็บไซต์และตั้งค่าระบบต่างๆ จะทำได้สะดวกกว่ามาก
            สเปคปกติทั่วไปก็เพียงพอแล้ว ไม่ต้องซื้อใหม่เลย
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q">
          ใช้ฟรีแบบถูกกฎหมายไหม
          <span class="faq-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">
            ถูกกฎหมาย 100% ครับ ทุกเครื่องมือที่ใช้ในคอร์สเป็น Freemium หรือ
            Open Source ที่ให้ใช้ฟรีอย่างถูกต้อง
            ไม่มีการแคร็กหรือละเมิดลิขสิทธิ์ใดๆ ทั้งสิ้น
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button class="faq-q">
          ออกแบบไม่เก่งจะเหมาะไหม
          <span class="faq-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
                stroke-width="2"
                stroke-linecap="round"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>
        <div class="faq-a">
          <div class="faq-a-inner">
            เหมาะมากครับ คอร์สมี Website Template สำเร็จรูปให้เลือกใช้ได้เลย
            ไม่ต้องออกแบบเอง แค่เลือก Template ที่ชอบแล้วใส่เนื้อหาของคุณลงไป
            เว็บก็ออกมาดูดีแบบมืออาชีพทันที
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════
     FINAL CTA
═══════════════════════════════════ -->
<section class="final-cta">
  <div class="wrap">
    <h2 class="heading-lg reveal d1">พร้อมสร้าง OVM<br />ของคุณหรือยังครับ?</h2>
    <p class="body-lg reveal d2">
      ขอเวลา 1 แค่วัน ผมจะช่วยคุณเปิดร้านพร้อมขายเลย
    </p>
    <div class="reveal d3">
      <a href="#early-bird" class="btn btn--lg">พร้อมลุยแล้ว</a>
    </div>
  </div>
</section>

<section class="member-login">
  <div class="wrap">
    <p class="member-login-text">
      เป็นสมาชิกอยู่แล้ว?
      <a
        href="/login"
        data-sveltekit-preload-data="tap"
        class="member-login-link">เข้าสู่ระบบที่นี่</a
      >
    </p>
  </div>
</section>

<!-- ═══════════════════════════════════
     FOOTER
═══════════════════════════════════ -->
<footer>
  <p>© 2024 Online Vending Machine by Guitar DSP. All rights reserved.</p>
</footer>

<style>
  /* ─── RESET ─── */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ─── TOKENS ─── */
  :root {
    --white: #fefefe;
    --off-white: #f6f4f0; /* warm off-white to complement amber */
    --black: #16150f; /* warm near-black */
    --gray-dark: #38372f;
    --gray-mid: #6b6a62;
    --gray-light: #aba99f;
    --gray-border: #e0ded7; /* warm border */
    --accent: #c97e14;
    --accent-hover: #a86610;
    --accent-bg: #fdf3e3;
    --font: "IBM Plex Sans Thai", sans-serif;
  }

  /* ─── BASE ─── */
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: var(--font);
    background-color: var(--white);
    background-image: linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.035) 1px, transparent 1px);
    background-size: 52px 52px;
    background-position: top left;
    color: var(--black);
    font-size: 18px;
    line-height: 1.9;
    -webkit-font-smoothing: antialiased;
  }

  img {
    display: block;
    max-width: 100%;
  }

  /* ─── LAYOUT ─── */
  .wrap {
    max-width: 820px;
    margin: 0 auto;
    padding: 0 28px;
  }
  .wrap--wide {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 28px;
  }

  section {
    padding: 112px 0;
  }
  section.alt {
    background: var(--off-white);
  }

  .rule {
    height: 1px;
    background: var(--gray-border);
    max-width: 820px;
    margin: 0 auto;
  }

  /* ─── SCROLL REVEAL ─── */
  .reveal {
    opacity: 0;
    transform: translateY(20px) scale(0.995);
    transition:
      opacity 0.7s cubic-bezier(0.22, 0.68, 0, 1.1),
      transform 0.7s cubic-bezier(0.22, 0.68, 0, 1.1);
  }
  :global(.reveal.in) {
    opacity: 1;
    transform: none;
  }
  .d1 {
    transition-delay: 0.08s;
  }
  .d2 {
    transition-delay: 0.16s;
  }
  .d3 {
    transition-delay: 0.24s;
  }
  .d4 {
    transition-delay: 0.32s;
  }

  /* ─── TYPOGRAPHY ─── */
  /* Note: Thai script does not benefit from negative letter-spacing.
       Headings use default or very slight tracking only. */
  .eyebrow {
    display: block;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }

  .heading-xl {
    font-size: clamp(32px, 5vw, 58px);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0.005em; /* Thai: keep near-zero */
  }

  .heading-lg {
    font-size: clamp(26px, 3.6vw, 42px);
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: 0.005em;
  }

  .heading-md {
    font-size: clamp(20px, 2.2vw, 26px);
    font-weight: 700;
    line-height: 1.4;
  }

  .body-lg {
    font-size: clamp(17px, 1.6vw, 19px);
    color: var(--gray-mid);
    line-height: 2;
  }

  /* ─── BUTTON ─── */
  .btn {
    display: inline-block;
    font-family: var(--font);
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: 100px;
    padding: 16px 44px;
    text-decoration: none;
    cursor: pointer;
    transition:
      background 0.22s,
      transform 0.18s,
      box-shadow 0.22s;
    box-shadow:
      0 2px 20px rgba(201, 126, 20, 0.3),
      0 1px 0 rgba(255, 255, 255, 0.1) inset;
    letter-spacing: 0.02em;
  }
  .btn:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(201, 126, 20, 0.4);
  }
  .btn:active {
    transform: none;
  }
  .btn--lg {
    font-size: 17px;
    padding: 15px 52px;
  }

  /* ─── ══════════════════════════════════
         HERO
    ══════════════════════════════════ ─── */
  .hero {
    padding: 56px 0 40px;
    text-align: center;
    background: radial-gradient(
      ellipse 900px 500px at 50% -60px,
      rgba(201, 126, 20, 0.06) 0%,
      transparent 100%
    );
  }

  /* Hero-specific type overrides — smaller to fit above the fold */
  .hero .eyebrow {
    margin-bottom: 10px;
  }
  .hero .heading-xl {
    max-width: 720px;
    margin: 0 auto 16px;
    font-size: clamp(24px, 3.6vw, 44px);
  }
  .hero .body-lg {
    max-width: 600px;
    margin: 0 auto 10px;
    font-size: clamp(15px, 1.5vw, 17px);
    line-height: 1.75;
  }
  .hero-highlight {
    position: relative;
    display: inline-block;
    padding: 0 0.1em;
    isolation: isolate;
  }

  .hero-highlight::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    transform-origin: left center;
    z-index: -1;
    pointer-events: none;
    opacity: 0;
  }

  /* main highlighter stroke */
  .hero-highlight::after {
    bottom: 0.1em;
    height: 0.44em;
    background: linear-gradient(
        180deg,
        rgba(201, 126, 20, 0.25) 0%,
        rgba(201, 126, 20, 0.38) 40%,
        rgba(201, 126, 20, 0.3) 100%
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.08) 0 10px,
        rgba(0, 0, 0, 0.02) 10px 18px
      );
    border-radius: 0.42em 0.14em 0.34em 0.18em;
    transform: scaleX(0) rotate(-0.35deg);
    opacity: 0;
    animation: hero-highlight-sweep 3.4s cubic-bezier(0.22, 0.7, 0.24, 1)
      infinite;
    will-change: transform, opacity;
  }

  @keyframes hero-highlight-sweep {
    0%,
    14% {
      transform: scaleX(0) rotate(-0.35deg) translateY(0);
      opacity: 1;
    }
    68% {
      transform: scaleX(1) rotate(0deg) translateY(0);
      opacity: 1;
    }
    71.9% {
      transform: scaleX(1) rotate(0deg) translateY(0);
      opacity: 1;
    }
    72% {
      transform: scaleX(1) rotate(0deg) translateY(0);
      opacity: 0;
    }
    100% {
      transform: scaleX(0) rotate(0deg) translateY(0);
      opacity: 0;
    }
  }

  .sub-guarantee {
    font-size: 13.5px;
    color: var(--gray-mid);
    margin-bottom: 20px;
  }
  .sub-guarantee strong {
    color: var(--black);
    font-weight: 600;
  }
  .sub-guarantee u {
    text-underline-offset: 3px;
  }

  /* Hero social proof */
  .hero-proof {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    margin-bottom: 20px;
  }

  .hero-avatars {
    display: flex;
  }

  .avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--white);
    margin-left: -9px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  .avatar-circle:first-child {
    margin-left: 0;
  }

  .hero-proof-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-dark);
    letter-spacing: 0.01em;
  }

  /* VSL — narrower so 16:9 height stays short */
  .vsl {
    position: relative;
    max-width: 480px;
    margin: 0 auto 14px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--gray-border);
    background: var(--off-white);
    aspect-ratio: 16/9;
    cursor: pointer;
    transition:
      border-color 0.25s,
      box-shadow 0.25s;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.06);
  }

  @media (min-width: 781px) {
    .vsl {
      max-width: 691px;
    }
  }
  .vsl:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 32px rgba(201, 126, 20, 0.12);
  }

  /* ─── ══════════════════════════════════
         TESTIMONIAL CARDS
    ══════════════════════════════════ ─── */
  .t-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .t-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .t-card {
    background: var(--white);
    border-radius: 18px;
    padding: 28px 28px 32px;
    /* Shadow-based, no border — reads more premium */
    box-shadow:
      0 1px 0 var(--gray-border),
      0 4px 20px rgba(0, 0, 0, 0.05);
    transition:
      box-shadow 0.28s,
      transform 0.28s;
  }
  .t-card:hover {
    box-shadow:
      0 1px 0 var(--gray-border),
      0 10px 40px rgba(0, 0, 0, 0.09);
    transform: translateY(-3px);
  }

  .t-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 12px;
  }
  .t-stars {
    color: var(--accent);
    font-size: 13px;
    letter-spacing: 0.05em;
  }

  .t-text {
    font-size: 15px;
    color: var(--gray-dark);
    line-height: 1.95;
    margin-bottom: 18px;
  }

  .t-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .t-author-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px dashed var(--gray-border);
    color: var(--gray-light);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--off-white);
    text-transform: uppercase;
  }

  .t-author-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--black);
    line-height: 1.3;
  }

  .t-author-role {
    font-size: 11px;
    color: var(--gray-mid);
    line-height: 1.3;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;
  }
  .section-header .heading-lg {
    margin-bottom: 0;
  }

  /* ─── ══════════════════════════════════
         STORY
    ══════════════════════════════════ ─── */
  .story-body {
    max-width: 660px;
    margin: 0 auto;
  }

  .story-body p {
    font-size: 18px;
    line-height: 2.05;
    color: var(--gray-dark);
    margin-bottom: 16px;
  }

  .story-body strong {
    color: var(--black);
    font-weight: 600;
  }

  /* Callout: clean filled style, no left-border gimmick */
  .callout {
    background: var(--accent-bg);
    border-radius: 14px;
    border: 1px solid rgba(201, 126, 20, 0.18);
    padding: 24px 32px;
    margin: 40px 0;
  }

  .callout p {
    font-size: 18px !important;
    font-weight: 600;
    color: var(--black) !important;
    margin: 0 !important;
    line-height: 1.8 !important;
  }

  /* Image placeholder */
  .img-slot {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--off-white);
    border: 1.5px dashed var(--gray-border);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 40px 0;
    color: var(--gray-light);
  }
  .img-slot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    border-radius: 16px;
  }

  /* ─── ══════════════════════════════════
         WHAT YOU GET
    ══════════════════════════════════ ─── */
  .offer-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 64px;
  }

  .offer-card {
    border: 1px solid var(--gray-border);
    border-radius: 20px;
    padding: 36px 40px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 32px;
    align-items: start;
    background: var(--white);
    transition:
      border-color 0.25s,
      box-shadow 0.25s,
      transform 0.25s;
  }
  .offer-card:hover {
    border-color: rgba(201, 126, 20, 0.4);
    box-shadow: 0 6px 32px rgba(201, 126, 20, 0.07);
    transform: translateY(-1px);
  }
  .offer-card.dark {
    background: var(--black);
    border-color: var(--black);
  }
  .offer-card.dark:hover {
    border-color: #333;
    box-shadow: 0 6px 32px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
  }

  .offer-badge {
    display: inline-block;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-bg);
    padding: 4px 12px;
    border-radius: 50px;
    margin-bottom: 14px;
    border: 1px solid rgba(201, 126, 20, 0.2);
  }
  .offer-card.dark .offer-badge {
    background: rgba(201, 126, 20, 0.15);
    border-color: rgba(201, 126, 20, 0.25);
  }

  .offer-title {
    font-size: 19px;
    font-weight: 700;
    color: var(--black);
    margin-bottom: 18px;
    line-height: 1.4;
  }
  .offer-card.dark .offer-title {
    color: #fff;
  }

  .offer-feats {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .offer-feats li {
    font-size: 15px;
    color: var(--gray-dark);
    padding-left: 22px;
    position: relative;
    line-height: 1.7;
  }
  .offer-feats li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: 700;
  }
  .offer-card.dark .offer-feats li {
    color: #a09e96;
  }
  .offer-card.dark .offer-feats li::before {
    color: var(--accent);
  }

  .offer-price {
    text-align: right;
    flex-shrink: 0;
  }
  .offer-price .strike {
    font-size: 12.5px;
    color: var(--gray-light);
    text-decoration: line-through;
    display: block;
    margin-bottom: 4px;
  }
  .offer-price .val {
    font-size: 17px;
    font-weight: 700;
    color: var(--black);
  }
  .offer-card.dark .offer-price .val {
    color: var(--accent);
  }

  /* Pricing box — dark & commanding */
  .price-box {
    background: var(--black);
    border-radius: 28px;
    padding: 64px 56px;
    text-align: center;
  }

  .price-tag {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 50px;
    margin-bottom: 24px;
  }

  .price-original {
    font-size: 15px;
    color: var(--gray-light);
    margin-bottom: 6px;
  }
  .price-original span {
    text-decoration: line-through;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .price-row .label {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
  }
  .price-row .amount {
    font-size: 72px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .price-row .unit {
    font-size: 18px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
  }

  .price-note {
    font-size: 14.5px;
    color: var(--gray-light);
    margin-bottom: 36px;
    line-height: 1.85;
  }
  .price-note strong {
    color: #fff;
  }

  /* Special bonus dark block */
  .special-bonus {
    background: #1e1c15;
    border: 1px solid #2e2c22;
    border-radius: 20px;
    padding: 40px 44px;
    margin-top: 40px;
    text-align: left;
  }
  .special-bonus .eyebrow {
    color: var(--accent);
  }
  .special-bonus .heading-md {
    color: #fff;
    margin-bottom: 20px;
    margin-top: 8px;
  }
  .sb-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sb-list li {
    font-size: 15px;
    color: #a09e96;
    padding-left: 22px;
    position: relative;
    line-height: 1.75;
  }
  .sb-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }

  /* ─── ══════════════════════════════════
         GUARANTEE
    ══════════════════════════════════ ─── */
  .guarantee-inner {
    max-width: 580px;
    margin: 0 auto;
    text-align: center;
  }

  .guarantee-icon {
    width: 72px;
    height: 72px;
    background: var(--white);
    border: 1px solid var(--gray-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    font-size: 32px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .guarantee-inner .heading-lg {
    margin-bottom: 20px;
  }
  .guarantee-inner p {
    font-size: 16.5px;
    color: var(--gray-dark);
    line-height: 2.05;
  }

  /* ─── ══════════════════════════════════
         FAQ
    ══════════════════════════════════ ─── */
  .faq-list {
    max-width: 660px;
    margin: 0 auto;
  }

  .faq-item {
    border-bottom: 1px solid var(--gray-border);
  }
  .faq-item:first-child {
    border-top: 1px solid var(--gray-border);
  }

  .faq-q {
    width: 100%;
    background: none;
    border: none;
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    font-family: var(--font);
    font-size: 16.5px;
    font-weight: 600;
    color: var(--black);
    text-align: left;
    cursor: pointer;
    transition: color 0.2s;
  }
  .faq-q:hover {
    color: var(--accent);
  }

  .faq-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    background: var(--off-white);
    border: 1px solid var(--gray-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.22s,
      border-color 0.22s,
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .faq-icon svg {
    width: 13px;
    height: 13px;
    stroke: var(--gray-mid);
    transition: stroke 0.22s;
  }
  :global(.faq-item.open .faq-icon) {
    background: var(--accent);
    border-color: var(--accent);
    transform: rotate(45deg);
  }
  :global(.faq-item.open .faq-icon svg) {
    stroke: #fff;
  }

  .faq-a {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease;
  }
  :global(.faq-item.open .faq-a) {
    max-height: 320px;
  }
  .faq-a-inner {
    padding-bottom: 24px;
    font-size: 15.5px;
    color: var(--gray-mid);
    line-height: 2;
  }

  /* ─── ══════════════════════════════════
         FINAL CTA + FOOTER
    ══════════════════════════════════ ─── */
  .final-cta {
    text-align: center;
    padding: 80px 0 140px;
  }
  .final-cta .heading-lg {
    margin-bottom: 14px;
  }
  .final-cta .body-lg {
    max-width: 460px;
    margin: 0 auto 44px;
  }

  .member-login {
    padding: 16px 0 28px;
    text-align: center;
  }

  .member-login-text {
    font-size: 13.5px;
    color: var(--gray-light);
  }

  .member-login-link {
    color: var(--gray-mid);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;
  }

  .member-login-link:hover {
    color: var(--gray-dark);
  }

  footer {
    padding: 36px 24px;
    border-top: 1px solid var(--gray-border);
    text-align: center;
  }
  footer p {
    font-size: 13px;
    color: var(--gray-light);
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 780px) {
    section {
      padding: 72px 0;
    }
    .hero {
      padding: 100px 0 72px;
    }
    .hero .heading-xl {
      font-size: 28.8px;
    }
    .t-grid-3,
    .t-grid-2 {
      grid-template-columns: 1fr;
    }
    .offer-card {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 28px 24px;
    }
    .offer-price {
      text-align: left;
    }
    .price-box {
      padding: 44px 28px;
    }
    .price-row .amount {
      font-size: 56px;
    }
    .special-bonus {
      padding: 28px 24px;
    }
  }

  @media (min-width: 781px) {
    .hero .heading-xl {
      font-size: clamp(28.8px, 4.32vw, 52.8px);
    }
  }
</style>
