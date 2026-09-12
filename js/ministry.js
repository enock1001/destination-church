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

/* Ministry photo gallery: crossfade / rise-up / converge / diagonal slideshow */
document.querySelectorAll('.ministry-slideshow:not(.ministry-slideshow-particles)').forEach(container => {
  const slides = container.querySelectorAll('.ministry-slide');
  if (!slides.length) return;
  let index = 0;
  let z = 1;
  slides[0].style.zIndex = z;
  slides[0].classList.add('active');
  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    z += 1;
    slides[index].style.zIndex = z;
    slides[index].classList.add('active');
  }, 4000);
});

/* Ministry photo gallery: zoom-in/out then shatter into particles */
document.querySelectorAll('.ministry-slideshow-particles').forEach(container => {
  const slides = Array.from(container.querySelectorAll('.ministry-slide'));
  if (!slides.length) return;

  const cols = 6;
  const rows = 4;

  const shatter = (slide, onDone) => {
    const overlay = document.createElement('div');
    overlay.className = 'particle-overlay';
    const tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = document.createElement('div');
        tile.className = 'particle-tile';
        tile.style.backgroundImage = slide.style.backgroundImage;
        tile.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
        tile.style.backgroundPosition = `${(c / (cols - 1)) * 100}% ${(r / (rows - 1)) * 100}%`;
        tile.style.left = `${(c / cols) * 100}%`;
        tile.style.top = `${(r / rows) * 100}%`;
        tile.style.width = `${100 / cols}%`;
        tile.style.height = `${100 / rows}%`;
        overlay.appendChild(tile);
        tiles.push(tile);
      }
    }
    slide.appendChild(overlay);
    slide.style.opacity = '0';

    requestAnimationFrame(() => {
      tiles.forEach(tile => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 140;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 220;
        tile.style.transition = `transform 1.1s ease-in ${Math.random() * 0.2}s, opacity 1.1s ease-in ${Math.random() * 0.2}s`;
        tile.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        tile.style.opacity = '0';
      });
    });

    setTimeout(() => {
      overlay.remove();
      slide.style.opacity = '';
      onDone();
    }, 1500);
  };

  let index = 0;
  slides[0].style.zIndex = '10';
  slides[0].classList.add('active');

  const cycle = () => {
    const current = slides[index];
    shatter(current, () => {
      current.classList.remove('active');
      index = (index + 1) % slides.length;
      const next = slides[index];
      next.style.zIndex = String(10 + index);
      next.classList.add('active');
    });
  };

  setInterval(cycle, 4700);
});
