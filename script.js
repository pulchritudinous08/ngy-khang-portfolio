/* ==========================================================================
   Personal Portfolio & Project Hub — Interactive Engine
   Supports: IndexedDB file storage, real file downloads, PC mouse-tracking,
   3D tilt, magnetic buttons, scroll parallax, and mobile touch/scroll effects.
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY_PROJECTS = 'ngykhang_portfolio_projects_v2';
  const STORAGE_KEY_PROFILE = 'ngykhang_portfolio_profile_v2';
  const DB_NAME = 'PortfolioVaultDB';
  const DB_STORE = 'files';

  /* ------------------------------------------------------------------------
     1. Bespoke Minimalist Monochrome Cover Art Generator (SVG)
     ------------------------------------------------------------------------ */
  function generateCoverSVG(seedIndex, label) {
    const patterns = [
      // Concentric architectural rings
      `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g0" cx="72%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#e6d5b8" stop-opacity="0.22"/>
            <stop offset="55%" stop-color="#18181d" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#08080a" stop-opacity="1"/>
          </radialGradient>
        </defs>
        <rect width="640" height="360" fill="#08080a"/>
        <rect width="640" height="360" fill="url(#g0)"/>
        <circle cx="460" cy="140" r="190" fill="none" stroke="#e6d5b8" stroke-opacity="0.16" stroke-width="1"/>
        <circle cx="460" cy="140" r="130" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>
        <circle cx="460" cy="140" r="70" fill="none" stroke="#e6d5b8" stroke-opacity="0.28" stroke-width="1.2"/>
        <line x1="48" y1="296" x2="280" y2="296" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1"/>
        <text x="48" y="280" fill="#f4f4f6" fill-opacity="0.55" font-family="monospace" font-size="13" letter-spacing="3">${escapeXML(label)}</text>
      </svg>`,

      // Editorial diagonal planes
      `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#17171c"/>
            <stop offset="60%" stop-color="#0a0a0d"/>
            <stop offset="100%" stop-color="#060607"/>
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#g1)"/>
        <polygon points="320,0 640,0 640,360 190,360" fill="#ffffff" fill-opacity="0.025"/>
        <polygon points="430,0 640,0 640,260" fill="#e6d5b8" fill-opacity="0.08"/>
        <line x1="190" y1="360" x2="320" y2="0" stroke="#e6d5b8" stroke-opacity="0.26" stroke-width="1"/>
        <line x1="250" y1="360" x2="380" y2="0" stroke="#ffffff" stroke-opacity="0.09" stroke-width="1"/>
        <rect x="48" y="258" width="28" height="2" fill="#e6d5b8" fill-opacity="0.7"/>
        <text x="48" y="292" fill="#f4f4f6" fill-opacity="0.55" font-family="monospace" font-size="13" letter-spacing="3">${escapeXML(label)}</text>
      </svg>`,

      // Precision horology / timer arc
      `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#08080a"/>
        <circle cx="320" cy="180" r="118" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
        <path d="M 320 62 A 118 118 0 1 1 215 234" fill="none" stroke="#e6d5b8" stroke-opacity="0.65" stroke-width="2" stroke-linecap="round"/>
        <circle cx="320" cy="180" r="4" fill="#e6d5b8"/>
        <line x1="320" y1="180" x2="386" y2="128" stroke="#f4f4f6" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round"/>
        <text x="48" y="312" fill="#f4f4f6" fill-opacity="0.5" font-family="monospace" font-size="13" letter-spacing="3">${escapeXML(label)}</text>
      </svg>`,

      // Layered terminal bars
      `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g3" cx="25%" cy="25%" r="70%">
            <stop offset="0%" stop-color="#e6d5b8" stop-opacity="0.14"/>
            <stop offset="100%" stop-color="#08080a" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="640" height="360" fill="#08080a"/>
        <rect width="640" height="360" fill="url(#g3)"/>
        <rect x="64" y="88" width="512" height="184" rx="12" fill="#0f0f13" stroke="#ffffff" stroke-opacity="0.1"/>
        <circle cx="88" cy="112" r="4" fill="#ffffff" fill-opacity="0.22"/>
        <circle cx="104" cy="112" r="4" fill="#ffffff" fill-opacity="0.14"/>
        <circle cx="120" cy="112" r="4" fill="#e6d5b8" fill-opacity="0.5"/>
        <rect x="88" y="144" width="180" height="8" rx="4" fill="#e6d5b8" fill-opacity="0.45"/>
        <rect x="88" y="168" width="320" height="8" rx="4" fill="#ffffff" fill-opacity="0.14"/>
        <rect x="88" y="192" width="240" height="8" rx="4" fill="#ffffff" fill-opacity="0.1"/>
        <rect x="88" y="216" width="140" height="8" rx="4" fill="#ffffff" fill-opacity="0.08"/>
        <text x="64" y="314" fill="#f4f4f6" fill-opacity="0.5" font-family="monospace" font-size="13" letter-spacing="3">${escapeXML(label)}</text>
      </svg>`
    ];
    return patterns[Math.abs(seedIndex) % patterns.length];
  }

  function escapeXML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ------------------------------------------------------------------------
     2. Default Sample Projects (with Real Downloadable Files)
     ------------------------------------------------------------------------ */
  const DEFAULT_PROFILE = {
    brand: 'Ngy Khang',
    headline: 'Không gian lưu trữ & chia sẻ dự án cá nhân.',
    bio: 'Tổng hợp các ứng dụng, công cụ dòng lệnh, giao diện web và mã nguồn mở do Ngy Khang xây dựng. Bạn có thể xem chi tiết và tải về trực tiếp bản phát hành mới nhất ngay tại đây.',
    email: 'contact@ngykhang.dev',
    github: 'https://github.com'
  };

  const DEFAULT_PROJECTS = [
    {
      id: 'sample-flux-motion',
      title: 'Flux Motion Starter Kit',
      category: 'Web',
      version: 'v2.1.0',
      description:
        'Bộ khung giao diện nền đen tối giản tích hợp sẵn hiệu ứng dò chuột, thẻ nghiêng 3D và xuất hiện mượt mà khi cuộn trang trên cả điện thoại lẫn máy tính.',
      tags: ['HTML5', 'CSS3', 'Vanilla JS'],
      fileName: 'flux-motion-starter-v2.1.0.html',
      fileType: 'text/html',
      fileSize: 2840,
      downloads: 184,
      createdAt: Date.now() - 86400000 * 2,
      coverIndex: 0,
      isSample: true,
      sampleContent: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flux Motion Starter v2.1.0</title>
  <style>
    body { margin: 0; background: #060607; color: #f4f4f6; font-family: system-ui, sans-serif; min-height: 100vh; display: grid; place-items: center; }
    .card { padding: 40px; border-radius: 16px; background: #111115; border: 1px solid rgba(255,255,255,0.1); max-width: 460px; text-align: center; transition: transform 0.3s ease; }
    .card:hover { transform: translateY(-6px); border-color: rgba(230,213,184,0.45); }
    h1 { margin: 0 0 12px; font-size: 1.75rem; }
    p { color: #9d9da8; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Flux Motion Starter</h1>
    <p>File mẫu được tải về trực tiếp từ kho dự án cá nhân của Ngy Khang. Bạn có thể tùy biến tự do!</p>
  </div>
</body>
</html>`
    },
    {
      id: 'sample-focus-timer',
      title: 'Obsidian Focus Timer',
      category: 'Ứng dụng',
      version: 'v1.3.0',
      description:
        'Ứng dụng đếm ngược Pomodoro nền đen không gây xao nhãng, chạy độc lập chỉ với một tệp HTML duy nhất và hỗ trợ chế độ nghỉ ngắn/dài.',
      tags: ['App', 'Pomodoro', 'Offline'],
      fileName: 'obsidian-focus-timer-v1.3.0.html',
      fileType: 'text/html',
      fileSize: 3120,
      downloads: 129,
      createdAt: Date.now() - 86400000 * 6,
      coverIndex: 2,
      isSample: true,
      sampleContent: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Obsidian Focus Timer v1.3.0</title>
  <style>
    body { margin: 0; background: #060607; color: #f4f4f6; font-family: system-ui, sans-serif; min-height: 100vh; display: grid; place-items: center; }
    .box { text-align: center; padding: 48px; background: #111115; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; }
    #time { font-size: 4.5rem; font-weight: 700; font-variant-numeric: tabular-nums; margin: 16px 0 28px; color: #e6d5b8; }
    button { background: #f4f4f6; color: #060607; border: 0; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; margin: 0 6px; }
  </style>
</head>
<body>
  <div class="box">
    <div style="letter-spacing:2px;font-size:12px;color:#888">OBSIDIAN FOCUS</div>
    <div id="time">25:00</div>
    <button onclick="toggle()">Bắt đầu / Dừng</button>
    <button onclick="reset()" style="background:#1c1c22;color:#fff">Đặt lại</button>
  </div>
  <script>
    let sec = 1500, timer = null;
    const el = document.getElementById('time');
    function render() { el.textContent = String(Math.floor(sec/60)).padStart(2,'0') + ':' + String(sec%60).padStart(2,'0'); }
    function toggle() { if (timer) { clearInterval(timer); timer = null; } else { timer = setInterval(() => { if (sec > 0) { sec--; render(); } }, 1000); } }
    function reset() { clearInterval(timer); timer = null; sec = 1500; render(); }
  </script>
</body>
</html>`
    },
    {
      id: 'sample-notes-cli',
      title: 'QuickNote CLI Utility',
      category: 'Công cụ',
      version: 'v1.4.2',
      description:
        'Công cụ dòng lệnh ghi chú nhanh bằng Node.js, lưu trực tiếp dưới dạng Markdown theo ngày và hỗ trợ tìm kiếm từ khóa tức thì.',
      tags: ['Node.js', 'CLI', 'Markdown'],
      fileName: 'quicknote-cli-v1.4.2.js',
      fileType: 'text/javascript',
      fileSize: 1640,
      downloads: 96,
      createdAt: Date.now() - 86400000 * 14,
      coverIndex: 3,
      isSample: true,
      sampleContent: `#!/usr/bin/env node
// QuickNote CLI v1.4.2 — Ghi chú Markdown nhanh từ Terminal
const fs = require('fs');
const path = require('path');

const note = process.argv.slice(2).join(' ');
const file = path.join(process.cwd(), 'notes.md');

if (!note) {
  console.log('Cách dùng: node quicknote-cli-v1.4.2.js "Nội dung ghi chú"');
  process.exit(0);
}

const line = \`- [\${new Date().toISOString().slice(0, 16).replace('T', ' ')}] \${note}\\n\`;
fs.appendFileSync(file, line, 'utf8');
console.log('Đã lưu ghi chú vào', file);
`
    },
    {
      id: 'sample-backup-sh',
      title: 'Auto-Backup Shell Script',
      category: 'Mã nguồn',
      version: 'v1.0.5',
      description:
        'Kịch bản Bash gọn nhẹ giúp tự động nén thư mục dự án kèm mốc thời gian, bỏ qua node_modules và giữ lại 5 bản sao lưu gần nhất.',
      tags: ['Bash', 'Linux', 'Automation'],
      fileName: 'auto-backup-v1.0.5.sh',
      fileType: 'text/x-shellscript',
      fileSize: 1180,
      downloads: 73,
      createdAt: Date.now() - 86400000 * 21,
      coverIndex: 1,
      isSample: true,
      sampleContent: `#!/usr/bin/env bash
# Auto-Backup Script v1.0.5
set -euo pipefail

SRC_DIR="\${1:-.}"
OUT_DIR="\${2:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

ARCHIVE="$OUT_DIR/backup-$STAMP.tar.gz"
tar --exclude='node_modules' --exclude='.git' --exclude="$OUT_DIR" -czf "$ARCHIVE" "$SRC_DIR"
echo "Sao lưu hoàn tất: $ARCHIVE"
`
    }
  ];

  /* ------------------------------------------------------------------------
     3. IndexedDB Wrapper for Uploaded Binary Files
     ------------------------------------------------------------------------ */
  let dbInstance = null;

  function openDB() {
    return new Promise((resolve) => {
      if (!('indexedDB' in window)) return resolve(null);
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(DB_STORE)) {
            db.createObjectStore(DB_STORE);
          }
        };
        req.onsuccess = (e) => {
          dbInstance = e.target.result;
          resolve(dbInstance);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function saveFileBlob(id, blob) {
    const db = dbInstance || (await openDB());
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readwrite');
        tx.objectStore(DB_STORE).put(blob, id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async function getFileBlob(id) {
    const db = dbInstance || (await openDB());
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(DB_STORE, 'readonly');
        const req = tx.objectStore(DB_STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function deleteFileBlob(id) {
    const db = dbInstance || (await openDB());
    if (!db) return;
    try {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(id);
    } catch {
      // ignore
    }
  }

  // In-memory fallback if IndexedDB is unavailable
  const memoryFiles = new Map();

  /* ------------------------------------------------------------------------
     4. Application State
     ------------------------------------------------------------------------ */
  let projects = loadProjects();
  let profile = loadProfile();
  let activeCategory = 'all';
  let searchQuery = '';
  let sortMode = 'newest';
  let selectedUploadFile = null;
  let activeDetailId = null;

  function loadProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PROJECTS.map((p) => ({ ...p }));
  }

  function persistProjects() {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore quota error
    }
  }

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
      // fallback
    }
    return { ...DEFAULT_PROFILE };
  }

  function persistProfile() {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  /* ------------------------------------------------------------------------
     5. Formatting & UI Helpers
     ------------------------------------------------------------------------ */
  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return 'Liên kết ngoài';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }

  function formatDate(ts) {
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(ts));
    } catch {
      return 'Gần đây';
    }
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-dot"></span><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 380);
    }, 3200);
  }

  /* ------------------------------------------------------------------------
     6. Render Profile, Stats & Projects
     ------------------------------------------------------------------------ */
  function getMonogram(name) {
    const parts = String(name || 'NK').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0] || 'NK').slice(0, 2).toUpperCase();
  }

  function renderProfile() {
    const mono = getMonogram(profile.brand);
    document.getElementById('brand-initial').textContent = mono;
    document.getElementById('brand-name').textContent = profile.brand;
    document.getElementById('footer-brand').textContent = profile.brand;
    document.getElementById('profile-headline').textContent = profile.headline;
    document.getElementById('profile-bio').textContent = profile.bio;
    document.getElementById('contact-email-label').textContent = profile.email;
    document.getElementById('contact-github-link').href = profile.github;

    const introMono = document.getElementById('intro-monogram');
    const introBrand = document.getElementById('intro-brand');
    const eyebrow = document.getElementById('profile-eyebrow');
    if (introMono) introMono.textContent = mono;
    if (introBrand) introBrand.textContent = profile.brand;
    if (eyebrow) eyebrow.textContent = `01 / ${profile.brand.toUpperCase()} — PORTFOLIO & RELEASES`;

    document.title = `${profile.brand} — Kho Dự Án Cá Nhân & Tải Về`;
  }

  function renderStats() {
    const totalProjects = projects.length;
    const totalDownloads = projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
    const latest = [...projects].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];

    document.getElementById('stat-projects').textContent = String(totalProjects).padStart(2, '0');
    document.getElementById('stat-downloads').textContent = totalDownloads.toLocaleString('vi-VN');
    document.getElementById('stat-latest').textContent = latest ? latest.version || 'v1.0' : '—';
  }

  function getFilteredProjects() {
    const q = searchQuery.trim().toLowerCase();
    let list = projects.filter((p) => {
      const catMatch = activeCategory === 'all' || p.category === activeCategory;
      if (!catMatch) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.description} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });

    if (sortMode === 'downloads') {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortMode === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return list;
  }

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const list = getFilteredProjects();

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>Không tìm thấy dự án phù hợp</h3>
          <p>Thử đổi từ khóa tìm kiếm hoặc bấm "Đăng dự án" để thêm sản phẩm mới.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list
      .map((p, idx) => {
        const coverHTML = p.coverDataUrl
          ? `<img src="${p.coverDataUrl}" alt="${escapeHTML(p.title)}" loading="lazy" />`
          : generateCoverSVG(p.coverIndex ?? idx, `${p.category.toUpperCase()} / ${p.version || 'v1.0'}`);

        const ext = p.fileName
          ? p.fileName.split('.').pop().toUpperCase().slice(0, 6)
          : 'LINK';

        const tagsHTML = (p.tags || [])
          .slice(0, 4)
          .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
          .join('');

        return `
          <article class="project-card reveal is-visible" data-project-id="${escapeHTML(p.id)}" style="transition-delay: ${Math.min(idx * 60, 240)}ms">
            <div class="project-cover">
              <div class="project-cover-meta">
                <span class="meta-chip">${escapeHTML(p.category)}</span>
                <span class="meta-chip meta-chip--accent">${escapeHTML(p.version || 'v1.0.0')}</span>
              </div>
              ${coverHTML}
            </div>
            <div class="project-body">
              <h3 class="project-title">${escapeHTML(p.title)}</h3>
              <p class="project-desc">${escapeHTML(p.description)}</p>
              <div class="tag-list">${tagsHTML}</div>
              <div class="project-footer">
                <div class="file-info">
                  <span>${escapeHTML(ext)}</span>
                  <span>•</span>
                  <span>${escapeHTML(formatBytes(p.fileSize))}</span>
                  <span>•</span>
                  <span>${(p.downloads || 0).toLocaleString('vi-VN')} tải</span>
                </div>
                <div class="project-actions">
                  <button type="button" class="btn btn-secondary btn-sm" data-action="detail" data-id="${escapeHTML(p.id)}">
                    Chi tiết
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" data-action="download" data-id="${escapeHTML(p.id)}">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Tải về</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    bindCardInteractions();
    updateMobileFocusedCard();
  }

  /* ------------------------------------------------------------------------
     7. Download & Project Management Logic
     ------------------------------------------------------------------------ */
  async function downloadProject(projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    let downloaded = false;

    // Case 1: User-uploaded binary stored in IndexedDB or memory
    if (project.hasBlob) {
      const blob = memoryFiles.get(project.id) || (await getFileBlob(project.id));
      if (blob) {
        triggerBlobDownload(blob, project.fileName || `${project.title}.bin`);
        downloaded = true;
      }
    }

    // Case 2: Built-in sample content
    if (!downloaded && project.sampleContent) {
      const blob = new Blob([project.sampleContent], {
        type: project.fileType || 'text/plain;charset=utf-8'
      });
      triggerBlobDownload(blob, project.fileName || `${project.id}.txt`);
      downloaded = true;
    }

    // Case 3: External URL
    if (!downloaded && project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
      downloaded = true;
    }

    // Case 4: Fallback generated README summary
    if (!downloaded) {
      const readme = `# ${project.title} (${project.version || 'v1.0.0'})\n\nDanh mục: ${project.category}\nMô tả:\n${project.description}\n\nCông nghệ: ${(project.tags || []).join(', ')}\n`;
      const blob = new Blob([readme], { type: 'text/markdown;charset=utf-8' });
      triggerBlobDownload(blob, `${slugify(project.title)}-README.md`);
      downloaded = true;
    }

    if (downloaded) {
      project.downloads = (project.downloads || 0) + 1;
      persistProjects();
      renderStats();
      renderProjects();
      if (activeDetailId === project.id) {
        openDetailModal(project.id);
      }
      showToast(`Đang tải xuống "${project.title}"`);
    }
  }

  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function slugify(text) {
    return String(text || 'project')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'project';
  }

  /* ------------------------------------------------------------------------
     8. Modals (Upload, Detail, Profile)
     ------------------------------------------------------------------------ */
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openDetailModal(projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    activeDetailId = project.id;

    document.getElementById('detail-category-version').textContent =
      `${project.category.toUpperCase()} • ${project.version || 'v1.0.0'}`;
    document.getElementById('detail-modal-title').textContent = project.title;
    document.getElementById('detail-desc').textContent = project.description;

    const coverBox = document.getElementById('detail-cover');
    coverBox.innerHTML = project.coverDataUrl
      ? `<img src="${project.coverDataUrl}" alt="${escapeHTML(project.title)}" />`
      : generateCoverSVG(project.coverIndex ?? 0, `${project.category.toUpperCase()} / ${project.version || 'v1.0'}`);

    document.getElementById('detail-tags').innerHTML = (project.tags || [])
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join('');

    const fileLabel = project.fileName || (project.externalUrl ? 'Liên kết tải ngoài' : 'README.md');
    document.getElementById('detail-meta').innerHTML = `
      <span>Tệp: <strong>${escapeHTML(fileLabel)}</strong></span>
      <span>Dung lượng: <strong>${escapeHTML(formatBytes(project.fileSize))}</strong></span>
      <span>Lượt tải: <strong>${(project.downloads || 0).toLocaleString('vi-VN')}</strong></span>
      <span>Ngày đăng: <strong>${escapeHTML(formatDate(project.createdAt))}</strong></span>
    `;

    const deleteBtn = document.getElementById('detail-delete-btn');
    deleteBtn.style.display = project.isSample ? 'none' : 'inline-flex';

    openModal('detail-modal');
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  /* ------------------------------------------------------------------------
     9. PC Mouse-Tracking, 3D Tilt, Magnetic Buttons & Mobile Scroll Effects
     ------------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  function initPointerAndAmbient() {
    if (prefersReducedMotion) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const ambient = document.getElementById('ambient-light');

    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.35;
    let ringX = mouseX;
    let ringY = mouseY;
    let ambientX = mouseX;
    let ambientY = mouseY;

    if (!isTouchDevice) {
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!document.body.classList.contains('has-cursor')) {
          document.body.classList.add('has-cursor');
        }
        if (dot) {
          dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
      }, { passive: true });

      window.addEventListener('pointerdown', () => document.body.classList.add('cursor-down'), { passive: true });
      window.addEventListener('pointerup', () => document.body.classList.remove('cursor-down'), { passive: true });
      document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));

      // Hover state delegation for interactive elements
      document.addEventListener('pointerover', (e) => {
        if (e.target.closest('a, button, input, select, textarea, .dropzone, .project-card')) {
          document.body.classList.add('cursor-hover');
        }
      });
      document.addEventListener('pointerout', (e) => {
        if (e.target.closest('a, button, input, select, textarea, .dropzone, .project-card')) {
          document.body.classList.remove('cursor-hover');
        }
      });
    }

    // Smooth animation loop (lerp cursor ring + ambient light)
    function animate() {
      if (isTouchDevice) {
        // On mobile, gently drift ambient light with scroll position
        const scrollRatio = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1);
        mouseX = window.innerWidth * (0.25 + Math.sin(scrollRatio * Math.PI * 2) * 0.25 + 0.25);
        mouseY = window.innerHeight * (0.22 + scrollRatio * 0.45);
      }

      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ambientX += (mouseX - ambientX) * 0.06;
      ambientY += (mouseY - ambientY) * 0.06;

      if (ring && !isTouchDevice) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (ambient) {
        ambient.style.transform = `translate3d(${ambientX}px, ${ambientY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  function initMagneticButtons() {
    if (prefersReducedMotion || isTouchDevice) return;
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function bindCardInteractions() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card) => {
      if (!prefersReducedMotion && !isTouchDevice) {
        // PC: Specular spotlight + damped 3D perspective tilt
        card.addEventListener('pointermove', (e) => {
          if (e.pointerType !== 'mouse') return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mx', `${x}px`);
          card.style.setProperty('--my', `${y}px`);

          const rotateY = ((x / rect.width) - 0.5) * 6;
          const rotateX = ((y / rect.height) - 0.5) * -6;
          card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });
      } else {
        // Mobile / Touch: Tactile ripple & active spotlight at tap point
        card.addEventListener('pointerdown', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mx', `${x}px`);
          card.style.setProperty('--my', `${y}px`);

          const ripple = document.createElement('span');
          ripple.className = 'touch-ripple';
          const size = Math.max(rect.width, rect.height) * 0.45;
          ripple.style.width = `${size}px`;
          ripple.style.height = `${size}px`;
          ripple.style.left = `${x - size / 2}px`;
          ripple.style.top = `${y - size / 2}px`;
          card.appendChild(ripple);
          setTimeout(() => ripple.remove(), 650);
        }, { passive: true });
      }
    });
  }

  function updateMobileFocusedCard() {
    if (!isTouchDevice && window.innerWidth > 900) return;
    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    const viewportCenter = window.innerHeight * 0.48;
    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (rect.bottom > 60 && rect.top < window.innerHeight - 60 && dist < minDistance) {
        minDistance = dist;
        closestCard = card;
      }
    });

    cards.forEach((card) => {
      const isActive = card === closestCard;
      card.classList.toggle('is-mobile-active', isActive);
      if (isActive) {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '30%');
      }
    });
  }

  function initScrollEffects() {
    const header = document.getElementById('site-header');
    const progressBar = document.getElementById('scroll-progress-bar');
    const heroParallax = document.getElementById('hero-parallax');
    const scrollCue = document.getElementById('scroll-cue');
    const projectsGrid = document.getElementById('projects-grid');

    // IntersectionObserver for scroll reveal
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    }

    let lastScrollY = window.scrollY;
    let ticking = false;
    let skewTimeout = null;

    function onScroll() {
      const y = window.scrollY;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(y / maxScroll, 0), 1);

      if (progressBar) {
        progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
      }
      if (header) {
        header.classList.toggle('is-scrolled', y > 24);
      }
      if (scrollCue) {
        scrollCue.style.opacity = y > 90 ? '0' : '1';
      }

      if (!prefersReducedMotion && heroParallax && y < window.innerHeight) {
        const shift = y * 0.16;
        const opacity = Math.max(1 - y / (window.innerHeight * 0.95), 0.15);
        heroParallax.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
        heroParallax.style.opacity = opacity.toFixed(3);
      }

      // Subtle velocity skew on project grid (both PC & Mobile)
      if (!prefersReducedMotion && projectsGrid) {
        const velocity = y - lastScrollY;
        const skew = Math.max(Math.min(velocity * 0.035, 1.4), -1.4);
        projectsGrid.style.transform = `skewY(${skew.toFixed(2)}deg)`;
        clearTimeout(skewTimeout);
        skewTimeout = setTimeout(() => {
          projectsGrid.style.transform = 'skewY(0deg)';
        }, 120);
      }

      updateMobileFocusedCard();
      lastScrollY = y;
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();
  }

  /* ------------------------------------------------------------------------
     10. Event Wiring & Initialization
     ------------------------------------------------------------------------ */
  function bindEvents() {
    // Open Upload Modal triggers
    ['open-upload-btn', 'hero-upload-btn', 'section-upload-btn'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => openModal('upload-modal'));
    });

    // Mobile Nav Drawer
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const toggleMobileNav = (forceClose = false) => {
      const open = forceClose ? false : !mobileNav.classList.contains('is-open');
      mobileNav.classList.toggle('is-open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      mobileBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    mobileBtn?.addEventListener('click', () => toggleMobileNav());
    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        toggleMobileNav(true);
        if (link.id === 'mobile-upload-trigger') {
          e.preventDefault();
          openModal('upload-modal');
        }
      });
    });

    // Close modal buttons & backdrop click & ESC key
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
    });
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop.id);
      });
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.is-open').forEach((m) => closeModal(m.id));
        toggleMobileNav(true);
      }
    });

    // Category Filter Tabs
    document.getElementById('filter-tabs')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      activeCategory = btn.dataset.category;
      document.querySelectorAll('.filter-tab').forEach((t) => {
        const active = t === btn;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      renderProjects();
    });

    // Search & Sort
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      sortMode = e.target.value;
      renderProjects();
    });

    // Project Card Actions (Event Delegation)
    document.getElementById('projects-grid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'download') {
        downloadProject(id);
      } else if (action === 'detail') {
        openDetailModal(id);
      }
    });

    // Detail Modal Download & Delete
    document.getElementById('detail-download-btn')?.addEventListener('click', () => {
      if (activeDetailId) downloadProject(activeDetailId);
    });
    document.getElementById('detail-delete-btn')?.addEventListener('click', async () => {
      if (!activeDetailId) return;
      const target = projects.find((p) => p.id === activeDetailId);
      if (!target || target.isSample) return;
      projects = projects.filter((p) => p.id !== activeDetailId);
      memoryFiles.delete(activeDetailId);
      await deleteFileBlob(activeDetailId);
      persistProjects();
      renderStats();
      renderProjects();
      closeModal('detail-modal');
      showToast(`Đã xóa dự án "${target.title}"`);
    });

    // Upload File Dropzone
    const dropzone = document.getElementById('file-dropzone');
    const fileInput = document.getElementById('proj-file');
    const fileInfoEl = document.getElementById('selected-file-info');

    const handleSelectedFile = (file) => {
      if (!file) return;
      selectedUploadFile = file;
      fileInfoEl.textContent = `Đã chọn: ${file.name} (${formatBytes(file.size)})`;
    };

    dropzone?.addEventListener('click', () => fileInput.click());
    dropzone?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileInput?.addEventListener('change', (e) => handleSelectedFile(e.target.files[0]));
    dropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      handleSelectedFile(e.dataTransfer.files[0]);
    });

    // Upload Project Form Submit
    document.getElementById('upload-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('proj-title').value.trim();
      const category = document.getElementById('proj-category').value;
      const version = document.getElementById('proj-version').value.trim() || 'v1.0.0';
      const description = document.getElementById('proj-desc').value.trim();
      const tagsRaw = document.getElementById('proj-tags').value;
      const externalUrl = document.getElementById('proj-url').value.trim();
      const coverFile = document.getElementById('proj-cover').files[0];

      if (!title || !description) return;

      const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const tags = tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let hasBlob = false;
      let fileName = '';
      let fileSize = 0;
      let fileType = '';

      if (selectedUploadFile) {
        fileName = selectedUploadFile.name;
        fileSize = selectedUploadFile.size;
        fileType = selectedUploadFile.type || 'application/octet-stream';
        memoryFiles.set(id, selectedUploadFile);
        await saveFileBlob(id, selectedUploadFile);
        hasBlob = true;
      }

      let coverDataUrl = null;
      if (coverFile) {
        coverDataUrl = await readFileAsDataURL(coverFile);
      }

      const newProject = {
        id,
        title,
        category,
        version,
        description,
        tags: tags.length ? tags : [category],
        fileName,
        fileSize,
        fileType,
        externalUrl,
        hasBlob,
        coverDataUrl,
        coverIndex: projects.length,
        downloads: 0,
        createdAt: Date.now(),
        isSample: false
      };

      projects.unshift(newProject);
      persistProjects();
      renderStats();
      renderProjects();

      // Reset form
      e.target.reset();
      selectedUploadFile = null;
      fileInfoEl.textContent = '';
      closeModal('upload-modal');
      showToast(`Đã đăng dự án "${title}" thành công!`);
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Edit Profile Modal
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
      document.getElementById('input-brand').value = profile.brand;
      document.getElementById('input-headline').value = profile.headline;
      document.getElementById('input-bio').value = profile.bio;
      document.getElementById('input-email').value = profile.email;
      document.getElementById('input-github').value = profile.github;
      openModal('profile-modal');
    });

    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      profile = {
        brand: document.getElementById('input-brand').value.trim() || DEFAULT_PROFILE.brand,
        headline: document.getElementById('input-headline').value.trim() || DEFAULT_PROFILE.headline,
        bio: document.getElementById('input-bio').value.trim() || DEFAULT_PROFILE.bio,
        email: document.getElementById('input-email').value.trim() || DEFAULT_PROFILE.email,
        github: document.getElementById('input-github').value.trim() || DEFAULT_PROFILE.github
      };
      persistProfile();
      renderProfile();
      closeModal('profile-modal');
      showToast('Đã cập nhật hồ sơ cá nhân');
    });

    // Copy Email
    document.getElementById('copy-email-btn')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        showToast(`Đã sao chép email: ${profile.email}`);
      } catch {
        showToast(`Email liên hệ: ${profile.email}`);
      }
    });

    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     11. Opening Intro Curtain & Choreographed Entrance
     ------------------------------------------------------------------------ */
  function animateCount(el, target, padTwo = false) {
    if (!el || prefersReducedMotion) return;
    const duration = 900;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.textContent = padTwo ? String(val).padStart(2, '0') : val.toLocaleString('vi-VN');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function runIntroSequence() {
    const overlay = document.getElementById('intro-overlay');
    const bar = document.getElementById('intro-bar');
    const percentEl = document.getElementById('intro-percent');

    const finishIntro = () => {
      document.body.classList.add('is-loaded');
      const totalProjects = projects.length;
      const totalDownloads = projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
      animateCount(document.getElementById('stat-projects'), totalProjects, true);
      animateCount(document.getElementById('stat-downloads'), totalDownloads, false);
    };

    if (!overlay || prefersReducedMotion) {
      if (overlay) overlay.classList.add('is-done');
      finishIntro();
      return;
    }

    document.body.style.overflow = 'hidden';
    const duration = 1100;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);

      if (bar) bar.style.width = `${pct}%`;
      if (percentEl) percentEl.textContent = `${String(pct).padStart(2, '0')}%`;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          overlay.classList.add('is-leaving');
          document.body.style.overflow = '';
          finishIntro();
          setTimeout(() => overlay.classList.add('is-done'), 920);
        }, 160);
      }
    }

    requestAnimationFrame(frame);
  }

  // Boot
  openDB().then(() => {
    renderProfile();
    renderStats();
    renderProjects();
    bindEvents();
    initPointerAndAmbient();
    initMagneticButtons();
    initScrollEffects();
    runIntroSequence();
  });
})();
