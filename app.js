'use strict';

const services = {
  corte: { name: 'Corte autoral', minutes: 45, price: 95 },
  barba: { name: 'Barba no traço', minutes: 35, price: 70 },
  combo: { name: 'Corte & barba', minutes: 75, price: 150 },
  ritual: { name: 'Tempo VINCO', minutes: 90, price: 195 }
};
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

let dialogOrigin = null;
const dialogs = document.querySelectorAll('dialog');
function openDialog(dialog, origin) {
  dialogOrigin = origin;
  closeMenu();
  dialog.showModal();
  document.body.classList.add('modal-open');
}
dialogs.forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (dialogOrigin && dialogOrigin.isConnected) dialogOrigin.focus();
  });
});

const booking = document.querySelector('#booking-dialog');
const form = document.querySelector('#booking-form');
const serviceSelect = document.querySelector('#service');
const dateInput = document.querySelector('#booking-date');
const timeSelect = document.querySelector('#booking-time');
const errorText = document.querySelector('#form-error');
const summary = document.querySelector('#booking-summary');
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const dateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
const part = type => dateParts.find(p => p.type === type).value;
const today = `${part('year')}-${part('month')}-${part('day')}`;
function parseDate(value) { return new Date(`${value}T12:00:00Z`); }
function dateString(date) { return date.toISOString().slice(0, 10); }
function isOpen(value) { return value && ![0, 1].includes(parseDate(value).getUTCDay()); }
const maxDate = parseDate(today);
maxDate.setUTCDate(maxDate.getUTCDate() + 30);
dateInput.min = today;
dateInput.max = dateString(maxDate);
const firstDay = parseDate(today);
while (!isOpen(dateString(firstDay))) firstDay.setUTCDate(firstDay.getUTCDate() + 1);
dateInput.value = dateString(firstDay);

