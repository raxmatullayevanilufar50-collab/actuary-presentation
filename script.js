document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayInterval = null;
  let isAutoPlay = false;

  // DOM Elements
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  const progressFill = document.getElementById('progressFill');
  const slideDotsGroup = document.getElementById('slideDotsGroup');
  const autoPlayBtn = document.getElementById('autoPlayBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const overviewBtn = document.getElementById('overviewBtn');
  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const closeOverviewBtn = document.getElementById('closeOverviewBtn');
  const presentationShell = document.getElementById('presentationShell');

  // Build dots
  function buildNavigation() {
    slideDotsGroup.innerHTML = '';
    overviewGrid.innerHTML = '';

    slides.forEach((slide, index) => {
      // Dots
      const dot = document.createElement('button');
      dot.className = `slide-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.title = `Slide ${index + 1}: ${slide.getAttribute('data-title') || ''}`;
      dot.addEventListener('click', () => {
        goToSlide(index);
        stopAutoPlay();
      });
      slideDotsGroup.appendChild(dot);

      // Overview Thumbnails
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${index === 0 ? 'current' : ''}`;
      const title = slide.getAttribute('data-title') || `Slide ${index + 1}`;
      thumb.innerHTML = `
        <div class="thumb-num">SLIDE ${String(index + 1).padStart(2, '0')}</div>
        <div class="thumb-title">${title}</div>
      `;
      thumb.addEventListener('click', () => {
        goToSlide(index);
        closeOverview();
        stopAutoPlay();
      });
      overviewGrid.appendChild(thumb);
    });
  }

  // Update slide view
  function updateSlideView() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Update dots
    const dots = slideDotsGroup.querySelectorAll('.slide-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Update overview modal current
    const thumbs = overviewGrid.querySelectorAll('.overview-thumb');
    thumbs.forEach((thumb, idx) => {
      thumb.classList.toggle('current', idx === currentIndex);
    });

    // Counter & Progress
    slideCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
    const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateSlideView();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Auto-play feature
  function startAutoPlay() {
    isAutoPlay = true;
    autoPlayBtn.classList.add('active');
    autoPlayBtn.innerHTML = '<span>⏸</span> Pause';
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 7000);
  }

  function stopAutoPlay() {
    isAutoPlay = false;
    autoPlayBtn.classList.remove('active');
    autoPlayBtn.innerHTML = '<span>▶</span> Auto-Play';
    clearInterval(autoPlayInterval);
  }

  function toggleAutoPlay() {
    if (isAutoPlay) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  // Fullscreen feature
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Overview Modal
  function openOverview() {
    overviewModal.classList.add('open');
  }

  function closeOverview() {
    overviewModal.classList.remove('open');
  }

  // Event Listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoPlay();
  });

  autoPlayBtn.addEventListener('click', toggleAutoPlay);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  overviewBtn.addEventListener('click', openOverview);
  closeOverviewBtn.addEventListener('click', closeOverview);

  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) {
      closeOverview();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (overviewModal.classList.contains('open')) {
      if (e.key === 'Escape') closeOverview();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
      stopAutoPlay();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
      stopAutoPlay();
    } else if (e.key === 'Home') {
      goToSlide(0);
      stopAutoPlay();
    } else if (e.key === 'End') {
      goToSlide(totalSlides - 1);
      stopAutoPlay();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    } else if (e.key.toLowerCase() === 'o') {
      openOverview();
    }
  });

  // Initialize
  buildNavigation();
  updateSlideView();
});
