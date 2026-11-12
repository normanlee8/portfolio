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

// Work Dropdown: never runs past the header's right edge; long titles wrap instead
const projectMenu = document.querySelector('.project-menu');

function fitProjectMenu() {
    const contentRight = header.getBoundingClientRect().right - parseFloat(getComputedStyle(header).paddingRight);
    const room = contentRight - projectMenu.getBoundingClientRect().left;
    projectMenu.style.setProperty('--menu-room', `${Math.max(room, 0)}px`);
}

if (projectMenu) {
    window.addEventListener('resize', fitProjectMenu);
    document.fonts.ready.then(fitProjectMenu); // the nav's width depends on the loaded font
    fitProjectMenu();
}

// Prototype Popup: "Try the prototype" opens it here instead of leaving the site
const protoDialog = document.getElementById('proto-dialog');
const protoLink = document.querySelector('[data-prototype]');

if (protoDialog && protoLink && typeof protoDialog.showModal === 'function') {
    const protoFrame = protoDialog.querySelector('.proto-frame');
    const protoPhone = protoDialog.querySelector('.proto-phone');
    const PHONE_W = 393 + 24; // screen plus bezel
    const PHONE_H = 852 + 24;

    // shrink the phone to fit the window, leaving room for the margins and the "new tab" link
    function fitPrototype() {
        const scale = Math.min(1, (window.innerHeight - 120) / PHONE_H, (window.innerWidth - 48) / PHONE_W);
        protoPhone.style.setProperty('--proto-scale', scale.toFixed(3));
    }

    protoLink.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // still opens a new tab
        e.preventDefault();
        if (!protoFrame.src) protoFrame.src = protoFrame.dataset.src; // load on first open only
        fitPrototype();
        protoDialog.showModal();
    });

    window.addEventListener('resize', fitPrototype);
    protoDialog.querySelector('.proto-close').addEventListener('click', () => protoDialog.close());

    // clicking the dimmed area around the phone closes it (Esc does too, natively)
    protoDialog.addEventListener('click', (e) => {
        if (e.target === protoDialog || e.target.classList.contains('proto-stage')) protoDialog.close();
    });
}

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

// Header links to the page you're on scroll back to the top instead of reloading
// ("/", "/index.html", "/work" and "/work.html" count as the same page)
const pagePath = (path) => path.replace(/(index)?\.html$/, "").replace(/\/$/, "") || "/";

document.addEventListener("click", (e) => {
    const link = e.target.closest(".header a[href]");
    if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new-tab clicks still open
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.hash || pagePath(url.pathname) !== pagePath(location.pathname)) return;
    e.preventDefault();
    setMenu(false);
    window.scrollTo({ top: 0 });
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

// Local Time (PT) in the footer, updated on the minute
const localTime = document.getElementById("local-time");

if (localTime) {
    const ptFormat = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
    });

    function updateLocalTime() {
        localTime.textContent = ptFormat.format(new Date());
        localTime.closest(".local-time").hidden = false;
    }

    updateLocalTime();
    setTimeout(() => {
        updateLocalTime();
        setInterval(updateLocalTime, 60000);
    }, 60000 - (Date.now() % 60000));
}

// Location arrow: rests tilted up and to the right, like the usual current-location
// arrow, and glances toward the cursor when it comes near.
// It drifts back to rest when the cursor stops, moves away, or leaves the page
const locationArrow = document.querySelector(".location-arrow");
const ARROW_REST = 45; // degrees: up and to the right (0 = up, 90 = right)
const ARROW_REACH = 360; // px: only a cursor this close turns the arrow
const ARROW_IDLE_MS = 1500; // a still cursor is let go after this long

if (locationArrow) {
    let heading = ARROW_REST; // keeps counting past 360 so it always turns the short way
    let idleTimer = null;

    function turnTo(target) {
        heading += ((target - heading + 540) % 360) - 180;
        locationArrow.style.setProperty("--heading", `${heading}deg`);
    }

    window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = locationArrow.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        clearTimeout(idleTimer);
        if (Math.hypot(dx, dy) > ARROW_REACH) {
            turnTo(ARROW_REST);
            return;
        }
        turnTo((Math.atan2(dy, dx) * 180) / Math.PI + 90);
        idleTimer = setTimeout(() => turnTo(ARROW_REST), ARROW_IDLE_MS);
    }, { passive: true });

    // the cursor left the window
    document.addEventListener("pointerout", (e) => {
        if (!e.relatedTarget) {
            clearTimeout(idleTimer);
            turnTo(ARROW_REST);
        }
    });
}

