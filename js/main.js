
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  if (toggle && drawer) toggle.addEventListener('click', () => drawer.classList.toggle('hidden'));

  if (window.AOS) AOS.init({ once: true, offset: 60, duration: 600, easing: 'ease-out' });
});

// Parallax
(function(){
  const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!nodes.length) return;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    nodes.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed') || '0.3');
      const t = clamp(y * speed, -300, 300);
      el.style.transform = `translate3d(0, ${t}px, 0)`;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Prefill Contact
(function(){
  try {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const item = params.get('item');
    const form = document.querySelector('form');
    if (!form) return;
    const messageEl = form.querySelector('textarea[name="message"]');
    const vehicleEl = form.querySelector('input[name="vehicle"]');
    if (!messageEl) return;

    const templates = {
      "General Repair": (item) => `Service: General Repair\nSub-service: ${item || "[choose]"}\nVehicle: [Year Make Model]\nSymptoms/Notes: [describe] \nPreferred date/time: [two options]\n\nIntake Questions:\n- Any warning lights? [Y/N]\n- Any recent work done? [details]\n- Noises/Smells/Vibrations? [describe]\n`,
      "Performance Mods": (item) => `Service: Suspension & Handling\nItem: ${item || "[springs/coilovers/bushings/alignment]"}\nVehicle: [Year Make Model]\nParts: [I have parts / Need sourcing]\nGoals: [ride/handling]\nPreferred date/time: [two options]\n\nIntake Questions:\n- Any warning lights? [Y/N]\n- Any recent work done? [details]\n- Noises/Smells/Vibrations? [describe]\n`,
      "Parts Sales": (item) => `Service: Parts Sourcing\nLooking for: ${item || "[part name]"}\nNew/Used: [new/used/either]\nBudget: [$]\nNeed install: [yes/no]\n`,
    };

    if (service && templates[service]) {
      messageEl.value = templates[service](item);
      if (vehicleEl) vehicleEl.focus();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (e) {}
})();

// Quick Actions: bubble <-> bar with scroll-direction morph + synced open/close
(function(){
  const root = document.querySelector('[data-qa-root]');
  if (!root) return;

  const fab = root.querySelector('[data-qa-toggle]');
  const panel = root.querySelector('[data-qa-panel]');
  const barWrap = root.querySelector('[data-qa-barwrap]');
  const bar = root.querySelector('[data-qa-bar]');

  let mode = 'bubble'; // 'bubble' | 'bar'
  let open = false;
  let lastY = window.scrollY;

  const openPanel = () => {
    panel.classList.remove('qa-panel--closed');
    panel.classList.add('qa-panel--open');
    open = true;
  };

  const closePanel = () => {
    panel.classList.remove('qa-panel--open');
    panel.classList.add('qa-panel--closed');
    open = false;
  };

  const setMode = (next) => {
    if (mode === next) return;
    mode = next;
    if (mode === 'bubble') {
      // show fab bubble, hide rectangular bar
      barWrap.classList.add('qa-hidden');
    } else {
      // show rectangular bar, hide panel if open
      closePanel();
      barWrap.classList.remove('qa-hidden');
    }
  };

  // Toggle mini panel on bubble
  if (fab && panel) {
    fab.addEventListener('click', () => {
      open ? closePanel() : openPanel();
    });
  }

  // Close any open UI when scrolling, and morph by direction
  const onScroll = () => {
    const y = window.scrollY;
    const dir = y > lastY ? 'down' : 'up';
    lastY = y;

    if (open) closePanel();             // close mini panel if open
    // Morph:
    // - scrolling down -> bubble
    // - scrolling up   -> bar (splits into two buttons + disclaimer)
    setMode(dir === 'down' ? 'bubble' : 'bar');
  };

  // Throttle via rAF for smoothness
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }, { passive:true });

  // init
  setMode('bubble');
  closePanel();
})();

