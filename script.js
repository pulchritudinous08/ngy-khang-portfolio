/* ==========================================================================
   Ngy Khang — Personal Portfolio & Project Hub
   Real stats (initialized at 0, prioritizing Views), user-only projects,
   IndexedDB binary storage, 100% burst-out intro, PC mouse & Mobile scroll FX.
   ========================================================================== */

(() => {
  'use strict';

  const STORAGE_KEY_PROJECTS = 'ngykhang_portfolio_projects_v3';
  const STORAGE_KEY_PROFILE = 'ngykhang_portfolio_profile_v4';
  const STORAGE_KEY_VIEWS = 'ngykhang_portfolio_views_v3';
  const DB_NAME = 'NgyKhangVaultDB';
  const DB_STORE = 'files';

  /* ------------------------------------------------------------------------
     1. Minimalist Monochrome Cover Art Generator (SVG fallback if no cover)
     ------------------------------------------------------------------------ */
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

  function generateCoverSVG(seedIndex, label) {
    const patterns = [
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
      `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#08080a"/>
        <circle cx="320" cy="180" r="118" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
        <path d="M 320 62 A 118 118 0 1 1 215 234" fill="none" stroke="#e6d5b8" stroke-opacity="0.65" stroke-width="2" stroke-linecap="round"/>
        <circle cx="320" cy="180" r="4" fill="#e6d5b8"/>
        <line x1="320" y1="180" x2="386" y2="128" stroke="#f4f4f6" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round"/>
        <text x="48" y="312" fill="#f4f4f6" fill-opacity="0.5" font-family="monospace" font-size="13" letter-spacing="3">${escapeXML(label)}</text>
      </svg>`,
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

  /* ------------------------------------------------------------------------
     2. Default Profile & Empty User-Only Project Store
     ------------------------------------------------------------------------ */
  const DEFAULT_PROFILE = {
    brand: 'Ngy Khang',
    headline: 'Nơi mình cất mấy món đồ tự code & chia sẻ free.',
    bio: 'Mấy app nhỏ, tool nghịch vui, web hay mã nguồn do Ngy Khang tự tay làm ra. Thích món nào cứ bấm xem chi tiết rồi tải thẳng về máy xài nhé.',
    email: 'contact@ngykhang.dev',
    github: 'https://github.com'
  };

  /* ------------------------------------------------------------------------
     3. IndexedDB Wrapper for Uploaded Binary Files
     ------------------------------------------------------------------------ */
  let dbInstance = null;
  const memoryFiles = new Map();

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

  /* ------------------------------------------------------------------------
     4. Application State (All Real Stats Start at 0, No Sample Projects)
     ------------------------------------------------------------------------ */
  let projects = loadProjects();
  let profile = loadProfile();
  let totalViews = loadViews();
  let activeCategory = 'all';
  let searchQuery = '';
  let sortMode = 'views';
  let selectedUploadFile = null;
  let activeDetailId = null;

  function loadProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  }

  function persistProjects() {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch {
      // ignore
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

  function loadViews() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VIEWS);
      const num = parseInt(raw, 10);
      return Number.isFinite(num) && num >= 0 ? num : 0;
    } catch {
      return 0;
    }
  }

  function persistViews() {
    try {
      localStorage.setItem(STORAGE_KEY_VIEWS, String(totalViews));
    } catch {
      // ignore
    }
  }

  /* ------------------------------------------------------------------------
     5. Formatting & UI Helpers
     ------------------------------------------------------------------------ */
  function getMonogram(name) {
    const parts = String(name || 'NK').trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (parts[0] || 'NK').slice(0, 2).toUpperCase();
  }

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
     6. Render Profile, Real Stats & User Projects
     ------------------------------------------------------------------------ */
  function renderProfile() {
    const mono = getMonogram(profile.brand);
    document.getElementById('brand-initial').textContent = mono;
    document.getElementById('brand-name').textContent = profile.brand;
    document.getElementById('footer-brand').textContent = profile.brand;

    const headlineEl = document.getElementById('profile-headline');
    if (profile.headline === DEFAULT_PROFILE.headline) {
      headlineEl.innerHTML = `Nơi mình cất mấy món đồ <span class="hand-highlight">tự code<svg class="hand-underline" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 45 4, 115 16, 217 6" /></svg></span> &amp; chia sẻ free.`;
    } else {
      headlineEl.textContent = profile.headline;
    }

    document.getElementById('profile-bio').textContent = profile.bio;
    document.getElementById('contact-email-label').textContent = profile.email;
    document.getElementById('contact-github-link').href = profile.github;

    const introMono = document.getElementById('intro-monogram');
    const introBrand = document.getElementById('intro-brand');
    const eyebrow = document.getElementById('profile-eyebrow');
    if (introMono) introMono.textContent = mono;
    if (introBrand) introBrand.textContent = profile.brand;
    if (eyebrow) eyebrow.textContent = `~ góc nhỏ nghịch code của ${profile.brand} ✦`;

    document.title = `${profile.brand} — Kho Dự Án Cá Nhân & Tải Về`;
  }

  function getRealStats() {
    const totalProjects = projects.length;
    const totalDownloads = projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
    return { views: totalViews, projects: totalProjects, downloads: totalDownloads };
  }

  function renderStats() {
    const stats = getRealStats();
    const viewsText = stats.views.toLocaleString('vi-VN');
    const projectsText = stats.projects.toLocaleString('vi-VN');
    document.getElementById('stat-views').textContent = viewsText;
    document.getElementById('stat-projects').textContent = projectsText;
    document.getElementById('stat-downloads').textContent = stats.downloads.toLocaleString('vi-VN');

    const popViews = document.getElementById('pop-views');
    const popProjects = document.getElementById('pop-projects');
    if (popViews) popViews.textContent = viewsText;
    if (popProjects) popProjects.textContent = projectsText;

    const floatViews = document.getElementById('floating-stat-views');
    const floatProjects = document.getElementById('floating-stat-projects');
    if (floatViews) floatViews.textContent = viewsText;
    if (floatProjects) floatProjects.textContent = projectsText;
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

    if (sortMode === 'views') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0) || (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortMode === 'downloads') {
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

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>Chưa có dự án nào được đăng</h3>
          <p style="margin-bottom: 20px;">Kho dự án của ${escapeHTML(profile.brand)} hiện đang trống. Bắt đầu bằng việc đăng tải sản phẩm đầu tiên của bạn.</p>
          <button type="button" class="btn btn-primary" data-action="open-upload">
            + Đăng dự án đầu tiên
          </button>
        </div>
      `;
      return;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>Không tìm thấy dự án phù hợp</h3>
          <p>Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
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
                <span class="meta-chip meta-chip--accent"><span class="views-ocean">${(p.views || 0).toLocaleString('vi-VN')} lượt xem</span> • ${escapeHTML(p.version || 'v1.0.0')}</span>
              </div>
              ${coverHTML}
            </div>
            <div class="project-body">
              <h3 class="project-title">${escapeHTML(p.title)}</h3>
              <p class="project-desc">${escapeHTML(p.description)}</p>
              <div class="tag-list">${tagsHTML}</div>
              <div class="project-footer">
                <div class="file-info">
                  <span class="views-ocean">${(p.views || 0).toLocaleString('vi-VN')} xem</span>
                  <span>•</span>
                  <span>${(p.downloads || 0).toLocaleString('vi-VN')} tải</span>
                  <span>•</span>
                  <span>${escapeHTML(ext)} (${escapeHTML(formatBytes(p.fileSize))})</span>
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

    if (project.hasBlob) {
      const blob = memoryFiles.get(project.id) || (await getFileBlob(project.id));
      if (blob) {
        triggerBlobDownload(blob, project.fileName || `${project.title}.bin`);
        downloaded = true;
      }
    }

    if (!downloaded && project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
      downloaded = true;
    }

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
        renderDetailModalContent(project);
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
     8. Modals (Upload, Detail with Real View Increment, Profile)
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
    if (id === 'detail-modal') activeDetailId = null;
  }

  function renderDetailModalContent(project) {
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
      <span>Lượt xem: <strong>${(project.views || 0).toLocaleString('vi-VN')}</strong></span>
      <span>Lượt tải: <strong>${(project.downloads || 0).toLocaleString('vi-VN')}</strong></span>
      <span>Tệp: <strong>${escapeHTML(fileLabel)}</strong></span>
      <span>Dung lượng: <strong>${escapeHTML(formatBytes(project.fileSize))}</strong></span>
      <span>Ngày đăng: <strong>${escapeHTML(formatDate(project.createdAt))}</strong></span>
    `;

    const deleteBtn = document.getElementById('detail-delete-btn');
    deleteBtn.style.display = 'inline-flex';
  }

  function openDetailModal(projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    activeDetailId = project.id;

    // Increment real view counter when user opens project details
    project.views = (project.views || 0) + 1;
    totalViews += 1;
    persistProjects();
    persistViews();
    renderStats();
    renderProjects();

    renderDetailModalContent(project);
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

    function animate() {
      if (isTouchDevice) {
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
    const statsStrip = document.getElementById('stats-strip');
    const floatingStats = document.getElementById('floating-stats');

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
    let floatPulseTimeout = null;

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

      // Highlight ocean-blue Views & Projects stats smoothly as you scroll down,
      // and keep them highlighted in the floating dock even after scrolling past!
      if (statsStrip) {
        statsStrip.classList.toggle('is-scroll-active', y > 10);
        if (floatingStats) {
          const rect = statsStrip.getBoundingClientRect();
          const passedStats = rect.bottom < 90;
          floatingStats.classList.toggle('is-visible', passedStats);
          if (passedStats && Math.abs(y - lastScrollY) > 0.5) {
            floatingStats.classList.add('is-scrolling');
            clearTimeout(floatPulseTimeout);
            floatPulseTimeout = setTimeout(() => {
              floatingStats.classList.remove('is-scrolling');
            }, 220);
          }
        }
      }

      if (!prefersReducedMotion && heroParallax && y < window.innerHeight) {
        const shift = y * 0.16;
        const opacity = Math.max(1 - y / (window.innerHeight * 0.95), 0.15);
        heroParallax.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
        heroParallax.style.opacity = opacity.toFixed(3);
      }

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

  function rollLiveStat(mainEl, popEl, target) {
    if (!mainEl) return;
    const exactText = target.toLocaleString('vi-VN');
    if (prefersReducedMotion) {
      mainEl.textContent = exactText;
      if (popEl) popEl.textContent = exactText;
      return;
    }

    if (mainEl._rollFrame) cancelAnimationFrame(mainEl._rollFrame);
    mainEl.classList.add('is-rolling');

    if (target <= 0) {
      const steps = ['·', '0'];
      let idx = 0;
      const tickZero = () => {
        const val = steps[idx++];
        mainEl.textContent = val;
        if (popEl) popEl.textContent = val;
        if (idx < steps.length) {
          mainEl._rollFrame = requestAnimationFrame(() => setTimeout(tickZero, 110));
        } else {
          setTimeout(() => mainEl.classList.remove('is-rolling'), 260);
        }
      };
      tickZero();
      return;
    }

    const duration = Math.min(420 + target * 12, 760);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased).toLocaleString('vi-VN');
      mainEl.textContent = current;
      if (popEl) popEl.textContent = current;
      if (t < 1) {
        mainEl._rollFrame = requestAnimationFrame(step);
      } else {
        mainEl.textContent = exactText;
        if (popEl) popEl.textContent = exactText;
        setTimeout(() => mainEl.classList.remove('is-rolling'), 200);
      }
    };
    mainEl._rollFrame = requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     10. Event Wiring
     ------------------------------------------------------------------------ */
  function bindEvents() {
    ['open-upload-btn', 'hero-upload-btn', 'section-upload-btn'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => openModal('upload-modal'));
    });

    // Playful personal easter-egg when clicking brand logo
    const cheekyNotes = [
      'Chào bạn, cảm ơn đã ghé góc nhỏ của Ngy Khang nha!',
      'Ê, bấm vào logo NK có thấy nó lắc không?',
      'Góc này toàn đồ tự code lúc rảnh thôi đó.',
      'Thích dự án nào cứ tải về vọc thoải mái nhé!'
    ];
    let noteIdx = 0;
    document.getElementById('brand-link')?.addEventListener('click', () => {
      showToast(cheekyNotes[noteIdx % cheekyNotes.length]);
      noteIdx += 1;
    });

    // Hover / tap live rolling counter on Views & Projects stats
    const statItems = [
      {
        box: document.getElementById('stat-item-views'),
        val: document.getElementById('stat-views'),
        pop: document.getElementById('pop-views'),
        getTarget: () => getRealStats().views
      },
      {
        box: document.getElementById('stat-item-projects'),
        val: document.getElementById('stat-projects'),
        pop: document.getElementById('pop-projects'),
        getTarget: () => getRealStats().projects
      }
    ];

    statItems.forEach(({ box, val, pop, getTarget }) => {
      if (!box) return;
      let popTimer = null;
      const triggerRoll = () => rollLiveStat(val, pop, getTarget());
      box.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') triggerRoll();
      });
      box.addEventListener('focus', triggerRoll);
      box.addEventListener('click', () => {
        triggerRoll();
        box.classList.add('is-pop-open');
        clearTimeout(popTimer);
        popTimer = setTimeout(() => box.classList.remove('is-pop-open'), 1900);
      });
    });

    const floatingStats = document.getElementById('floating-stats');
    floatingStats?.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      const st = getRealStats();
      rollLiveStat(document.getElementById('floating-stat-views'), null, st.views);
      rollLiveStat(document.getElementById('floating-stat-projects'), null, st.projects);
    });
    floatingStats?.addEventListener('click', () => {
      const st = getRealStats();
      rollLiveStat(document.getElementById('floating-stat-views'), null, st.views);
      rollLiveStat(document.getElementById('floating-stat-projects'), null, st.projects);
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    floatingStats?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }
    });

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

    document.getElementById('search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      sortMode = e.target.value;
      renderProjects();
    });

    document.getElementById('projects-grid')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'download') {
        downloadProject(id);
      } else if (action === 'detail') {
        openDetailModal(id);
      } else if (action === 'open-upload') {
        openModal('upload-modal');
      }
    });

    document.getElementById('detail-download-btn')?.addEventListener('click', () => {
      if (activeDetailId) downloadProject(activeDetailId);
    });
    document.getElementById('detail-delete-btn')?.addEventListener('click', async () => {
      if (!activeDetailId) return;
      const target = projects.find((p) => p.id === activeDetailId);
      if (!target) return;
      projects = projects.filter((p) => p.id !== activeDetailId);
      memoryFiles.delete(activeDetailId);
      await deleteFileBlob(activeDetailId);
      persistProjects();
      renderStats();
      renderProjects();
      closeModal('detail-modal');
      showToast(`Đã xóa dự án "${target.title}"`);
    });

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
        views: 0,
        downloads: 0,
        createdAt: Date.now()
      };

      projects.unshift(newProject);
      persistProjects();
      renderStats();
      renderProjects();

      e.target.reset();
      selectedUploadFile = null;
      fileInfoEl.textContent = '';
      closeModal('upload-modal');
      showToast(`Đã đăng dự án "${title}" thành công!`);
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });

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
      renderProjects();
      closeModal('profile-modal');
      showToast('Đã cập nhật hồ sơ cá nhân');
    });

    document.getElementById('copy-email-btn')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        showToast(`Đã sao chép email: ${profile.email}`);
      } catch {
        showToast(`Email liên hệ: ${profile.email}`);
      }
    });

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     11. Opening Intro with 100% Burst / Pop-Out-of-Screen Effect
     ------------------------------------------------------------------------ */
  function animateCount(el, target) {
    if (!el || prefersReducedMotion || target === 0) {
      if (el) el.textContent = target.toLocaleString('vi-VN');
      return;
    }
    const duration = 750;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString('vi-VN');
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
      const stats = getRealStats();
      animateCount(document.getElementById('stat-views'), stats.views);
      animateCount(document.getElementById('stat-projects'), stats.projects);
      animateCount(document.getElementById('stat-downloads'), stats.downloads);
    };

    if (!overlay || prefersReducedMotion) {
      if (overlay) overlay.classList.add('is-done');
      finishIntro();
      return;
    }

    document.body.style.overflow = 'hidden';
    const duration = 1050;
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);

      if (bar) bar.style.width = `${pct}%`;
      if (percentEl) percentEl.textContent = `${String(pct).padStart(2, '0')}%`;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // Hit 100%: trigger pop/burst shockwave & launch intro out of screen
        overlay.classList.add('is-bursting');
        setTimeout(() => {
          overlay.classList.add('is-leaving');
          document.body.style.overflow = '';
          finishIntro();
          setTimeout(() => overlay.classList.add('is-done'), 820);
        }, 280);
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
