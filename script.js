// anime.js v3 loaded via CDN — available as global `anime`

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// History nav runs always (not animation-dependent)
initHistoryNav();

if (!prefersReducedMotion) {
    initPageAnimations();
    initScrollAnimations();
    initImageModal();
} else {
    initImageModal();
}

// ─── Page load animations ──────────────────────────────────────────────────

function initPageAnimations() {
    anime({
        targets: ".custom-navbar",
        translateY: [-24, 0],
        opacity: [0, 1],
        duration: 700,
        easing: "easeOutExpo"
    });

    animateHeroTitle();

    anime({
        targets: ".hero-img",
        scale: [0.92, 1],
        opacity: [0, 1],
        rotate: [-2, 0],
        delay: 450,
        duration: 950,
        easing: "easeOutExpo"
    });

    anime({
        targets: ".hero-mini-info span",
        translateY: [14, 0],
        opacity: [0, 1],
        delay: anime.stagger(80, { start: 650 }),
        duration: 650,
        easing: "easeOutExpo"
    });

    anime({
        targets: ".social-links a",
        scale: [0.7, 1],
        opacity: [0, 1],
        delay: anime.stagger(70, { start: 820 }),
        duration: 600,
        easing: "easeOutBack"
    });

    anime({
        targets: [".lead-text", ".hero-actions"],
        translateY: [24, 0],
        opacity: [0, 1],
        delay: anime.stagger(90, { start: 1000 }),
        duration: 850,
        easing: "easeOutExpo"
    });
}

// 1. Título del hero letra por letra ─────────────────────────────────────────

function animateHeroTitle() {
    const h1 = document.querySelector(".hero-section h1");
    if (!h1) return;

    const text = h1.textContent;
    h1.innerHTML = "";
    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.textContent = char === " " ? " " : char;
        h1.appendChild(span);
    });

    anime({
        targets: ".hero-section h1 span",
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(50, { start: 200 }),
        duration: 600,
        easing: "easeOutExpo"
    });

    // Subtítulo aparece completo después del título
    const subtitle = document.querySelector(".hero-section .subtitle");
    if (subtitle) {
        subtitle.style.opacity = "0";
        anime({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [12, 0],
            delay: 950,
            duration: 700,
            easing: "easeOutExpo"
        });
    }
}

// ─── Scroll animations ────────────────────────────────────────────────────

function initScrollAnimations() {
    // Reveal general (excluye proyecto-card, que tiene su propio stagger)
    const generalItems = document.querySelectorAll(
        ".custom-card:not(.proyecto-card), .timeline-item, .gallery-card, .section-title, .section-intro"
    );

    generalItems.forEach(item => item.classList.add("is-hidden"));

    const generalObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.remove("is-hidden");
                el.classList.add("is-visible");
                anime({
                    targets: el,
                    translateY: [28, 0],
                    opacity: [0, 1],
                    duration: 780,
                    easing: "easeOutExpo"
                });
                obs.unobserve(el);
            });
        },
        { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
    );

    generalItems.forEach(item => generalObserver.observe(item));

    // 2. Cards de proyectos con stagger ─────────────────────────────────────
    initProjectCardsAnimation();

    // 3. Barras de habilidades ───────────────────────────────────────────────
    initSkillChipsAnimation();
}

// 2. Proyecto cards: fade + slide up con stagger de 150ms ─────────────────

function initProjectCardsAnimation() {
    const cards = Array.from(document.querySelectorAll(".proyecto-card"));
    if (!cards.length) return;

    cards.forEach(card => card.classList.add("is-hidden"));

    const projectRow = document.querySelector("#proyectos .row");
    if (!projectRow) return;

    let triggered = false;

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || triggered) return;
                triggered = true;

                cards.forEach(c => {
                    c.classList.remove("is-hidden");
                    c.classList.add("is-visible");
                });

                anime({
                    targets: cards,
                    translateY: [40, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(150),
                    duration: 800,
                    easing: "easeOutExpo"
                });

                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.05 }
    );

    observer.observe(projectRow);
}

// 3. Skill chips: fill de izquierda a derecha con clip-path ───────────────

function initSkillChipsAnimation() {
    const skillSections = document.querySelectorAll(".skills-grid");

    skillSections.forEach(section => {
        const chips = Array.from(section.querySelectorAll(".skill-chip"));

        chips.forEach(chip => {
            chip.style.clipPath = "inset(0 100% 0 0)";
            chip.style.opacity = "0";
        });

        const skillObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    anime({
                        targets: chips,
                        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
                        opacity: [0, 1],
                        delay: anime.stagger(80),
                        duration: 800,
                        easing: "easeOutQuart"
                    });

                    obs.unobserve(section);
                });
            },
            { threshold: 0.22 }
        );

        skillObserver.observe(section);
    });
}

// ─── Image modal ──────────────────────────────────────────────────────────

function initImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const galleryImages = document.querySelectorAll(".gallery-img");
    const closeModal = document.querySelector(".close-modal");

    if (!modal || !modalImg || !closeModal) return;

    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            modal.classList.add("active");
            modalImg.src = img.src;
            modalImg.alt = img.alt;

            if (!prefersReducedMotion) {
                anime({
                    targets: modalImg,
                    scale: [0.96, 1],
                    opacity: [0, 1],
                    duration: 350,
                    easing: "easeOutExpo"
                });
            }
        });
    });

    closeModal.addEventListener("click", () => modal.classList.remove("active"));

    modal.addEventListener("click", event => {
        if (event.target === modal) modal.classList.remove("active");
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") modal.classList.remove("active");
    });
}

// ─── History API navigation (clean URLs, no #) ────────────────────────────

function initHistoryNav() {
    // Intercept all internal hash-link clicks
    document.addEventListener("click", event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const sectionId = link.getAttribute("href").slice(1); // "#inicio" → "inicio"
        const section = document.getElementById(sectionId);
        if (!section) return;

        event.preventDefault();
        history.pushState({ sectionId }, "", `/${sectionId}`);
        section.scrollIntoView({ behavior: "smooth" });
    });

    // Handle browser back / forward
    window.addEventListener("popstate", () => {
        const sectionId = getPathnameSection();
        if (!sectionId) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    });

    // On direct URL access (e.g. /logros), scroll to the matching section
    const sectionId = getPathnameSection();
    if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) setTimeout(() => section.scrollIntoView({ behavior: "smooth" }), 300);
    }
}

function getPathnameSection() {
    return window.location.pathname.replace(/^\/|\/$/g, "") || null;
}
