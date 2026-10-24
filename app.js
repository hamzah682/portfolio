/**
 * HAMZA SHAHID PORTFOLIO — INTERACTIVE ENGINE (BRYL LIM AESTHETIC)
 * Features: Spotlight Card Deck, Theme Switcher, Web Audio Synthesis,
 * Ask Overlay (⌘K), Typing Test (⌘J), Screenshot Showcase, & Scope Estimator.
 */

// ── 1. GALLERY MANIFESTS FOR INSPECTING PRODUCTION SCREENS ──
const projectGalleries = {
  musicshare: {
    title: "Sync Beat - Real-Time Audio Sharing App",
    images: [
      "apps/img01.jpg", "apps/img02.jpg", "apps/img03.jpg", "apps/img04.jpg", "apps/img05.jpg",
      "apps/img06.jpeg", "apps/img07.jpeg", "apps/img08.jpeg", "apps/img09.jpeg", "apps/img10.jpeg",
      "apps/img11.jpeg", "apps/img12.jpeg", "apps/img13.jpeg", "apps/img14.jpeg"
    ]
  },
  geofarming: {
    title: "GeoFarming - GPS Pasture Division & Grazing GIS",
    images: [
      "apps/feofarming_screenshot_1.jpeg", "apps/feofarming_screenshot_2.jpeg", "apps/feofarming_screenshot_3.jpeg",
      "apps/feofarming_screenshot_4.jpeg", "apps/feofarming_screenshot_5.jpeg", "apps/feofarming_screenshot_6.jpeg",
      "apps/feofarming_screenshot_7.jpeg", "apps/feofarming_screenshot_8.jpeg", "apps/feofarming_screenshot_9.jpeg",
      "apps/feofarming_screenshot_10.jpeg", "apps/feofarming_screenshot_11.jpeg", "apps/feofarming_screenshot_12.jpeg",
      "apps/feofarming_screenshot_13.jpeg", "apps/feofarming_screenshot_14.jpeg", "apps/feofarming_screenshot_15.jpeg"
    ]
  },
  notessnap: {
    title: "NoteSnap - Academic Peer Knowledge & Notes Engine",
    images: [
      "apps/notessnap_Screenshot_1.jpg", "apps/notessnap_Screenshot_2.jpg", "apps/notessnap_Screenshot_3.jpg",
      "apps/notessnap_Screenshot_4.jpg", "apps/notessnap_Screenshot_5.jpg", "apps/notessnap_Screenshot_6.jpg",
      "apps/notessnap_Screenshot_7.jpg", "apps/notessnap_Screenshot_8.jpg", "apps/notessnap_Screenshot_9.jpg",
      "apps/notessnap_Screenshot_10.jpg", "apps/notessnap_Screenshot_11.jpg", "apps/notessnap_Screenshot_12.jpg",
      "apps/notessnap_Screenshot_13.jpg", "apps/notessnap_Screenshot_14.jpg", "apps/notessnap_Screenshot_15.jpg",
      "apps/notessnap_Screenshot_16.jpg", "apps/notessnap_Screenshot_17.jpg"
    ]
  },
  socialapp: {
    title: "Social Video & Creator Escrow Hub",
    images: [
      "apps/socialapp1.jpg", "apps/socialapp2.jpg", "apps/socialapp3.jpg",
      "apps/socialapp4.jpg", "apps/socialapp5.jpg", "apps/socialapp6.jpg",
      "apps/socialapp7.jpg", "apps/socialapp8.jpg", "apps/socialapp9.jpg"
    ]
  }
};

