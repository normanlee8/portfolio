// Page Fade In: only the first screen fades in. Runs last, once the layout is final
function pageTop(el) {
    let top = 0;
    for (; el; el = el.offsetParent) top += el.offsetTop; // ignores the fade's slide offset
    return top;
}

// Blocks with their own text or background fade as one piece
function canSplitFade(el) {
    if (!el.children.length) return false;
    if (getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)") return false;
    return ![...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
}

function limitFadeToFirstScreen(el, screenBottom, leeway) {
    const top = pageTop(el);
    if (top >= screenBottom) {
        el.removeAttribute("data-fade");
        return;
    }
    if (top + el.offsetHeight <= screenBottom + leeway || !canSplitFade(el)) return;

    // Crosses the fold: fade its children instead
    const step = el.getAttribute("data-fade");
    el.removeAttribute("data-fade");
    for (const child of el.children) {
        child.setAttribute("data-fade", step);
        limitFadeToFirstScreen(child, screenBottom, leeway);
    }
}

function setUpPageFade() {
    const screenBottom = window.innerHeight; // the page's top screen, not the restored scroll position
    const leeway = window.innerHeight * 0.1; // up to 10% past the fold still fades whole
    document.querySelectorAll("[data-fade]").forEach((el) => {
        if (el.hasAttribute("data-fade")) limitFadeToFirstScreen(el, screenBottom, leeway);
    });

    // Opened (or restored by a refresh) away from the top: show everything at once instead of waiting
    function skipFadeIfScrolled() {
        if (window.scrollY < window.innerHeight / 2) return;
        document.getAnimations().forEach((a) => {
            if (a.animationName === "page-fade-in") a.finish();
        });
    }

    skipFadeIfScrolled();
    window.addEventListener("scroll", skipFadeIfScrolled, { passive: true });
    window.addEventListener("load", skipFadeIfScrolled);
    setTimeout(() => window.removeEventListener("scroll", skipFadeIfScrolled), 4000); // the fade is over by then
}

// Title Fade + Header Stroke
const heroTitle = document.querySelector('.title');
// the arrow fades separately from its wrapper's fade-in
const scrollDownArrow = document.querySelector('.scroll-down svg');
const header = document.querySelector('.header');
const FADE_DISTANCE = 8; // px of scroll to fully fade out
const ARROW_FADE_DISTANCE = 200; // px of scroll for the arrow to fully fade out

function updateOnScroll() {
    const progress = Math.min(window.scrollY / FADE_DISTANCE, 1);
    heroTitle.style.opacity = 1 - progress;
    header.classList.toggle('scrolled', progress === 1);
    const arrowOpacity = 1 - Math.min(window.scrollY / ARROW_FADE_DISTANCE, 1);
    scrollDownArrow.style.opacity = arrowOpacity;
    // invisible arrow can't be clicked
    scrollDownArrow.closest('.scroll-down').style.visibility = arrowOpacity === 0 ? 'hidden' : '';
}

// Only the home page has a hero title; other pages use .perma-line instead
if (heroTitle) {
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    updateOnScroll(); // correct state if the page loads already scrolled
}

// Scroll Progress
function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    header.style.setProperty('--scroll-progress', progress);
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Theme Toggle
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Saved choice wins; otherwise follow the system setting
function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return darkQuery.matches ? "dark" : "light";
}

function applyTheme() {
    const isDark = getPreferredTheme() === "dark";
    document.documentElement.classList.toggle("dark-theme", isDark);
    updateButtonAria(isDark);
}

function updateButtonAria(isDark) {
    const label = isDark ? "Change to light mode" : "Change to dark mode";
    themeToggleBtn.setAttribute("aria-label", label);
    themeToggleBtn.setAttribute("title", label);
}

applyTheme();

themeToggleBtn.addEventListener("click", () => {
    const isDarkNow = !document.documentElement.classList.contains("dark-theme");

    // Matching the system clears the saved choice
    if (isDarkNow === darkQuery.matches) {
        localStorage.removeItem("theme");
    } else {
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    }

    applyTheme();
});

// Re-check when a page is shown, including from Back/Forward
window.addEventListener("pageshow", applyTheme);

// Keep other open tabs of your site in sync
window.addEventListener("storage", (e) => {
    if (e.key === "theme" || e.key === null) applyTheme();
});

// Follow the system theme if there's no saved choice
darkQuery.addEventListener("change", applyTheme);

// Hamburger menu
const menu = document.getElementById("menu");
const burger = document.querySelector(".hamburger-menu");

function setMenu(open) {
    menu.classList.toggle("hidden", !open);
    burger.setAttribute("aria-expanded", open);
}

burger.addEventListener("click", () => {
    setMenu(menu.classList.contains("hidden")); // open if currently hidden
});

document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
});

// Close the menu when returning with Back/Forward
window.addEventListener("pageshow", (e) => {
    if (e.persisted) setMenu(false);
});

// Copy Email
const copyEmailBtn = document.getElementById("copy-email");
const toast = document.getElementById("toast");
const EMAIL = "normanlee2002@gmail.com";
let toastTimer;

function showToast() {
    toast.classList.add("show");
    clearTimeout(toastTimer); // restart the timer if clicked again
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// Only run on pages that have the footer
if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            showToast();
        } catch (err) {
            console.error("Copy failed:", err);
        }
    });
}

// Work page: the whole card opens its project
document.querySelectorAll(".work-grid .work-card").forEach((card) => {
    const link = card.querySelector(".work-link");
    if (!link) return;

    card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // real links handle themselves
        if (window.getSelection().toString()) return; // don't navigate while selecting text
        if (e.ctrlKey || e.metaKey) window.open(link.href, "_blank");
        else window.location.href = link.href;
    });
});

