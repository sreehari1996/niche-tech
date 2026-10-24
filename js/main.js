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
  initServicePageGsapAnimations();
  initCaseStudyPageGsapAnimations();
  initBlogPageGsapAnimations();
  initCareerPageGsapAnimations();
  initBackToTop();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const heroSection = document.querySelector('.hero-section, .about-hero-section, .contact-hero-section');

  const handleScroll = () => {
    const threshold = heroSection ? (heroSection.offsetHeight - 90) : 40;
    if (window.scrollY > threshold) {
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
  // 1. Hero Section Opening Timeline Orchestration (Banner Background)
  // =========================================================================
  const aboutHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Badge Entrance
  const heroBadge = document.querySelector('.about-hero-badge') || document.querySelector('.about-hero-eyebrow');
  if (heroBadge) {
    aboutHeroTL.fromTo(heroBadge,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.15
    );
  }

  // B. Main Title Reveal
  const aboutTitle = document.querySelector('.about-hero-title');
  if (aboutTitle) {
    aboutHeroTL.fromTo(aboutTitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.28
    );
  }

  // C. Description Reveal
  const aboutDesc = document.querySelector('.about-hero-desc');
  if (aboutDesc) {
    aboutHeroTL.fromTo(aboutDesc,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.42
    );
  }

  // D. Action Buttons Entrance
  const heroActions = document.querySelector('.about-hero-actions');
  const btnAboutStory = document.getElementById('btn-about-story');
  if (heroActions) {
    aboutHeroTL.fromTo(heroActions,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.55
    );
  } else if (btnAboutStory) {
    aboutHeroTL.fromTo(btnAboutStory,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.7
    );
  }

  // Magnetic button hover effect on CTA buttons
  if (btnAboutStory && window.matchMedia('(hover: hover)').matches) {
    const btnSvg = btnAboutStory.querySelector('svg');
    btnAboutStory.addEventListener('mousemove', (e) => {
      const rect = btnAboutStory.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      gsap.to(btnAboutStory, { x, y, duration: 0.3, ease: 'power2.out' });
      if (btnSvg) {
        gsap.to(btnSvg, { x: x * 0.4 + 3, duration: 0.3, ease: 'power2.out' });
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

  // B. Foundation & Purpose Section: Modern Tab Navigation (Matching User's Attached Structure)
  const foundationTabs = document.querySelectorAll('.foundation-tab-btn');
  const foundationPanels = document.querySelectorAll('.foundation-panel');

  if (foundationTabs.length > 0 && foundationPanels.length > 0) {
    foundationTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');

        foundationTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        foundationPanels.forEach((panel) => {
          if (panel.id === `panel-${targetTab}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
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

  // D. Culture Section: GSAP Cinema Reel Carousel & Modal
  const cultureSection = document.querySelector('.about-culture-section');
  if (cultureSection) {
    // 1. Entrance ScrollTrigger
    const cultureHeader = cultureSection.querySelector('.about-culture-header');
    if (cultureHeader) {
      gsap.from(cultureHeader.children, {
        scrollTrigger: {
          trigger: cultureSection,
          start: 'top 80%',
          once: true
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    const reelCards = cultureSection.querySelectorAll('.culture-reel-card');
    if (reelCards.length) {
      gsap.from(reelCards, {
        scrollTrigger: {
          trigger: '.about-culture-reel-wrap',
          start: 'top 85%',
          once: true
        },
        y: 45,
        opacity: 0,
        stagger: 0.07,
        duration: 0.75,
        ease: 'power3.out',
        clearProps: 'all'
      });
    }

    // 2. Cinema Reel Carousel Engine
    const viewport = document.getElementById('culture-viewport');
    const track = document.getElementById('culture-track');
    const prevBtn = document.getElementById('culture-prev-btn');
    const nextBtn = document.getElementById('culture-next-btn');
    const currentIdxEl = document.getElementById('culture-current-idx');
    const totalIdxEl = document.getElementById('culture-total-idx');
    const progressBar = document.getElementById('culture-progress-bar');
    const filterPills = cultureSection.querySelectorAll('.culture-pill-btn');

    if (viewport && track) {
      let currentOffset = 0;
      let isDragging = false;
      let startX = 0;
      let dragStartOffset = 0;
      let hasDragged = false;

      function getVisibleCards() {
        return Array.from(track.querySelectorAll('.culture-reel-card:not(.is-hidden)'));
      }

      function getStepSize() {
        const visible = getVisibleCards();
        if (!visible.length) return 360;
        const card = visible[0];
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 20;
        return card.offsetWidth + gap;
      }

      function getMaxOffset() {
        const totalTrackWidth = track.scrollWidth;
        const viewWidth = viewport.clientWidth;
        return Math.max(0, totalTrackWidth - viewWidth);
      }

      function updateCounterAndProgress(offset) {
        const maxOffset = getMaxOffset();
        const visible = getVisibleCards();
        const total = visible.length;

        if (totalIdxEl) {
          totalIdxEl.textContent = total < 10 ? '0' + total : '' + total;
        }

        const step = getStepSize();
        let activeIdx = Math.round(offset / step) + 1;
        if (activeIdx < 1) activeIdx = 1;
        if (activeIdx > total) activeIdx = total;

        if (currentIdxEl) {
          currentIdxEl.textContent = activeIdx < 10 ? '0' + activeIdx : '' + activeIdx;
        }

        if (progressBar) {
          if (maxOffset <= 0) {
            progressBar.style.width = '100%';
          } else {
            const pct = Math.min(100, Math.max(14, ((offset + viewport.clientWidth) / track.scrollWidth) * 100));
            progressBar.style.width = pct + '%';
          }
        }

        if (prevBtn) prevBtn.disabled = offset <= 2;
        if (nextBtn) nextBtn.disabled = offset >= maxOffset - 2;
      }

      function slideTo(targetOffset, animate = true) {
        const maxOffset = getMaxOffset();
        currentOffset = Math.max(0, Math.min(targetOffset, maxOffset));

        if (animate && typeof gsap !== 'undefined') {
          gsap.to(track, {
            x: -currentOffset,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
            onUpdate: () => updateCounterAndProgress(currentOffset)
          });
        } else {
          track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
          updateCounterAndProgress(currentOffset);
        }
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const step = getStepSize();
          slideTo(currentOffset + step);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const step = getStepSize();
          slideTo(currentOffset - step);
        });
      }

      // Pointer / Drag gesture support
      viewport.addEventListener('pointerdown', (e) => {
        // Ignore if clicking on a button inside
        if (e.target.closest('button')) return;
        isDragging = true;
        hasDragged = false;
        startX = e.clientX;
        dragStartOffset = currentOffset;
        viewport.classList.add('is-dragging');
        track.style.transition = 'none';
      });

      window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) hasDragged = true;
        const maxOffset = getMaxOffset();
        const rawOffset = dragStartOffset - dx;
        // Dampen when overscrolling
        if (rawOffset < 0) {
          currentOffset = rawOffset * 0.35;
        } else if (rawOffset > maxOffset) {
          currentOffset = maxOffset + (rawOffset - maxOffset) * 0.35;
        } else {
          currentOffset = rawOffset;
        }
        track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
        updateCounterAndProgress(currentOffset);
      });

      function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('is-dragging');
        const step = getStepSize();
        const snappedOffset = Math.round(currentOffset / step) * step;
        slideTo(snappedOffset, true);
      }

      window.addEventListener('pointerup', handleDragEnd);
      window.addEventListener('pointercancel', handleDragEnd);

      // Category Filter Tabs
      filterPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const filter = pill.getAttribute('data-filter') || 'all';
          filterPills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');

          const allCards = track.querySelectorAll('.culture-reel-card');
          const visible = [];

          allCards.forEach((card) => {
            const cat = card.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
              card.classList.remove('is-hidden');
              visible.push(card);
            } else {
              card.classList.add('is-hidden');
            }
          });

          // Animate freshly displayed cards
          if (typeof gsap !== 'undefined' && visible.length) {
            gsap.fromTo(visible,
              { opacity: 0, scale: 0.94 },
              { opacity: 1, scale: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
            );
          }

          slideTo(0, false);
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
      });

      // Resize observer to update constraints
      window.addEventListener('resize', () => {
        slideTo(currentOffset, false);
      });

      // Initial state
      slideTo(0, false);
    }

    // 3. Lightbox Modal Engine
    const lightbox = document.getElementById('culture-lightbox');
    const lightboxImg = document.getElementById('culture-lightbox-img');
    const lightboxTitle = document.getElementById('culture-lightbox-title');
    const lightboxDesc = document.getElementById('culture-lightbox-desc');
    const lightboxClose = document.getElementById('culture-lightbox-close');
    const lightboxBackdrop = document.getElementById('culture-lightbox-backdrop');

    function openLightbox(src, title, desc) {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    cultureSection.addEventListener('click', (e) => {
      const zoomBtn = e.target.closest('.culture-zoom-btn');
      const card = e.target.closest('.culture-reel-card');

      if (zoomBtn) {
        e.stopPropagation();
        const src = zoomBtn.getAttribute('data-src') || '';
        const title = zoomBtn.getAttribute('data-title') || '';
        const desc = zoomBtn.getAttribute('data-desc') || '';
        openLightbox(src, title, desc);
      } else if (card) {
        const btn = card.querySelector('.culture-zoom-btn');
        if (btn) {
          const src = btn.getAttribute('data-src') || '';
          const title = btn.getAttribute('data-title') || '';
          const desc = btn.getAttribute('data-desc') || '';
          openLightbox(src, title, desc);
        }
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
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

// 8C. Service Page GSAP Animations & Interactions
function initServicePageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const serviceHero = document.querySelector('.service-hero-section');
  if (!serviceHero) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration (Executive Banner Theme)
  // =========================================================================
  const serviceHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Eyebrow Badge Entrance
  const eyebrow = serviceHero.querySelector('.service-hero-eyebrow');
  if (eyebrow) {
    serviceHeroTL.fromTo(eyebrow,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.15
    );
  }

  // B. Main Title Reveal
  const heroTitle = serviceHero.querySelector('.service-hero-title');
  if (heroTitle) {
    serviceHeroTL.fromTo(heroTitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.28
    );
  }

  // C. Narrative Description Reveal
  const heroDesc = serviceHero.querySelector('.service-hero-desc');
  if (heroDesc) {
    serviceHeroTL.fromTo(heroDesc,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.42
    );
  }

  // D. Action Buttons Entrance
  const heroActions = serviceHero.querySelector('.service-hero-actions');
  const ctaBtns = serviceHero.querySelectorAll('.service-hero-actions a');
  if (heroActions) {
    serviceHeroTL.fromTo(heroActions,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.55
    );
  }

  // =========================================================================
  // 2. Magnetic Hover Physics for Action Buttons
  // =========================================================================
  if (window.matchMedia('(hover: hover)').matches && ctaBtns.length > 0) {
    ctaBtns.forEach((btn) => {
      const btnSvg = btn.querySelector('svg');
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
        if (btnSvg) {
          gsap.to(btnSvg, { x: x * 0.4 + 3, duration: 0.3, ease: 'power2.out' });
        }
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (btnSvg) {
          gsap.to(btnSvg, { x: 0, duration: 0.4, ease: 'power2.out' });
        }
      });
    });
  }
}


// 8D. Case Study Page GSAP Animations & Interactions
function initCaseStudyPageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const caseHero = document.querySelector('.casestudy-hero-section');
  if (!caseHero) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration
  // =========================================================================
  const caseHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Background shapes soft reveal and ambient floating
  const bgShapeTL = caseHero.querySelector('.bg-shape-top-left');
  const bgShapeBL = caseHero.querySelector('.bg-shape-bottom-left');
  const bgShapeTR = caseHero.querySelector('.bg-shape-top-right');
  const wireframeTL = caseHero.querySelector('.casestudy-contour-wireframe-tl');
  const dotMatrices = caseHero.querySelectorAll('.casestudy-dot-matrix');
  const floatingChips = caseHero.querySelectorAll('.casestudy-floating-chip');

  if (bgShapeTL) {
    caseHeroTL.from(bgShapeTL, { opacity: 0, scale: 0.9, duration: 1.4 }, 0);
    gsap.to(bgShapeTL, {
      x: 10,
      y: -8,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.2
    });
  }

  if (bgShapeBL) {
    caseHeroTL.from(bgShapeBL, { opacity: 0, scale: 0.9, duration: 1.4 }, 0);
    gsap.to(bgShapeBL, {
      x: 8,
      y: -12,
      duration: 7.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.2
    });
  }

  if (bgShapeTR) {
    caseHeroTL.from(bgShapeTR, { opacity: 0, scale: 0.92, duration: 1.4 }, 0);
    gsap.to(bgShapeTR, {
      x: -12,
      y: 12,
      duration: 8.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4
    });
  }

  if (wireframeTL) {
    caseHeroTL.from(wireframeTL, {
      scale: 0.85,
      opacity: 0,
      rotation: -10,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.2);

    gsap.to(wireframeTL, {
      rotation: 4,
      duration: 9.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5
    });
  }

  if (dotMatrices.length > 0) {
    caseHeroTL.from(dotMatrices, {
      scale: 0.8,
      opacity: 0,
      y: 15,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    }, 0.3);

    dotMatrices.forEach((matrix, i) => {
      gsap.to(matrix, {
        y: i === 0 ? -7 : 7,
        duration: 4.5 + i,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2 + i * 0.3
      });
    });
  }

  if (floatingChips.length > 0) {
    caseHeroTL.from(floatingChips, {
      scale: 0,
      opacity: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: 'back.out(2)'
    }, 0.4);

    floatingChips.forEach((chip, i) => {
      gsap.to(chip, {
        y: i % 2 === 0 ? -6 : 6,
        rotation: i % 2 === 0 ? '+=8' : '-=8',
        duration: 3.5 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2 + i * 0.2
      });
    });
  }

  // B. Eyebrow Row: Text and Accent Line
  const eyebrow = caseHero.querySelector('.casestudy-eyebrow');
  const eyebrowLine = caseHero.querySelector('.casestudy-eyebrow-line');
  if (eyebrow) {
    caseHeroTL.from(eyebrow, {
      y: 18,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, 0.15);
  }
  if (eyebrowLine) {
    caseHeroTL.from(eyebrowLine, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.6,
      ease: 'power2.out'
    }, 0.3);
  }

  // C. Headline Title Reveal
  const heroTitle = caseHero.querySelector('.casestudy-hero-title');
  if (heroTitle) {
    caseHeroTL.from(heroTitle, {
      y: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out'
    }, 0.35);
  }

  // D. Center Divider
  const heroDivider = caseHero.querySelector('.casestudy-hero-divider');
  if (heroDivider) {
    caseHeroTL.from(heroDivider, {
      scaleY: 0,
      transformOrigin: 'center center',
      duration: 0.8,
      ease: 'power2.inOut'
    }, 0.35);
  }

  // E. Right Description
  const heroDesc = caseHero.querySelector('.casestudy-hero-desc');
  if (heroDesc) {
    caseHeroTL.from(heroDesc, {
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.5);
  }

  // F. CTA Button
  const scrollBtn = caseHero.querySelector('#hero-scroll-btn');
  if (scrollBtn) {
    caseHeroTL.fromTo(scrollBtn,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.65
    );
  }

  // G. Key Metrics Stats Strip & Dividers
  const statsStrip = caseHero.querySelector('.casestudy-hero-stats');
  const statDividers = caseHero.querySelectorAll('.casestudy-hero-stats .stat-divider');
  const statSubtexts = caseHero.querySelectorAll('.casestudy-hero-stats .stat-subtext');

  if (statsStrip) {
    caseHeroTL.from(statsStrip, {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, 0.7);
  }
  if (statDividers.length > 0) {
    caseHeroTL.from(statDividers, {
      scaleY: 0,
      transformOrigin: 'center center',
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out'
    }, 0.85);
  }

  // Live Counter Interpolation with Decimal Support
  const statNumbers = caseHero.querySelectorAll('.stat-number[data-target]');
  statNumbers.forEach((counter) => {
    const targetVal = parseFloat(counter.getAttribute('data-target')) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals'), 10) || 0;
    const counterObj = { val: 0 };

    caseHeroTL.to(counterObj, {
      val: targetVal,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (decimals > 0) {
          counter.textContent = counterObj.val.toFixed(decimals) + suffix;
        } else {
          counter.textContent = Math.floor(counterObj.val) + suffix;
        }
      }
    }, 0.8);
  });

  if (statSubtexts.length > 0) {
    caseHeroTL.from(statSubtexts, {
      opacity: 0,
      y: 10,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, 1.1);
  }

  // =========================================================================
  // 2. Interactive 3D Parallax Mouse Physics
  // =========================================================================
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    const setChipX = gsap.quickTo(floatingChips, 'x', { duration: 0.7, ease: 'power2.out' });
    const setChipY = gsap.quickTo(floatingChips, 'y', { duration: 0.7, ease: 'power2.out' });
    const setMatrixX = gsap.quickTo(dotMatrices, 'x', { duration: 0.85, ease: 'power2.out' });
    const setMatrixY = gsap.quickTo(dotMatrices, 'y', { duration: 0.85, ease: 'power2.out' });
    const setWireTLX = wireframeTL ? gsap.quickTo(wireframeTL, 'x', { duration: 0.8, ease: 'power2.out' }) : null;
    const setWireTLY = wireframeTL ? gsap.quickTo(wireframeTL, 'y', { duration: 0.8, ease: 'power2.out' }) : null;

    caseHero.addEventListener('mousemove', (e) => {
      const rect = caseHero.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;

      setChipX(normX * 18);
      setChipY(normY * 18);
      setMatrixX(-normX * 14);
      setMatrixY(-normY * 14);
      if (setWireTLX) setWireTLX(-normX * 20);
      if (setWireTLY) setWireTLY(-normY * 20);
    });

    caseHero.addEventListener('mouseleave', () => {
      setChipX(0);
      setChipY(0);
      setMatrixX(0);
      setMatrixY(0);
      if (setWireTLX) setWireTLX(0);
      if (setWireTLY) setWireTLY(0);
    });
  }

  // =========================================================================
  // 3. Magnetic Hover Physics for Scroll Button
  // =========================================================================
  if (scrollBtn && window.matchMedia('(hover: hover)').matches) {
    const iconWrap = scrollBtn.querySelector('.scroll-icon-wrap');
    scrollBtn.addEventListener('mousemove', (e) => {
      const rect = scrollBtn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
      gsap.to(scrollBtn, { x, y, duration: 0.3, ease: 'power2.out' });
      if (iconWrap) {
        gsap.to(iconWrap, { x: x * 0.4, y: y * 0.4 + 2, duration: 0.3, ease: 'power2.out' });
      }
    });

    scrollBtn.addEventListener('mouseleave', () => {
      gsap.to(scrollBtn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      if (iconWrap) {
        gsap.to(iconWrap, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
      }
    });
  }

  // =========================================================================
  // 4. ScrollTrigger — Filter Section (Category Pills + Result Count)
  // =========================================================================
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const filterSection = document.querySelector('.casestudy-filter-section');
    if (filterSection) {
      const filterPills = filterSection.querySelectorAll('.category-pill-btn');
      const filterFeedback = filterSection.querySelector('.filter-feedback');

      if (filterPills.length > 0) {
        gsap.from(filterPills, {
          scrollTrigger: {
            trigger: filterSection,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          scale: 0.92,
          duration: 0.5,
          stagger: 0.06,
          ease: 'back.out(1.4)'
        });
      }

      if (filterFeedback) {
        gsap.from(filterFeedback, {
          scrollTrigger: {
            trigger: filterSection,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          x: 20,
          duration: 0.6,
          delay: 0.35,
          ease: 'power2.out'
        });
      }
    }

    // =========================================================================
    // 5. ScrollTrigger — Case Study Cards (Staggered Reveal)
    // =========================================================================
    const caseCards = document.querySelectorAll('.case-card');
    if (caseCards.length > 0) {
      caseCards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 50,
          x: isEven ? -30 : 30,
          opacity: 0,
          scale: 0.96,
          duration: 0.75,
          ease: 'power3.out'
        });

        // Card image zoom-in reveal
        const cardImg = card.querySelector('.case-card-visual img');
        if (cardImg) {
          gsap.from(cardImg, {
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            scale: 1.15,
            duration: 1.2,
            delay: 0.15,
            ease: 'power2.out'
          });
        }

        // Card category badge pop-in
        const badge = card.querySelector('.card-category-badge');
        if (badge) {
          gsap.from(badge, {
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'back.out(2)'
          });
        }

        // Card body content stagger
        const cardTitle = card.querySelector('.case-card-title');
        const cardExcerpt = card.querySelector('.case-card-excerpt');
        const cardCta = card.querySelector('.case-card-cta');
        const cardMeta = card.querySelector('.case-card-meta');
        const bodyElements = [cardTitle, cardExcerpt, cardCta, cardMeta].filter(Boolean);

        if (bodyElements.length > 0) {
          gsap.from(bodyElements, {
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none'
            },
            y: 15,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            delay: 0.25,
            ease: 'power2.out'
          });
        }
      });
    }

    // =========================================================================
    // 6. ScrollTrigger — Empty State (if visible)
    // =========================================================================
    const emptyState = document.querySelector('.cases-empty-state');
    if (emptyState) {
      gsap.from(emptyState, {
        scrollTrigger: {
          trigger: emptyState,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    // =========================================================================
    // 7. ScrollTrigger — CTA Strip (Cinematic Entrance)
    // =========================================================================
    const ctaStrip = document.querySelector('.casestudy-cta-strip');
    if (ctaStrip) {
      const ctaTL = gsap.timeline({
        scrollTrigger: {
          trigger: ctaStrip,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });

      const ctaEyebrow = ctaStrip.querySelector('.cta-strip-eyebrow');
      const ctaTitle = ctaStrip.querySelector('.cta-strip-title');
      const ctaDesc = ctaStrip.querySelector('.cta-strip-desc');
      const ctaBtn = ctaStrip.querySelector('.btn-strip-action');

      if (ctaEyebrow) {
        ctaTL.from(ctaEyebrow, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out'
        }, 0);
      }

      if (ctaTitle) {
        ctaTL.from(ctaTitle, {
          y: 35,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        }, 0.1);
      }

      if (ctaDesc) {
        ctaTL.from(ctaDesc, {
          y: 25,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out'
        }, 0.25);
      }

      if (ctaBtn) {
        ctaTL.from(ctaBtn, {
          y: 20,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'back.out(1.6)',
          clearProps: 'transform,opacity,scale'
        }, 0.4);
      }
    }

    // =========================================================================
    // 8. ScrollTrigger — Contact Section
    // =========================================================================
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      const contactCard = contactSection.querySelector('.contact-card-box');
      if (contactCard) {
        gsap.from(contactCard, {
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        });
      }

      // Stagger the contact form elements
      const contactFormElements = contactSection.querySelectorAll('.contact-eyebrow, .contact-title, .contact-subtitle, .form-group, .btn-submit');
      if (contactFormElements.length > 0) {
        gsap.from(contactFormElements, {
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.3,
          ease: 'power2.out'
        });
      }

      // Contact details slide in from right
      const contactDetails = contactSection.querySelectorAll('.contact-detail-item');
      if (contactDetails.length > 0) {
        gsap.from(contactDetails, {
          scrollTrigger: {
            trigger: contactSection,
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          x: 30,
          opacity: 0,
          duration: 0.55,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power2.out'
        });
      }
    }
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


// =========================================================================
// 10. Blog Page Hero & Content GSAP Animations (Premium Smoothness)
// =========================================================================
function initBlogPageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const blogHero = document.querySelector('.blog-hero-section');
  if (!blogHero) return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // DOM References
  const heroEyebrow = blogHero.querySelector('.blog-hero-eyebrow') || blogHero.querySelector('.blog-eyebrow-row');
  const heroTitle = blogHero.querySelector('.blog-hero-title');
  const heroDesc = blogHero.querySelector('.blog-hero-desc');
  const heroActions = blogHero.querySelector('.blog-hero-actions') || blogHero.querySelector('.hero-action-row');
  const btnExplore = document.getElementById('btn-explore-articles') || document.getElementById('blog-hero-scroll-btn');
  const btnFeatured = document.getElementById('btn-featured-story');

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration (Matching About Page Theme)
  // =========================================================================
  const blogHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Eyebrow Entrance
  if (heroEyebrow) {
    blogHeroTL.fromTo(heroEyebrow,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.15
    );
  }

  // B. Main Title Reveal
  if (heroTitle) {
    blogHeroTL.fromTo(heroTitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.28
    );
  }

  // C. Description Reveal
  if (heroDesc) {
    blogHeroTL.fromTo(heroDesc,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.42
    );
  }

  // D. Action Buttons Entrance
  if (heroActions) {
    blogHeroTL.fromTo(heroActions,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.55
    );
  }

  // =========================================================================
  // 2. Smooth Scrolling for Hero Action Buttons
  // =========================================================================
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      const target = document.getElementById('blog-filter-section');
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  }

  if (btnFeatured) {
    btnFeatured.addEventListener('click', (e) => {
      const target = document.getElementById('blog-grid-section');
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  }

  // =========================================================================
  // 3. ScrollTrigger Reveals for Blog Content Sections
  // =========================================================================
  if (typeof ScrollTrigger !== 'undefined') {
    // Subhero Section Reveal
    const subhero = document.querySelector('.blog-subhero-section');
    if (subhero) {
      gsap.from(subhero.querySelectorAll('.blog-subhero-heading, .blog-subhero-desc'), {
        scrollTrigger: {
          trigger: subhero,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      });
    }

    // Filter Controls Bar Reveal
    const filterSection = document.querySelector('.blog-filter-section');
    if (filterSection) {
      gsap.from(filterSection.querySelector('.blog-controls-bar'), {
        scrollTrigger: {
          trigger: filterSection,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      });
    }

    // Blog Cards Staggered Reveal
    const blogCards = document.querySelectorAll('.blog-card');
    if (blogCards.length > 0) {
      gsap.from(blogCards, {
        scrollTrigger: {
          trigger: '.blog-grid-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      });
    }
  }
}

// =============================================================================
// Career Page Hero GSAP Animations (Matching About Page Theme)
// =============================================================================
function initCareerPageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const careerHero = document.querySelector('.career-hero-section');
  if (!careerHero) return;

  // DOM References
  const heroEyebrow = careerHero.querySelector('.career-hero-eyebrow') || careerHero.querySelector('.career-eyebrow-row');
  const heroTitle = careerHero.querySelector('.career-hero-title');
  const heroDesc = careerHero.querySelector('.career-hero-desc');
  const heroActions = careerHero.querySelector('.career-hero-actions');
  const btnExplore = document.getElementById('btn-explore-positions');
  const btnContact = document.getElementById('btn-career-contact');

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration
  // =========================================================================
  const careerHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Eyebrow Entrance
  if (heroEyebrow) {
    careerHeroTL.fromTo(heroEyebrow,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.15
    );
  }

  // B. Main Title Reveal
  if (heroTitle) {
    careerHeroTL.fromTo(heroTitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.28
    );
  }

  // C. Description Reveal
  if (heroDesc) {
    careerHeroTL.fromTo(heroDesc,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.42
    );
  }

  // D. Action Buttons Entrance
  if (heroActions) {
    careerHeroTL.fromTo(heroActions,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.55
    );
  }

  // =========================================================================
  // 2. Smooth Scrolling for Career Action Buttons
  // =========================================================================
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      const target = document.getElementById('positions');
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  }

  if (btnContact) {
    btnContact.addEventListener('click', (e) => {
      const target = document.getElementById('contact');
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  }
}

// =============================================================================
// Case Study Page Hero GSAP Animations (Matching About Page Theme)
// =============================================================================
function initCaseStudyPageGsapAnimations() {
  if (typeof gsap === 'undefined') return;

  const caseHero = document.querySelector('.casestudy-hero-section');
  if (!caseHero) return;

  // DOM References
  const heroEyebrow = caseHero.querySelector('.casestudy-hero-eyebrow') || caseHero.querySelector('.casestudy-eyebrow-row');
  const heroTitle = caseHero.querySelector('.casestudy-hero-title');
  const heroDesc = caseHero.querySelector('.casestudy-hero-desc');
  const heroActions = caseHero.querySelector('.casestudy-hero-actions');
  const btnExplore = document.getElementById('btn-explore-cases') || document.getElementById('hero-scroll-btn');

  // =========================================================================
  // 1. Hero Section Opening Timeline Orchestration
  // =========================================================================
  const caseHeroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // A. Eyebrow Entrance
  if (heroEyebrow) {
    caseHeroTL.fromTo(heroEyebrow,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.15
    );
  }

  // B. Main Title Reveal
  if (heroTitle) {
    caseHeroTL.fromTo(heroTitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.28
    );
  }

  // C. Description Reveal
  if (heroDesc) {
    caseHeroTL.fromTo(heroDesc,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.42
    );
  }

  // D. Action Buttons Entrance
  if (heroActions) {
    caseHeroTL.fromTo(heroActions,
      { y: 16, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', clearProps: 'opacity,transform,scale' },
      0.55
    );
  }

  // =========================================================================
  // 2. Smooth Scrolling for Case Study Action Buttons
  // =========================================================================
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      const target = document.getElementById('cases-section');
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  }

  // =========================================================================
  // 3. Stats Numbers Counter Animation
  // =========================================================================
  const statNumbers = document.querySelectorAll('.casestudy-hero-stats .stat-number');
  if (statNumbers.length > 0 && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.casestudy-stats-section',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        statNumbers.forEach(stat => {
          const targetStr = stat.getAttribute('data-target');
          if (!targetStr) return;
          const targetVal = parseFloat(targetStr);
          const suffix = stat.getAttribute('data-suffix') || '';
          const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
          const obj = { val: 0 };

          gsap.to(obj, {
            val: targetVal,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              stat.textContent = (decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val)) + suffix;
            }
          });
        });
      }
    });
  }
}