// ── 2. THEME SWITCHER (LIGHT / DARK / SYSTEM) ──
(function initTheme() {
  const KEY = 'theme_pref';
  const root = document.documentElement;
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function pref() {
    try {
      const v = localStorage.getItem(KEY);
      return (v === 'dark' || v === 'light' || v === 'system') ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function isDark(p) {
    return p === 'dark' || (p === 'system' && !!mq && mq.matches);
  }

  function setClass(p) {
    root.classList.toggle('dark', isDark(p));
    document.querySelectorAll('[data-theme-opt]').forEach(el => {
      el.classList.toggle('is-active', el.getAttribute('data-theme-opt') === p);
    });
  }

  window.setTheme = function (p, ev) {
    try { localStorage.setItem(KEY, p); } catch (e) {}
    root.classList.add('theme-anim');
    setClass(p);
    setTimeout(() => root.classList.remove('theme-anim'), 480);
    window.siteAudio?.play('tick');
  };

  setClass(pref());
  if (mq) mq.addEventListener('change', () => { if (pref() === 'system') setClass('system'); });
})();

// ── 3. WEB AUDIO INTERFACE SOUND SYNTHESIZER ──
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  toggle() {
    this.init();
    this.enabled = !this.enabled;
    const btns = document.querySelectorAll('[data-sound-toggle]');
    btns.forEach(btn => {
      btn.setAttribute('aria-pressed', String(this.enabled));
      const iconOn = btn.querySelector('.sound-icon-on');
      const iconOff = btn.querySelector('.sound-icon-off');
      if (iconOn && iconOff) {
        iconOn.style.display = this.enabled ? 'block' : 'none';
        iconOff.style.display = this.enabled ? 'none' : 'block';
      }
    });
    if (this.enabled) this.play('chime');
  }
  play(type = 'tick') {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.07); // A5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'droplet') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }
}
window.siteAudio = new SoundSynth();

// ── 4. SPOTLIGHT 3D CARD DECK CONTROLLER ──
function activateCard(cardEl) {
  if (!cardEl || cardEl.classList.contains('is-center')) return;
  const deck = cardEl.closest('[data-deck]');
  if (!deck) return;

  const cards = Array.from(deck.querySelectorAll('.deck-card'));
  const clickedIdx = cards.indexOf(cardEl);

  // Rotate positions
  if (cardEl.classList.contains('is-left')) {
    // Left card becomes center, center becomes right, right becomes left
    const leftCard = cards.find(c => c.classList.contains('is-left'));
    const centerCard = cards.find(c => c.classList.contains('is-center'));
    const rightCard = cards.find(c => c.classList.contains('is-right'));

    if (leftCard && centerCard && rightCard) {
      leftCard.className = 'deck-card is-center';
      centerCard.className = 'deck-card is-right';
      rightCard.className = 'deck-card is-left';
    }
  } else if (cardEl.classList.contains('is-right')) {
    // Right card becomes center, center becomes left, left becomes right
    const leftCard = cards.find(c => c.classList.contains('is-left'));
    const centerCard = cards.find(c => c.classList.contains('is-center'));
    const rightCard = cards.find(c => c.classList.contains('is-right'));

    if (leftCard && centerCard && rightCard) {
      rightCard.className = 'deck-card is-center';
      centerCard.className = 'deck-card is-left';
      leftCard.className = 'deck-card is-right';
    }
  }
  window.siteAudio?.play('tick');
}

// ── 5. ASK OVERLAY (⌘K / ALT+K) ──
const askOverlay = document.getElementById('askOverlay');
const askInput = document.getElementById('askInput');
const askText = document.getElementById('askText');
const askTitle = document.getElementById('askTitle');
const askBubble = document.getElementById('askBubble');
const askBubbleText = document.getElementById('askBubbleText');
let askSeq = 0;

function openAsk() {
  askSeq++;
  if (!askOverlay) return;
  askOverlay.classList.add('is-visible');
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => askOverlay.classList.add('is-open'));
  if (askInput) {
    askInput.value = '';
    askText.textContent = '';
    askInput.focus();
  }
  if (askTitle) askTitle.textContent = 'what do you want to ask?';
  if (askBubble) askBubble.classList.remove('is-on');
  window.siteAudio?.play('chime');
}

function closeAsk() {
  askSeq++;
  if (!askOverlay) return;
  document.documentElement.style.overflow = '';
  if (askInput) askInput.blur();
  askOverlay.classList.remove('is-open');
  setTimeout(() => askOverlay.classList.remove('is-visible'), 250);
}

if (askInput) {
  askInput.addEventListener('input', () => {
    if (askText) askText.textContent = askInput.value;
  });
  askInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAskSubmit();
    }
  });
}

