/*
 * Catalogue language switching through the Google Translate element, ported
 * from b2b_orders/js/catalog_translate.js. It runs inside the catalogue frame,
 * so only the catalogue pages are translated and the admin stays in English.
 * No reload: the widget's own combo is driven in place, and the googtrans
 * cookie is written so a refresh keeps the language.
 */

const SUPPORTED = ["en", "hi", "bn", "mr", "gu", "pa", "or", "kn", "ta", "te", "ml", "ne", "as"];

export function createCatalogTranslate(win, { onUnavailable } = {}) {
  const doc = win.document;
  let loading = false;
  let ready = false;
  let pending = null;

  const getGoogTrans = () => {
    const m = doc.cookie.match(/googtrans=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  };

  const setGoogTrans = (lang) => {
    const value = !lang || lang === "en" ? "/en/en" : "/en/" + lang;
    doc.cookie = "googtrans=; path=/; max-age=0";
    doc.cookie = "googtrans=; path=/; domain=" + win.location.hostname + "; max-age=0";
    doc.cookie = "googtrans=" + encodeURIComponent(value) + "; path=/; max-age=31536000";
  };

  const langFromCookie = () => {
    const m = getGoogTrans().match(/^\/en\/([a-z-]+)$/);
    return m && SUPPORTED.includes(m[1]) ? m[1] : "en";
  };

  const hideGoogleChrome = () => {
    const bar = doc.querySelector(".goog-te-banner-frame, .skiptranslate iframe");
    if (bar) {
      bar.style.display = "none";
      bar.style.height = "0";
    }
    if (doc.body && doc.body.style.top !== "0px") doc.body.style.top = "0px";
    doc.documentElement.style.marginTop = "0";
  };

  const apply = (lang) => {
    const combo = doc.querySelector(".goog-te-combo");
    if (!combo) {
      pending = lang;
      return;
    }
    combo.value = lang === "en" ? "" : lang;
    combo.dispatchEvent(new win.Event("change"));
  };

  const mountHost = () => {
    let host = doc.getElementById("google_translate_element");
    if (!host) {
      host = doc.createElement("div");
      host.id = "google_translate_element";
      host.className = "notranslate";
      host.setAttribute("aria-hidden", "true");
      doc.body.appendChild(host);
    }
  };

  win.googleTranslateElementInit = () => {
    if (!win.google || !win.google.translate) return;
    new win.google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: SUPPORTED.join(","), autoDisplay: false }, "google_translate_element");
    hideGoogleChrome();
    win.setInterval(hideGoogleChrome, 600);
    const wait = win.setInterval(() => {
      if (!doc.querySelector(".goog-te-combo")) return;
      win.clearInterval(wait);
      ready = true;
      if (pending) {
        apply(pending);
        pending = null;
      }
    }, 150);
  };

  const loadScript = () => {
    if (loading || doc.getElementById("bal-catalog-translate-script")) return;
    loading = true;
    mountHost();
    const s = doc.createElement("script");
    s.id = "bal-catalog-translate-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    s.onerror = () => {
      loading = false;
      onUnavailable?.("Google Translate could not be reached — the catalogue stays in English.");
    };
    doc.head.appendChild(s);
  };

  return {
    setLanguage(lang) {
      const next = SUPPORTED.includes(lang) ? lang : "en";
      setGoogTrans(next);
      if (next === "en") {
        if (ready) apply("en");
        return;
      }
      if (!ready) {
        pending = next;
        loadScript();
        return;
      }
      apply(next);
    },
    /** Re-submit freshly rendered pages: bounce through English to force a new pass. */
    refresh() {
      const lang = langFromCookie();
      if (lang === "en" || !ready) return;
      apply("en");
      win.setTimeout(() => apply(lang), 60);
    },
    current: langFromCookie,
    /** Resolves once the widget has settled, so printing waits for it. */
    settled() {
      if (langFromCookie() === "en") return Promise.resolve();
      return new Promise((resolve) => {
        let tries = 0;
        const timer = win.setInterval(() => {
          tries++;
          if (ready || tries > 40) {
            win.clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    },
  };
}
