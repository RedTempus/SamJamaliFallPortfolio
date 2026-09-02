const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
}

document.querySelectorAll('[data-year]').forEach((item) => item.textContent = new Date().getFullYear());

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('in-view');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// Keep the decorative background at the same point in its cycle between pages.
const background = document.querySelector('.circuit-bg');
if (background) {
  const storageKey = 'sam-portfolio-background-epoch';
  let epoch = Number(sessionStorage.getItem(storageKey));
  if (!epoch || epoch > Date.now()) {
    epoch = Date.now();
    sessionStorage.setItem(storageKey, String(epoch));
  }
  background.style.setProperty('--animation-offset', `${-(Date.now() - epoch) / 1000}s`);
}

// A Home link on the Home page returns to the top without reloading or restarting animation.
const onHomePage = /(?:\/|index\.html)$/i.test(window.location.pathname);
if (onHomePage) {
  document.querySelectorAll('a[href="index.html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Center the contact details after following the conversation link.
if (window.location.hash === '#contact-details') {
  const contactDetails = document.querySelector('#contact-details');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    contactDetails?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }));
}

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const current = carousel.querySelector('.carousel-current');
  const total = carousel.querySelector('.carousel-total');
  let index = 0;
  let touchStartX = null;

  total.textContent = slides.length;
  const showSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === index));
    current.textContent = index + 1;
  };

  previous.addEventListener('click', () => showSlide(index - 1));
  next.addEventListener('click', () => showSlide(index + 1));
  carousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 40) showSlide(index + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
});
