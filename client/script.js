// Navigation Toggle
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
  })
})

// Hero video - play once then fade in content
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('ended', () => {
    // Video finished, fade in the rest of the content
    const fadeElements = document.querySelectorAll('.hero-fade-in');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, index * 200); // stagger by 200ms
    });
  });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  function updateCounter() {
    start += increment
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString()
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target.toLocaleString() + (target === 94 ? "%" : "+")
    }
  }

  updateCounter()
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate")

      // Animate counters when stats section is visible
      if (entry.target.classList.contains("stat-value")) {
        const target = Number.parseInt(entry.target.dataset.count)
        animateCounter(entry.target, target)
      }
    }
  })
}, observerOptions)

// Observe all elements with data-aos attribute
document.querySelectorAll("[data-aos]").forEach((el) => {
  observer.observe(el)
})

// Observe stat values for counter animation
document.querySelectorAll(".stat-value").forEach((el) => {
  observer.observe(el)
})

// Navbar hide on scroll down, show on scroll up
;(function () {
  const navbar = document.querySelector('.navbar')
  if (!navbar) return

  let lastY = window.scrollY
  let ticking = false

  function onScroll() {
    const currentY = window.scrollY
    // If mobile menu is open, keep navbar visible
    const navMenu = document.querySelector('.nav-menu')
    const menuOpen = navMenu && navMenu.classList.contains('active')

    if (menuOpen) {
      navbar.classList.remove('nav-hidden')
      lastY = currentY
      return
    }

    if (currentY <= 50) {
      // near top: always show
      navbar.classList.remove('nav-hidden')
    } else if (currentY > lastY + 5) {
      // scrolling down -> hide
      navbar.classList.add('nav-hidden')
    } else if (currentY < lastY - 5) {
      // scrolling up -> show
      navbar.classList.remove('nav-hidden')
    }

    lastY = currentY
    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll)
      ticking = true
    }
  })
})()

// Parallax effect for hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroBackground = document.querySelector(".hero-bg-animation")
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`
  }
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})

// Button hover effects
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)"
  })

  button.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)"
  })
})

// Feature cards hover effect
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.innerHTML = ""

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialize typing effect on load
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const originalText = heroTitle.textContent
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50)
    }, 1000)
  }
})
