// Changes an element's text by editing its text node rather than replacing it. Replacing it (textContent) counts as
// removing and adding a node, and after any such change the stylesheet's :has() rules make the browser restyle the
// whole page: for text that changes as the page scrolls or a video plays, that was most of the work of every frame
function setText(el, text) {
    const node = el.firstChild;
    if (node && node.nodeType === Node.TEXT_NODE && !node.nextSibling) {
        if (node.data !== text) node.data = text;
    } else if (el.textContent !== text) {
        el.textContent = text;
    }
}

// Page Fade In (style.css): only what's on the first screen fades in; anything that starts below it is shown as is,
// so nothing off screen is animated. Measured from the top of the page (where a refresh restores a scrolled page,
// what's in view there was below the first screen, so it's simply shown). Run last, once the layout is final
function pageTop(el) {
    let top = 0;
    for (; el; el = el.offsetParent) top += el.offsetTop;
    return top;
}

function setUpPageFade() {
    const screenBottom = window.innerHeight;
    document.querySelectorAll("[data-fade]").forEach((el) => {
        if (pageTop(el) >= screenBottom) el.removeAttribute("data-fade");
    });

    // The home page's parts come in one after another: scrolled half a screen down before they all have, the rest
    // show at once instead of waiting their turn
    if (!document.querySelector('[data-fade]:not([data-fade=""])')) return;
    function showRest() {
        if (window.scrollY < window.innerHeight / 2) return;
        window.removeEventListener("scroll", showRest);
        document.getAnimations().forEach((run) => {
            if (run.animationName === "page-rise-in") run.finish();
        });
    }
    window.addEventListener("scroll", showRest, { passive: true });
    setTimeout(() => window.removeEventListener("scroll", showRest), 2000); // it's all in by then
}

// Scroll effects: everything that follows the scroll updates together, once per frame.
// Each effect measures the page and returns what it will change; the changes are made only after every
// effect has measured, so the browser lays the page out once per frame instead of once per measurement.
// An effect returns nothing when nothing changed, so a scroll that changes nothing touches nothing
const scrollEffects = [];
let scrollFrame = 0;

function addScrollEffect(effect) {
    scrollEffects.push(effect);
}

// The page's length is measured only when it may have changed (a resize, or the page growing), not on every scroll
// frame: measuring right after the effects' last changes would make the browser lay the page out again each frame
let pageLength = null;

function runScrollEffects() {
    scrollFrame = 0;
    const y = Math.max(window.scrollY, 0); // iOS can overscroll above the top
    const height = window.innerHeight;
    if (pageLength === null) pageLength = document.documentElement.scrollHeight;
    const scrollable = pageLength - height;
    const view = { y, height, progress: scrollable > 0 ? Math.min(y / scrollable, 1) : 0 };
    const changes = scrollEffects.map((effect) => effect(view));
    changes.forEach((change) => change && change());
}

function requestScrollEffects() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(runScrollEffects);
}

function remeasureScrollEffects() {
    pageLength = null;
    requestScrollEffects();
}

window.addEventListener('scroll', requestScrollEffects, { passive: true });
window.addEventListener('resize', remeasureScrollEffects);
// the page can also grow without a scroll or resize (images, fonts, the side list), which moves the progress
if ('ResizeObserver' in window) new ResizeObserver(remeasureScrollEffects).observe(document.body);
else window.addEventListener('scroll', () => (pageLength = null), { passive: true });

// Title Fade + Header Stroke
const heroTitle = document.querySelector('.title');
// the arrow fades separately from its wrapper's fade-in
const scrollDownArrow = document.querySelector('.scroll-down svg');
const header = document.querySelector('.header');
const FADE_DISTANCE = 8; // px of scroll to fully fade out
const ARROW_FADE_DISTANCE = 200; // px of scroll for the arrow to fully fade out

// Only the home page has a hero title; other pages use .perma-line instead
if (heroTitle) {
    const scrollDown = scrollDownArrow.closest('.scroll-down');
    let lastTitle = null;
    let lastArrow = null;

    addScrollEffect(({ y }) => {
        const progress = Math.min(y / FADE_DISTANCE, 1);
        const arrowOpacity = 1 - Math.min(y / ARROW_FADE_DISTANCE, 1);
        if (progress === lastTitle && arrowOpacity === lastArrow) return null;
        lastTitle = progress;
        lastArrow = arrowOpacity;
        return () => {
            heroTitle.style.opacity = 1 - progress;
            header.classList.toggle('scrolled', progress === 1);
            scrollDownArrow.style.opacity = arrowOpacity;
            // invisible arrow can't be clicked, and stops bouncing (style.css)
            scrollDown.style.visibility = arrowOpacity === 0 ? 'hidden' : '';
            scrollDown.classList.toggle('is-gone', arrowOpacity === 0);
        };
    });
}

// Scroll Progress: the line under the header fills as you read. It's its own element, scaled, so moving it
// restyles nothing else in the header and needs no layout. Where the browser can tie an animation to the scroll
// (style.css), it fills by itself, off the page's main thread; elsewhere it's set here, once per frame
const headerProgress = document.createElement('span');
headerProgress.className = 'header-progress';
headerProgress.setAttribute('aria-hidden', 'true');
header.append(headerProgress);
let lastScrollProgress = null;

if (!(window.CSS && CSS.supports('animation-timeline: scroll()'))) {
    addScrollEffect(({ progress }) => {
        const scale = progress.toFixed(4);
        if (scale === lastScrollProgress) return null;
        lastScrollProgress = scale;
        return () => {
            headerProgress.style.transform = `scaleX(${scale})`;
        };
    });
}

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

    // shrink the phone to fit the window, leaving a margin above and below it
    function fitPrototype() {
        const scale = Math.min(1, (window.innerHeight - 120) / PHONE_H, (window.innerWidth - 48) / PHONE_W);
        protoPhone.style.setProperty('--proto-scale', scale.toFixed(3));
    }

    protoLink.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // still opens a new tab
        e.preventDefault();
        protoFrame.classList.remove('is-loaded');
        protoFrame.src = protoFrame.dataset.src; // a fresh load each time, so it always starts on its home screen
        fitPrototype();
        protoDialog.showModal();
    });

    // it stays hidden while it loads (style.css) and fades in once it's fully drawn: its games, logos and tip are
    // all in place by the load event. The blank page swapped in on close loads too, and stays hidden
    protoFrame.addEventListener('load', () => {
        if (protoFrame.getAttribute('src') === protoFrame.dataset.src) protoFrame.classList.add('is-loaded');
    });

    // unload it on close (by any route: button, backdrop or Esc), so it stops running and the next open starts over.
    // The close event arrives a moment after closing, so it skips the unload if the popup has been opened again
    protoDialog.addEventListener('close', () => {
        if (!protoDialog.open) {
            protoFrame.classList.remove('is-loaded');
            protoFrame.src = 'about:blank';
        }
        protoDialog.classList.remove('is-sheet-open');
    });

    // the prototype says when its game card is open: on phones the close button sits over the card's date, so it
    // steps aside until the card is closed (style.css)
    window.addEventListener('message', (e) => {
        if (e.origin !== location.origin || e.source !== protoFrame.contentWindow || e.data?.type !== 'proto-sheet') return;
        protoDialog.classList.toggle('is-sheet-open', Boolean(e.data.open));
    });

    window.addEventListener('resize', fitPrototype);
    protoDialog.querySelector('.proto-close').addEventListener('click', () => protoDialog.close());

    // clicking the dimmed area around the phone closes it (Esc does too, natively)
    protoDialog.addEventListener('click', (e) => {
        if (e.target === protoDialog || e.target.classList.contains('proto-stage')) protoDialog.close();
    });
}