async function handleAskSubmit() {
  const query = (askInput.value || '').trim();
  if (!query) return;

  if (askBubble && askBubbleText) {
    askBubbleText.textContent = query;
    askBubble.classList.add('is-on');
  }
  if (askInput) askInput.value = '';
  if (askText) askText.textContent = '';

  const qLower = query.toLowerCase();
  let answer = "I'm a senior full-stack & mobile engineer specializing in Flutter, React Native, and robust web applications.";

  if (qLower.includes('pricing') || qLower.includes('cost') || qLower.includes('rate') || qLower.includes('package')) {
    answer = "Projects range from $2,400 for an MVP Launchpad (3 weeks) to $4,800 for full-stack multi-platform systems. Zero agency markup.";
  } else if (qLower.includes('timeline') || qLower.includes('how long') || qLower.includes('turnaround')) {
    answer = "Average turnaround is 3 to 5 weeks from approved screen wireframes to live on the Apple App Store & Google Play.";
  } else if (qLower.includes('tech') || qLower.includes('stack') || qLower.includes('framework')) {
    answer = "I build in Flutter, React Native, Swift, Kotlin, Next.js, Node.js, Laravel, Supabase, Firebase, and PostgreSQL.";
  } else if (qLower.includes('contact') || qLower.includes('hire') || qLower.includes('whatsapp') || qLower.includes('email')) {
    answer = "You can chat with me directly on WhatsApp at +92 345 6575495 or email applyforhamza@gmail.com.";
  } else {
    // Playful browser sniff reveal like Bryl Lim's easter egg!
    const ua = navigator.userAgent;
    const browser = /Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : /Firefox/.test(ua) ? 'Firefox' : 'your browser';
    const os = /Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone/.test(ua) ? 'iOS' : 'your device';
    answer = `You are browsing on ${os} via ${browser}. I can build custom software tailored specifically for your users across all devices.`;
  }

  if (askTitle) {
    askTitle.textContent = "analyzing...";
    setTimeout(() => {
      askTitle.textContent = answer;
      window.siteAudio?.play('droplet');
    }, 700);
  }
}

// ── 6. TYPING TEST (⌘J / ALT+J) ──
const typingOverlay = document.getElementById('typingOverlay');
const ttWordsDisplay = document.getElementById('ttWordsDisplay');
const ttWpmEl = document.getElementById('ttWpm');
const ttAccEl = document.getElementById('ttAcc');
const ttTimeEl = document.getElementById('ttTime');

const TEST_TEXT = "shipping clean production software with zero fluff and maximum speed for startups worldwide";
let ttIndex = 0;
let ttStartTime = 0;
let ttTimer = null;
let ttErrors = 0;

function openTyping() {
  if (!typingOverlay) return;
  typingOverlay.classList.add('is-visible');
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => typingOverlay.classList.add('is-open'));
  resetTypingTest();
  window.siteAudio?.play('chime');
}

function closeTyping() {
  if (!typingOverlay) return;
  document.documentElement.style.overflow = '';
  clearInterval(ttTimer);
  typingOverlay.classList.remove('is-open');
  setTimeout(() => typingOverlay.classList.remove('is-visible'), 250);
}

function resetTypingTest() {
  ttIndex = 0;
  ttStartTime = 0;
  ttErrors = 0;
  clearInterval(ttTimer);
  if (ttWpmEl) ttWpmEl.textContent = '0';
  if (ttAccEl) ttAccEl.textContent = '100';
  if (ttTimeEl) ttTimeEl.textContent = '0s';

  if (ttWordsDisplay) {
    ttWordsDisplay.innerHTML = TEST_TEXT.split('').map((char, i) => 
      `<span class="tt-char ${i === 0 ? 'tt-caret' : ''}" data-idx="${i}">${char}</span>`
    ).join('');
  }
}

document.addEventListener('keydown', (e) => {
  // Global Hotkeys: ⌘K or Alt+K
  if ((e.metaKey || e.altKey) && e.code === 'KeyK') {
    e.preventDefault();
    askOverlay?.classList.contains('is-visible') ? closeAsk() : openAsk();
    return;
  }
  // Global Hotkeys: ⌘J or Alt+J
  if ((e.metaKey || e.altKey) && e.code === 'KeyJ') {
    e.preventDefault();
    typingOverlay?.classList.contains('is-visible') ? closeTyping() : openTyping();
    return;
  }
  // Escape closes modals
  if (e.key === 'Escape') {
    if (askOverlay?.classList.contains('is-visible')) closeAsk();
    if (typingOverlay?.classList.contains('is-visible')) closeTyping();
    closeGalleryModal();
    return;
  }

  // Handle typing test input
  if (typingOverlay?.classList.contains('is-visible')) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1 || e.key === 'Backspace') {
      e.preventDefault();
      handleTypingKey(e.key);
    }
  }
});

