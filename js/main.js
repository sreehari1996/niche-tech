/**
 * Niche Global - Talent & Transformation
 * Main Interactive Engine with GSAP & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initProjectCarousel();
  initFormHandler();
  initGsapAnimations();
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
  const card1Title = document.getElementById('project-1-title');
  const card1Tags = document.getElementById('project-1-tags');
  const card1Img = document.getElementById('project-1-img');
  
  const card2Title = document.getElementById('project-2-title');
  const card2Tags = document.getElementById('project-2-tags');
  const card2Img = document.getElementById('project-2-img');

  if (!prevBtn || !nextBtn) return;

  const projects = [
    {
      p1: { title: 'Enterprise Software Platform', tags: 'Web App • React • Node.js', img: 'assets/images/work-laptop-clean.jpg' },
      p2: { title: 'Digital Product', tags: 'UI/UX', img: 'assets/images/work-digital-product-clean.jpg' }
    },
    {
      p1: { title: 'Global Cloud Infrastructure', tags: 'AWS • Kubernetes • DevOps', img: 'assets/images/glass-tower-clean.jpg' },
      p2: { title: 'Fintech AI Copilot', tags: 'Product Design • Python', img: 'assets/images/hero-clean.jpg' }
    },
    {
      p1: { title: 'Omnichannel Digital Banking', tags: 'Microservices • Next.js', img: 'assets/images/work-laptop-clean.jpg' },
      p2: { title: 'Enterprise SaaS Core', tags: 'Full Stack', img: 'assets/images/about-boardroom.png' }
    },
    {
      p1: { title: 'Supply Chain Intelligence', tags: 'Data Ops • React Native', img: 'assets/images/glass-tower-clean.jpg' },
      p2: { title: 'Talent Cloud Portal', tags: 'Design System', img: 'assets/images/contact-woman.png' }
    }
  ];

  let currentIndex = 0;

  function updateCarousel(index) {
    currentIndex = index;
    if (counterEl) {
      counterEl.textContent = `0${currentIndex + 1} / 0${projects.length}`;
    }

    const current = projects[currentIndex];

    // GSAP Crossfade
    if (window.gsap) {
      gsap.to(['.project-card'], {
        opacity: 0.5,
        duration: 0.2,
        y: 6,
        onComplete: () => {
          if (card1Title) card1Title.textContent = current.p1.title;
          if (card1Tags) card1Tags.textContent = current.p1.tags;
          if (card1Img) card1Img.src = current.p1.img;

          if (card2Title) card2Title.textContent = current.p2.title;
          if (card2Tags) card2Tags.textContent = current.p2.tags;
          if (card2Img) card2Img.src = current.p2.img;

          gsap.to(['.project-card'], {
            opacity: 1,
            duration: 0.35,
            y: 0,
            ease: 'power2.out'
          });
        }
      });
    } else {
      if (card1Title) card1Title.textContent = current.p1.title;
      if (card1Tags) card1Tags.textContent = current.p1.tags;
      if (card1Img) card1Img.src = current.p1.img;

      if (card2Title) card2Title.textContent = current.p2.title;
      if (card2Tags) card2Tags.textContent = current.p2.tags;
      if (card2Img) card2Img.src = current.p2.img;
    }
  }

  prevBtn.addEventListener('click', () => {
    const nextIdx = (currentIndex - 1 + projects.length) % projects.length;
    updateCarousel(nextIdx);
  });

  nextBtn.addEventListener('click', () => {
    const nextIdx = (currentIndex + 1) % projects.length;
    updateCarousel(nextIdx);
  });
}

// 5. Interactive Contact Form with Validation & Feedback Toast
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

// 6. GSAP Animations & ScrollTrigger
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
    }, '<0.1')
    .from('.hero-float-badge, .hero-scroll-indicator', {
      opacity: 0,
      duration: 0.4
    }, '-=0.2');

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
                counter.innerHTML = Math.floor(counter.innerText) + `<span class="text-blue-500">${suffix}</span>`;
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

    // F. Work Section Cards
    gsap.from('.work-grid .project-card', {
      scrollTrigger: {
        trigger: '.work-section',
        start: 'top 80%',
        once: true
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // G. Insights Cards
    gsap.from('.insight-card', {
      scrollTrigger: {
        trigger: '.insights-section',
        start: 'top 80%',
        once: true
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // H. Testimonial Cards
    gsap.from('.quote-card', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%',
        once: true
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.testimonials-visual-banner', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 80%',
        once: true
      },
      scale: 0.96,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });

    // I. Contact Box
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