// Graphics check: is there a graphics card doing the drawing? Asked once per visit (once the page is idle) by
// trying to start WebGL in a mode that refuses to run on the processor alone. Without one, the page switches to a
// lighter look that draws quickly on the processor (.low-gfx in style.css: solid tints in place of the frosted glass).
// The answer is remembered, so later pages and later visits start in the right look from the first frame (each page's
// <head>); asking again each visit catches hardware acceleration being turned on or off since
function rememberGraphics(answer) {
    try {
        localStorage.setItem("gfx", answer);
    } catch (e) {}
}

function markLowGraphics(answer) {
    document.documentElement.classList.add("low-gfx");
    rememberGraphics(answer);
}

function checkGraphics() {
    let low = false;
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ||
            canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });
        low = !gl;
        if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch (e) {
        low = true;
    }
    try {
        sessionStorage.setItem("gfx-checked", "1");
    } catch (e) {}
    if (low) markLowGraphics("low");
    else if (graphicsSeen !== "slow") {
        // a graphics card after all (turned back on): the full look again. One found too slow by the frame check below
        // stays that way
        document.documentElement.classList.remove("low-gfx");
        rememberGraphics("ok");
    }
}

let graphicsSeen = null;
let graphicsChecked = false;
try {
    graphicsSeen = localStorage.getItem("gfx");
    graphicsChecked = !!sessionStorage.getItem("gfx-checked");
} catch (e) {}

if (!graphicsChecked) {
    if ("requestIdleCallback" in window) requestIdleCallback(checkGraphics, { timeout: 2000 });
    else setTimeout(checkGraphics, 1200);
}

// Frame check: some browsers pass the check above and still draw slowly (Firefox with hardware acceleration off
// keeps WebGL). While the page scrolls, the time between frames is measured in batches (40 frames, or 0.6s of
// scrolling when frames are that slow). A batch is very slow if a third or more of it ran long (over 30ms, under
// about 33 frames a second): the page switches to the lighter look at once. It's slow if a third or more of the
// frames the screen could have shown were missed: each gap is counted against the screen's own pace (the gap a
// quarter of the batch comes in under), so a steady 60 frames a second on a 120Hz screen isn't slow, but scrolling
// that keeps skipping frames is, even when no single frame runs long (Firefox without hardware acceleration scrolls
// at 16-25ms frames under the glass header, 40-60 a second on a 120Hz screen, and drops none with the lighter look).
// Three slow batches switch it. Measured, smooth scrolling misses at most about a quarter in a batch (the page's own
// main thread skips the odd frame even while the scrolling itself is smooth); the slowest drawing a third or more,
// batch after batch. Either way it stays in the lighter look on later visits. After ten smooth batches it stops
const FRAME_PAUSE = 250; // ms: a gap this long is a pause (the page or window wasn't drawing), not slow drawing

function missedShare(gaps) {
    const sorted = [...gaps].sort((a, b) => a - b);
    const pace = Math.max(sorted[Math.floor(sorted.length / 4)], 4);
    let shown = 0;
    let missed = 0;
    gaps.forEach((gap) => {
        const frames = Math.max(1, Math.round(gap / pace));
        shown += frames;
        missed += frames - 1;
    });
    return missed / shown;
}