function handleTypingKey(key) {
  if (ttIndex >= TEST_TEXT.length) return;
  if (!ttStartTime) {
    ttStartTime = Date.now();
    ttTimer = setInterval(updateTypingStats, 200);
  }

  const chars = ttWordsDisplay.querySelectorAll('.tt-char');
  if (key === 'Backspace') {
    if (ttIndex > 0) {
      chars[ttIndex]?.classList.remove('tt-caret');
      ttIndex--;
      chars[ttIndex].className = 'tt-char tt-caret';
      window.siteAudio?.play('tick');
    }
    return;
  }

  const targetChar = TEST_TEXT[ttIndex];
  if (key === targetChar) {
    chars[ttIndex].className = 'tt-char correct';
    window.siteAudio?.play('tick');
  } else {
    chars[ttIndex].className = 'tt-char incorrect';
    ttErrors++;
    window.siteAudio?.play('droplet');
  }

  ttIndex++;
  if (ttIndex < TEST_TEXT.length) {
    chars[ttIndex]?.classList.add('tt-caret');
  } else {
    // Finished!
    clearInterval(ttTimer);
    updateTypingStats();
    window.siteAudio?.play('chime');
  }
}

function updateTypingStats() {
  if (!ttStartTime) return;
  const elapsedSec = Math.max(0.5, (Date.now() - ttStartTime) / 1000);
  const wpm = Math.round((ttIndex / 5) / (elapsedSec / 60));
  const accuracy = Math.max(0, Math.round(((ttIndex - ttErrors) / Math.max(1, ttIndex)) * 100));

  if (ttWpmEl) ttWpmEl.textContent = String(wpm);
  if (ttAccEl) ttAccEl.textContent = String(accuracy);
  if (ttTimeEl) ttTimeEl.textContent = Math.round(elapsedSec) + 's';
}

// ── 7. SCREENSHOT GALLERY LIGHTBOX ──
let activeGallery = [];
let currentGalleryIdx = 0;

function openGalleryModal(projectKey, initialIndex = 0) {
  const gallery = projectGalleries[projectKey];
  if (!gallery || !gallery.images || gallery.images.length === 0) return;

  activeGallery = gallery.images;
  currentGalleryIdx = initialIndex;

  const modal = document.getElementById('lightboxModal');
  const title = document.getElementById('lightboxTitle');
  const img = document.getElementById('lightboxImg');
  const thumbs = document.getElementById('lightboxThumbs');

  if (title) title.textContent = gallery.title;
  if (img) img.src = activeGallery[currentGalleryIdx];

  if (thumbs) {
    thumbs.innerHTML = activeGallery.map((src, idx) => `
      <div class="lightbox-thumb ${idx === currentGalleryIdx ? 'active' : ''}" onclick="selectGalleryIndex(${idx})">
        <img src="${src}" alt="Thumb ${idx + 1}" loading="lazy">
      </div>
    `).join('');
  }

  if (modal) modal.classList.add('is-active');
  document.documentElement.style.overflow = 'hidden';
  window.siteAudio?.play('tick');

  if (typeof gtag === 'function') {
    gtag('event', 'inspect_gallery', {
      event_category: 'engagement',
      project_key: projectKey,
      gallery_title: gallery.title
    });
  }
}

function closeGalleryModal() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('is-active');
  document.documentElement.style.overflow = '';
}

function selectGalleryIndex(idx) {
  if (idx < 0 || idx >= activeGallery.length) return;
  currentGalleryIdx = idx;
  const img = document.getElementById('lightboxImg');
  if (img) img.src = activeGallery[currentGalleryIdx];

  const thumbs = document.querySelectorAll('.lightbox-thumb');
  thumbs.forEach((t, i) => t.classList.toggle('active', i === currentGalleryIdx));
  window.siteAudio?.play('tick');
}

