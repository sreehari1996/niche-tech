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
  initAboutPageGsapAnimations();
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
  if (menuBtn.dataset.menuBound === 'true') return;
  menuBtn.dataset.menuBound = 'true';

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
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

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      menuBtn.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
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
  const workList = document.querySelector('.work-section .work-list');
  const workItems = document.querySelectorAll('.work-section .work-item');

  if (!workItems.length) return;

  const totalItems = workItems.length;
  let currentIndex = 0;
  let isProgrammaticScroll = false;
  let scrollProgrammaticTimer = null;

  function scrollItemIntoView(idx) {
    if (!workList || window.innerWidth > 767) return;
    const item = workItems[idx];
    if (!item) return;

    isProgrammaticScroll = true;
    clearTimeout(scrollProgrammaticTimer);

    item.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest'
    });

    scrollProgrammaticTimer = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 450);
  }

  function setActiveItem(index, shouldScroll = true) {
    currentIndex = (index + totalItems) % totalItems;
    if (counterEl) {
      counterEl.textContent = `0${currentIndex + 1} / 0${totalItems}`;
    }

    workItems.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add('work-item-active');
        item.style.background = 'rgba(255, 255, 255, 0.05)';
        item.style.borderColor = 'rgba(56, 189, 248, 0.38)';
      } else {
        item.classList.remove('work-item-active');
        item.style.background = '';
        item.style.borderColor = '';
      }
    });

    if (shouldScroll) {
      scrollItemIntoView(currentIndex);
    }
  }

  // Initial state: reset scroll to 0 and activate card 1
  if (workList && window.innerWidth <= 767) {
    workList.scrollLeft = 0;
  }
  setActiveItem(0, false);

  // Click card to select & scroll into view
  workItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      setActiveItem(idx, true);
    });
  });

  // Prev / Next button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveItem(currentIndex - 1, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveItem(currentIndex + 1, true);
    });
  }

  // Mobile horizontal swipe / scroll synchronization
  if (workList) {
    let scrollDebounce = null;
    workList.addEventListener('scroll', () => {
      if (window.innerWidth > 767 || isProgrammaticScroll || !workItems[0]) return;

      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const listRect = workList.getBoundingClientRect();
        const listPadding = parseFloat(window.getComputedStyle(workList).paddingLeft) || 0;
        let closestIdx = 0;
        let minDiff = Infinity;

        workItems.forEach((item, idx) => {
          const itemRect = item.getBoundingClientRect();
          const diff = Math.abs((itemRect.left - listRect.left) - listPadding);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });

        if (closestIdx !== currentIndex) {
          setActiveItem(closestIdx, false);
        }
      }, 50);
    }, { passive: true });
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

  // A. Hero Section GSAP Animations
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Cinematic Background Image Reveal
    const heroBgArt = document.querySelector('.hero-bg-art');
    if (heroBgArt) {
      heroTL.fromTo(heroBgArt,
        { scale: 1.08, opacity: 0, x: 25 },
        { scale: 1, opacity: 1, x: 0, duration: 1.4, ease: 'power3.out' },
        0
      );

      // Continuous subtle ambient breathing pulse
      gsap.to(heroBgArt, {
        scale: 1.025,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.4
      });
    }

    // 2. Eyebrow Badge Reveal
    const eyebrow = document.querySelector('.hero-eyebrow-tech');
    if (eyebrow) {
      heroTL.from(eyebrow, {
        y: 18,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power3.out'
      }, 0.2);
    }

    // 3. Staged Headline Reveal
    const titleLines = document.querySelectorAll('.hero-title .hero-title-line');
    if (titleLines.length > 0) {
      heroTL.from(titleLines, {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.3);
    } else {
      heroTL.from('.hero-title', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.3);
    }

    // 4. Description Paragraph
    const description = document.querySelector('.hero-description');
    if (description) {
      heroTL.from(description, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.5);
    }

    // 5. CTA Buttons
    const ctaButtons = document.querySelectorAll('.hero-cta-group a');
    if (ctaButtons.length > 0) {
      heroTL.from(ctaButtons, {
        y: 20,
        opacity: 0,
        scale: 0.96,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.4)'
      }, 0.65);
    }

    // 6. Stats Strip Items & Counter Numbers
    const statItems = document.querySelectorAll('.hero-stats-strip .hero-stat-item');
    if (statItems.length > 0) {
      heroTL.from(statItems, {
        y: 18,
        opacity: 0,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power2.out'
      }, 0.8);

      // Animate counters smoothly right into hero entrance
      const heroStatCounters = document.querySelectorAll('.hero-stats-strip .stat-number');
      heroStatCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const suffix = counter.getAttribute('data-suffix') || '+';
        counter.dataset.animated = 'true';
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          delay: 0.6,
          onUpdate: () => {
            counter.textContent = Math.floor(counterObj.val) + suffix;
          }
        });
      });
    }

    // 7. Right Floating Glass Services Card Reveal (3D Perspective Entrance)
    const servicesCard = document.querySelector('.hero-services-card');
    if (servicesCard) {
      heroTL.fromTo(servicesCard,
        {
          opacity: 0,
          y: 45,
          scale: 0.92,
          rotationY: -10,
          rotationX: 8,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          duration: 1.1,
          ease: 'power3.out'
        },
        0.4
      );

      // Staggered Entrance of Service Rows inside the card
      const serviceRows = document.querySelectorAll('.hero-service-row');
      if (serviceRows.length > 0) {
        heroTL.from(serviceRows, {
          x: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }, 0.65);
      }

      // Continuous Organic Levitation Loop
      gsap.to(servicesCard, {
        y: -9,
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.5
      });
    }

    // 8. Handwritten Annotation & Sketching Arrow
    const impactNote = document.querySelector('.hero-impact-note');
    if (impactNote) {
      const noteScript = impactNote.querySelector('.note-script');
      if (noteScript) {
        heroTL.fromTo(noteScript,
          { scale: 0.6, opacity: 0, rotation: -16 },
          { scale: 1, opacity: 1, rotation: -6, duration: 0.55, ease: 'back.out(1.8)' },
          0.65
        );
      }

      // Live SVG Arrow Drawing
      const arrowCurve = impactNote.querySelector('.arrow-curve') || impactNote.querySelectorAll('path')[0];
      const arrowHead = impactNote.querySelector('.arrow-head') || impactNote.querySelectorAll('path')[1];

      if (arrowCurve && arrowHead) {
        const curveLength = arrowCurve.getTotalLength ? arrowCurve.getTotalLength() : 60;
        const headLength = arrowHead.getTotalLength ? arrowHead.getTotalLength() : 35;

        gsap.set(arrowCurve, { strokeDasharray: curveLength, strokeDashoffset: curveLength });
        gsap.set(arrowHead, { strokeDasharray: headLength, strokeDashoffset: headLength });

        heroTL.to(arrowCurve, {
          strokeDashoffset: 0,
          duration: 0.35,
          ease: 'power2.inOut'
        }, 0.85)
        .to(arrowHead, {
          strokeDashoffset: 0,
          duration: 0.25,
          ease: 'power2.out'
        }, 1.05);
      }

      // Organic Floating Sway
      gsap.to(impactNote, {
        y: -6,
        rotation: -4,
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8
      });
    }

    // 9. Bottom Brands Bar Entrance
    const brandsBar = document.querySelector('.hero-brands-bar');
    if (brandsBar) {
      heroTL.from(brandsBar, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      }, 0.95);

      const brandDivider = brandsBar.querySelector('.brands-bar-divider');
      if (brandDivider) {
        heroTL.from(brandDivider, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power2.out'
        }, 1.1);
      }

      const brandLogos = brandsBar.querySelectorAll('.brand-logo-item');
      if (brandLogos.length > 0) {
        heroTL.from(brandLogos, {
          y: 10,
          opacity: 0,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out'
        }, 1.15);
      }
    }

    // 10. Interactive 3D Multi-Layer Mouse Parallax (Screens >= 1024px)
    if (window.matchMedia('(min-width: 1024px)').matches) {
      const heroContent = document.querySelector('.hero-content');

      const setBgX = heroBgArt ? gsap.quickTo(heroBgArt, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
      const setBgY = heroBgArt ? gsap.quickTo(heroBgArt, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

      const setContentX = heroContent ? gsap.quickTo(heroContent, 'x', { duration: 0.7, ease: 'power2.out' }) : null;
      const setContentY = heroContent ? gsap.quickTo(heroContent, 'y', { duration: 0.7, ease: 'power2.out' }) : null;

      const setCardTiltX = servicesCard ? gsap.quickTo(servicesCard, 'rotationX', { duration: 0.6, ease: 'power2.out' }) : null;
      const setCardTiltY = servicesCard ? gsap.quickTo(servicesCard, 'rotationY', { duration: 0.6, ease: 'power2.out' }) : null;
      const setCardX = servicesCard ? gsap.quickTo(servicesCard, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
      const setCardY = servicesCard ? gsap.quickTo(servicesCard, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

      const setNoteX = impactNote ? gsap.quickTo(impactNote, 'x', { duration: 0.65, ease: 'power2.out' }) : null;
      const setNoteY = impactNote ? gsap.quickTo(impactNote, 'y', { duration: 0.65, ease: 'power2.out' }) : null;

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        if (setBgX) setBgX(-normX * 16);
        if (setBgY) setBgY(-normY * 12);

        if (setContentX) setContentX(normX * 8);
        if (setContentY) setContentY(normY * 6);

        if (setCardTiltX) setCardTiltX(-normY * 10);
        if (setCardTiltY) setCardTiltY(normX * 12);
        if (setCardX) setCardX(normX * 16);
        if (setCardY) setCardY(normY * 12);

        if (setNoteX) setNoteX(normX * 24);
        if (setNoteY) setNoteY(normY * 18);
      });

      heroSection.addEventListener('mouseleave', () => {
        if (setBgX) setBgX(0);
        if (setBgY) setBgY(0);
        if (setContentX) setContentX(0);
        if (setContentY) setContentY(0);
        if (setCardTiltX) setCardTiltX(0);
        if (setCardTiltY) setCardTiltY(0);
        if (setCardX) setCardX(0);
        if (setCardY) setCardY(0);
        if (setNoteX) setNoteX(0);
        if (setNoteY) setNoteY(0);
      });
    }

    // 11. Interactive Magnetic CTA Buttons
    const heroButtons = document.querySelectorAll('.hero-cta-group a');
    heroButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.3,
          ease: 'power2.out'
        });
        const svg = btn.querySelector('svg');
        if (svg) {
          gsap.to(svg, {
            x: x * 0.12,
            y: y * 0.12,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
        const svg = btn.querySelector('svg');
        if (svg) {
          gsap.to(svg, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
          });
        }
      });
    });

    // 12. ScrollTrigger Exit Parallax
    if (typeof ScrollTrigger !== 'undefined') {
      const heroParallaxBg = document.querySelector('.hero-bg-parallax');
      if (heroParallaxBg) {
        gsap.to(heroParallaxBg, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      const floatingWrapper = document.querySelector('.hero-floating-wrapper');
      if (floatingWrapper) {
        gsap.to(floatingWrapper, {
          y: -50,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      const heroContentEl = document.querySelector('.hero-content');
      if (heroContentEl) {
        gsap.to(heroContentEl, {
          y: -35,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }
    }
  }

  // B. Counter Number Animation for other pages / non-hero stat counters
  if (typeof ScrollTrigger !== 'undefined') {
    const statCounters = document.querySelectorAll('.stat-number:not([data-animated="true"])');
    
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

// 8B. About Page GSAP Animations & Interactions
function initAboutPageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const aboutHero = document.querySelector('.about-hero-section');
  if (!aboutHero) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration
  // =========================================================================
  const aboutHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Background Fluid Shapes (Gentle Ambient Floating)
  const bgShapeBL = document.querySelector('.bg-shape-bottom-left');
  const bgShapeTR = document.querySelector('.bg-shape-top-right');
  if (bgShapeBL) {
    aboutHeroTL.from(bgShapeBL, { opacity: 0, scale: 0.9, duration: 1.4 }, 0);
    gsap.to(bgShapeBL, {
      y: -14,
      x: 8,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4
    });
  }
  if (bgShapeTR) {
    aboutHeroTL.from(bgShapeTR, { opacity: 0, scale: 0.92, duration: 1.4 }, 0);
    gsap.to(bgShapeTR, {
      y: 16,
      x: -10,
      duration: 8.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4
    });
  }

  // B. Left Content Column: Eyebrow
  const eyebrow = document.querySelector('.about-hero-eyebrow');
  if (eyebrow) {
    aboutHeroTL.from(eyebrow, {
      y: 18,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, 0.15);
  }

  // C. Main Title Reveal
  const aboutTitle = document.querySelector('.about-hero-title');
  if (aboutTitle) {
    aboutHeroTL.from(aboutTitle, {
      y: 35,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.35);
  }

  // D. Description
  const aboutDesc = document.querySelector('.about-hero-desc');
  if (aboutDesc) {
    aboutHeroTL.from(aboutDesc, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.5);
  }

  // E. 3-Stat Metric Strip & Vertical Dividers
  const statsStrip = document.querySelector('.about-stats-strip');
  const statSeparators = document.querySelectorAll('.about-stat-separator');
  if (statsStrip) {
    aboutHeroTL.from(statsStrip, {
      y: 22,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0.65);
  }
  if (statSeparators.length > 0) {
    aboutHeroTL.from(statSeparators, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    }, 0.8);
  }

  // Live Count-Up Animation for Stat Numbers
  const heroStatNumbers = aboutHero.querySelectorAll('.stat-number[data-target]');
  heroStatNumbers.forEach((counter) => {
    const targetVal = parseInt(counter.getAttribute('data-target'), 10) || 0;
    const suffix = counter.getAttribute('data-suffix') || '+';
    const counterObj = { val: 0 };

    aboutHeroTL.to(counterObj, {
      val: targetVal,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        counter.textContent = Math.floor(counterObj.val) + suffix;
      }
    }, 0.7);
  });

  // F. CTA Outline Button ("Our Story")
  const btnAboutStory = document.getElementById('btn-about-story');
  if (btnAboutStory) {
    aboutHeroTL.fromTo(btnAboutStory,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.65
    );
  }

  // =========================================================================
  // Right Visual Composition Orchestration
  // =========================================================================
  const tiltedBackplate = document.querySelector('.about-tilted-backplate');
  const dotMatrix = document.querySelector('.about-dot-matrix');
  const visualFrame = document.querySelector('.about-visual-frame');
  const contourPath = document.querySelector('.about-contour-curve path');
  const accentPills = document.querySelectorAll('.accent-pill');
  const floatingBadge = document.querySelector('.about-floating-badge');

  // 1. Tilted Backplate Entrance
  if (tiltedBackplate) {
    aboutHeroTL.fromTo(tiltedBackplate,
      { scale: 0.86, opacity: 0, rotation: -16 },
      { scale: 1, opacity: 1, rotation: -10.5, duration: 1.2, ease: 'back.out(1.2)' },
      0.3
    );
  }

  // 2. Dot Matrix Grid Staged Pop & Floating
  if (dotMatrix) {
    aboutHeroTL.from(dotMatrix, {
      scale: 0.8,
      opacity: 0,
      y: -15,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.45);

    gsap.to(dotMatrix, {
      y: -8,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.2
    });
  }

  // 3. Team Photo Frame Entrance
  if (visualFrame) {
    aboutHeroTL.from(visualFrame, {
      scale: 0.92,
      opacity: 0,
      y: 28,
      duration: 1.1,
      ease: 'power3.out'
    }, 0.4);
  }

  // 4. Contour Curve Real-Time Stroke Drawing Animation
  if (contourPath) {
    try {
      const pathLength = contourPath.getTotalLength();
      if (pathLength > 0) {
        gsap.set(contourPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });

        aboutHeroTL.to(contourPath, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut'
        }, 0.55);
      }
    } catch (e) {
      // Graceful fallback if getTotalLength is unavailable
    }
  }

  // 5. Floating Accent Pills (Pop-in & Organic Hover Micro-Animations)
  if (accentPills.length > 0) {
    aboutHeroTL.from(accentPills, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'back.out(2)'
    }, 0.85);

    // Continuous floating oscillations for each pill
    const pillNavyBottom = document.querySelector('.pill-navy-bottom');
    const pillAmberBottom = document.querySelector('.pill-amber-bottom');
    const pillNavyTop = document.querySelector('.pill-navy-top');

    if (pillNavyBottom) {
      gsap.to(pillNavyBottom, {
        y: -6,
        rotation: -8,
        duration: 3.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.4
      });
    }
    if (pillAmberBottom) {
      gsap.to(pillAmberBottom, {
        y: -7,
        rotation: 12,
        duration: 4.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.6
      });
    }
    if (pillNavyTop) {
      gsap.to(pillNavyTop, {
        y: -5,
        rotation: 18,
        duration: 3.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.5
      });
    }
  }

  // 6. Floating Badge Entrance & Continuous Micro-Float
  if (floatingBadge) {
    aboutHeroTL.from(floatingBadge, {
      y: 24,
      scale: 0.88,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(1.5)'
    }, 0.95);

    gsap.to(floatingBadge, {
      y: -5,
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.6
    });

    // Subtle pulse on badge dot inner
    const badgeDotInner = floatingBadge.querySelector('.badge-dot-inner');
    if (badgeDotInner) {
      gsap.to(badgeDotInner, {
        scale: 1.35,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }

  // =========================================================================
  // 2. Interactive 3D Parallax & Magnetic Cursor Effect
  // =========================================================================
  const visualComp = document.querySelector('.about-visual-composition');
  if (visualComp && window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    const setFrameTiltX = visualFrame ? gsap.quickTo(visualFrame, 'rotationX', { duration: 0.7, ease: 'power2.out' }) : null;
    const setFrameTiltY = visualFrame ? gsap.quickTo(visualFrame, 'rotationY', { duration: 0.7, ease: 'power2.out' }) : null;
    const setFrameX = visualFrame ? gsap.quickTo(visualFrame, 'x', { duration: 0.7, ease: 'power2.out' }) : null;
    const setFrameY = visualFrame ? gsap.quickTo(visualFrame, 'y', { duration: 0.7, ease: 'power2.out' }) : null;

    const setBackplateX = tiltedBackplate ? gsap.quickTo(tiltedBackplate, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
    const setBackplateY = tiltedBackplate ? gsap.quickTo(tiltedBackplate, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

    const setBadgeX = floatingBadge ? gsap.quickTo(floatingBadge, 'x', { duration: 0.6, ease: 'power2.out' }) : null;
    const setBadgeY = floatingBadge ? gsap.quickTo(floatingBadge, 'y', { duration: 0.6, ease: 'power2.out' }) : null;

    gsap.set(visualFrame, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

    aboutHero.addEventListener('mousemove', (e) => {
      const rect = aboutHero.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      if (setFrameTiltY) setFrameTiltY(normX * 8);
      if (setFrameTiltX) setFrameTiltX(-normY * 8);
      if (setFrameX) setFrameX(normX * 12);
      if (setFrameY) setFrameY(normY * 12);

      if (setBackplateX) setBackplateX(-normX * 16);
      if (setBackplateY) setBackplateY(-normY * 16);

      if (setBadgeX) setBadgeX(normX * 22);
      if (setBadgeY) setBadgeY(normY * 22);
    });

    aboutHero.addEventListener('mouseleave', () => {
      if (setFrameTiltY) setFrameTiltY(0);
      if (setFrameTiltX) setFrameTiltX(0);
      if (setFrameX) setFrameX(0);
      if (setFrameY) setFrameY(0);
      if (setBackplateX) setBackplateX(0);
      if (setBackplateY) setBackplateY(0);
      if (setBadgeX) setBadgeX(0);
      if (setBadgeY) setBadgeY(0);
    });
  }

  // Magnetic button effect on "Our Story"
  if (btnAboutStory && window.matchMedia('(hover: hover)').matches) {
    const btnSvg = btnAboutStory.querySelector('svg');
    btnAboutStory.addEventListener('mousemove', (e) => {
      const rect = btnAboutStory.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
      gsap.to(btnAboutStory, { x, y, duration: 0.3, ease: 'power2.out' });
      if (btnSvg) {
        gsap.to(btnSvg, { x: x * 0.5 + 3, duration: 0.3, ease: 'power2.out' });
      }
    });

    btnAboutStory.addEventListener('mouseleave', () => {
      gsap.to(btnAboutStory, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      if (btnSvg) {
        gsap.to(btnSvg, { x: 0, duration: 0.4, ease: 'power2.out' });
      }
    });
  }

  // =========================================================================
  // 3. ScrollTrigger Suite for Subsequent About Page Sections
  // =========================================================================
  if (typeof ScrollTrigger === 'undefined') return;

  // A. Values Section: Intro & Value Cards Stagger
  const valuesSection = document.querySelector('.about-values-section');
  if (valuesSection) {
    gsap.from('.about-values-intro', {
      scrollTrigger: {
        trigger: valuesSection,
        start: 'top 82%',
        once: true
      },
      x: -35,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.value-card', {
      scrollTrigger: {
        trigger: '.about-values-grid',
        start: 'top 85%',
        once: true
      },
      y: 35,
      opacity: 0,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // B. Principles Section: Intro & Quad Principle Items + Photo
  const principlesSection = document.querySelector('.about-principles-section');
  if (principlesSection) {
    gsap.from('.about-principles-info', {
      scrollTrigger: {
        trigger: principlesSection,
        start: 'top 80%',
        once: true
      },
      x: -30,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.principle-item', {
      scrollTrigger: {
        trigger: '.principles-quad',
        start: 'top 85%',
        once: true
      },
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.principles-frame', {
      scrollTrigger: {
        trigger: '.about-principles-visual',
        start: 'top 80%',
        once: true
      },
      scale: 0.92,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // C. Technologies Section: Staggered Ripple Reveal of Tech Cells
  const techSection = document.querySelector('.about-technologies-section');
  if (techSection) {
    gsap.from('.tech-header', {
      scrollTrigger: {
        trigger: techSection,
        start: 'top 82%',
        once: true
      },
      y: 25,
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.tech-cell', {
      scrollTrigger: {
        trigger: '.tech-grid-wrapper',
        start: 'top 85%',
        once: true
      },
      scale: 0.88,
      opacity: 0,
      y: 18,
      duration: 0.55,
      stagger: {
        amount: 0.5,
        grid: [2, 8],
        from: 'center'
      },
      ease: 'back.out(1.3)',
      clearProps: 'all'
    });
  }

  // D. Culture Section: 2x2 Photo Gallery Reveal
  const cultureSection = document.querySelector('.about-culture-section');
  if (cultureSection) {
    gsap.from('.about-culture-intro', {
      scrollTrigger: {
        trigger: cultureSection,
        start: 'top 80%',
        once: true
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.culture-photo-frame', {
      scrollTrigger: {
        trigger: '.about-culture-gallery',
        start: 'top 80%',
        once: true
      },
      scale: 0.92,
      y: 25,
      opacity: 0,
      stagger: 0.14,
      duration: 0.75,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  // E. Join Our Team Section
  const joinSection = document.querySelector('.about-join-section');
  if (joinSection) {
    gsap.from('.join-frame', {
      scrollTrigger: {
        trigger: joinSection,
        start: 'top 80%',
        once: true
      },
      x: -35,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.about-join-content', {
      scrollTrigger: {
        trigger: joinSection,
        start: 'top 80%',
        once: true
      },
      x: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'all'
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