if (graphicsSeen !== "low" && graphicsSeen !== "slow") {
    let gaps = [];
    let lastFrame = 0;
    let frame = 0;
    let scrolling = 0; // timer: scrolling counts as stopped 0.7s after the last scroll event (longer than a slow frame)
    let smoothBatches = 0;
    let slowBatches = 0;
    let batchTime = 0;

    function timeFrame(now) {
        const gap = now - lastFrame;
        if (lastFrame && gap < FRAME_PAUSE) {
            gaps.push(gap);
            batchTime += gap;
        }
        lastFrame = now;
        if (gaps.length >= 40 || (gaps.length >= 8 && batchTime >= 600)) {
            const verySlow = gaps.filter((g) => g > 30).length * 3 >= gaps.length;
            const slow = verySlow || missedShare(gaps) >= 1 / 3;
            gaps = [];
            batchTime = 0;
            if (slow) slowBatches += verySlow ? 3 : 1;
            if (slowBatches >= 3) {
                markLowGraphics("slow");
                window.removeEventListener("scroll", onScrollFrames);
                frame = 0;
                return;
            }
            if (!slow && ++smoothBatches >= 10) {
                window.removeEventListener("scroll", onScrollFrames);
                frame = 0;
                return;
            }
        }
        frame = scrolling ? requestAnimationFrame(timeFrame) : 0;
    }

    function onScrollFrames() {
        clearTimeout(scrolling);
        scrolling = setTimeout(() => {
            scrolling = 0;
            lastFrame = 0; // a pause isn't a slow frame
        }, 700);
        if (!frame) frame = requestAnimationFrame(timeFrame);
    }

    window.addEventListener("scroll", onScrollFrames, { passive: true });
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

// The covers' pictures in the other theme only download when needed, so pointing at (or pressing) the switch fetches
// and decodes them ahead of the click, and the switch itself never waits for them
function picturesForTheme(theme) {
    const imgs = [];
    document.querySelectorAll(".work-thumbnail :is(.cover-screens, .cover-wall)").forEach((cover) => {
        if (cover.matches(".is-live, .is-still")) imgs.push(...livePictures(cover, theme));
        imgs.push(...cover.querySelectorAll(`img.cover-poster.is-${theme}`));
    });
    // only the ones on or near the screen hold the switch up; the rest just start loading
    const near = (img) => {
        const r = img.parentElement.getBoundingClientRect();
        return r.bottom > -window.innerHeight && r.top < window.innerHeight * 2;
    };
    fetchPictures(imgs);
    return imgs.filter(near);
}

const otherTheme = () => (pageTheme() === "dark" ? "light" : "dark");
const warmOtherTheme = () => readyPictures(picturesForTheme(otherTheme()));
themeToggleBtn.addEventListener("pointerenter", warmOtherTheme);
themeToggleBtn.addEventListener("pointerdown", warmOtherTheme); // touch screens: no hover, but a head start
themeToggleBtn.addEventListener("focus", warmOtherTheme);

// The theme changes on the click: the page cross-fades to it in a fifth of a second, starting at once (style.css).
// Inside the fade the change itself is instant: the hover color transitions are held off for it, so nothing eases into
// the new colors behind the rest of the page. Without view transitions, with reduced motion on, or where drawing is
// slow (blending two pictures of the whole page on every frame would stutter), it just switches
themeToggleBtn.addEventListener("click", () => {
    // from the saved choice, not the page's current look: a second click during a fade (before the first change has
    // landed on the page) still flips it back
    const isDarkNow = getPreferredTheme() !== "dark";

    // Matching the system clears the saved choice
    if (isDarkNow === darkQuery.matches) {
        localStorage.removeItem("theme");
    } else {
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    }

    const page = document.documentElement;
    function switchNow() {
        page.classList.add("theme-instant");
        applyTheme();
        getComputedStyle(page).color; // the new colors land now, with no transitions running
        page.classList.remove("theme-instant");
    }

    if (!document.startViewTransition || reduceMotion.matches || page.classList.contains("low-gfx")) switchNow();
    else document.startViewTransition(switchNow).ready.catch(() => {}); // a quicker second click cuts this fade short
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
// ("/", "/index.html", "/work", "/work/" and "/work/index.html" count as the same page)
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

// Instant pages, in browsers without speculation rules (Firefox, Safari): pointing at a link to another page
// here (or touching or tabbing to it) fetches that page into the browser's cache, so by the time it's clicked it
// comes from memory instead of the network. Chrome and Edge prepare the whole page instead (each page's <head>)
if (!(HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules"))) {
    const warmed = new Set([location.pathname]);

    function warmLink(e) {
        const link = e.target instanceof Element && e.target.closest("a[href]");
        if (!link || link.origin !== location.origin || link.hasAttribute("download")) return;
        const path = link.pathname;
        if (warmed.has(path) || path.startsWith("/prototypes/") || /\.(pdf|png|jpe?g|webp|svg|mp4)$/i.test(path)) return;
        warmed.add(path);
        fetch(path, { credentials: "same-origin", priority: "low" }).catch(() => warmed.delete(path));
    }

    document.addEventListener("pointerover", warmLink, { passive: true });
    document.addEventListener("touchstart", warmLink, { passive: true });
    document.addEventListener("focusin", warmLink);
}

// Copy Email: a click copies it, and for 2 seconds the copy icon swaps for a green check
// (style.css) while the address fades into "Email copied to clipboard". The address is plain text, so it can
// be selected like any other; a click that ends a selection doesn't copy
const copyEmailBtn = document.getElementById("copy-email");
const EMAIL = "normanlee2002@gmail.com";
const COPIED_MESSAGE = "Email copied to clipboard";
let copiedTimer;
let uncopyingTimer;

// Only run on pages that have the footer
if (copyEmailBtn) {
    const label = copyEmailBtn.querySelector("p");
    const status = document.getElementById("copy-email-status"); // read out by screen readers

    // The words fade out, then the new ones fade in (the message a little bolder, style.css). On one line, the line
    // eases to its new width meanwhile, so the icon beside it slides over rather than jumping (the message is a
    // little shorter than the address)
    function swapEmailText(text) {
        const isMessage = text !== EMAIL;
        label.getAnimations().forEach((a) => a.cancel());
        if (reduceMotion.matches) {
            setText(label, text);
            label.classList.toggle("is-message", isMessage);
            return;
        }
        const fromWidth = label.getBoundingClientRect().width;
        const oneLine = label.getBoundingClientRect().height < parseFloat(getComputedStyle(label).lineHeight) * 1.5;
        const fadeOut = label.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: "ease-in", fill: "forwards" });
        fadeOut.finished
            .then(() => {
                setText(label, text);
                label.classList.toggle("is-message", isMessage);
                if (oneLine) {
                    const toWidth = label.getBoundingClientRect().width;
                    label.animate([{ width: `${fromWidth}px`, whiteSpace: "nowrap" }, { width: `${toWidth}px`, whiteSpace: "nowrap" }], {
                        duration: 200,
                        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                    });
                }
                fadeOut.cancel();
                label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
            })
            .catch(() => {}); // cancelled by a newer swap, which sets its own words
    }

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText(EMAIL);
        } catch (err) {
            console.error("Copy failed:", err);
            return;
        }
        setText(status, "Email copied");
        if (!copyEmailBtn.classList.contains("is-copied")) {
            clearTimeout(uncopyingTimer);
            copyEmailBtn.classList.remove("is-uncopying");
            copyEmailBtn.classList.add("is-copied");
            swapEmailText(COPIED_MESSAGE);
        }
        clearTimeout(copiedTimer); // restart the timer if clicked again
        copiedTimer = setTimeout(() => {
            copyEmailBtn.classList.remove("is-copied");
            copyEmailBtn.classList.add("is-uncopying"); // the check leaves first, then the copy icon returns (style.css)
            uncopyingTimer = setTimeout(() => copyEmailBtn.classList.remove("is-uncopying"), 400);
            swapEmailText(EMAIL);
            setText(status, "");
        }, 2000);
    }

    copyEmailBtn.addEventListener("click", () => {
        const selection = getSelection();
        if (!selection.isCollapsed && copyEmailBtn.contains(selection.anchorNode)) return; // selecting, not clicking
        copyEmail();
    });
    // a button from the keyboard too: Enter, or Space on release (as buttons do)
    copyEmailBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.repeat) {
            e.preventDefault();
            copyEmail();
        } else if (e.key === " ") {
            e.preventDefault(); // no page scroll
        }
    });
    copyEmailBtn.addEventListener("keyup", (e) => {
        if (e.key === " ") copyEmail();
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
        setText(localTime, ptFormat.format(new Date()));
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

// Covers: at rest each cover is one picture of itself (style.css, "Covers at rest"), so scrolling past it costs no more
// than scrolling past a photo. The live cover is built only when it's about to be used: pointing at the part that
// moves it (the thumbnail; on the Work page, the whole slice), or tabbing to its project, lays it out hidden while its
// pictures load and decode, then shows it in the picture's place, which it matches exactly, and only then do the hover
// effects start. Pointing at the rest of the project (its title, description, tags) does nothing to the cover, so it
// doesn't build it either: the whole card used to, and as the page scrolled under a resting cursor that meant decoding
// every live picture and swapping the cover back and forth between its picture and its live version, for no visible
// change. Nothing switches over mid-scroll: a switch waits until the page has been still for a moment.
// On computers with a mouse, the live covers' pictures are fetched once the page is idle, so pointing at a cover
// brings it to life at once
const SCROLL_QUIET = 150; // ms without scrolling before a cover switches over
let lastScrollTime = -Infinity;
window.addEventListener("scroll", () => (lastScrollTime = performance.now()), { passive: true });

// run once the page has been still for a moment (right away if it already is)
function whenScrollQuiet(fn) {
    const wait = lastScrollTime + SCROLL_QUIET - performance.now();
    if (wait > 0) return setTimeout(() => whenScrollQuiet(fn), wait);
    fn();
    return 0;
}

const pageTheme = () => (document.documentElement.classList.contains("dark-theme") ? "dark" : "light");

// the pictures a live cover shows in a theme (the wall's tiles come in both; the Apple Sports screens don't)
function livePictures(cover, theme = pageTheme()) {
    const other = theme === "dark" ? "is-light" : "is-dark";
    return [...cover.querySelectorAll("img:not(.cover-poster)")].filter((img) => !img.classList.contains(other));
}

// starts the downloads; the browser decodes them later, when they're needed
function fetchPictures(imgs) {
    imgs.forEach((img) => {
        if (img.loading !== "eager") img.loading = "eager";
    });
}

// downloaded and decoded, ready to draw without a gap; gives up waiting after `limit` ms
function readyPictures(imgs, limit = Infinity) {
    fetchPictures(imgs);
    const all = Promise.all(imgs.map((img) => img.decode().catch(() => {})));
    return limit === Infinity ? all : Promise.race([all, new Promise((done) => setTimeout(done, limit))]);
}

// Shared by both covers: is-warm while the live cover gets ready, then is-live. `onLive` runs once it shows
function bringToLife(cover, onLive) {
    if (cover.classList.contains("is-live") || cover.classList.contains("is-warm")) return;
    cover.classList.add("is-warm");
    readyPictures(livePictures(cover)).then(() => {
        if (!cover.classList.contains("is-warm")) return; // put back to rest while loading
        whenScrollQuiet(() => {
            if (!cover.classList.contains("is-warm")) return;
            getComputedStyle(cover.lastElementChild).visibility; // the hidden, resting state is the effects' starting point
            cover.classList.replace("is-warm", "is-live");
            if (onLive) onLive();
        });
    });
}

const coverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");

// the part of the page that moves a cover when pointed at: its slice on the Work page, its thumbnail elsewhere
// (the hover effects in style.css are written for exactly these)
const coverZone = (cover) => cover.closest(".work-grid .work-card") || cover.closest(".work-thumbnail");

// is the visitor using this cover right now: pointing at its zone, or tabbed into its project
const inUse = (zone, card) => zone.matches(":hover") || !!card.querySelector(":focus-visible");

// The live cover's triggers: the mouse entering its zone, or a keyboard focus inside its project (a tap that focuses a
// link on its way to opening it doesn't count). `onStart` brings it to life; `onEnd` runs once the visitor leaves
function watchCoverUse(zone, card, onStart, onEnd) {
    zone.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") onStart();
    });
    zone.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse" && !card.querySelector(":focus-visible")) onEnd();
    });
    card.addEventListener("focusin", () => {
        if (card.querySelector(":focus-visible")) onStart();
    });
    card.addEventListener("focusout", (e) => {
        if (!card.contains(e.relatedTarget) && !zone.matches(":hover")) onEnd();
    });
}