function nextGalleryImage(step) {
  if (activeGallery.length === 0) return;
  let nextIdx = (currentGalleryIdx + step) % activeGallery.length;
  if (nextIdx < 0) nextIdx = activeGallery.length - 1;
  selectGalleryIndex(nextIdx);
}

// ── 8. SCOPE ESTIMATOR ENGINE ──
const scopeItems = {
  mobile_app: { name: "iOS & Android App", weeks: 2.5, price: 1400, selected: true },
  web_portal: { name: "Web SaaS Platform", weeks: 1.5, price: 900, selected: true },
  cloud_backend: { name: "Scalable Database & APIs", weeks: 1.0, price: 600, selected: true },
  auth_roles: { name: "User Accounts & Security", weeks: 0.5, price: 350, selected: true },
  stripe_pay: { name: "Stripe Online Payments", weeks: 0.8, price: 500, selected: false },
  realtime_sync: { name: "Live Push Alerts & Sync", weeks: 0.8, price: 550, selected: false },
  app_store_launch: { name: "Apple & Google Submission", weeks: 0.5, price: 350, selected: true }
};

function toggleScope(key, chipEl) {
  if (scopeItems[key]) {
    scopeItems[key].selected = !scopeItems[key].selected;
    chipEl.classList.toggle('is-selected', scopeItems[key].selected);
    recalcEstimator();
    window.siteAudio?.play('tick');
  }
}

function recalcEstimator() {
  let weeks = 0;
  let price = 0;
  let selected = [];

  for (const [key, item] of Object.entries(scopeItems)) {
    if (item.selected) {
      weeks += item.weeks;
      price += item.price;
      selected.push(item.name);
    }
  }

  if (price === 0) {
    price = 1200;
    weeks = 2;
  }

  const minW = Math.max(2, Math.round(weeks * 0.85));
  const maxW = Math.max(minW + 1, Math.round(weeks * 1.15));
  const minP = Math.round(price * 0.9);
  const maxP = Math.round(price * 1.15);

  const budgetEl = document.getElementById('estBudgetValue');
  const timeEl = document.getElementById('estTimeValue');
  const btn = document.getElementById('estWhatsappBtn');

  if (budgetEl) budgetEl.textContent = `$${minP.toLocaleString()} – $${maxP.toLocaleString()}`;
  if (timeEl) timeEl.textContent = `🚀 Delivery: ${minW} to ${maxW} Weeks`;

  if (btn) {
    const text = encodeURIComponent(
      `Hi Hamza! I configured my project scope on your portfolio:\n` +
      `- Scope: ${selected.slice(0, 3).join(', ')}...\n` +
      `- Budget Range: $${minP} - $${maxP}\n` +
      `- Delivery: ${minW}-${maxW} wks\n` +
      `Let's discuss building this.`
    );
    btn.href = `https://wa.me/923456575495?text=${text}`;
  }
}

// ── 9. FAQ ACCORDION ──
function toggleFaq(btn) {
  const entry = btn.closest('.faq-entry');
  if (!entry) return;
  const wasActive = entry.classList.contains('is-active');

  document.querySelectorAll('.faq-entry').forEach(el => {
    el.classList.remove('is-active');
    const body = el.querySelector('.faq-body');
    if (body) body.style.maxHeight = null;
  });

  if (!wasActive) {
    entry.classList.add('is-active');
    const body = entry.querySelector('.faq-body');
    if (body) body.style.maxHeight = body.scrollHeight + 'px';
  }
  window.siteAudio?.play('tick');
}

// ── 10. MOBILE NAV DRAWER ──
function openMobileNav() {
  const nav = document.getElementById('mobileNavOverlay');
  if (!nav) return;
  nav.style.display = 'flex';
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => nav.classList.add('is-open'));
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNavOverlay');
  if (!nav) return;
  document.documentElement.style.overflow = '';
  nav.classList.remove('is-open');
  setTimeout(() => nav.style.display = 'none', 300);
}

// ── 11. MULTI-PAGE SPA ROUTER & CATEGORY FILTERING (BRYL LIM AESTHETIC) ──
const VALID_PAGES = ['home', 'projects', 'experience', 'stack', 'services', 'packages', 'recommendations', 'faq'];

