const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const year = document.getElementById("year");

// A locally rendered sculpture: no video download or external 3D dependency.
const sculpture = document.getElementById("heroSculpture");
if (sculpture) {
  const ctx = sculpture.getContext("2d");
  const hero = sculpture.closest("section");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0, height = 0, frame = 0, visible = true, phase = 0, lastTime = 0;
  const mesh = [];
  const center = (t) => [(2 + 0.65 * Math.cos(3 * t)) * Math.cos(2 * t), (2 + 0.65 * Math.cos(3 * t)) * Math.sin(2 * t), 0.95 * Math.sin(3 * t)];
  const unit = (v) => { const length = Math.hypot(...v); return v.map(n => n / length); };
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160 * Math.PI * 2;
    const c = center(t), next = center(t + 0.001);
    const tangent = unit(next.map((n, k) => n - c[k]));
    const normal = unit(cross(tangent, [0, 0, 1]));
    const binormal = cross(tangent, normal);
    const ring = [];
    for (let j = 0; j <= 24; j++) {
      const a = j / 24 * Math.PI * 2;
      ring.push(c.map((n, k) => n + 0.49 * (Math.cos(a) * normal[k] + Math.sin(a) * binormal[k])));
    }
    mesh.push(ring);
  }
  function draw(time = 0) {
    frame = 0;
    if (!ctx || !width || !height) return;
    if (lastTime && !motion.matches) phase += Math.min(time - lastTime, 40) * 0.00013;
    lastTime = time;
    const scroll = motion.matches ? 0 : Math.min(window.scrollY / hero.offsetHeight, 1);
    const angle = -0.4 + phase + scroll * 0.6;
    const tilt = 0.95 + Math.sin(phase) * 0.13;
    const rotate = ([x,y,z]) => {
      const a = x * Math.cos(angle) + z * Math.sin(angle), b = z * Math.cos(angle) - x * Math.sin(angle);
      return [a * 0.94 - y * 0.34, (y * 0.94 + a * 0.34) * Math.cos(tilt) - b * Math.sin(tilt), (y * 0.94 + a * 0.34) * Math.sin(tilt) + b * Math.cos(tilt)];
    };
    const points = mesh.map(r => r.map(rotate));
    const scale = Math.min(width, height) * 0.155;
    const project = ([x,y,z]) => { const p = 9 / (9-z); return [width * 0.52 + x*scale*p, height * 0.49 + y*scale*p]; };
    const faces = [];
    for (let i = 0; i < 160; i++) for (let j = 0; j < 24; j++) {
      const vertices = [points[i][j], points[i+1][j], points[i+1][j+1], points[i][j+1]];
      const a = vertices[1].map((n,k)=>n-vertices[0][k]), b = vertices[3].map((n,k)=>n-vertices[0][k]);
      const n = unit(cross(a,b));
      const diffuse = Math.abs(n[0]*-0.35 + n[1]*-0.65 + n[2]*0.68);
      const highlight = Math.pow(diffuse, 14);
      const rim = Math.pow(1-Math.abs(n[2]), 3);
      const light = 12 + diffuse*29 + highlight*45 + rim*12;
      faces.push({vertices, depth:vertices.reduce((s,v)=>s+v[2],0), color:`hsl(${211 + diffuse*9} ${60-highlight*40}% ${light}%)`});
    }
    ctx.clearRect(0,0,width,height);
    faces.sort((a,b)=>a.depth-b.depth).forEach(face=>{
      ctx.beginPath();
      face.vertices.forEach((v,i)=>{const p=project(v);i?ctx.lineTo(...p):ctx.moveTo(...p);});
      ctx.closePath(); ctx.fillStyle=face.color; ctx.strokeStyle=face.color; ctx.lineWidth=0.65; ctx.fill(); ctx.stroke();
    });
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
  }
  function refresh() { cancelAnimationFrame(frame); lastTime = 0; draw(); }
  new ResizeObserver(() => {
    const bounds = sculpture.getBoundingClientRect(); width = bounds.width; height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    sculpture.width = Math.round(width*ratio); sculpture.height = Math.round(height*ratio);
    ctx?.setTransform(ratio,0,0,ratio,0,0); refresh();
  }).observe(sculpture);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) refresh(); else cancelAnimationFrame(frame); }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) refresh(); else cancelAnimationFrame(frame); });
  motion.addEventListener("change", refresh);
}

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

contactForm?.addEventListener("submit", (event) => {
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

contactForm?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    markInvalid(field, false);
  });
});

const portfolioToggle = document.getElementById("portfolioToggle");
const portfolioMore = document.getElementById("portfolioMore");
portfolioToggle?.addEventListener("click", () => {
  const expanded = portfolioToggle.getAttribute("aria-expanded") === "true";
  portfolioMore.hidden = expanded;
  portfolioToggle.setAttribute("aria-expanded", String(!expanded));
  portfolioToggle.textContent = expanded ? "View projects" : "Show fewer projects";
  if (!expanded) {
    portfolioMore.querySelector("a").focus({ preventScroll: true });
    portfolioMore.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
});