// Live pictures, fetched ahead once the page is idle (mouse-driven computers only; never with Save-Data on)
function prefetchLiveCovers() {
    if (!coverPointer.matches || navigator.connection?.saveData) return;
    document.querySelectorAll(".work-thumbnail :is(.cover-screens, .cover-wall)").forEach((cover) => fetchPictures(livePictures(cover)));
}

window.addEventListener("load", () => {
    if ("requestIdleCallback" in window) requestIdleCallback(prefetchLiveCovers, { timeout: 3000 });
    else setTimeout(prefetchLiveCovers, 1500);
});

// The Apple Sports cover's phones: each one's flat side as a picture (style.css, "The side as a picture"). The same
// slices the stylesheet stacks as shadows under the phone, in the same order and places, drawn into one picture per
// theme and phone, so a scroll past the live cover draws one picture instead of 27 shadows per phone.
// They're pictures in the cover like any other, so the cover waits for them before it comes to life (bringToLife)
// and the other theme's are ready before the theme switches (picturesForTheme)
const PHONE = { w: 66, bezel: 1.3, radius: 66 * 0.168, rim: 0.3 }; // cqh, as in style.css (.cover-phone)
// each slice's offset (cqh) and color, top to bottom: the stylesheet's box-shadow list after the rim
const SIDE_SLICES = [
    [0.19, 0.27, "a"], [0.37, 0.53, "mix"],
    ...[[0.56, 0.80], [0.75, 1.06], [0.93, 1.33], [1.12, 1.60], [1.30, 1.86], [1.49, 2.13], [1.68, 2.39], [1.86, 2.66],
        [2.05, 2.93], [2.24, 3.19], [2.42, 3.46], [2.61, 3.73], [2.79, 3.99], [2.98, 4.26], [3.17, 4.52], [3.35, 4.79],
        [3.54, 5.06], [3.73, 5.32], [3.91, 5.59], [4.10, 5.85], [4.29, 6.12], [4.47, 6.39], [4.66, 6.65]].map(([x, y]) => [x, y, "b"]),
    [4.84, 6.92, "c"], [5.03, 7.18, "c"],
];

function drawPhoneSides(cover) {
    const style = getComputedStyle(cover);
    const last = SIDE_SLICES[SIDE_SLICES.length - 1];
    const width = PHONE.w + 2 * PHONE.rim + last[0];
    cover.querySelectorAll(".cover-phone").forEach((phone) => {
        const shot = phone.querySelector("img");
        // the phone's height: its bezel above and below the screenshot, which fills its width
        const height = 2 * PHONE.bezel + (PHONE.w - 2 * PHONE.bezel) * shot.getAttribute("height") / shot.getAttribute("width");
        ["light", "dark"].forEach((theme) => {
            const color = (name) => style.getPropertyValue(`--cover-side-${name}-${theme}`).trim();
            const fills = { a: color("a"), b: color("b"), c: color("c"), mix: `color-mix(in srgb, ${color("a")} 45%, ${color("b")})` };
            // from the phone's top left, less the rim (the stylesheet places the picture there); the last slice is
            // at the bottom and the first on top, as the shadows stack
            const slices = SIDE_SLICES.map(([x, y, c]) => `<use href="#s" x="${x}" y="${y}" style="fill:${fills[c]}"/>`).reverse().join("");
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${(height + 2 * PHONE.rim + last[1]).toFixed(5)}" preserveAspectRatio="none">` +
                `<defs><rect id="s" width="${PHONE.w + 2 * PHONE.rim}" height="${(height + 2 * PHONE.rim).toFixed(5)}" rx="${(PHONE.radius + PHONE.rim).toFixed(5)}"/></defs>${slices}</svg>`;
            const img = document.createElement("img");
            img.className = `cover-side is-${theme}`;
            img.alt = "";
            img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
            phone.prepend(img);
        });
        phone.classList.add("has-side");
    });
}