// Return to Top
const returnTopBtn = document.querySelector(".return-top");

function updateReturnTop() {
    // Show once the user has scrolled past one full viewport height
    returnTopBtn.classList.toggle("visible", window.scrollY > window.innerHeight);
}

if (returnTopBtn) {
    window.addEventListener("scroll", updateReturnTop, { passive: true });
    window.addEventListener("resize", updateReturnTop);
    updateReturnTop(); // correct state if the page loads already scrolled

    returnTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0 });
    });
}

// Page Navigation (About + project pages)
const pageNav = document.querySelector(".page-nav");

if (pageNav) {
    const backBtn = pageNav.querySelector(".page-nav-back");
    const sectionToggle = pageNav.querySelector(".section-toggle");
    const sectionMenu = document.getElementById("section-menu");
    const sectionList = sectionMenu.querySelector(".section-list");
    const sectionLabel = pageNav.querySelector(".section-label");
    const progressPercent = pageNav.querySelector(".progress-percent");
    const progressFill = pageNav.querySelector(".progress-fill");
    const sectionHeaders = [...document.querySelectorAll(".section-header, .resume-header")];

    // Go back if the visitor came from this site; otherwise follow the link
    backBtn.addEventListener("click", (e) => {
        const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
        if (cameFromSite && history.length > 1) {
            e.preventDefault();
            history.back();
        }
    });

    function setSectionMenu(open) {
        sectionMenu.classList.toggle("hidden", !open);
        sectionToggle.setAttribute("aria-expanded", open);
    }

    function addMenuItem(text, onClick) {
        const item = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = text;
        btn.addEventListener("click", () => {
            onClick();
            setSectionMenu(false);
        });
        item.append(btn);
        sectionList.append(item);
        return btn;
    }

    // A clicked section stays current until the visitor scrolls
    let pinnedSection = null;

    function goToSection(i) {
        pinnedSection = i;
        sectionHeaders[i].scrollIntoView();
        updatePageNav();
    }

    function unpinSection() {
        if (pinnedSection === null) return;
        pinnedSection = null;
        updatePageNav();
    }

    // The visitor's scrolling releases it; the smooth scroll after a click doesn't
    window.addEventListener("wheel", unpinSection, { passive: true });
    window.addEventListener("touchstart", unpinSection, { passive: true });
    window.addEventListener("mousedown", unpinSection);
    window.addEventListener("keydown", (e) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) unpinSection();
    });

    addMenuItem("Return to Top", () => window.scrollTo({ top: 0 }));
    const sectionItems = sectionHeaders.map((h, i) =>
        addMenuItem(h.textContent.trim(), () => goToSection(i))
    );

    // Wide screens (1280px+): side list and return-to-top
    const toc = document.querySelector(".page-toc");
    const tocTop = document.querySelector(".toc-top");
    const tocItems = sectionHeaders.map((h, i) => {
        const item = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = h.textContent.trim();
        btn.addEventListener("click", () => goToSection(i));
        item.append(btn);
        toc.querySelector(".toc-list").append(item);
        return btn;
    });

    // Move the list beside the sections (a grid at 1280px)
    const sectionBlocks = sectionHeaders.map((h) => h.closest(".section-item, .resume-item"));
    if (sectionBlocks.length) {
        const host = sectionBlocks[0].parentElement;
        host.classList.add("toc-host");
        host.insertBefore(toc, sectionBlocks[0]);
        toc.style.gridRow = `span ${sectionBlocks.length}`;
    }

    tocTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

    // Return to Top: shown after a screen of scrolling, hidden at the footer
    const footer = document.querySelector(".section-footer");

    function updateTocOverlap() {
        tocTop.classList.toggle("is-shown", window.scrollY > window.innerHeight);
        tocTop.classList.toggle("is-covered", footer.getBoundingClientRect().top < tocTop.getBoundingClientRect().bottom);
    }

    function updatePageNav() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
        const percent = Math.round(progress * 100);
        const atEnd = percent === 100; // matches the ring reading 100%
        progressPercent.textContent = `${percent}%`;
        progressFill.style.strokeDasharray = `${progress * 100} 100`;

        // Current section: last header past a third of the screen; none at the end
        const line = window.innerHeight / 3;
        let current = -1;
        sectionHeaders.forEach((h, i) => {
            if (h.getBoundingClientRect().top <= line) current = i;
        });
        if (atEnd) current = -1;

        // a clicked section wins
        const pinned = pinnedSection !== null;
        if (pinned) current = pinnedSection;

        if (atEnd && !pinned) sectionLabel.textContent = "The End";
        else sectionLabel.textContent = current >= 0 ? sectionHeaders[current].textContent.trim() : "Scroll Down";
        [sectionItems, tocItems].forEach((items) => items.forEach((btn, i) => {
            if (i === current) btn.setAttribute("aria-current", "true");
            else btn.removeAttribute("aria-current");
        }));
        updateTocOverlap();
    }

    sectionToggle.addEventListener("click", () => {
        setSectionMenu(sectionMenu.classList.contains("hidden")); // open if currently hidden
    });

    document.addEventListener("click", (e) => {
        if (!pageNav.contains(e.target)) setSectionMenu(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setSectionMenu(false);
    });

    window.addEventListener("scroll", updatePageNav, { passive: true });
    window.addEventListener("resize", updatePageNav);
    updatePageNav();
}

// Run last, once the layout is final
setUpPageFade();
