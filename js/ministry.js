const hamburger = document.getElementById('hamburger');
const moreMenu = document.getElementById('moreMenu');

hamburger.addEventListener('click', () => {
  moreMenu.classList.toggle('open');
});

moreMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => moreMenu.classList.remove('open'));
});

const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Reveal photo when scrolled into view */
const revealEls = document.querySelectorAll('.reveal-slide, .reveal-fade-up, .reveal-slide-lr');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

/* Ministry photo gallery: crossfade slideshow */
const ministrySlides = document.querySelectorAll('.ministry-slide');
if (ministrySlides.length) {
  let ministryIndex = 0;
  ministrySlides[0].classList.add('active');
  setInterval(() => {
    ministrySlides[ministryIndex].classList.remove('active');
    ministryIndex = (ministryIndex + 1) % ministrySlides.length;
    ministrySlides[ministryIndex].classList.add('active');
  }, 4000);
}
