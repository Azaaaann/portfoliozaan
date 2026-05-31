const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const navItems = Array.from(document.querySelectorAll(".nav-links a"));
const sections = Array.from(document.querySelectorAll(".page-section[id]"));
const revealItems = Array.from(document.querySelectorAll(".scroll-3d"));
const planCards = Array.from(document.querySelectorAll(".plan-card"));
const modal = document.querySelector(".plan-modal");
const modalTitle = document.querySelector("#modal-title");
const modalPrice = document.querySelector("#modal-price");
const modalMail = document.querySelector("#modal-mail");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  if (!themeToggle) {
    return;
  }
  themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
};

const savedTheme = localStorage.getItem("denzi-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(savedTheme || preferredTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("denzi-theme", nextTheme);
});

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

const setActiveNav = (sectionId) => {
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.getAttribute("href") === `#${sectionId}`);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      setActiveNav(visible.target.id);
    }
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.18, 0.35, 0.6],
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const openPlan = (card) => {
  const plan = card.dataset.plan || "Selected Plan";
  const price = card.dataset.price || "";
  const paymentUrl = new URL("payment.html", window.location.href);

  paymentUrl.searchParams.set("plan", plan);
  paymentUrl.searchParams.set("price", price);
  window.location.href = paymentUrl.toString();
};

const closePlan = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

planCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest(".get-button")) {
      openPlan(card);
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closePlan);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closePlan();
  }
});

// --- Enhanced Micro-interactions ---

// 1. Before/After Comparison Slider
const baSlider = document.querySelector(".ba-slider");
const baRange = document.querySelector(".ba-range");
baRange?.addEventListener("input", (event) => {
  baSlider.style.setProperty("--clip-pos", `${event.target.value}%`);
});

// 2. 3D Tilt Card Interaction
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Subtle rotation: max 8 degrees
    const rx = -((y - yc) / yc) * 8;
    const ry = ((x - xc) / xc) * 8;
    
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
    card.style.setProperty("--scale", "1.02");
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--scale", "1");
  });
});

// 3. Shrinking Header on Scroll
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header?.classList.add("header-shrunk");
  } else {
    header?.classList.remove("header-shrunk");
  }
});

// 4. Click Portfolio Thumbnail to Order Plan
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    openPlan(card);
  });
});