// The Apple Sports cover leans with the cursor: the floor slides a little away from it and the lifted parts slide
// the other way, higher parts further, so the screen seems to have depth. The lean eases toward the cursor here,
// frame by frame, and is written straight onto those pieces, each on its own layer (style.css): following the cursor
// then only moves finished layers, with nothing redrawn.
// Once the visitor leaves and the parts have settled back down, the cover goes back to its picture
const LEAN_EASE = 0.1; // share of the remaining distance covered per frame (at 60fps): about half a second to settle
const LIFT_SETTLE = 1000; // ms for the lifted parts to settle back down (style.css: 0.8s, after up to 0.1s)

document.querySelectorAll(".work-thumbnail .cover-screens").forEach((cover) => {
    drawPhoneSides(cover);
    const thumb = cover.closest(".work-thumbnail");
    const zone = coverZone(cover);
    const card = cover.closest(".work-card") || thumb;
    const floor = cover.querySelector(".cover-floor");
    const parts = [...cover.querySelectorAll(".cover-layer")].map((el) => ({
        el,
        depth: getComputedStyle(el).getPropertyValue("--depth").trim() || "1cqh",
    }));
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let lastTime = 0;
    let restTimer = 0;

    function place() {
        const { x, y } = current;
        if (floor) floor.style.translate = `calc(-50% + ${(-x).toFixed(3)}cqh) calc(-50% + 8cqh + ${(-y).toFixed(3)}cqh)`;
        parts.forEach(({ el, depth }) => {
            const dx = (x * 0.819 + y * 0.932).toFixed(3);
            const dy = (x * -0.574 + y * 1.331).toFixed(3);
            el.style.transform = `translate(calc(${dx} * ${depth}), calc(${dy} * ${depth}))`;
        });
    }

    function step(time) {
        const dt = lastTime ? Math.min(time - lastTime, 50) : 16.7;
        lastTime = time;
        const k = 1 - Math.pow(1 - LEAN_EASE, dt / 16.7); // same feel at any frame rate
        current.x += (target.x - current.x) * k;
        current.y += (target.y - current.y) * k;
        const settled = Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002;
        if (settled) {
            current.x = target.x;
            current.y = target.y;
        }
        place();
        frame = settled ? 0 : requestAnimationFrame(step);
    }

    function go() {
        if (!frame) {
            lastTime = 0;
            frame = requestAnimationFrame(step);
        }
    }

    // back to the picture, once nothing is moving and nobody is using it
    function rest() {
        restTimer = 0;
        if (inUse(zone, card)) return;
        if (frame || current.x || current.y) {
            restTimer = setTimeout(rest, 200);
            return;
        }
        restTimer = whenScrollQuiet(() => {
            if (!inUse(zone, card)) cover.classList.remove("is-live", "is-warm");
        });
    }

    watchCoverUse(zone, card, () => {
        clearTimeout(restTimer);
        bringToLife(cover);
    }, () => {
        clearTimeout(restTimer);
        if (cover.classList.contains("is-warm")) {
            cover.classList.remove("is-warm"); // left before it was ready
            return;
        }
        restTimer = setTimeout(rest, reduceMotion.matches ? 0 : LIFT_SETTLE);
    });

    thumb.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || reduceMotion.matches || !cover.classList.contains("is-live")) return;
        const rect = thumb.getBoundingClientRect();
        target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        target.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        go();
    });

    thumb.addEventListener("pointerleave", () => {
        target.x = 0;
        target.y = 0;
        if (current.x || current.y) go();
    });
});

// The portfolio cover's wall of sections: pointing at it (or at its slice on the Work page, or tabbing to its
// project) eases the columns up to speed, and leaving eases them to a stop where they are, so the motion never
// starts or stops with a jolt. Each column's own speed and direction come from style.css; this only scales them.
// Once stopped (and no longer pointed at), the wall stays as it stopped, drawn as part of the page (is-still): each
// column is fixed where it is and its animation let go, and they pick up from there next time.
// With reduced motion on, the wall holds still (style.css) and is always drawn live, still
const WALL_SPEED_UP = 1000; // ms from still to full speed
const WALL_SLOW_DOWN = 700; // ms from full speed to still
const WALL_SETTLE = 750; // ms for the wall to shrink back after being pointed at (style.css: 0.7s)

