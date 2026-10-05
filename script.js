const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

function syncHeaderState() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 520);
}

function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  navToggle.classList.toggle("active", isOpen);
  header.classList.toggle("menu-active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(element);
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function markInvalid(field, invalid) {
  field.classList.toggle("is-invalid", invalid);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
  let isValid = true;

  fields.forEach((field) => {
    const value = field.value.trim();
    let invalid = field.hasAttribute("required") && value.length === 0;

    if (field.type === "email" && value && !isValidEmail(value)) {
      invalid = true;
    }

    if (field.name === "phone" && value && value.replace(/\D/g, "").length < 9) {
      invalid = true;
    }

    markInvalid(field, invalid);
    if (invalid) isValid = false;
  });

  if (!isValid) {
    formMessage.textContent = "Please complete all fields with valid contact details.";
    formMessage.style.color = "#D93025";
    return;
  }

  formMessage.textContent = "Thank you. Your request has been prepared successfully.";
  formMessage.style.color = "#0B7A39";
  contactForm.reset();

  window.setTimeout(() => {
    formMessage.textContent = "";
  }, 5200);
});

contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    markInvalid(field, false);
  });
});

const portfolioToggle = document.getElementById("portfolioToggle");
const portfolioMore = document.getElementById("portfolioMore");
portfolioToggle.addEventListener("click", () => {
  const expanded = portfolioToggle.getAttribute("aria-expanded") === "true";
  portfolioMore.hidden = expanded;
  portfolioToggle.setAttribute("aria-expanded", String(!expanded));
  portfolioToggle.textContent = expanded ? "View all projects" : "Show fewer projects";
  if (!expanded) {
    portfolioMore.querySelector("a").focus({ preventScroll: true });
    portfolioMore.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
});
