document.addEventListener("DOMContentLoaded", () => {

  /* =============================================
     NAVBAR — scroll shadow + mobile menu
     ============================================= */
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      const icon = menuBtn.querySelector("i");
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        const icon = menuBtn.querySelector("i");
        icon.classList.replace("fa-xmark", "fa-bars");
      });
    });
  }

  /* =============================================
     SCROLL REVEAL — IntersectionObserver
     ============================================= */
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  const revealObs = new IntersectionObserver(
    entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.classList.add("active");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(el => revealObs.observe(el));

  // Trigger elements already in view on load
  requestAnimationFrame(() => {
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add("active");
      }
    });
  });

  /* =============================================
     HERO ENTRANCE — staggered sequence on load
     ============================================= */
  const heroSequence = [
    "#hero-eyebrow",
    "#hero-heading",
    "#hero-body",
    "#hero-cta-wrap",
    "#hero-stats",
  ];

  heroSequence.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.7s ease ${i * 0.13 + 0.1}s, transform 0.7s ease ${i * 0.13 + 0.1}s`;

    // Double rAF forces a new paint frame so the transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  });

  /* =============================================
     PARALLAX — hero image on scroll
     ============================================= */
  const parallaxEl = document.getElementById("hero-img-parallax");

  if (parallaxEl) {
    window.addEventListener("scroll", () => {
      parallaxEl.style.transform = `translateY(${window.scrollY * 0.14}px)`;
    }, { passive: true });
  }

  /* =============================================
     COUNTER ANIMATION — data-count attribute
     ============================================= */
  function animateCount(el, target, duration = 1400) {
    const start = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(
    entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          animateCount(target, parseInt(target.dataset.count, 10));
          counterObs.unobserve(target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach(el => counterObs.observe(el));

  /* =============================================
     3-D CARD TILT — on product cards
     ============================================= */
  document.querySelectorAll(".product-card").forEach(card => {
    let raf;
    card.addEventListener("mousemove", e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left)  / r.width  - 0.5;
        const y  = (e.clientY - r.top)   / r.height - 0.5;
        card.style.transform =
          `translateY(-8px) perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });

  /* =============================================
     BENEFIT ITEMS — stagger activation on scroll
     ============================================= */
  const benefitItems = document.querySelectorAll(".benefit-item");

  benefitItems.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px) scale(0.95)";
    el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
  });

  const benefitObs = new IntersectionObserver(
    entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.style.opacity = "1";
          target.style.transform = "translateY(0) scale(1)";
          benefitObs.unobserve(target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  benefitItems.forEach(el => benefitObs.observe(el));

  /* =============================================
     FORM SUBMIT — redirige a WhatsApp con los datos
     ============================================= */
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const nombre   = form.nombre.value.trim();
      const empresa  = form.empresa.value.trim();
      const telefono = form.telefono.value.trim();
      const mensaje  = form.mensaje.value.trim();

      let texto = `Hola ESMEX Aceros, me comunico desde su página web.\n\n`;
      texto += `*Nombre:* ${nombre}\n`;
      if (empresa) texto += `*Empresa:* ${empresa}\n`;
      texto += `*Teléfono:* ${telefono}\n`;
      texto += `*Mensaje:* ${mensaje}`;

      const url = `https://wa.me/525615533783?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank", "noopener,noreferrer");

      form.reset();
    });
  }
});

