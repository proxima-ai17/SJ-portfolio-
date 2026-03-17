const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const interactiveElements = document.querySelectorAll("a, button, .project-card");
const parallaxItems = document.querySelectorAll(".parallax");

const modal = document.getElementById("projectModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalDescription = document.getElementById("modalDescription");
const modalTools = document.getElementById("modalTools");
const modalLearning = document.getElementById("modalLearning");
const modalImage = document.getElementById("modalImage");
const projectCards = document.querySelectorAll(".project-card");

// Mobile menu
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Active nav links
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.05,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Animated text intro
function animateHeroTitle() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  const originalHTML = title.innerHTML;
  const temp = document.createElement("div");
  temp.innerHTML = originalHTML;

  const walk = (node) => {
    let result = "";

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        result += text
          .split("")
          .map((char, index) => {
            if (char === " ") return `<span class="char-space"> </span>`;
            return `<span class="char" style="transition-delay:${index * 0.02}s">${char}</span>`;
          })
          .join("");
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const className = child.getAttribute("class") || "";
        const innerText = child.textContent || "";
        const wrapped = innerText
          .split("")
          .map((char, index) => {
            if (char === " ") return `<span class="char-space"> </span>`;
            return `<span class="char" style="transition-delay:${index * 0.02 + 0.25}s">${char}</span>`;
          })
          .join("");
        result += `<span class="${className}">${wrapped}</span>`;
      }
    });

    return result;
  };

  title.innerHTML = walk(temp);
  requestAnimationFrame(() => {
    document.querySelectorAll(".char").forEach((char) => char.classList.add("show"));
  });
}

animateHeroTitle();

// Inject character animation style
const charStyle = document.createElement("style");
charStyle.innerHTML = `
  .hero-title .char {
    display: inline-block;
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.22,.61,.36,1);
  }
  .hero-title .char.show {
    opacity: 1;
    transform: translateY(0);
  }
  .hero-title .char-space {
    display: inline-block;
    width: 0.28em;
  }
`;
document.head.appendChild(charStyle);

// Custom cursor
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorRing?.classList.add("active");
  });
  el.addEventListener("mouseleave", () => {
    cursorRing?.classList.remove("active");
  });
});

// Parallax mouse movement
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  parallaxItems.forEach((item) => {
    const speed = parseFloat(item.dataset.speed || "0.03");
    const moveX = x * 18 * speed;
    const moveY = y * 18 * speed;
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });
});

// Project modals
function openModal(card) {
  const title = card.dataset.modalTitle || "";
  const subtitle = card.dataset.modalSubtitle || "";
  const description = card.dataset.modalDescription || "";
  const tools = card.dataset.modalTools || "";
  const learning = card.dataset.modalLearning || "";
  const image = card.dataset.modalImage || "";

  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
  modalDescription.textContent = description;
  modalTools.textContent = tools;
  modalLearning.textContent = learning;
  modalImage.src = image;
  modalImage.alt = `${title} preview`;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

projectCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".project-open") || e.currentTarget === card) {
      openModal(card);
    }
  });
});

modalClose?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});

// Slight scroll-based section polish
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.querySelectorAll(".hero-shell, .panel, .feature-card, .skill-card").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      const offset = (rect.top - window.innerHeight / 2) * 0.01;
      el.style.filter = `saturate(${1.02})`;
      el.style.willChange = "transform";
      if (!el.classList.contains("parallax")) {
        el.style.transform = `translateY(${offset * -1.5}px)`;
      }
    }
  });

  if (scrollY < 20) {
    document.querySelectorAll(".panel, .feature-card, .skill-card").forEach((el) => {
      if (!el.classList.contains("parallax")) {
        el.style.transform = "";
      }
    });
  }
});