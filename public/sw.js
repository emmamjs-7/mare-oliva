// ==== Service Worker (robust prod) ====
// Network-first för assets, NO-CACHE för /api, cache-säkerhetsbälten.

const CACHE_VERSION = "v6"; // <- ändra vid varje SW-ändring
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;
const ASSETS = ["/", "images/missing-image.png"];
const MISSING_IMG = "images/missing-image.png";

// --- Install ---
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    self.skipWaiting(); // snabbare aktivering
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
  })());
});

// --- Activate ---
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith("app-cache-") && k !== CACHE_NAME)
        .map(k => caches.delete(k))
    );
  })());
});

// --- Fetch ---
self.addEventListener("fetch", (event) => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const method = request.method;
  const isGET = method === "GET";

  // Skydd: hantera bara http/https — ignorera chrome-extension:, data:, blob:, ws:, wss:
  if (!isHttp(url)) {
    try { return await fetch(request); }
    catch { return new Response("Unsupported scheme", { status: 400 }); }
  }

  const isApi = url.pathname.startsWith("/api/");
  const isNavigation =
    request.mode === "navigate" ||
    (isGET && request.headers.get("accept")?.includes("text/html"));

  // 1) API → alltid nätet, med cookies, no-store; ALDRIG cache
  if (isApi) {
    try {
      const apiReq = new Request(request, { credentials: "include", cache: "no-store" });
      return await fetch(apiReq);
    } catch {
      return json503({ error: "Offline (API)" });
    }
  }

  // 2) SPA-navigering → network-first, fallback till index vid offline
  if (isNavigation) {
    try {
      return await fetch(request);
    } catch {
      const cache = await caches.open(CACHE_NAME);
      const fallback = await cache.match("/");
      return fallback ?? new Response("Offline", { status: 503 });
    }
  }

  // 3) Övriga GET (bilder/css/js) → network-first + cacha säkra svar
  if (isGET) {
    const cache = await caches.open(CACHE_NAME);
    try {
      const net = await fetch(request);
      if (shouldCache(request, net)) {
        cache.put(request, net.clone());
      }
      return net;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;

      if (looksLikeImage(url.pathname)) {
        const missing = await cache.match(MISSING_IMG);
        if (missing) return missing;
      }
      return new Response("Offline", { status: 503 });
    }
  }

  // 4) Andra metoder (POST/PUT/DELETE/OPTIONS) som inte är /api → bara vidare
  try {
    return await fetch(request);
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

// --- Helpers ---
function looksLikeImage(path) {
  return /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(path);
}
function isHttp(url) {
  return url.protocol === "http:" || url.protocol === "https:";
}
function sameOrigin(url) {
  return url.origin === self.location.origin;
}
function shouldCache(req, resp) {
  // Cacha bara GET + http/https + same-origin + OK + "basic"
  return (
    req.method === "GET" &&
    isHttp(new URL(req.url)) &&
    sameOrigin(new URL(req.url)) &&
    resp &&
    resp.ok &&
    resp.type === "basic"
  );
}
function json503(obj) {
  return new Response(JSON.stringify(obj), {
    status: 503,
    headers: { "Content-Type": "application/json" }
  });
}