function updateTimes() {
  const previous = timeSelect.value;
  timeSelect.replaceChildren(new Option('Escolha um horário', ''));
  dateInput.setCustomValidity('');
  errorText.hidden = true;
  if (!dateInput.value) return;
  if (!isOpen(dateInput.value)) {
    dateInput.setCustomValidity('Na demonstração, os dias de atendimento são de terça a sábado.');
    errorText.textContent = 'Escolha um dia de terça a sábado para continuar.';
    errorText.hidden = false;
    return;
  }
  const saturday = parseDate(dateInput.value).getUTCDay() === 6;
  const start = (saturday ? 9 : 10) * 60;
  const end = (saturday ? 18 : 20) * 60;
  for (let minutes = start; minutes + services[serviceSelect.value].minutes <= end; minutes += 60) {
    const label = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:00`;
    timeSelect.add(new Option(label, label));
  }
  if ([...timeSelect.options].some(option => option.value === previous)) timeSelect.value = previous;
}
dateInput.addEventListener('change', updateTimes);
serviceSelect.addEventListener('change', updateTimes);
updateTimes();

document.querySelectorAll('[data-book]').forEach(button => {
  button.addEventListener('click', () => {
    if (services[button.dataset.book]) serviceSelect.value = button.dataset.book;
    form.hidden = false;
    summary.hidden = true;
    updateTimes();
    openDialog(booking, button);
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const selection = services[serviceSelect.value];
  if (!form.reportValidity() || !selection || !isOpen(dateInput.value)) return;
  const day = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(parseDate(dateInput.value));
  document.querySelector('#summary-details').textContent = `${selection.name} · ${selection.minutes} minutos · ${money.format(selection.price)}. ${day}, às ${timeSelect.value}. Todos os valores e horários são ilustrativos.`;
  form.hidden = true;
  summary.hidden = false;
  document.querySelector('#edit-booking').focus();
});
document.querySelector('#edit-booking').addEventListener('click', () => {
  form.hidden = false;
  summary.hidden = true;
  serviceSelect.focus();
});

const galleryImages = {
  portrait: { src: 'assets/portrait-1024.webp', avif: 'assets/portrait-1024.avif', alt: 'Retrato de homem negro com corte crespo e acabamento preciso', title: '01 / Textura & personalidade — O traço respeita você.', width: 1024, height: 1536 },
  studio: { src: 'assets/studio-1440.webp', avif: 'assets/studio-1440.avif', alt: 'Ambiente conceitual VINCO com cadeiras verdes, madeira e luz natural', title: '02 / Espaço para desacelerar — Menos ruído. Mais tempo.', width: 1440, height: 960 },
  ritual: { src: 'assets/ritual-1024.webp', avif: 'assets/ritual-1024.avif', alt: 'Detalhe da navalha e espuma no acabamento de barba', title: '03 / Precisão de perto — Cuidado em cada contorno.', width: 1024, height: 1536 }
};
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    const photo = galleryImages[button.dataset.gallery];
    const img = document.querySelector('#gallery-full-image');
    document.querySelector('#gallery-full-source').srcset = photo.avif;
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = photo.width;
    img.height = photo.height;
    document.querySelector('#gallery-dialog-title').textContent = photo.title;
    openDialog(document.querySelector('#gallery-dialog'), button);
  });
});
document.querySelector('[data-legal]').addEventListener('click', event => openDialog(document.querySelector('#legal-dialog'), event.currentTarget));
document.querySelector('#year').textContent = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', year: 'numeric' }).format(new Date());

// Entradas independentes: o conteúdo permanece disponível sem animação ou JavaScript.
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const compactScreen = matchMedia('(max-width: 720px)');
  const choreography = new Map();
  const active = new Map();

  function register(selector, options = {}) {
    document.querySelectorAll(selector).forEach((element, index) => {
      choreography.set(element, {
        direction: 'up', distance: 54, duration: 950, delay: 0, scale: 1, roll: 0,
        ...(typeof options === 'function' ? options(index) : options)
      });
    });
  }

  // A abertura ganha uma sequência própria, sem esperar pelo scroll.
  register('.hero-photo', { type: 'photo', scale: 1.075, duration: 1800 });
  register('.hero-copy .eyebrow', { direction: 'left', distance: 65, delay: 60 });
  register('.hero-title-line', index => ({ distance: 85, delay: 120 + index * 145, duration: 1100 }));
  register('.hero-description', { distance: 40, delay: 460 });
  register('.hero-actions > .button', { direction: 'left', distance: 70, delay: 620 });
  register('.hero-actions > .text-link', { direction: 'right', distance: 65, delay: 780 });
  register('.hero-blade', { type: 'icon', direction: 'right', distance: 110, roll: 35, scale: .35, delay: 340, duration: 1250 });
  register('.hero-caption > span', index => ({ direction: index ? 'right' : 'left', distance: 40, delay: 650 + index * 100 }));
  register('.hero-scroll', { type: 'icon', direction: 'down', distance: 35, scale: .5, delay: 950 });
  register('.under-hero > span', index => ({ direction: index ? 'right' : 'left', distance: 45, delay: index * 130 }));

  register('.section-kicker > span', index => ({ direction: index % 2 ? 'right' : 'left', distance: 38, duration: 750, delay: index % 2 * 100 }));
  register('.blade-portrait', { direction: 'left', distance: 105, roll: -9, scale: .92, duration: 1200 });
  register('.blade-companion', { direction: 'right', distance: 95, roll: 11, scale: .9, delay: 170, duration: 1250 });
  register('.art-caption', { distance: 30, delay: 290 });
  register('.concept-copy > h2', { direction: 'right', distance: 75, duration: 1100 });
  register('.concept-copy > p', index => ({ distance: 38, delay: 130 + index * 100 }));
  register('.concept-copy > .text-link', { direction: 'left', distance: 48, delay: 320 });
  register('.services-heading > h2, .editorial-heading > h2, .experience-title > h2', { direction: 'left', distance: 75, duration: 1100 });
  register('.services-heading > p, .editorial-heading > p, .experience-title > p', { direction: 'right', distance: 60, delay: 160 });

  register('.service-index', index => ({ direction: 'left', distance: 50, delay: index * 90 }));
  register('.service-row > div', index => ({ direction: index % 2 ? 'right' : 'left', distance: 65, delay: 60 + index * 90 }));
  register('.service-price', index => ({ distance: 40, delay: 170 + index * 90 }));
  register('.service-time', index => ({ distance: 25, delay: 230 + index * 90 }));
  register('.service-book', index => ({ type: 'icon', direction: index % 2 ? 'left' : 'right', distance: 80, roll: index % 2 ? -32 : 32, scale: .3, delay: 280 + index * 110, duration: 1100 }));
  register('.service-footnote > span', index => ({ direction: index ? 'right' : 'left', distance: 35, delay: index * 100 }));

  register('.gallery-shot', index => ({ direction: ['left', 'right', 'up'][index], distance: 75, scale: .96, delay: index * 100, duration: 1200 }));
  register('.image-open', index => ({ type: 'icon', direction: index % 2 ? 'left' : 'right', distance: 32, scale: .4, roll: 25, delay: 430 + index * 100, duration: 1000 }));
  register('.gallery-statement', { distance: 65, roll: -7, scale: .92, delay: 200, duration: 1200 });
  register('.campaign-note', { distance: 25, delay: 160 });

  register('.experience-number', index => ({ direction: 'left', distance: 30, delay: index * 100 }));
  register('.care-icon', index => ({ type: 'icon', direction: ['left', 'right', 'up'][index], distance: 65, roll: [-32, 32, -22][index], scale: .25, delay: 100 + index * 170, duration: 1200 }));
  register('.experience-grid h3', index => ({ direction: ['left', 'up', 'right'][index], distance: 48, delay: 190 + index * 110 }));
  register('.experience-grid p', index => ({ distance: 35, delay: 300 + index * 110 }));

  register('.conversion-mark', { direction: 'right', distance: 130, roll: 12, duration: 1500 });
  register('.conversion-content > .eyebrow', { direction: 'left', distance: 55 });
  register('.conversion-content > h2', { distance: 75, scale: .96, delay: 120, duration: 1200 });
  register('.conversion-content > .button', { direction: 'right', distance: 65, delay: 370 });
  register('.conversion-note', { distance: 25, delay: 480 });
  register('.contact-intro > h2', { direction: 'left', distance: 70, duration: 1100 });
  register('.contact-intro > p', { distance: 35, delay: 160 });
  register('.contact-intro > .text-link', { direction: 'left', distance: 45, delay: 280 });
  register('.contact-details > div', index => ({ direction: index % 2 ? 'left' : 'right', distance: 55, delay: index * 120 }));
  register('.footer-top > span', { direction: 'left', distance: 40 });
  register('.footer-top nav > a', index => ({ direction: 'down', distance: 25, delay: index * 100 }));
  register('.footer-wordmark', { distance: 70, scale: .96, duration: 1300 });
  register('.footer-bottom > span, .footer-bottom > button', index => ({ distance: 25, delay: index * 100 }));
  register('main .button > span[aria-hidden], .header-book > span[aria-hidden]', { type: 'icon', direction: 'left', distance: 22, roll: -30, scale: .4, delay: 520, duration: 1000 });

  function arrive(element, options, baseline) {
    const baseTransform = baseline.transform === 'none' ? '' : baseline.transform;
    const opacity = baseline.opacity;
    const distance = options.distance * (compactScreen.matches ? .65 : 1);
    const x = options.direction === 'left' ? -distance : options.direction === 'right' ? distance : 0;
    const y = options.direction === 'up' ? distance : options.direction === 'down' ? -distance : 0;
    const transform = (dx, dy, rotation, scale) => `translate3d(${dx}px, ${dy}px, 0) rotate(${rotation}deg) scale(${scale}) ${baseTransform}`;
    let keyframes = [
      { opacity: 0, transform: transform(x, y, options.roll, options.scale) },
      { opacity, transform: transform(0, 0, 0, 1) }
    ];
    if (options.type === 'icon') {
      keyframes = [
        { opacity: 0, transform: transform(x, y, options.roll, options.scale), offset: 0 },
        { opacity, transform: transform(-x * .04, -4, -options.roll * .09, 1.08), offset: .72 },
        { opacity, transform: transform(0, 0, 0, 1), offset: 1 }
      ];
    } else if (options.type === 'photo') {
      keyframes = [{ transform: `scale(${options.scale})` }, { transform: 'scale(1)' }];
    }
    // Backwards cobre apenas a espera. Ao terminar, hover e transforms do layout retomam o controle.
    const animation = element.animate(keyframes, {
      duration: options.duration,
      delay: options.delay * (compactScreen.matches ? .8 : 1),
      easing: 'cubic-bezier(.16, 1, .3, 1)',
      fill: 'backwards'
    });
    animation.id = `vinco-arrive:${options.type || 'content'}:from-${options.direction}`;
    active.set(element, animation);
    element.classList.add('motion-active');
    const clean = () => {
      if (active.get(element) === animation) {
        active.delete(element);
        element.classList.remove('motion-active');
        animation.cancel();
      }
    };
    animation.finished.then(clean, clean);
  }

  const observer = new IntersectionObserver(entries => {
    const arrivals = [];
    // Lê todos os estilos antes de iniciar efeitos, evitando recalcular o layout entre elementos.
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const options = choreography.get(entry.target);
      if (!options) return;
      choreography.delete(entry.target);
      if (entry.target.matches(':focus-visible') || entry.target.querySelector(':focus-visible')) return;
      const style = getComputedStyle(entry.target);
      arrivals.push({ element: entry.target, options, baseline: { transform: style.transform, opacity: Number(style.opacity) } });
    });
    arrivals.forEach(({ element, options, baseline }) => {
      element.classList.add('is-visible');
      arrive(element, options, baseline);
    });
    if (!choreography.size) observer.disconnect();
  }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });

  // A coreografia começa automaticamente. Cada alvo deixa o observador após a primeira entrada.
  choreography.forEach((options, element) => observer.observe(element));
  // A navegação por teclado torna imediatamente estável o elemento que recebeu foco.
  document.addEventListener('focusin', event => {
    if (!event.target.matches(':focus-visible')) return;
    active.forEach((animation, element) => {
      if (element.contains(event.target) || event.target.contains(element)) animation.finish();
    });
  });
})();
