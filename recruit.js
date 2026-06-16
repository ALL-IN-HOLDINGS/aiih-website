/* ===========================
   HAWK HOLDINGS — recruit.js
   採用ページ専用スクリプト
   =========================== */

'use strict';

// ===== エントリーフォーム送信 =====
const entryForm = document.getElementById('entryForm');
if (entryForm) {
  entryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = entryForm.querySelector('button[type="submit"]');
    btn.textContent = '送信中...';
    btn.disabled = true;

    setTimeout(() => {
      entryForm.innerHTML = `
        <div style="text-align:center; padding: 56px 0;">
          <h3 style="font-size:1.4rem; font-weight:700; margin-bottom:16px; color:#1A1A1A;">
            エントリーありがとうございます
          </h3>
          <p style="color:#555; line-height:1.9; margin-bottom:24px;">
            書類を確認の上、5営業日以内にご連絡いたします。<br />
            ALL IN HOLDINGSで一緒に挑戦できることを楽しみにしています。
          </p>
          <a href="index.html" class="btn btn--metallic" style="display:inline-flex;">TOPページへ戻る</a>
        </div>
      `;
    }, 1500);
  });
}

// ===== ファイル選択時にラベル更新 =====
const fileInput = document.getElementById('e-file');
const fileLabel = document.querySelector('.form__file-label');
if (fileInput && fileLabel) {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      fileLabel.innerHTML = `<span>${file.name}</span>`;
      fileLabel.style.borderColor = 'var(--accent)';
      fileLabel.style.color = 'var(--accent)';
    } else {
      fileLabel.innerHTML = `<span>ファイルを選択（PDF / Word）</span>`;
      fileLabel.style.borderColor = '';
      fileLabel.style.color = '';
    }
  });
}

// ===== リアルタイム時計（問いかけセクション） =====
function updateClock() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ids = {
    clockYear: now.getFullYear(),
    clockMonth: pad(now.getMonth() + 1),
    clockDay: pad(now.getDate()),
    clockHour: pad(now.getHours()),
    clockMin: pad(now.getMinutes()),
    clockSec: pad(now.getSeconds()),
  };
  for (const [id, val] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}
if (document.getElementById('questionClock')) {
  updateClock();
  setInterval(updateClock, 1000);
}
