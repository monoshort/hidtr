/* Volledig artikel lezen in popup */
(function () {
  "use strict";

  const reader = document.getElementById("ht-article-reader");
  const backdrop = reader?.querySelector(".ht-reader-backdrop");
  const closeBtn = reader?.querySelector(".ht-reader-close");
  const titleEl = reader?.querySelector("#ht-reader-title");
  const metaEl = reader?.querySelector(".ht-reader-meta");
  const loadingEl = reader?.querySelector(".ht-reader-loading");
  const bodyEl = reader?.querySelector(".ht-reader-body");
  const errorEl = reader?.querySelector(".ht-reader-error");
  const extLink = reader?.querySelector(".ht-reader-ext");

  let lastFocus = null;

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bodyToParagraphs(text) {
    const cleaned = String(text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return [];

    const chunks = cleaned.split(/(?<=[.!?])\s+(?=[A-Z"“‘(])/);
    const paragraphs = [];
    let current = "";

    for (const chunk of chunks) {
      const piece = chunk.trim();
      if (!piece) continue;
      const next = current ? `${current} ${piece}` : piece;
      if (current && next.length > 340) {
        paragraphs.push(current.trim());
        current = piece;
      } else {
        current = next;
      }
    }

    if (current) paragraphs.push(current.trim());
    return paragraphs.length ? paragraphs : [cleaned];
  }

  function renderBody(text) {
    const paragraphs = bodyToParagraphs(text);
    return paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  }

  function articleFromElement(el) {
    if (!el) return null;
    return {
      title: el.dataset.htTitle || "",
      date: el.dataset.htDate || "",
      url: el.dataset.htUrl || "",
      author: el.dataset.htAuthor || "",
    };
  }

  function setLoading() {
    if (loadingEl) {
      loadingEl.hidden = false;
      loadingEl.textContent = "Artikel laden uit Verborgen Schatten…";
    }
    if (bodyEl) bodyEl.hidden = true;
    if (errorEl) errorEl.hidden = true;
  }

  function setError(message) {
    if (loadingEl) loadingEl.hidden = true;
    if (bodyEl) bodyEl.hidden = true;
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = message;
    }
  }

  function open(article) {
    if (!reader || !article?.title) return;
    lastFocus = document.activeElement;

    if (titleEl) titleEl.textContent = article.title;
    if (metaEl) {
      metaEl.textContent = [article.author, article.dateLabel, article.publication]
        .filter(Boolean)
        .join(" · ");
    }
    if (extLink) {
      extLink.href = article.url || window.HT_LINKS?.buildSearchUrl?.(article.title) || "#";
      extLink.hidden = !extLink.href || extLink.href === "#";
    }

    setLoading();
    reader.hidden = false;
    reader.setAttribute("aria-hidden", "false");
    reader.classList.add("open");
    document.body.classList.add("article-reader-open", "modal-open");
    closeBtn?.focus();

    const load = window.HT_LINKS?.fetchFullArticle?.(article);
    if (!load) {
      setError("Kon artikel niet laden.");
      return;
    }

    load
      .then((full) => {
        if (titleEl) titleEl.textContent = full.title;
        if (metaEl) {
          metaEl.textContent = [full.author, full.dateLabel, full.publication].filter(Boolean).join(" · ");
        }
        if (extLink) {
          extLink.href = full.url || extLink.href;
          extLink.hidden = !extLink.href || extLink.href === "#";
        }
        if (bodyEl) {
          bodyEl.innerHTML = renderBody(full.body);
          bodyEl.hidden = false;
        }
        if (loadingEl) loadingEl.hidden = true;
        if (errorEl) errorEl.hidden = true;
      })
      .catch(() => {
        setError("Kon het artikel niet ophalen. Probeer via de link naar hiddentreasures.org.");
      });
  }

  function close() {
    if (!reader?.classList.contains("open")) return;
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("article-reader-open", "modal-open");
    window.setTimeout(() => {
      if (reader && !reader.classList.contains("open")) reader.hidden = true;
    }, 280);
    if (bodyEl) bodyEl.innerHTML = "";
    lastFocus?.focus?.();
    lastFocus = null;
  }

  function isOpen() {
    return reader?.classList.contains("open");
  }

  function handleClick(e) {
    const trigger = e.target.closest(".ht-article-open");
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    const article = articleFromElement(trigger);
    if (article?.title) open(article);
  }

  function init() {
    if (!reader) return;
    backdrop?.addEventListener("click", close);
    closeBtn?.addEventListener("click", close);
    document.addEventListener("click", handleClick);
  }

  window.HT_READER = { init, open, close, isOpen, articleFromElement };
})();
