/* ===========================
   HAWK HOLDINGS — script.js
   =========================== */

'use strict';

// ===== ヘッダー: スクロールで背景変化 + ロゴ切替 =====
const header = document.getElementById('header');
const headerLogoSwap = header ? header.querySelector('.header__logo--swap') : null;
const logoHero = document.getElementById('logoHero');

const headerHamburgerSwap = header ? header.querySelector('.header__hamburger--swap') : null;

const handleHeaderScroll = () => {
  if (!header || !logoHero || !headerLogoSwap || !headerHamburgerSwap) return;
  // デカロゴが画面外に出たらヘッダーロゴ＋ハンバーガーを表示
  const logoBottom = logoHero.getBoundingClientRect().bottom;
  const scrolled = logoBottom <= 0;
  header.classList.toggle('is-scrolled', scrolled);
  headerLogoSwap.classList.toggle('is-visible', scrolled);
  headerHamburgerSwap.classList.toggle('is-visible', scrolled);
};
if (header && logoHero && headerLogoSwap && headerHamburgerSwap) {
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();
}


// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('navOverlay');

const openNav = () => {
  nav.classList.add('is-open');
  navOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeNav = () => {
  nav.classList.remove('is-open');
  navOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
};

hamburger.addEventListener('click', openNav);

navOverlay.addEventListener('click', closeNav);
document.getElementById('navClose').addEventListener('click', closeNav);

// ナビリンクをクリックでメニューを閉じる
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});


// ===== スムーススクロール =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// ===== スクロールフェードイン =====
const fadeinEls = document.querySelectorAll('.js-fadein');

const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // 同じ親の中での子番号で遅延
      const siblings = [...entry.target.parentElement.querySelectorAll('.js-fadein')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.1}s`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeinEls.forEach(el => observer.observe(el));


// ===== 数字カウントアップ =====
const countEls = document.querySelectorAll('.numbers__count');

const countUp = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();

  // Cancel any previous animation
  if (el._countUpId) cancelAnimationFrame(el._countUpId);

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      el._countUpId = requestAnimationFrame(update);
    } else {
      el.textContent = target;
      el._countUpId = null;
    }
  };
  el._countUpId = requestAnimationFrame(update);
};

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
    } else {
      // Reset to 0 when out of view so it counts up again next time
      if (entry.target._countUpId) {
        cancelAnimationFrame(entry.target._countUpId);
        entry.target._countUpId = null;
      }
      entry.target.textContent = '0';
    }
  });
}, { threshold: 0.5 });

countEls.forEach(el => numberObserver.observe(el));


// ===== サービスカード: スクロールで自動ホバー =====
const serviceCards = document.querySelectorAll('.service__card');
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (serviceCards.length) {
  if (isMobile) {
    // スマホ: 画面中心に最も近い1枚だけホバー
    const updateClosest = () => {
      const centerY = window.innerHeight / 2;
      let closest = null;
      let minDist = Infinity;

      serviceCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - centerY);
        if (dist < minDist) {
          minDist = dist;
          closest = card;
        }
      });

      serviceCards.forEach(card => {
        card.classList.toggle('is-hovered', card === closest);
      });
    };

    window.addEventListener('scroll', updateClosest, { passive: true });
    updateClosest();
  } else {
    // PC: 表示されたら順番にホバー（維持）
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.service__card')];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('is-hovered');
          }, idx * 150);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    serviceCards.forEach(el => cardObserver.observe(el));
  }
}


// ===== コンタクトフォーム (デモ送信) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '送信中...';
    btn.disabled = true;

    // デモ用: 1.5秒後に完了メッセージ
    setTimeout(() => {
      contactForm.innerHTML = `
        <div style="text-align:center; padding: 48px 0;">
          <div style="font-size:3rem; margin-bottom:16px;">✅</div>
          <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:12px; color:#1A1A1A;">
            お問い合わせを受け付けました
          </h3>
          <p style="color:#555; line-height:1.8;">
            内容を確認の上、担当者よりご連絡いたします。<br />
            しばらくお待ちください。
          </p>
        </div>
      `;
    }, 1500);
  });
}


// ===== ヘッダー: アクティブナビ =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__nav-list a');

const activateNav = () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${section.id}`) {
          link.style.color = 'var(--red)';
        }
      });
    }
  });
};
window.addEventListener('scroll', activateNav, { passive: true });


// ===== リアルタイム時計（value.html 問いかけセクション） =====
const clockYear  = document.getElementById('clockYear');
const clockMonth = document.getElementById('clockMonth');
const clockDay   = document.getElementById('clockDay');
const clockHour  = document.getElementById('clockHour');
const clockMin   = document.getElementById('clockMin');
const clockSec   = document.getElementById('clockSec');

if (clockYear) {
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const now = new Date();
    clockYear.textContent  = now.getFullYear();
    clockMonth.textContent = pad(now.getMonth() + 1);
    clockDay.textContent   = pad(now.getDate());
    clockHour.textContent  = pad(now.getHours());
    clockMin.textContent   = pad(now.getMinutes());
    clockSec.textContent   = pad(now.getSeconds());
  };
  tick();
  setInterval(tick, 1000);
}
