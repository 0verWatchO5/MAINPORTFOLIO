// Initialize EmailJS
;(() => {
  emailjs.init("zWEkzzUo64mefMWHQ") // Replace with your EmailJS user ID
})()

document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  const preloader = document.querySelector(".preloader")
  window.addEventListener("load", () => {
    preloader.classList.add("hidden")
    setTimeout(() => {
      preloader.style.display = "none"
    }, 2000)
  })

  // Custom cursor
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"

      setTimeout(() => {
        cursorFollower.style.left = e.clientX + "px"
        cursorFollower.style.top = e.clientY + "px"
      }, 100)
    })

    document.addEventListener("mousedown", () => {
      cursor.style.width = "8px"
      cursor.style.height = "8px"
      cursorFollower.style.width = "30px"
      cursorFollower.style.height = "30px"
    })

    document.addEventListener("mouseup", () => {
      cursor.style.width = "10px"
      cursor.style.height = "10px"
      cursorFollower.style.width = "40px"
      cursorFollower.style.height = "40px"
    })

    const links = document.querySelectorAll("a, button, .menu-toggle, .project-card, .filter-btn, .tab-btn")
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        cursor.style.width = "0px"
        cursor.style.height = "0px"
        cursorFollower.style.width = "50px"
        cursorFollower.style.height = "50px"
        cursorFollower.style.borderColor = "var(--secondary-color)"
      })

      link.addEventListener("mouseleave", () => {
        cursor.style.width = "10px"
        cursor.style.height = "10px"
        cursorFollower.style.width = "40px"
        cursorFollower.style.height = "40px"
        cursorFollower.style.borderColor = "var(--secondary-color)"
      })
    })
  } else {
    cursor.style.display = "none"
    cursorFollower.style.display = "none"
  }

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    htmlElement.className = savedTheme
  } else {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (prefersDarkMode) {
      htmlElement.classList.add("dark")
    }
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  })

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const mobileNav = document.querySelector(".mobile-nav")

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active")
    mobileNav.classList.toggle("active")
    document.body.classList.toggle("no-scroll")
  })

  // Close mobile menu when clicking on a link
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      mobileNav.classList.remove("active")
      document.body.classList.remove("no-scroll")
    })
  })

  // Header scroll effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      window.scrollTo({
        top: targetSection.offsetTop - 70,
        behavior: "smooth",
      })
    })
  })

  // Active navigation link based on scroll position
  const sections = document.querySelectorAll(".section")

  function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  window.addEventListener("scroll", setActiveNavLink)

  // Initialize active nav link on page load
  setActiveNavLink()

  // Skills tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const target = this.dataset.target

      tabBtns.forEach((btn) => btn.classList.remove("active"))
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      this.classList.add("active")
      document.getElementById(target).classList.add("active")
    })
  })

  // Projects filter
  const filterBtns = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.filter

      filterBtns.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      projectCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "scale(1)"
          }, 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "scale(0.8)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Project modals
  const projectLinks = document.querySelectorAll(".project-link")
  const projectModals = document.querySelectorAll(".project-modal")
  const modalCloses = document.querySelectorAll(".modal-close")

  projectLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = this.getAttribute("href")
      const modal = document.querySelector(target)

      modal.classList.add("active")
      document.body.style.overflow = "hidden"
    })
  })

  modalCloses.forEach((close) => {
    close.addEventListener("click", function () {
      const modal = this.closest(".project-modal")
      modal.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  })

  projectModals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
        document.body.style.overflow = "auto"
      }
    })
  })

  // Animate skill bars on scroll
  const skillLevels = document.querySelectorAll(".skill-level")

  function animateSkillBars() {
    skillLevels.forEach((skill) => {
      const skillPosition = skill.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.3

      if (skillPosition < screenPosition) {
        skill.style.width = skill.style.width
      }
    })
  }

  // Animate stats counter
  const statNumbers = document.querySelectorAll(".stat-number")
  let statsAnimated = false

  function animateStats() {
    if (statsAnimated) return

    const statsSection = document.querySelector(".stats-section")
    const statsSectionPosition = statsSection.getBoundingClientRect().top
    const screenPosition = window.innerHeight / 1.3

    if (statsSectionPosition < screenPosition) {
      statsAnimated = true

      statNumbers.forEach((stat) => {
        const target = Number.parseInt(stat.dataset.count)
        let count = 0
        const duration = 2000 // 2 seconds
        const increment = target / (duration / 16) // 60fps

        const updateCount = () => {
          if (count < target) {
            count += increment
            stat.textContent = Math.ceil(count)
            requestAnimationFrame(updateCount)
          } else {
            stat.textContent = target
          }
        }

        updateCount()
      })
    }
  }

  // Network visualization
  const canvas = document.getElementById("network-canvas")
  if (canvas) {
    const ctx = canvas.getContext("2d")
    const nodes = []
    const connections = []

    // Set canvas size
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create nodes
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
      })
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.85) {
          connections.push({
            from: i,
            to: j,
          })
        }
      }
    }

    // Draw network
    function drawNetwork() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = "rgba(231, 76, 60, 0.2)"
      ctx.lineWidth = 1

      connections.forEach((connection) => {
        const fromNode = nodes[connection.from]
        const toNode = nodes[connection.to]

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      })

      // Draw nodes
      ctx.fillStyle = "rgba(231, 76, 60, 0.6)"

      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      requestAnimationFrame(drawNetwork)
    }

    drawNetwork()
  }

  // Back to top button
  const backToTopBtn = document.querySelector(".back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("active")
    } else {
      backToTopBtn.classList.remove("active")
    }
  })

  backToTopBtn.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Contact form submission with EmailJS
  const contactForm = document.getElementById("contact-form")
  const formMessage = document.getElementById("form-message")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>'
      submitBtn.disabled = true

      // Send email using EmailJS
      emailjs
        .send("service_uxhbwk4", "template_rvjfpvg", formData)
        .then((response) => {
          // Show success message
          formMessage.textContent = "Your message has been sent successfully!"
          formMessage.className = "form-message success"

          // Reset form
          contactForm.reset()

          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Hide message after 5 seconds
          setTimeout(() => {
            formMessage.style.display = "none"
          }, 5000)
        })
        .catch((error) => {
          // Show error message
          formMessage.textContent = "Failed to send message. Please try again later."
          formMessage.className = "form-message error"

          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          console.error("EmailJS error:", error)
        })
    })
  }

  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector("input").value

      // Here you would typically send the email to your newsletter service
      alert("Thank you for subscribing with: " + email)
      this.reset()
    })
  }

  // Initial check for elements in view
  animateSkillBars()
  animateStats()

  // Check on scroll
  window.addEventListener("scroll", () => {
    animateSkillBars()
    animateStats()
  })
})
