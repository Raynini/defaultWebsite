
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  if (toggle && drawer) toggle.addEventListener('click', () => drawer.classList.toggle('hidden'));

  if (window.AOS) AOS.init({ once: true, offset: 60, duration: 600, easing: 'ease-out' });

  // Sticky bar injection
  const root = document.querySelector('[data-qa-root]');
  if (root) {
    const markup = [
      '<div class="qa-bar" data-qa-barwrap>',
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
  }
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
      const formRect = form.getBoundingClientRect();
      if (formRect.top > 0 && formRect.top < window.innerHeight) {
        // already in view; no jump
      } else {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  } catch (e) {}
})();
