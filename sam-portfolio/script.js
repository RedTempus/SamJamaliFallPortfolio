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
