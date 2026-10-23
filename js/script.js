// Page Fade In: only what's on screen when the page opens eases in; anything further down shows instantly
function pageTop(el) {
    let top = 0;
    for (; el; el = el.offsetParent) top += el.offsetTop; // ignores the fade's slide offset
    return top;
}

const screenBottom = window.scrollY + window.innerHeight;
document.querySelectorAll("[data-fade]").forEach((el) => {
    if (pageTop(el) >= screenBottom) el.removeAttribute("data-fade");
});

// Title Fade + Header Stroke
const heroTitle = document.querySelector('.title');
// Fade the arrow itself, not its wrapper, so it doesn't fight the wrapper's fade-in
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
    // Once fully faded, stop the invisible arrow from catching clicks
    scrollDownArrow.closest('.scroll-down').style.visibility = arrowOpacity === 0 ? 'hidden' : '';
}

// Only the home page has a hero title; other pages use .perma-line instead
if (heroTitle) {
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    updateOnScroll(); // correct state if the page loads already scrolled
}

// Scroll Progress: the header line fills left to right as the page scrolls
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

    // If the choice matches the system, forget the override so the site keeps following the system
    if (isDarkNow === darkQuery.matches) {
        localStorage.removeItem("theme");
    } else {
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    }

    applyTheme();
});

// Re-check whenever a page is shown, including when it's restored by the Back/Forward buttons
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

// If the page is restored with Back/Forward, don't show the menu still open
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

// Work page: clicking anywhere on a card opens its project, not just the title and thumbnail.
// The title stays the real link (for keyboards), so its blue hover still only shows over the title
document.querySelectorAll(".work-grid .work-card").forEach((card) => {
    const link = card.querySelector(".work-link");
    if (!link) return;

    card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // the title and thumbnail links handle themselves
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

// Page Navigation (About + project pages): back button, scroll progress ring and section menu
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

    // Go back if the visitor came from another page on this site; otherwise the link's fallback page opens
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

    // A clicked section stays current until the visitor scrolls themselves. Otherwise, when two short
    // sections sit close together, landing on one can still mark the next as current
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

    // The visitor's own scrolling (wheel, touch, scrollbar, scroll keys) releases the pin;
    // the smooth scroll that follows a click doesn't
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

    // Wide screens (1440px+): the same sections as a fixed list on the left, plus a return-to-top button
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

    // Move the list next to the sections: it becomes the first column of their container (the CSS makes
    // that a grid at 1440px), spanning every section so it can stick while they scroll past
    const sectionBlocks = sectionHeaders.map((h) => h.closest(".section-item, .resume-item"));
    if (sectionBlocks.length) {
        const host = sectionBlocks[0].parentElement;
        host.classList.add("toc-host");
        host.insertBefore(toc, sectionBlocks[0]);
        toc.style.gridRow = `span ${sectionBlocks.length}`;
    }

    tocTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

    // Return to Top shows once the page has scrolled one full screen (like the landing page's),
    // and fades out once the footer scrolls up to it, so it never sits on top of the footer's links
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

        // Current section: the last header that has passed a third of the way down the screen.
        // At the very end no section is current, so the menu shows no dot or bold item
        const line = window.innerHeight / 3;
        let current = -1;
        sectionHeaders.forEach((h, i) => {
            if (h.getBoundingClientRect().top <= line) current = i;
        });
        if (atEnd) current = -1;

        // A section the visitor clicked wins until they scroll themselves
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