function navigateToPage(targetPage, updateHash = true) {
  let pageId = (targetPage || '').replace(/^#/, '').toLowerCase();
  if (!VALID_PAGES.includes(pageId)) pageId = 'home';

  // Toggle active class on page views
  let matched = false;
  document.querySelectorAll('.page-view').forEach(view => {
    const isCurrent = view.id === `page-${pageId}`;
    view.classList.toggle('active', isCurrent);
    if (isCurrent) matched = true;
  });

  if (!matched) {
    const homeView = document.getElementById('page-home');
    if (homeView) homeView.classList.add('active');
    pageId = 'home';
  }

  // Update active states on sidebar navigation links (both desktop and mobile)
  document.querySelectorAll('.sidebar-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.replace(/^#/, '').toLowerCase();
    const isBrand = href === '#' || href === '#home';
    const active = (pageId === 'home' && isBrand) || (linkPage === pageId);
    link.classList.toggle('active', active);
  });

  // Dynamic titles
  const pageTitles = {
    home: 'Hamza Shahid — Senior Full-Stack & Mobile Product Engineer',
    projects: 'Projects — Hamza Shahid',
    experience: 'Experience — Hamza Shahid',
    stack: 'Tech Stack — Hamza Shahid',
    services: 'What I Build — Hamza Shahid',
    packages: 'Packages & Estimator — Hamza Shahid',
    recommendations: 'Founder Reviews — Hamza Shahid',
    faq: 'FAQ — Hamza Shahid'
  };
  if (pageTitles[pageId]) {
    document.title = pageTitles[pageId];
  }

  // Instant scroll to top without flicker
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update URL hash
  if (updateHash) {
    if (pageId === 'home') {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    } else {
      if (window.location.hash !== `#${pageId}`) {
        history.pushState(null, '', `#${pageId}`);
      }
    }
  }

  // Send virtual page_view to Firebase Analytics
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pageId === 'home' ? '/' : `/${pageId}`
    });
  }

  window.siteAudio?.play('tick');
  closeMobileNav();
}

function filterProjects(cat, btn) {
  document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const rows = document.querySelectorAll('.project-row[data-category]');
  rows.forEach(row => {
    const c = row.getAttribute('data-category') || '';
    if (cat === 'all' || c.includes(cat)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });

  window.siteAudio?.play('tick');
}

// Global click delegation for hash links
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const href = target.getAttribute('href');
  if (!href) return;
  const hash = href.replace(/^#/, '').toLowerCase();
  if (VALID_PAGES.includes(hash) || hash === '' || hash === 'home') {
    e.preventDefault();
    navigateToPage(hash || 'home');
  }
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace(/^#/, '');
  navigateToPage(hash || 'home', false);
});

// Init when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  recalcEstimator();
  // Adjust mod key hint (⌘ for Mac, Alt for Windows)
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  document.querySelectorAll('.ask-mod-key').forEach(el => {
    el.textContent = isMac ? '⌘' : 'Alt';
  });

  // Handle direct hash navigation or pathname navigation on initial page load (e.g., #projects or projects.html)
  const initialHash = window.location.hash.replace(/^#/, '');
  const pathPage = (window.location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase();

  if (initialHash && VALID_PAGES.includes(initialHash.toLowerCase())) {
    navigateToPage(initialHash, false);
  } else if (pathPage && VALID_PAGES.includes(pathPage)) {
    navigateToPage(pathPage, false);
  }

  // Global Conversion Tracking (WhatsApp, Email, Resume)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('wa.me')) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_whatsapp', {
          event_category: 'conversion',
          channel: 'whatsapp',
          link_url: href
        });
      }
    } else if (href.startsWith('mailto:')) {
      if (typeof gtag === 'function') {
        gtag('event', 'click_email', {
          event_category: 'conversion',
          channel: 'email',
          email_address: href.replace('mailto:', '')
        });
      }
    } else if (href.includes('resume.pdf')) {
      if (typeof gtag === 'function') {
        gtag('event', 'download_resume', {
          event_category: 'engagement',
          file_name: 'resume.pdf'
        });
      }
    }
  });
});
