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
const serviceCards = document.querySelectorAll('.service__set');
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
          const siblings = [...entry.target.parentElement.querySelectorAll('.service__set')];
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


// ===== 中長期目標: 年号タブ切替（スマホ） =====
const goalsRow = document.querySelector('.c-goals__row');
if (goalsRow) {
  const gCards = [...goalsRow.querySelectorAll('.c-goals__card')];
  const mqG = window.matchMedia('(max-width: 768px)');
  if (gCards.length) {
    const tabs = document.createElement('div');
    tabs.className = 'c-goals__tabs';
    const gBtns = gCards.map((card, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'c-goals__tab';
      const y = card.querySelector('.c-goals__year');
      b.textContent = y ? y.textContent.trim() : String(i + 1);
      b.addEventListener('click', () => { gActive = i; gRender(); });
      return b;
    });
    tabs.append(...gBtns);
    goalsRow.before(tabs);

    let gActive = 0;

    // 各年パネルの高さを最も高いもの（=2030）に揃える
    const lockGoals = () => {
      gCards.forEach(c => { c.style.minHeight = ''; });
      if (!mqG.matches) return;
      let max = 0;
      gCards.forEach(c => {
        const hidden = c.classList.contains('is-goal-hidden');
        if (hidden) c.classList.remove('is-goal-hidden');
        if (c.offsetHeight > max) max = c.offsetHeight;
        if (hidden) c.classList.add('is-goal-hidden');
      });
      gCards.forEach(c => { c.style.minHeight = max + 'px'; });
    };

    const gRender = () => {
      if (mqG.matches) {
        tabs.style.display = 'flex';
        gCards.forEach((card, i) => {
          const on = i === gActive;
          card.classList.toggle('is-goal-hidden', !on);
          gBtns[i].classList.toggle('is-active', on);
          if (on) { card.classList.remove('is-goal-anim'); void card.offsetWidth; card.classList.add('is-goal-anim'); }
        });
      } else {
        tabs.style.display = 'none';
        gCards.forEach(card => { card.classList.remove('is-goal-hidden'); card.style.minHeight = ''; });
      }
    };
    mqG.addEventListener('change', () => { lockGoals(); gRender(); });
    lockGoals();
    gRender();
  }
}


// ===== New Next Venture: スマホでページ送り（3枚ずつ） =====
const nvGrid = document.querySelector('.g-next__grid');
if (nvGrid) {
  const nvCards = [...nvGrid.querySelectorAll('.g-next__card')];
  const PAGE_SIZE = 3;
  const pageCount = Math.ceil(nvCards.length / PAGE_SIZE);
  const mq = window.matchMedia('(max-width: 768px)');

  // 番号を固定化（06始まり）。CSSカウンタは display:none でズ레るため data-num を使う
  nvCards.forEach((card, i) => { card.dataset.num = String(6 + i).padStart(2, '0'); });

  if (nvCards.length > PAGE_SIZE) {
    // ナビ（戻る矢印 ＋ ドット ＋ 進む矢印）— スワイプ可能の合図
    const dots = document.createElement('div');
    dots.className = 'g-next__dots';

    const arrowPrev = document.createElement('button');
    arrowPrev.type = 'button';
    arrowPrev.className = 'g-next__arrow g-next__arrow--prev';
    arrowPrev.setAttribute('aria-label', '前へ（右スワイプ）');
    arrowPrev.innerHTML = '<span></span>';
    arrowPrev.addEventListener('click', () => goTo(page - 1, 'prev'));

    const dotsInner = document.createElement('div');
    dotsInner.className = 'g-next__dots-inner';
    const dotEls = [];
    for (let i = 0; i < pageCount; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'g-next__dot';
      d.setAttribute('aria-label', `${i + 1}ページ目へ`);
      d.addEventListener('click', () => goTo(i));
      dotsInner.appendChild(d);
      dotEls.push(d);
    }

    const arrowNext = document.createElement('button');
    arrowNext.type = 'button';
    arrowNext.className = 'g-next__arrow g-next__arrow--next';
    arrowNext.setAttribute('aria-label', '次へ（左スワイプ）');
    arrowNext.innerHTML = '<span></span>';
    arrowNext.addEventListener('click', () => goTo(page + 1, 'next'));

    dots.append(arrowPrev, dotsInner, arrowNext);
    nvGrid.before(dots);

    let page = 0;

    const render = (dir) => {
      if (mq.matches) {
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        nvCards.forEach((card, i) => {
          const show = i >= start && i < end;
          card.style.display = show ? '' : 'none';
          if (show) card.classList.add('is-visible'); // フェードイン待ちで透明のままにならないよう
        });
        dots.style.display = 'flex';
        dotEls.forEach((d, i) => d.classList.toggle('is-active', i === page));
        arrowPrev.disabled = page === 0;
        arrowNext.disabled = page === pageCount - 1;
        if (dir) {
          nvGrid.classList.remove('is-slide-l', 'is-slide-r');
          void nvGrid.offsetWidth; // reflowで再生し直す
          nvGrid.classList.add(dir === 'next' ? 'is-slide-l' : 'is-slide-r');
        }
      } else {
        nvCards.forEach(card => { card.style.display = ''; });
        dots.style.display = 'none';
        nvGrid.style.minHeight = '';
      }
    };

    const goTo = (p, dir) => {
      p = Math.max(0, Math.min(pageCount - 1, p));
      if (p === page) return;
      dir = dir || (p > page ? 'next' : 'prev');
      page = p;
      render(dir);
    };

    // フリック（スワイプ）で左右にページ切替
    let sx = 0, sy = 0, tracking = false;
    nvGrid.addEventListener('touchstart', (e) => {
      if (!mq.matches) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });
    nvGrid.addEventListener('touchend', (e) => {
      if (!tracking || !mq.matches) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) goTo(page + 1, 'next');
        else goTo(page - 1, 'prev');
      }
    }, { passive: true });

    mq.addEventListener('change', () => { page = 0; render(); });
    render();
  }
}