// Thumbnails: the "View Details" pill floats at the top right of the cursor,
// easing toward it each frame so it trails loosely instead of snapping
const CURSOR_OFFSET = 12; // px from the pointer
const FOLLOW_EASE = 0.24; // share of the remaining distance covered per frame (at 60fps)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".work-thumbnail .view-project").forEach((pill) => {
    const thumb = pill.closest(".work-thumbnail");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = null;
    let lastTime = 0;

    function place() {
        pill.style.setProperty("--x", `${current.x}px`);
        pill.style.setProperty("--y", `${current.y}px`);
    }

    function step(time) {
        const dt = lastTime ? time - lastTime : 16.7;
        lastTime = time;
        const k = 1 - Math.pow(1 - FOLLOW_EASE, dt / 16.7); // same feel at any frame rate
        current.x += (target.x - current.x) * k;
        current.y += (target.y - current.y) * k;
        place();
        if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
            frame = requestAnimationFrame(step);
        } else {
            frame = null;
        }
    }

    function setTarget(e) {
        const rect = thumb.getBoundingClientRect();
        const scale = rect.width / thumb.offsetWidth; // the Work page scales thumbnails on hover
        // flips to the top left only when the right side would run off the screen
        const fitsRight = e.clientX + CURSOR_OFFSET + pill.offsetWidth <= document.documentElement.clientWidth;
        target.x = (e.clientX - rect.left) / scale + (fitsRight ? CURSOR_OFFSET : -CURSOR_OFFSET - pill.offsetWidth);
        target.y = (e.clientY - rect.top) / scale - pill.offsetHeight - CURSOR_OFFSET;
    }

    // Appear where the cursor enters, not where it last left
    thumb.addEventListener("pointerenter", (e) => {
        if (e.pointerType !== "mouse") return;
        setTarget(e);
        current.x = target.x;
        current.y = target.y;
        place();
    });

    thumb.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        setTarget(e);
        if (reduceMotion.matches) {
            current.x = target.x;
            current.y = target.y;
            place();
        } else if (!frame) {
            lastTime = 0;
            frame = requestAnimationFrame(step);
        }
    });
});

// About photos: drag one over another's spot and they swap right away (slots).
// The other photo glides to the spot you came from; on release, yours settles into its spot
const photoCluster = document.querySelector(".photo-cluster");
const SWAP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SWAP_COVER = 0.5; // swap once the two circles overlap by half of the smaller one

// Overlapping area of two circles (radii r1, r2, centers d apart)
function circleOverlap(r1, r2, d) {
    if (d >= r1 + r2) return 0;
    if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
    const a1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
    const a2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
    const lens = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
    return a1 + a2 - lens;
}

