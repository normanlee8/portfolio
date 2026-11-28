"""Renders the covers' resting pictures (the "Covers at rest" pictures in style.css).

Each cover on the site is shown at rest as one picture of itself, and swapped for the live cover when it's pointed at.
The two have to match exactly, so the pictures are rendered from the live covers by Chrome itself: run this again
whenever a cover changes (its markup in index.html, its styles, or its pictures).

    pip install websocket-client
    python _tools/render-covers.py

Writes images/apple-sports/cover-poster-{light,dark}-{640,960,1320}.webp and the same under images/portfolio/.
Each is twice as wide as it is tall (wider than any thumbnail gets: an opened Work slice reaches about 1.9), with the
cover's background drawn as a 16:9 cover draws it.
(The folder starts with an underscore so GitHub Pages doesn't publish it.)
"""
import base64, functools, http.server, json, os, shutil, socket, subprocess, sys, tempfile, threading, time, urllib.request

import websocket

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
]
CSS_W, CSS_H = 1000, 500  # the picture's shape, in CSS pixels; each size is this at a different pixel density
HEIGHTS = (640, 960, 1320)  # pages ask for about 1.3x what they show, so each is drawn smaller than rendered: sharp
COVERS = {"apple-sports": ".cover-screens"}
QUALITY = 90

# The page, reduced to one cover at the picture's size, on nothing
RENDER_CSS = """
html, body { background: transparent !important; }
[data-fade] { animation: none !important; }
body *:not(.render-target, .render-target *) { visibility: hidden !important; }
.render-target {
    position: fixed !important; inset: 0 auto auto 0 !important; margin: 0 !important; padding: 0 !important;
    width: %dpx !important; height: %dpx !important; aspect-ratio: auto !important;
    background: none !important; outline: none !important; border-radius: 0 !important; scale: none !important;
    z-index: 2147483647 !important; visibility: visible !important;
}
.render-target > p, .render-target > .view-project { display: none !important; }
/* the thumbnail's faint ring (style.css) is drawn over the picture on the page, so it isn't part of the picture */
.render-target::after { content: none !important; }
/* painted straight into the picture at full resolution: no layers of their own (a layer can be drawn at less than
   full resolution and then stretched, which comes out soft) */
.render-target *, .render-target *::before, .render-target *::after { will-change: auto !important; }
/* the background as a 16:9 cover draws it (the shape every cover has at rest), carried on past its sides */
.render-target > .cover-screens, .render-target > .cover-wall { --bg-w: %.3fpx !important; border-radius: 0 !important; }
""" % (CSS_W, CSS_H, CSS_H * 16 / 9)

PREPARE_JS = """
(async (selector, dark) => {
    document.documentElement.classList.toggle("dark-theme", dark);
    const cover = document.querySelector(".work-thumbnail " + selector);
    const thumb = cover.closest(".work-thumbnail");
    thumb.classList.add("render-target");
    cover.classList.remove("is-warm", "is-still");
    cover.classList.add("is-live");
    const style = document.createElement("style");
    style.textContent = %s;
    document.head.append(style);
    const theme = dark ? "dark" : "light";
    const imgs = [...cover.querySelectorAll("img:not(.cover-poster)")].filter((img) => !img.classList.contains(dark ? "is-light" : "is-dark"));
    imgs.forEach((img) => (img.loading = "eager"));
    // the wall's columns where their animations hold them at rest, fixed there, so nothing is left animating
    cover.querySelectorAll(".cover-wall-track").forEach((track) => {
        const at = getComputedStyle(track).transform;
        track.style.animation = "none";
        track.style.transform = at;
    });
    await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return imgs.length + " pictures, " + imgs.filter((i) => i.complete && i.naturalWidth).length + " loaded";
})
""" % json.dumps(RENDER_CSS)


class Handler(http.server.SimpleHTTPRequestHandler):
    """Like GitHub Pages: /about serves about.html"""

    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) and os.path.exists(path + ".html"):
            self.path = self.path.split("?")[0] + ".html"
        return super().send_head()

    def log_message(self, *args):
        pass


class QuietServer(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        pass  # Chrome dropping a connection as it moves on to the next page


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class Browser:
    def __init__(self):
        chrome = next((p for p in CHROME_PATHS if os.path.exists(p)), None) or shutil.which("chrome") or shutil.which("google-chrome")
        if not chrome:
            sys.exit("Chrome not found")
        self.profile = tempfile.mkdtemp(prefix="render-covers")
        port = free_port()
        self.proc = subprocess.Popen([chrome, "--headless=new", f"--remote-debugging-port={port}", f"--user-data-dir={self.profile}",
                                      "--no-first-run", "--hide-scrollbars", "--force-color-profile=srgb", "about:blank"],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                targets = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list"))
                page = next(t for t in targets if t["type"] == "page")
                break
            except Exception:
                time.sleep(0.1)
        else:
            sys.exit("Chrome didn't start")
        self.ws = websocket.create_connection(page["webSocketDebuggerUrl"], max_size=None, timeout=60)
        self.id = 0

    def send(self, method, params=None):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def wait_for_load(self, timeout=30):
        end = time.time() + timeout
        while time.time() < end:
            if self.send("Runtime.evaluate", {"expression": "document.readyState", "returnByValue": True})["result"]["value"] == "complete":
                return
            time.sleep(0.05)
        raise TimeoutError("page load")

    def close(self):
        self.proc.terminate()
        try:
            self.proc.wait(5)
        except Exception:
            self.proc.kill()
        shutil.rmtree(self.profile, ignore_errors=True)


def main():
    port = free_port()
    server = QuietServer(("127.0.0.1", port), functools.partial(Handler, directory=ROOT))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    browser = Browser()
    try:
        browser.send("Page.enable")
        browser.send("Emulation.setDefaultBackgroundColorOverride", {"color": {"r": 0, "g": 0, "b": 0, "a": 0}})
        browser.send("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "no-preference"}]})
        for folder, selector in COVERS.items():
            for theme in ("light", "dark"):
                for height in HEIGHTS:
                    scale = height / CSS_H
                    browser.send("Emulation.setDeviceMetricsOverride", {"width": CSS_W, "height": CSS_H, "deviceScaleFactor": scale, "mobile": False})
                    browser.send("Page.navigate", {"url": f"http://127.0.0.1:{port}/"})
                    browser.wait_for_load()
                    note = browser.send("Runtime.evaluate", {"expression": f"({PREPARE_JS})({json.dumps(selector)}, {json.dumps(theme == 'dark')})",
                                                             "awaitPromise": True, "returnByValue": True})["result"]["value"]
                    time.sleep(0.3)
                    shot = browser.send("Page.captureScreenshot", {"format": "webp", "quality": QUALITY, "fromSurface": True,
                                                                   "clip": {"x": 0, "y": 0, "width": CSS_W, "height": CSS_H, "scale": 1}})
                    out = os.path.join(ROOT, "images", folder, f"cover-poster-{theme}-{height}.webp")
                    with open(out, "wb") as f:
                        f.write(base64.b64decode(shot["data"]))
                    print(f"{os.path.relpath(out, ROOT)}  {os.path.getsize(out) // 1024} KB  ({note})")
    finally:
        browser.close()
        server.shutdown()


if __name__ == "__main__":
    main()