// ===== Transformation / Your Future: スマホでタブ切替 =====
(function () {
  const mq = window.matchMedia('(max-width: 768px)');
  const animate = (el) => {
    el.classList.remove('is-tab-anim');
    void el.offsetWidth; // reflowで再生し直す
    el.classList.add('is-tab-anim');
  };

  // --- Transformation: BEFORE / AFTER ---
  const tfGrid = document.querySelector('.v-transform__grid');
  if (tfGrid) {
    const before = tfGrid.querySelector('.v-transform__col--before');
    const after = tfGrid.querySelector('.v-transform__col--after');
    if (before && after) {
      const tabs = document.createElement('div');
      tabs.className = 'v-tabs v-transform__tabs';
      const bBtn = document.createElement('button');
      bBtn.type = 'button'; bBtn.className = 'v-tab'; bBtn.textContent = 'BEFORE';
      const aBtn = document.createElement('button');
      aBtn.type = 'button'; aBtn.className = 'v-tab'; aBtn.textContent = 'AFTER';
      tabs.append(bBtn, aBtn);
      tfGrid.before(tabs);

      let active = 'before';
      const render = () => {
        if (mq.matches) {
          tabs.style.display = 'flex';
          const showAfter = active === 'after';
          bBtn.classList.toggle('is-active', !showAfter);
          aBtn.classList.toggle('is-active', showAfter);
          before.classList.toggle('is-tab-hidden', showAfter);
          after.classList.toggle('is-tab-hidden', !showAfter);
          animate(showAfter ? after : before);
        } else {
          tabs.style.display = 'none';
          before.classList.remove('is-tab-hidden');
          after.classList.remove('is-tab-hidden');
        }
      };
      bBtn.addEventListener('click', () => { active = 'before'; render(); });
      aBtn.addEventListener('click', () => { active = 'after'; render(); });
      mq.addEventListener('change', render);
      render();
    }
  }

  // --- Your Future: ROUTE 01 / 02 / 03 ---
  const fuGrid = document.querySelector('.v-future__grid');
  if (fuGrid) {
    const cards = [...fuGrid.querySelectorAll('.v-future__card')];
    if (cards.length) {
      const tabs = document.createElement('div');
      tabs.className = 'v-tabs v-future__tabs';
      const btns = cards.map((card, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'v-tab';
        const numEl = card.querySelector('.v-future__card-num');
        b.textContent = numEl ? numEl.textContent.trim() : 'ROUTE 0' + (i + 1);
        b.addEventListener('click', () => { active = i; render(); });
        return b;
      });
      tabs.append(...btns);
      fuGrid.before(tabs);

      let active = 0;
      const render = () => {
        if (mq.matches) {
          tabs.style.display = 'flex';
          cards.forEach((card, i) => {
            const on = i === active;
            card.classList.toggle('is-tab-hidden', !on);
            btns[i].classList.toggle('is-active', on);
            if (on) {
              card.classList.add('is-visible');
              animate(card);
            }
          });
        } else {
          tabs.style.display = 'none';
          cards.forEach(card => card.classList.remove('is-tab-hidden'));
        }
      };
      mq.addEventListener('change', render);
      render();
    }
  }
})();