if (photoCluster) {
    const photos = [...photoCluster.querySelectorAll(".photo")];
    const slotOf = (el) => [...el.classList].find((c) => c.startsWith("slot-"));

    // Where a photo's spot is, ignoring any drag or animation on it
    function spotOf(p) {
        const c = photoCluster.getBoundingClientRect();
        const size = p.offsetWidth;
        return { left: c.left + p.offsetLeft, top: c.top + p.offsetTop, size, x: c.left + p.offsetLeft + size / 2, y: c.top + p.offsetTop + size / 2 };
    }

    // Play a photo's move from its old box to its new one (measure, change, play back)
    function glideFrom(p, from) {
        if (reduceMotion.matches) return;
        const to = p.getBoundingClientRect();
        p.animate(
            [
                { transformOrigin: "top left", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})` },
                { transformOrigin: "top left", transform: "none" },
            ],
            { duration: 450, easing: SWAP_EASE }
        );
    }

    function settle(p) {
        const from = p.style.translate;
        p.style.translate = "";
        if (!from || reduceMotion.matches) return;
        p.animate([{ translate: from }, { translate: "0px 0px" }], { duration: 300, easing: SWAP_EASE });
    }

    photos.forEach((photo) => {
        photo.querySelector("img").draggable = false;

        photo.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            photo.setPointerCapture(e.pointerId);
            photo.classList.add("dragging");
            // where in the photo it was grabbed, so that point stays under the pointer even as the photo resizes
            const start = spotOf(photo);
            const grabX = (e.clientX - start.left) / start.size;
            const grabY = (e.clientY - start.top) / start.size;

            function follow(ev) {
                const spot = spotOf(photo);
                const left = ev.clientX - grabX * spot.size;
                const top = ev.clientY - grabY * spot.size;
                photo.style.translate = `${left - spot.left}px ${top - spot.top}px`;
                return { x: left + spot.size / 2, y: top + spot.size / 2 };
            }

            // the photo just swapped out still overlaps the held one, so it's skipped until they separate
            let justSwapped = null;

            function onMove(ev) {
                const center = follow(ev);
                const r = photo.offsetWidth / 2;
                const covers = (p) => {
                    const spot = spotOf(p);
                    const overlap = circleOverlap(r, spot.size / 2, Math.hypot(center.x - spot.x, center.y - spot.y));
                    return overlap >= SWAP_COVER * Math.PI * Math.min(r, spot.size / 2) ** 2;
                };
                if (justSwapped && !covers(justSwapped)) justSwapped = null;
                const other = photos.find((p) => p !== photo && p !== justSwapped && covers(p));
                if (!other) return;
                justSwapped = other;

                const otherFrom = other.getBoundingClientRect();
                const mySize = photo.offsetWidth;
                const mySlot = slotOf(photo);
                const otherSlot = slotOf(other);
                photo.classList.replace(mySlot, otherSlot);
                other.classList.replace(otherSlot, mySlot);
                glideFrom(other, otherFrom);
                follow(ev);
                // ease the held photo into its new size around the grab point
                if (!reduceMotion.matches && photo.offsetWidth !== mySize) {
                    photo.animate(
                        [{ transformOrigin: `${grabX * 100}% ${grabY * 100}%`, scale: mySize / photo.offsetWidth }, { transformOrigin: `${grabX * 100}% ${grabY * 100}%`, scale: 1 }],
                        { duration: 250, easing: SWAP_EASE }
                    );
                }
            }

            function onUp() {
                photo.removeEventListener("pointermove", onMove);
                photo.removeEventListener("pointerup", onUp);
                photo.removeEventListener("pointercancel", onUp);
                photo.classList.remove("dragging");
                settle(photo);
            }

            photo.addEventListener("pointermove", onMove);
            photo.addEventListener("pointerup", onUp);
            photo.addEventListener("pointercancel", onUp);
        });
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

    // Return to Top: shown after a screen of scrolling, hidden before it reaches Previous / Next Project (or the footer)
    const tocStop = document.querySelector(".project-pager") || document.querySelector(".section-footer");

    function updateTocOverlap() {
        tocTop.classList.toggle("is-shown", window.scrollY > window.innerHeight);
        tocTop.classList.toggle("is-covered", tocStop.getBoundingClientRect().top < tocTop.getBoundingClientRect().bottom);
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

// Screen recordings: they play on their own. A small button in the corner of each screen pauses or resumes it.
// With reduced motion on, they start paused and wait for that button
const PAUSE_ICON = '<svg class="icon-pause" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1"/><rect x="9.5" y="2.5" width="3" height="11" rx="1"/></svg>';
const PLAY_ICON = '<svg class="icon-play" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.3v9.4a.6.6 0 0 0 .9.5l7.8-4.7a.6.6 0 0 0 0-1L5.9 2.8a.6.6 0 0 0-.9.5z"/></svg>';

function addMediaToggle(video) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "media-toggle";
    btn.innerHTML = PAUSE_ICON + PLAY_ICON;

    function show() {
        const paused = video.paused;
        btn.classList.toggle("is-paused", paused);
        btn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    }

    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // pausing doesn't also open the larger view
        if (video.paused) video.play().catch(show);
        else video.pause();
    });
    video.addEventListener("play", show);
    video.addEventListener("pause", show);
    // autoplay may not have started yet; the button shows pause unless the visitor (or reduced motion) paused it
    if (video.autoplay) btn.classList.remove("is-paused");
    else show();
    btn.setAttribute("aria-label", btn.classList.contains("is-paused") ? "Play video" : "Pause video");
    video.parentElement.append(btn);
}

document.querySelectorAll(".phone > video").forEach((video) => {
    if (reduceMotion.matches) {
        video.removeAttribute("autoplay");
        video.pause();
    }
    addMediaToggle(video);
});

// Larger view: clicking (or Enter / Space on) a phone or a crop opens it big over a dimmed page.
// The copy inside is fresh: a recording picks up where the small one was, and has its own pause button
const zoomables = document.querySelectorAll(".case-stage > .phone, .case-stage > .shot.is-actual");

if (zoomables.length && typeof HTMLDialogElement === "function") {
    const mediaDialog = document.createElement("dialog");
    mediaDialog.className = "proto-dialog media-dialog";
    mediaDialog.setAttribute("aria-label", "Larger view");
    mediaDialog.innerHTML =
        '<button type="button" class="proto-close" aria-label="Close larger view">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>' +
        '</button><div class="proto-stage media-stage"></div>';
    document.body.append(mediaDialog);
    const mediaStage = mediaDialog.querySelector(".media-stage");

    const closeBtn = mediaDialog.querySelector(".proto-close");
    let openItem = null; // the small item now shown larger
    let busy = false; // an opening or closing move is running

    // How far, and how much smaller, the large copy sits from the small item: the move starts (or ends) there
    function offsetFrom(item, copy) {
        const from = item.getBoundingClientRect();
        const to = copy.getBoundingClientRect();
        const dx = from.left + from.width / 2 - (to.left + to.width / 2);
        const dy = from.top + from.height / 2 - (to.top + to.height / 2);
        return `translate(${dx}px, ${dy}px) scale(${from.width / to.width})`;
    }

    // Moves the copy and fades the backdrop and close button; resolves when done.
    // Reduced motion: no move, everything just appears or disappears
    function animateView(copy, opening) {
        const moved = offsetFrom(openItem, copy);
        const time = reduceMotion.matches ? 0 : opening ? 450 : 350;
        const easing = "cubic-bezier(0.32, 0.72, 0, 1)"; // fast start, long soft landing, like iOS
        const frames = (a, b) => (opening ? [a, b] : [b, a]);
        const options = { duration: time, easing, fill: "forwards" };
        const moves = [
            copy.animate({ transform: frames(moved, "none") }, options),
            closeBtn.animate({ opacity: frames(0, 1) }, options),
        ];
        try {
            moves.push(mediaDialog.animate({ opacity: frames(0, 1) }, { ...options, pseudoElement: "::backdrop" }));
        } catch (e) {} // browsers that can't animate the backdrop just show it
        return Promise.all(moves.map((m) => m.finished)).catch(() => {});
    }

    async function openLarger(item) {
        if (busy || mediaDialog.open) return;
        busy = true;
        openItem = item;

        const copy = item.cloneNode(true);
        copy.classList.remove("is-zoomable");
        copy.removeAttribute("tabindex");
        copy.removeAttribute("role");
        copy.removeAttribute("aria-label");
        copy.style.visibility = "";
        copy.querySelector(".media-toggle")?.remove();

        const img = copy.matches("img") ? copy : copy.querySelector("img");
        if (img) img.loading = "eager";

        const smallVideo = item.querySelector("video");
        const video = copy.querySelector("video");
        if (video) {
            video.muted = true;
            video.currentTime = smallVideo.currentTime;
            video.autoplay = false;
            addMediaToggle(video);
            if (!smallVideo.paused) video.play().catch(() => {});
        }

        mediaStage.replaceChildren(copy);
        mediaDialog.showModal();
        item.style.visibility = "hidden"; // the small one seems to lift off the page into the larger view
        await animateView(copy, true);
        busy = false;
    }

    // The copy shrinks back into its spot, then the small one takes over where the large one left off
    async function closeLarger() {
        if (busy || !mediaDialog.open) return;
        busy = true;
        const copy = mediaStage.firstElementChild;
        const video = copy?.querySelector("video");
        const smallVideo = openItem.querySelector("video");
        if (video && smallVideo) {
            smallVideo.currentTime = video.currentTime;
            if (video.paused) smallVideo.pause();
            else smallVideo.play().catch(() => {});
        }
        if (copy) await animateView(copy, false);
        finishClose();
        busy = false;
    }

    function finishClose() {
        mediaStage.replaceChildren();
        closeBtn.getAnimations().forEach((a) => a.cancel());
        mediaDialog.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        if (mediaDialog.open) mediaDialog.close();
        if (openItem) openItem.style.visibility = "";
    }

    zoomables.forEach((item) => {
        const label = item.querySelector("img, video")?.getAttribute(item.querySelector("img") ? "alt" : "aria-label") || item.getAttribute("alt") || "";
        item.classList.add("is-zoomable");
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `View larger: ${label}`);

        item.addEventListener("click", () => openLarger(item));
        item.addEventListener("keydown", (e) => {
            if (e.target !== item || (e.key !== "Enter" && e.key !== " ")) return;
            e.preventDefault(); // Space would scroll the page
            openLarger(item);
        });
    });

    closeBtn.addEventListener("click", closeLarger);

    // clicking the dimmed area closes it
    mediaDialog.addEventListener("click", (e) => {
        if (e.target === mediaDialog || e.target === mediaStage) closeLarger();
    });

    // Esc: the same animated close instead of the dialog's instant one
    mediaDialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        closeLarger();
    });

    // if it closes any other way, the small item comes back
    mediaDialog.addEventListener("close", () => {
        if (!mediaDialog.open && !busy) finishClose();
    });
}

// Run last, once the layout is final
setUpPageFade();
