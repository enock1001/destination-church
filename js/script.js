const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Slide-in reveal when scrolled into view */
const revealEls = document.querySelectorAll('.reveal-slide, .reveal-fade-up');
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

const navLinks = document.querySelectorAll('.nav a');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

window.addEventListener('scroll', () => {
  let current = sections[0];
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) {
      current = section;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (current && link.getAttribute('href') === `#${current.id}`) {
      link.classList.add('active');
    }
  });
});

/* Prayer / Testimony form -> WhatsApp */
const WHATSAPP_NUMBER = '233244254607';
const prayerForm = document.getElementById('prayerForm');

if (prayerForm) {
  prayerForm.querySelectorAll('button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = prayerForm.querySelector('input[type="text"]').value.trim();
      const phone = prayerForm.querySelector('input[type="tel"]').value.trim();
      const message = prayerForm.querySelector('textarea').value.trim();

      if (!name || !phone || !message) {
        prayerForm.reportValidity();
        return;
      }

      const type = btn.dataset.type === 'testimony' ? 'Testimony' : 'Prayer Request';
      const text = `Hello Destination Church,\n\nType: ${type}\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });
  });
}

/* Sermon video + Watch Live */
const sermonVideo = document.getElementById('sermonVideo');
const sermonTabs = document.querySelectorAll('.sermon-tab');
const sermonEyebrow = document.getElementById('sermonEyebrow');
const sermonTitle = document.getElementById('sermonTitle');
const sermonDate = document.getElementById('sermonDate');
const sermonMoreLink = document.querySelector('.sermon-info .btn-gold');

if (sermonVideo) {
  const channelId = sermonVideo.dataset.channelId;

  let latest = {
    videoId: sermonVideo.dataset.videoId,
    title: sermonTitle.textContent,
    dateLabel: sermonDate.textContent.trim()
  };

  const thumbUrlFor = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  const showLatestThumb = () => {
    sermonVideo.innerHTML = `
      <img src="${thumbUrlFor(latest.videoId)}" alt="Sermon thumbnail" class="sermon-thumb" id="sermonThumb">
      <div class="sermon-play" id="sermonPlay"><i class="fa-solid fa-play"></i></div>
    `;
  };

  const playLatestSermon = () => {
    sermonVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${latest.videoId}?autoplay=1&playsinline=1" title="Sermon video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  };

  const playLive = () => {
    sermonVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&playsinline=1" title="Live service" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  };

  const isOnLatestTab = () => document.querySelector('.sermon-tab[data-tab="latest"]').classList.contains('active');

  sermonVideo.addEventListener('click', () => {
    if (sermonVideo.querySelector('.sermon-play')) playLatestSermon();
  });
  sermonVideo.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && sermonVideo.querySelector('.sermon-play')) {
      e.preventDefault();
      playLatestSermon();
    }
  });

  sermonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sermonTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'live') {
        playLive();
        sermonEyebrow.textContent = 'LIVE NOW';
        sermonTitle.textContent = 'Join Our Live Service';
        sermonDate.innerHTML = '<i class="fa-regular fa-calendar"></i> Streaming live from Destination Church';
      } else {
        showLatestThumb();
        sermonEyebrow.textContent = 'LATEST SERMON';
        sermonTitle.textContent = latest.title;
        sermonDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${latest.dateLabel}`;
      }
    });
  });

  // Auto-fetch the newest upload from the channel via our Netlify Function
  // (falls back silently to the sermon set in the HTML if it's not available,
  // e.g. when previewing locally without `netlify dev`)
  fetch('/.netlify/functions/latest-sermon')
    .then(res => {
      if (!res.ok) throw new Error('not available');
      return res.json();
    })
    .then(data => {
      if (!data.videoId) return;

      const publishedAt = new Date(data.published);
      const newDateLabel = publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      latest = { videoId: data.videoId, title: data.title, dateLabel: newDateLabel };

      if (sermonMoreLink) sermonMoreLink.href = `https://www.youtube.com/watch?v=${data.videoId}`;

      if (isOnLatestTab()) {
        sermonTitle.textContent = data.title;
        sermonDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${newDateLabel}`;
        if (sermonVideo.querySelector('.sermon-play')) showLatestThumb();
      }
    })
    .catch(() => {
      // Silently keep the fallback sermon set in the HTML
    });
}

/* Gallery Lightbox */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');

if (galleryItems.length && lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const photos = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  let currentIndex = 0;

  const showPhoto = (index) => {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
  };

  const openLightbox = (index) => {
    showPhoto(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showPhoto(currentIndex - 1));
  lightboxNext.addEventListener('click', () => showPhoto(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}

/* Giving Modal */
const giveOnlineBtn = document.getElementById('giveOnlineBtn');
const givingModal = document.getElementById('givingModal');

if (giveOnlineBtn && givingModal) {
  const givingModalClose = document.getElementById('givingModalClose');

  const openGivingModal = () => {
    givingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeGivingModal = () => {
    givingModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  giveOnlineBtn.addEventListener('click', openGivingModal);
  givingModalClose.addEventListener('click', closeGivingModal);

  givingModal.addEventListener('click', (e) => {
    if (e.target === givingModal) closeGivingModal();
  });

  document.addEventListener('keydown', (e) => {
    if (givingModal.classList.contains('open') && e.key === 'Escape') closeGivingModal();
  });

  givingModal.querySelectorAll('.giving-method').forEach(method => {
    const copyBtn = method.querySelector('.giving-copy-btn');
    const value = method.dataset.copy;

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(value).then(() => {
        const icon = copyBtn.querySelector('i');
        copyBtn.classList.add('copied');
        icon.className = 'fa-solid fa-check';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          icon.className = 'fa-regular fa-copy';
        }, 1500);
      });
    });
  });
}
