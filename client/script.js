// --- Utility: debounce to avoid too-frequent resize calculations ---
function debounce(fn, wait = 100) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// --- Sync CSS variable --nav-height with actual navbar height and update body padding ---
function syncNavHeightVar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const h = nav.offsetHeight;
  document.documentElement.style.setProperty('--nav-height', `${h}px`);
  // Also set body's padding-top as a fallback for older browsers
  document.body.style.paddingTop = `${h}px`;
}

// Run sync on load and resize (debounced)
window.addEventListener('load', syncNavHeightVar);
window.addEventListener('resize', debounce(syncNavHeightVar, 120));

// ------------------- Navigation Toggle -------------------
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // Keep aria state accessible
    const expanded = navMenu.classList.contains("active");
    navToggle.setAttribute("aria-expanded", expanded);

    // After toggling menu, re-sync nav height because mobile menu may change nav height
    // Use a tiny timeout to allow the mobile menu open animation to settle if any
    setTimeout(syncNavHeightVar, 120);
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu) {
      navMenu.classList.remove("active");
      // re-sync after closing
      setTimeout(syncNavHeightVar, 80);
    }
  });
});

// ------------------- Hero video - play once then fade in content -------------------
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('ended', () => {
    const fadeElements = document.querySelectorAll('.hero-fade-in');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 200); // stagger by 200ms
    });
  });

  // Some browsers autoplay policies cause 'ended' not to fire if video doesn't start —
  // ensure fade-in if video is already ended or cannot play
  if (heroVideo.readyState >= 4 && heroVideo.ended) {
    const fadeElements = document.querySelectorAll('.hero-fade-in');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 200);
    });
  }
}

// ------------------- Smooth scrolling for anchor links (accounts for fixed nav) -------------------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = document.querySelector(href);

    if (!target) return; // allow default if no target element

    e.preventDefault();

    // compute offset by current nav height
    const navHeightValue = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    const navHeight = parseInt(navHeightValue, 10) || document.querySelector('.navbar')?.offsetHeight || 0;

    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12; // small extra gap (12px)
    window.scrollTo({
      top: targetTop,
      behavior: "smooth"
    });
  });
});

// ------------------- Counter animation for stats -------------------
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      // Keep formatting consistent: add % for 94, + for others
      element.textContent = (target === 94 ? `${target}%` : `${target.toLocaleString()}+`);
    }
  }

  updateCounter();
}

// ------------------- Intersection Observer for animations & counters -------------------
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate");

      // Animate counters when stat-value becomes visible
      if (entry.target.classList.contains("stat-value")) {
        const target = Number.parseInt(entry.target.dataset.count, 10) || 0;
        animateCounter(entry.target, target);
      }
    }
  });
}, observerOptions);

// Observe elements with data-aos and stat-values
document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
document.querySelectorAll(".stat-value").forEach((el) => observer.observe(el));

// ------------------- Navbar hide on scroll down, show on scroll up -------------------
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentY = window.scrollY;
    const navMenuEl = document.querySelector('.nav-menu');
    const menuOpen = navMenuEl && navMenuEl.classList.contains('active');

    if (menuOpen) {
      navbar.classList.remove('nav-hidden');
      lastY = currentY;
      ticking = false;
      return;
    }

    if (currentY <= 50) {
      navbar.classList.remove('nav-hidden');
    } else if (currentY > lastY + 5) {
      navbar.classList.add('nav-hidden');
    } else if (currentY < lastY - 5) {
      navbar.classList.remove('nav-hidden');
    }

    lastY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();

// ------------------- Parallax effect for hero background -------------------
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-bg-animation");
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// ------------------- Add loading animation -------------------
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  // ensure nav height synced once more on full load
  setTimeout(syncNavHeightVar, 60);
});

// ------------------- Button hover effects -------------------
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// ------------------- Feature cards hover effect -------------------
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// ------------------- Typing effect for hero title -------------------
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Initialize typing effect on load
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.textContent.trim();
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50);
    }, 1000);
  }

  // ensure nav height var is set as early as possible
  syncNavHeightVar();
});
