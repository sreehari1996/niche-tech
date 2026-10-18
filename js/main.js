/**
 * Niche Global - Talent & Transformation
 * Main Interactive Engine with GSAP & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initProjectCarousel();
  initTestimonialCarousel();
  initBlogFilter();
  initProductStackedDeck();
  initFormHandler();
  initGsapAnimations();
  initBackToTop();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Mobile Menu
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.nav-mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-links a');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// 3. Smooth Anchor Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 4. Project Carousel Data & Controls
function initProjectCarousel() {
  const prevBtn = document.getElementById('work-prev');
  const nextBtn = document.getElementById('work-next');
  const counterEl = document.getElementById('work-counter');
  const workItems = document.querySelectorAll('.work-item');

  if (!workItems.length) return;

  const totalItems = workItems.length;
  let currentIndex = 0;

  function setActiveItem(index) {
    currentIndex = (index + totalItems) % totalItems;
    if (counterEl) {
      counterEl.textContent = `0${currentIndex + 1} / 0${totalItems}`;
    }

    workItems.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add('work-item-active');
        item.style.background = 'rgba(255, 255, 255, 0.05)';
        item.style.borderColor = 'rgba(56, 189, 248, 0.35)';
      } else {
        item.classList.remove('work-item-active');
        item.style.background = '';
        item.style.borderColor = '';
      }
    });
  }

  // Initial state
  setActiveItem(0);

  // Click row to select
  workItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      setActiveItem(idx);
    });
  });

  // Prev / Next button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setActiveItem(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setActiveItem(currentIndex + 1);
    });
  }
}

// 5. Testimonials Carousel Slider
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  let currentIndex = 0;

  function getStep() {
    const card = cards[0];
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  function getMaxIndex() {
    const container = track.parentElement;
    if (!container) return 0;
    const containerWidth = container.offsetWidth;
    const totalWidth = track.scrollWidth;
    const step = getStep();
    const maxOffset = Math.max(0, totalWidth - containerWidth);
    return Math.ceil(maxOffset / step);
  }

  function update() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const step = getStep();
    const container = track.parentElement;
    const containerWidth = container.offsetWidth;
    const totalWidth = track.scrollWidth;
    const maxOffset = Math.max(0, totalWidth - containerWidth);

    let offset = currentIndex * step;
    if (offset > maxOffset) offset = maxOffset;

    track.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIdx;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        update();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxIdx = getMaxIndex();
      if (currentIndex < maxIdx) {
        currentIndex++;
        update();
      }
    });
  }

  // Touch Swipe for mobile/tablet
  let startX = 0;
  let isDown = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDown = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDown) return;
    isDown = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentIndex < getMaxIndex()) {
        currentIndex++;
        update();
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
        update();
      }
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    update();
  });

  // Initial calculation
  setTimeout(update, 100);
}

// 6. Interactive Contact Form with Validation & Feedback Toast
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<span>Sending...</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<span>Message Sent! ✓</span>`;
      btn.style.backgroundColor = '#22c55e';
      btn.style.color = '#ffffff';

      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}

// 7. Interactive Blog Topic Filtering
function initBlogFilter() {
  const filterPills = document.querySelectorAll('.blog-filter-pills .filter-pill');
  const cards = document.querySelectorAll('.blog-grid .blog-card');
  if (!filterPills.length || !cards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      // Update active state
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      // Animate card display
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });

      // Refresh ScrollTrigger calculations after filter
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });
}

// 7b. Product Stacked Cards Deck with GSAP ScrollTrigger
function initProductStackedDeck() {
  const section = document.querySelector('.product-section');
  if (!section) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const cards = gsap.utils.toArray('.product-stack-card');
  if (!cards.length) return;

  // Header entrance animation
  gsap.from('.product-section-header', {
    scrollTrigger: {
      trigger: '.product-section',
      start: 'top 82%',
      once: true
    },
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });

  // GSAP Responsive MatchMedia for Stacked Deck
  const mm = gsap.matchMedia();

  // Desktop (>= 1024px): Stacked Deck Sticking & Scale-Down Scrub
  mm.add('(min-width: 1024px)', () => {
    cards.forEach((card, i) => {
      // Explicit z-index ensuring subsequent cards cleanly layer on top
      card.style.zIndex = (i + 1) * 10;

      // Scale down previous card slightly as next card covers it (NO OPACITY or FILTER to keep text 100% sharp and solid)
      if (i < cards.length - 1) {
        const nextCard = cards[i + 1];
        const cardInner = card.querySelector('.card-inner');

        gsap.to(cardInner, {
          scale: 0.96 - (cards.length - 1 - i) * 0.02,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top top+=260',
            end: 'top top+=86',
            scrub: true
          }
        });
      }

      // Stagger elements inside each card as it arrives
      const infoItems = card.querySelectorAll(
        '.card-header-bar, .card-title, .card-desc, .card-metrics-grid, .card-feature-list li, .card-actions'
      );
      if (infoItems.length) {
        gsap.from(infoItems, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          },
          y: 20,
          opacity: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }

      const mockup = card.querySelector('.mockup-frame');
      if (mockup) {
        gsap.from(mockup, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true
          },
          scale: 0.95,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    });
  });

  // Mobile / Tablet (< 1024px): Clean Staggered Scroll Reveal
  mm.add('(max-width: 1023px)', () => {
    cards.forEach(card => {
      const cardInner = card.querySelector('.card-inner');
      if (cardInner) {
        gsap.from(cardInner, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    });
  });
}

// 8. GSAP Animations & ScrollTrigger
function initGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // A. Hero Section Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.5 } });

  heroTL
    .from('.hero-content > *', {
      y: 16,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5
    })
    .from('.hero-visual-wrapper', {
      opacity: 0,
      scale: 0.98,
      duration: 0.6
    }, '<0.1');

  // B. Counter Number Animation in Stats Strip
  if (typeof ScrollTrigger !== 'undefined') {
    const statCounters = document.querySelectorAll('.stat-number');
    
    statCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const suffix = counter.getAttribute('data-suffix') || '+';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(counter, 
            { innerText: 0 },
            {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                counter.innerHTML = Math.floor(counter.innerText) + suffix;
              }
            }
          );
        }
      });
    });

    // C. Services Stagger
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 85%',
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // D. About Section Reveal
    gsap.from('.about-visual', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        once: true
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.about-content', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        once: true
      },
      x: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // E. Process Timeline Steps Stagger
    gsap.from('.timeline-step', {
      scrollTrigger: {
        trigger: '.process-section',
        start: 'top 80%',
        once: true
      },
      y: 25,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // F. Work Section Items
    gsap.from('.work-list .work-item', {
      scrollTrigger: {
        trigger: '.work-section',
        start: 'top 80%',
        once: true
      },
      y: 25,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // G. Product Section animations are fully managed in initProductStackedDeck()

    // H. Testimonials Section
    gsap.from('.testimonials-intro', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%',
        once: true
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%',
        once: true
      },
      x: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // I. Blog Section
    if (document.querySelector('.blog-section')) {
      gsap.from('.blog-header', {
        scrollTrigger: {
          trigger: '.blog-section',
          start: 'top 80%',
          once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.blog-card', {
        scrollTrigger: {
          trigger: '.blog-section',
          start: 'top 75%',
          once: true
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      });

      gsap.from('.blog-bottom-strip', {
        scrollTrigger: {
          trigger: '.blog-bottom-strip',
          start: 'top 85%',
          once: true
        },
        y: 25,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // J. Contact Box
    gsap.from('.contact-card-box', {
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });
    // Refresh ScrollTrigger when all assets/images are loaded
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }
}

// 9. Back To Top Floating Button with Circular Scroll Progress
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const progressFill = btn.querySelector('.progress-ring-fill');
  const radius = 21;
  const circumference = 2 * Math.PI * radius; // ~131.95

  if (progressFill) {
    progressFill.style.strokeDasharray = `${circumference}`;
    progressFill.style.strokeDashoffset = `${circumference}`;
  }

  const handleScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Show button after scrolling past 300px
    if (scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }

    // Dynamic scroll progress calculation
    if (progressFill && docHeight > 0) {
      const scrollPercent = Math.min(Math.max(scrollY / docHeight, 0), 1);
      const offset = circumference - (scrollPercent * circumference);
      progressFill.style.strokeDashoffset = offset;
    }
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}