document.querySelectorAll(".work-thumbnail .cover-wall").forEach((wall) => {
    const zone = coverZone(wall);
    const card = wall.closest(".work-card") || zone;
    const tracks = [...wall.querySelectorAll(".cover-wall-track")];
    const stoppedAt = new Map(); // track -> its animation's time when the wall went still
    let runs = [];
    let level = 0; // 0 = still, 1 = full speed
    let target = 0;
    let frame = 0;
    let lastTime = 0;
    let stillTimer = 0;
    let started = false; // the columns' animations have started; until then their speed is left alone

    if (reduceMotion.matches) wall.classList.add("is-still");

    // the columns' animations, taken over from the stylesheet: running, but at no speed until pointed at,
    // and picking up where they stopped. Their speed only starts changing once they've started (changing it before
    // keeps them waiting to start, and they'd then jump in at full speed)
    function takeOver() {
        runs = [];
        started = false;
        if (reduceMotion.matches) return;
        tracks.forEach((track) => {
            track.style.transform = "";
            const run = track.getAnimations()[0];
            if (!run) return;
            run.playbackRate = 0;
            run.play();
            if (stoppedAt.has(track)) run.currentTime = stoppedAt.get(track);
            runs.push(run);
        });
        const these = runs;
        Promise.all(these.map((run) => run.ready)).catch(() => {}).then(() => {
            if (runs !== these) return; // gone still (or live again) meanwhile
            started = true;
            go(target);
        });
    }

    // ease in and out: slow at both ends of the change, so speed builds and fades smoothly
    const ease = (t) => t * t * (3 - 2 * t);

    // Sets the columns' speed. Stopped, they're paused rather than left running at no speed: the browser can't hand
    // an animation at no speed to the graphics card, so it moved each column itself on every frame, redrawing the wall's
    // tiles and the thumbnail's ring each time, for as long as the wall stayed live (the switch to still waits for the
    // scrolling to stop, so scrolling with the pointer just off the cover kept it that way). A column picking up again
    // is played from where it paused, and its speed is only changed again once it has started (see takeOver)
    function setRate(rate) {
        runs.forEach((run) => {
            if (rate === 0) {
                if (run.playState !== "paused") run.pause();
            } else if (run.playState === "paused") {
                run.playbackRate = rate;
                run.play();
            } else if (!run.pending) {
                run.playbackRate = rate;
            }
        });
    }

    function step(now) {
        const dt = lastTime ? now - lastTime : 16;
        lastTime = now;
        const span = target > level ? WALL_SPEED_UP : WALL_SLOW_DOWN;
        level = target > level ? Math.min(target, level + dt / span) : Math.max(target, level - dt / span);
        setRate(ease(level));
        frame = level === target ? 0 : requestAnimationFrame(step);
    }

    function go(to) {
        target = to;
        if (!runs.length || !started) return; // not live (or not started) yet: it heads for this speed once it is
        if (!frame) {
            lastTime = 0;
            frame = requestAnimationFrame(step);
        }
    }

    function start() {
        clearTimeout(stillTimer);
        if (wall.classList.contains("is-still")) {
            // straight from still to live: the same picture, with its pictures already there
            wall.classList.replace("is-still", "is-live");
            takeOver();
        } else {
            bringToLife(wall, takeOver);
        }
    }

    // fix each column where it stopped and let the animations go
    function settle() {
        stillTimer = 0;
        if (inUse(zone, card)) return;
        if (frame || level) {
            stillTimer = setTimeout(settle, 100);
            return;
        }
        stillTimer = whenScrollQuiet(() => {
            if (inUse(zone, card) || !wall.classList.contains("is-live")) return;
            if (!reduceMotion.matches && !runs.some((run) => run.currentTime > 0)) {
                // never got going: its picture still matches, so back to that
                wall.classList.remove("is-live");
                runs = [];
                return;
            }
            tracks.forEach((track) => {
                const run = track.getAnimations()[0];
                if (!run) return;
                // where it is, as a share of its own length (style.css: up runs 0 to -50%, down -50% to 0), so it
                // stays put however the cover is resized
                const at = run.effect.getComputedTiming().progress || 0;
                const y = run.animationName === "cover-wall-up" ? -50 * at : -50 + 50 * at;
                track.style.transform = `translateY(${y.toFixed(5)}%)`;
                stoppedAt.set(track, run.currentTime);
            });
            runs = [];
            wall.classList.replace("is-live", "is-still");
        });
    }

    watchCoverUse(zone, card, start, () => {
        clearTimeout(stillTimer);
        if (wall.classList.contains("is-warm")) {
            wall.classList.remove("is-warm"); // left before it was ready
            return;
        }
        stillTimer = setTimeout(settle, reduceMotion.matches ? 0 : WALL_SETTLE);
    });

    zone.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") go(1);
    });
    zone.addEventListener("pointerleave", () => go(0));
    card.addEventListener("focusin", () => {
        if (card.querySelector(":focus-visible")) go(1);
    });
    card.addEventListener("focusout", (e) => {
        if (!card.contains(e.relatedTarget) && !zone.matches(":hover")) go(0);
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

// About, boba order ticket: the notches sit level with the tear line above the options, wherever it lands
// (the options wrap to more rows on narrow cards). Measured, then kept up to date as the card resizes
document.querySelectorAll(".fun-ticket").forEach((ticket) => {
    const order = ticket.querySelector(".fun-order");
    if (!order || !window.ResizeObserver) return;
    const place = () => ticket.style.setProperty("--tear-y", `${order.offsetTop + ticket.clientTop}px`);
    new ResizeObserver(place).observe(ticket);
    place();
});

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
    function goBack(e) {
        const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
        if (cameFromSite && history.length > 1) {
            e.preventDefault();
            history.back();
        }
    }

    backBtn.addEventListener("click", goBack);

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
        requestScrollEffects();
    }

    function unpinSection() {
        if (pinnedSection === null) return;
        pinnedSection = null;
        requestScrollEffects();
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

    const sectionNames = sectionHeaders.map((h) => h.textContent.trim());
    const shown = { ring: null, percent: null, label: null, current: null, tocShown: null, tocCovered: null }; // what the page shows now

    // The bottom pill (ring, percentage, label) is hidden on wide screens, where the side list takes its place
    // (style.css): there it's left alone, and it catches up when the window narrows
    const pillHidden = window.matchMedia("(min-width: 1280px)");
    pillHidden.addEventListener("change", () => {
        shown.ring = shown.percent = shown.label = null;
        requestScrollEffects();
    });

    addScrollEffect(({ y, height, progress }) => {
        const pill = !pillHidden.matches;
        const percent = Math.round(progress * 100);
        const atEnd = percent === 100; // matches the ring reading 100%

        // Current section: last header past a third of the screen; none at the end.
        // Headers run down the page in order, so the first one below the line ends the search
        const line = height / 3;
        let current = -1;
        for (let i = 0; i < sectionHeaders.length; i++) {
            if (sectionHeaders[i].getBoundingClientRect().top > line) break;
            current = i;
        }
        if (atEnd) current = -1;

        // a clicked section wins
        const pinned = pinnedSection !== null;
        if (pinned) current = pinnedSection;

        const label = atEnd && !pinned ? "The End" : current >= 0 ? sectionNames[current] : "Scroll Down";

        const tocShown = y > height;
        const tocCovered = tocStop.getBoundingClientRect().top < tocTop.getBoundingClientRect().bottom;

        const next = {
            ring: pill ? (progress * 100).toFixed(1) : shown.ring,
            percent: pill ? percent : shown.percent,
            label: pill ? label : shown.label,
            current,
            tocShown,
            tocCovered,
        };
        if (Object.keys(next).every((key) => next[key] === shown[key])) return null;

        return () => {
            if (next.ring !== shown.ring) progressFill.style.strokeDasharray = `${next.ring} 100`;
            if (next.percent !== shown.percent) setText(progressPercent, `${next.percent}%`);
            if (next.label !== shown.label) setText(sectionLabel, next.label);
            if (current !== shown.current) {
                [sectionItems, tocItems].forEach((items) => items.forEach((btn, i) => {
                    if (i === current) btn.setAttribute("aria-current", "true");
                    else btn.removeAttribute("aria-current");
                }));
            }
            if (tocShown !== shown.tocShown) tocTop.classList.toggle("is-shown", tocShown);
            if (tocCovered !== shown.tocCovered) tocTop.classList.toggle("is-covered", tocCovered);
            Object.assign(shown, next);
        };
    });

    sectionToggle.addEventListener("click", () => {
        setSectionMenu(sectionMenu.classList.contains("hidden")); // open if currently hidden
    });

    document.addEventListener("click", (e) => {
        if (!pageNav.contains(e.target)) setSectionMenu(false);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setSectionMenu(false);
    });

}

// Screen recordings: they play on their own while on screen. A small bar along the bottom of each screen has
// play/pause, a timeline to drag back and forth (and stop on any frame), and the time. On the page it folds
// down to just the button until the phone is pointed at (style.css); the larger view always shows all of it.
// With reduced motion on, they start paused and wait for that button.
// They're marked data-autoplay (not autoplay) and preload="none", so nothing downloads until a recording nears the screen
const userPaused = new WeakSet(); // recordings the visitor paused stay paused when they scroll back
const PAUSE_ICON = '<svg class="icon-pause" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1"/><rect x="9.5" y="2.5" width="3" height="11" rx="1"/></svg>';
const PLAY_ICON = '<svg class="icon-play" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 3.3v9.4a.6.6 0 0 0 .9.5l7.8-4.7a.6.6 0 0 0 0-1L5.9 2.8a.6.6 0 0 0-.9.5z"/></svg>';
const SEEK_STEPS = 1000; // the timeline's resolution

const formatTime = (seconds) => {
    const s = Math.floor(seconds || 0);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function addMediaControls(video) {
    const bar = document.createElement("div");
    bar.className = "media-controls";
    bar.innerHTML =
        `<button type="button" class="media-toggle">${PAUSE_ICON}${PLAY_ICON}</button>` +
        `<input type="range" class="media-seek" min="0" max="${SEEK_STEPS}" step="1" value="0" aria-label="Video position">` +
        '<span class="media-time" aria-hidden="true"><span class="media-time-now">0:00</span><span class="media-time-total"></span></span>';
    const btn = bar.querySelector(".media-toggle");
    const seek = bar.querySelector(".media-seek");
    const now = bar.querySelector(".media-time-now");
    const total = bar.querySelector(".media-time-total");
    let dragging = false;
    let frame = 0;

    function show() {
        const paused = video.paused;
        btn.classList.toggle("is-paused", paused);
        btn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
    }

    // the bar follows the video: every frame while it plays and the timeline can be seen, and after any jump. Only what
    // changed is written, so most frames touch nothing (the time reads in whole seconds; the timeline moves in steps of
    // 1/1000). On the page the bar is folded down to its button until the phone is pointed at (style.css), and a moving
    // timeline nobody can see still had to be laid out and redrawn on nearly every frame while the recording played,
    // scrolling or not. So while folded it moves only as the time ticks over (it stays current for screen readers),
    // and catches up the moment the bar opens, before that frame is drawn
    let shownStep = null;
    let shownTime = null;
    let lastOpen = -Infinity;
    const FOLD_TIME = 500; // ms: the bar is still folding away this long after it was last open (style.css: 0.35s)

    // can the timeline be seen: always in the larger view; on the page while the phone is pointed at or the bar is
    // tabbed into, and while it folds away after
    function timelineShown() {
        if (!bar.isConnected || bar.closest(".media-stage") || bar.parentElement.matches(":hover") || bar.querySelector(":focus-visible")) {
            lastOpen = performance.now();
            return true;
        }
        return performance.now() - lastOpen < FOLD_TIME;
    }

    function sync(always = true) {
        const duration = video.duration;
        const time = `${formatTime(video.currentTime)}|${formatTime(duration)}`;
        const ticked = time !== shownTime;
        if (!dragging && duration && (always || ticked || timelineShown())) {
            const at = String(Math.round((video.currentTime / duration) * SEEK_STEPS));
            if (seek.value !== at) seek.value = at;
        }
        const step = seek.value;
        if (step !== shownStep) {
            shownStep = step;
            seek.style.setProperty("--progress", `${(step / SEEK_STEPS) * 100}%`);
        }
        if (ticked) {
            shownTime = time;
            setText(now, formatTime(video.currentTime));
            seek.setAttribute("aria-valuetext", `${formatTime(video.currentTime)} of ${formatTime(duration)}`);
        }
    }

    // every frame while the timeline can be seen; folded, the video's own time updates (a few a second) keep the time
    // and timeline current to the second instead
    function follow() {
        sync(false);
        frame = timelineShown() ? requestAnimationFrame(follow) : 0;
    }

    function startFollowing() {
        if (!video.paused && !frame) frame = requestAnimationFrame(follow);
    }

    // opening the bar: caught up at once, then followed frame by frame
    function opened() {
        sync();
        startFollowing();
    }

    video.addEventListener("timeupdate", () => {
        if (!frame) sync(false);
    });
    bar.addEventListener("focusin", opened);

    function showDuration() {
        setText(total, ` / ${formatTime(video.duration)}`);
        sync();
    }

    btn.addEventListener("click", () => {
        if (video.paused) {
            userPaused.delete(video);
            video.play().catch(show);
        } else {
            userPaused.add(video);
            video.pause();
        }
    });

    // dragging the timeline moves the video to that point; a paused video stays paused on that frame
    seek.addEventListener("pointerdown", () => {
        dragging = true;
        if (video.readyState === 0) video.preload = "metadata"; // a recording that hasn't loaded yet starts now
    });
    seek.addEventListener("input", () => {
        if (video.duration) video.currentTime = (seek.value / SEEK_STEPS) * video.duration;
        sync();
    });
    seek.addEventListener("change", () => {
        dragging = false;
        sync();
    });
    seek.addEventListener("pointerup", () => (dragging = false));

    video.addEventListener("play", () => {
        show();
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(follow);
    });
    video.addEventListener("pause", () => {
        show();
        cancelAnimationFrame(frame);
        frame = 0;
        sync();
    });
    video.addEventListener("seeked", sync);
    video.addEventListener("loadedmetadata", showDuration);
    if (video.readyState >= 1) showDuration();

    // clicks on the bar stay on the bar: they don't also open (or close) the larger view
    bar.addEventListener("click", (e) => e.stopPropagation());

    // it may not have started yet; the button shows pause unless the visitor (or reduced motion) paused it
    if ("autoplay" in video.dataset) btn.classList.remove("is-paused");
    else show();
    btn.setAttribute("aria-label", btn.classList.contains("is-paused") ? "Play video" : "Pause video");
    video.parentElement.append(bar);
    video.parentElement.addEventListener("pointerenter", opened); // pointing at the phone opens the bar (style.css)
}

const recordings = document.querySelectorAll(".phone > video");

// Plays a recording as it nears the screen and pauses it once it's off, so only the ones in view download and decode
const recordingWatcher = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
        if (!isIntersecting) video.pause();
        else if (!userPaused.has(video)) video.play().catch(() => {});
    });
}, { rootMargin: "200px 0px" });

