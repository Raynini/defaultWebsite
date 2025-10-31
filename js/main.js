
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  if (toggle && drawer) toggle.addEventListener('click', () => drawer.classList.toggle('hidden'));

  if (window.AOS) AOS.init({ once: true, offset: 60, duration: 600, easing: 'ease-out' });

  // ==== Sticky Quick Actions (bubble <-> bar) ====
  const root = document.querySelector('[data-qa-root]');
  if (root) {
    const markup = [
      '<div class="qa-bubble">',
        '<button class="qa-fab" data-qa-toggle aria-label="Open quick actions">⋮</button>',
        '<div class="qa-panel qa-panel--closed" data-qa-panel>',
          '<div class="qa-card">',
            '<a href="contact.html" class="qa-btn qa-btn--ghost">Get a Quote</a>',
            '<a href="tel:REPLACE_WITH_YOUR_NUMBER" class="qa-btn qa-btn--solid">Call Now</a>',
            '<div class="qa-note">Appointment only</div>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="qa-bar qa-hidden" data-qa-barwrap>',
        '<div class="qa-bar-inner" data-qa-bar>',
          '<div class="qa-bar-grid">',
            '<a href="contact.html" class="qa-bar-btn">Get a Quote</a>',
            '<a href="tel:REPLACE_WITH_YOUR_NUMBER" class="qa-bar-btn qa-bar-btn--solid">Call Now</a>',
          '</div>',
          '<div class="qa-bar-note">Appointment only</div>',
        '</div>',
      '</div>'
    ].join('');
    root.insertAdjacentHTML('beforeend', markup);

    const fab = root.querySelector('[data-qa-toggle]');
    const panel = root.querySelector('[data-qa-panel]');
    const barWrap = root.querySelector('[data-qa-barwrap]');

    let mode = 'bubble'; // 'bubble' | 'bar'
    let open = false;
    let lastY = window.scrollY;

    const openPanel = () => { panel.classList.remove('qa-panel--closed'); panel.classList.add('qa-panel--open'); open = true; };
    const closePanel = () => { panel.classList.remove('qa-panel--open'); panel.classList.add('qa-panel--closed'); open = false; };
    const setMode = (next) => {
      if (mode === next) return;
      mode = next;
      if (mode === 'bubble') {
        barWrap.classList.add('qa-hidden');
      } else {
        closePanel();
        barWrap.classList.remove('qa-hidden');
      }
    };

    if (fab && panel) fab.addEventListener('click', () => (open ? closePanel() : openPanel()));

    const onScroll = () => {
      const yNow = window.scrollY || 0;
      const dir = yNow > lastY ? 'down' : 'up';
      lastY = yNow;
      if (open) closePanel();
      setMode(dir === 'down' ? 'bubble' : 'bar');
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onScroll(); ticking = false; });
    }, { passive:true });

    // Initial state
    setMode('bubble');
    closePanel();
  }
});