recordings.forEach((video) => {
    // its phone is drawn above its neighbours: a recording is always drawn on its own (as a layer), and anything drawn
    // after it that overlaps it, such as the soft shadows of the phones beside it, would then need layers of its own
    // too, which are slow to put together on every frame without a graphics card (style.css)
    video.parentElement.classList.add("is-recording");
    if (reduceMotion.matches) {
        delete video.dataset.autoplay;
        userPaused.add(video);
    }
    addMediaControls(video);
    if (recordingWatcher) recordingWatcher.observe(video);
    else if (!userPaused.has(video)) video.play().catch(() => {}); // old browsers: just play
});

// Larger view: clicking (or Enter / Space on) a phone or a crop opens it big over a dimmed page.
// The copy inside is fresh: a recording picks up where the small one was, and has its own controls.
// When its card holds more than one item, a bar at the bottom steps through them (previous, "2 of 3", next),
// as do Left / Right and, on touch screens, a sideways swipe. It stops at either end
const zoomables = document.querySelectorAll(".case-stage > .phone, .case-stage > .shot.is-actual, .case-shot > .shot.is-actual, .case-row-col > .shot.is-actual, .case-aside > .phone");

if (zoomables.length && typeof HTMLDialogElement === "function") {
    const mediaDialog = document.createElement("dialog");
    mediaDialog.className = "proto-dialog media-dialog";
    mediaDialog.setAttribute("aria-label", "Larger view");
    mediaDialog.innerHTML =
        '<button type="button" class="proto-close" aria-label="Close larger view">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>' +
        '</button><div class="proto-stage media-stage"></div>' +
        '<div class="media-nav">' +
        '<button type="button" class="media-nav-btn" data-step="-1" aria-label="Previous"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg></button>' +
        '<span class="media-count" aria-live="polite"></span>' +
        '<button type="button" class="media-nav-btn" data-step="1" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg></button>' +
        '</div>';
    document.body.append(mediaDialog);
    const mediaStage = mediaDialog.querySelector(".media-stage");

    const closeBtn = mediaDialog.querySelector(".proto-close");
    const mediaNav = mediaDialog.querySelector(".media-nav");
    const mediaCount = mediaDialog.querySelector(".media-count");
    const [prevBtn, nextBtn] = mediaDialog.querySelectorAll(".media-nav-btn");
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
            mediaNav.animate({ opacity: frames(0, 1) }, options),
        ];
        try {
            moves.push(mediaDialog.animate({ opacity: frames(0, 1) }, { ...options, pseudoElement: "::backdrop" }));
        } catch (e) {} // browsers that can't animate the backdrop just show it
        return Promise.all(moves.map((m) => m.finished)).catch(() => {});
    }

    // The items shown alongside this one (same card), for Left / Right. A picture hidden for the other theme
    // isn't one of them
    const groupOf = (item) =>
        [...zoomables].filter((z) => z.closest(".case-stage") === item.closest(".case-stage") && z.getClientRects().length > 0);

    // Shows the open item's place in its group, e.g. "2 of 5", and only offers the directions that go somewhere
    function labelView() {
        const group = groupOf(openItem);
        const index = group.indexOf(openItem);
        const inSet = group.length > 1;
        const place = inSet ? `${index + 1} of ${group.length}` : "";
        mediaDialog.setAttribute("aria-label", inSet ? `Larger view, ${place}` : "Larger view");
        mediaDialog.classList.toggle("has-nav", inSet);
        setText(mediaCount, place);
        prevBtn.disabled = index <= 0;
        nextBtn.disabled = index >= group.length - 1;
    }

    // A fresh copy of a small item for the larger view; a recording carries on from where the small one is
    function copyForView(item) {
        const copy = item.cloneNode(true);
        copy.classList.remove("is-zoomable");
        copy.removeAttribute("tabindex");
        copy.removeAttribute("role");
        copy.removeAttribute("aria-label");
        copy.style.visibility = "";
        copy.querySelector(".media-controls")?.remove();

        const img = copy.matches("img") ? copy : copy.querySelector("img");
        if (img) img.loading = "eager";

        const smallVideo = item.querySelector("video");
        const video = copy.querySelector("video");
        if (video) {
            video.muted = true;
            video.preload = "auto"; // even when paused, show the frame it's on rather than the poster
            video.currentTime = smallVideo.currentTime;
            delete video.dataset.autoplay;
            addMediaControls(video);
            if (!smallVideo.paused) {
                video.play().catch(() => {});
                smallVideo.pause(); // hidden under the larger view, so it doesn't need to keep decoding
            }
        }
        return copy;
    }

    // The small item takes over where the large copy left off: a pause or play in the larger view carries over
    function handBack(copy, item) {
        const video = copy?.querySelector("video");
        const smallVideo = item.querySelector("video");
        if (!video || !smallVideo) return;
        smallVideo.currentTime = video.currentTime;
        if (video.paused) {
            userPaused.add(smallVideo);
            smallVideo.pause();
        } else {
            userPaused.delete(smallVideo);
            smallVideo.play().catch(() => {});
        }
    }

    async function openLarger(item) {
        if (busy || mediaDialog.open) return;
        busy = true;
        openItem = item;
        const copy = copyForView(item);
        mediaStage.replaceChildren(copy);
        labelView();
        mediaDialog.showModal();
        item.style.visibility = "hidden"; // the small one seems to lift off the page into the larger view
        await animateView(copy, true);
        busy = false;
    }

    // Left / Right: the next item in the same group takes the larger view's place, with a quick crossfade.
    // The small items swap too, so closing shrinks the view back into whichever one is showing
    function stepLarger(direction) {
        if (busy || !mediaDialog.open || !openItem) return;
        const group = groupOf(openItem);
        const next = group[group.indexOf(openItem) + direction];
        if (!next) return; // stops at either end

        handBack(mediaStage.firstElementChild, openItem);
        openItem.style.visibility = "";
        openItem = next;
        const copy = copyForView(next);
        mediaStage.replaceChildren(copy);
        next.style.visibility = "hidden";
        labelView();
        if (!reduceMotion.matches) copy.animate({ opacity: [0, 1] }, { duration: 200, easing: "ease-out" });
    }

    // The copy shrinks back into its spot, then the small one takes over where the large one left off
    async function closeLarger() {
        if (busy || !mediaDialog.open) return;
        busy = true;
        const copy = mediaStage.firstElementChild;
        handBack(copy, openItem);
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

    [prevBtn, nextBtn].forEach((btn) => btn.addEventListener("click", () => stepLarger(Number(btn.dataset.step))));

    mediaDialog.addEventListener("keydown", (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.target.matches(".media-seek")) return; // on a timeline, the arrows move through the video instead
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            stepLarger(e.key === "ArrowLeft" ? -1 : 1);
        }
    });

    // Touch: a sideways swipe steps through the set (not on a recording's controls, where it drags the timeline)
    const SWIPE_MIN = 50; // px
    let swipeStart = null;
    let justSwiped = false;
    mediaStage.addEventListener("pointerdown", (e) => {
        swipeStart = e.pointerType !== "mouse" && !e.target.closest(".media-controls") ? { x: e.clientX, y: e.clientY } : null;
    });
    mediaStage.addEventListener("pointerup", (e) => {
        if (!swipeStart) return;
        const dx = e.clientX - swipeStart.x;
        const dy = e.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        justSwiped = true; // the tap the swipe ends in shouldn't close the view
        setTimeout(() => (justSwiped = false), 400);
        stepLarger(dx < 0 ? 1 : -1);
    });
    mediaStage.addEventListener("pointercancel", () => (swipeStart = null));

    // clicking the dimmed area closes it
    mediaDialog.addEventListener("click", (e) => {
        if (justSwiped) return;
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
runScrollEffects(); // correct state if the page loads already scrolled
setUpPageFade();
