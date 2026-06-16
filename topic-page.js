/* Visuele onderwerp-pagina's — dynamisch uit HT_TOPICS */
(function () {
  "use strict";

  const ANATOMY_ZONE = {
    god: "god",
    geest: "geest",
    ziel: "ziel",
    verstand: "verstand",
    fantasie: "fantasie",
    "fantasie-gevaar": "fantasie",
    "fantasie-geest": "fantasie",
    "vs-fantasie": "fantasie",
    "vs-verlicht": "fantasie",
    hart: "hart",
    wil: "wil",
    geweten: "geweten",
    "gw-plaats": "geweten",
    gevoel: "gevoel",
    "gv-plaats": "gevoel",
    tong: "tong",
    "tg-plaats": "tong",
    zintuigen: "zintuigen",
    lichaam: "lichaam",
    leden: "lichaam",
    "lichaam-vlezes": "lichaam",
    "lichaam-zonde": "lichaam",
    "lichaam-doods": "lichaam",
  };

  const ZONE_LABELS = {
    god: "God",
    geest: "Geest",
    ziel: "Ziel",
    verstand: "Verstand",
    fantasie: "Fantasie",
    geweten: "Geweten",
    gevoel: "Gevoel",
    tong: "Tong",
    wil: "Wil",
    lichaam: "Lichaam",
    zintuigen: "Zintuigen",
  };

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function summarySteps(summary) {
    if (!summary) return [];
    const parts = summary
      .split(/(?<=[.!?;])\s+|\s+[?—–-]\s+/)
      .map((s) => s.replace(/^[—–-]\s*/, "").trim())
      .filter((s) => s.length > 8);
    if (parts.length) return parts;
    if (summary.trim().length > 8) return [summary.trim()];
    return [];
  }

  function getKind(rawId, panelId) {
    const id = rawId || panelId;
    if (ANATOMY_ZONE[id] || ANATOMY_ZONE[panelId]) return "anatomy";
    if (id.startsWith("cmp-")) return "compare";
    if (id.endsWith("-overzicht")) return "overview";
    if (/^(vz-|dw-|r7-|gst-|gl-|om-|kr-|bz-|hm-|gv-|gw-|tg-|vs-)/.test(id)) return "journey";
    if (id.startsWith("wet-")) return "law";
    return "concept";
  }

  function buildAnatomySvg(highlight, color) {
    const gid = `tpG${highlight}`;
    const lit = (z) => (z === highlight ? 1 : 0.28);
    const stroke = (z) => (z === highlight ? color : "transparent");
    const sw = (z) => (z === highlight ? 2.2 : 0);
    return `<svg class="tp-anatomy-svg" viewBox="0 0 100 210" role="img" aria-label="Positie in het model van de mens">
      <defs><radialGradient id="${gid}"><stop offset="0%" stop-color="${esc(color)}"/><stop offset="100%" stop-color="#312e81"/></radialGradient></defs>
      <ellipse data-z="god" cx="50" cy="18" rx="24" ry="14" fill="url(#${gid})" opacity="${lit("god")}" stroke="${stroke("god")}" stroke-width="${sw("god")}"/>
      <text x="50" y="21" text-anchor="middle" fill="#fff" font-size="6.5" font-weight="700" pointer-events="none">GOD</text>
      <line x1="50" y1="32" x2="50" y2="40" stroke="#6366f1" stroke-width="1.2" opacity=".45"/>
      <ellipse data-z="geest" cx="50" cy="50" rx="20" ry="12" fill="#2563eb" opacity="${lit("geest")}" stroke="${stroke("geest")}" stroke-width="${sw("geest")}"/>
      <text x="50" y="52" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="600" pointer-events="none">GEEST</text>
      <rect data-z="ziel" x="26" y="66" width="48" height="62" rx="9" fill="#7c3aed" opacity="${lit("ziel")}" stroke="${stroke("ziel")}" stroke-width="${sw("ziel")}"/>
      <text x="50" y="78" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="600" pointer-events="none">ZIEL</text>
      <rect data-z="verstand" x="30" y="82" width="40" height="9" rx="3" fill="#f59e0b" opacity="${Math.max(lit("verstand"), highlight === "verstand" ? 1 : 0.35)}"/>
      <rect data-z="fantasie" x="30" y="93" width="40" height="9" rx="3" fill="#06b6d4" opacity="${Math.max(lit("fantasie"), highlight === "fantasie" ? 1 : 0.35)}"/>
      <rect data-z="hart" x="30" y="104" width="40" height="9" rx="3" fill="#dc2626" opacity="${Math.max(lit("hart"), highlight === "hart" ? 1 : 0.35)}"/>
      <rect data-z="wil" x="30" y="115" width="40" height="7" rx="2" fill="#a78bfa" opacity="${Math.max(lit("wil"), highlight === "wil" ? 1 : 0.35)}"/>
      <rect data-z="lichaam" x="28" y="132" width="44" height="58" rx="10" fill="#ea580c" opacity="${lit("lichaam")}" stroke="${stroke("lichaam")}" stroke-width="${sw("lichaam")}"/>
      <text x="50" y="146" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="600" pointer-events="none">LICHAAM</text>
      <rect data-z="zintuigen" x="32" y="158" width="36" height="8" rx="2" fill="#f97316" opacity="${Math.max(lit("zintuigen"), highlight === "zintuigen" ? 1 : 0.4)}"/>
      ${highlight ? `<circle cx="88" cy="24" r="14" fill="${esc(color)}" opacity=".2"/><text x="88" y="27" text-anchor="middle" fill="${esc(color)}" font-size="4.5" font-weight="700">${esc(ZONE_LABELS[highlight] || "")}</text>` : ""}
    </svg>`;
  }

  function buildCompareVisual(rawId) {
    const isSpirit = /geestelijk|geest|woord|geloof/.test(rawId);
    return `<div class="tp-compare">
      <div class="tp-compare-col tp-compare-left${isSpirit ? "" : " is-active"}">
        <span class="tp-compare-badge">Vlees / ziel</span>
        <p>Eigen wil, zielsbegeerte, wat van buiten via de zintuigen binnenkomt en in hart en wil landt.</p>
      </div>
      <div class="tp-compare-divider" aria-hidden="true">⇄</div>
      <div class="tp-compare-col tp-compare-right${isSpirit ? " is-active" : ""}">
        <span class="tp-compare-badge">Geest / geloof</span>
        <p>Wat de verlichte geest door het Woord en de Geest in de mens plant — niet van de wereld.</p>
      </div>
    </div>`;
  }

  function buildLawVisual(rawId, color) {
    const laws = [
      { id: "wet-geest", label: "Wet des geestes", sub: "Leven en vrede", cls: "spirit" },
      { id: "wet-zonde", label: "Wet der zonde", sub: "Begeerte in de leden", cls: "sin" },
      { id: "wet-doods", label: "Wet des doods", sub: "Veroordeeld geweten", cls: "death" },
    ];
    let html = `<div class="tp-law-grid">`;
    laws.forEach((law) => {
      const active = rawId === law.id || rawId.includes(law.cls);
      html += `<div class="tp-law-card tp-law-${law.cls}${active ? " is-active" : ""}" style="${active ? `--tp-accent:${esc(color)}` : ""}">
        <strong>${esc(law.label)}</strong>
        <span>${esc(law.sub)}</span>
      </div>`;
    });
    html += `</div><p class="tp-law-note">Drie krachten die tegelijk in de mens kunnen werken — Paulus beschrijft de strijd in Rom. 7.</p>`;
    return html;
  }

  function buildJourneyVisual(steps, color) {
    if (!steps.length) steps = ["Binnenkomst", "Verwerking", "Keuze", "Gevolg"];
    let html = `<div class="tp-journey">`;
    steps.slice(0, 5).forEach((step, i) => {
      if (i > 0) html += `<span class="tp-journey-arrow" aria-hidden="true">→</span>`;
      html += `<div class="tp-journey-step" style="--step-i:${i};--tp-accent:${esc(color)}">
        <span class="tp-journey-num">${i + 1}</span>
        <span class="tp-journey-text">${esc(step.length > 72 ? `${step.slice(0, 69)}…` : step)}</span>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  function buildConceptVisual(steps, color, tabIcon) {
    const items = steps.length ? steps : ["Kern van dit onderwerp"];
    let html = `<div class="tp-concept-grid">`;
    items.slice(0, 4).forEach((step, i) => {
      html += `<div class="tp-concept-card" style="--tp-accent:${esc(color)};--card-i:${i}">
        <span class="tp-concept-icon" aria-hidden="true">${esc(tabIcon || "◆")}</span>
        <p>${esc(step)}</p>
      </div>`;
    });
    html += `</div>`;
    return html;
  }

  function buildOverviewGrid(related, escapeHtml) {
    if (!related?.length) return "";
    let html = `<div class="tp-overview-grid">`;
    related.slice(0, 6).forEach((relId) => {
      const t = window.HT_TOPICS?.[relId];
      if (!t) return;
      html += `<button type="button" class="tp-overview-card" data-topic="${escapeHtml(relId)}" style="--tp-accent:${escapeHtml(t.color || "#818cf8")}">
        <strong>${escapeHtml(t.title)}</strong>
        <span>${escapeHtml(t.summary.slice(0, 80))}${t.summary.length > 80 ? "…" : ""}</span>
      </button>`;
    });
    html += `</div>`;
    return html;
  }

  window.renderTopicPage = function renderTopicPage(opts) {
    const {
      panelTopic,
      rawTopicId,
      topic,
      tab,
      tabLabel,
      hubLabel,
      hubTheme,
      tabIcon,
      related,
      escapeHtml,
    } = opts;

    const color = topic.color || "#818cf8";
    const steps = summarySteps(topic.summary);
    const displaySteps = steps.length ? steps : (topic.summary ? [topic.summary] : ["Kern van dit onderwerp"]);
    const kind = getKind(rawTopicId || panelTopic, panelTopic);
    const zoneId = ANATOMY_ZONE[rawTopicId] || ANATOMY_ZONE[panelTopic];
    const lead = displaySteps[0] || topic.summary;

    const illus = window.TP_ILLUSTRATION?.resolve(
      rawTopicId || panelTopic,
      panelTopic,
      kind,
      color,
      zoneId
    );

    let visualMain = "";
    if (illus) {
      visualMain = illus.html;
    } else if (kind === "anatomy" && zoneId) {
      visualMain = buildAnatomySvg(zoneId, color);
    } else if (kind === "compare") {
      visualMain = buildCompareVisual(rawTopicId || panelTopic);
    } else if (kind === "law") {
      visualMain = buildLawVisual(rawTopicId || panelTopic, color);
    } else if (kind === "journey") {
      visualMain = buildJourneyVisual(displaySteps, color);
    } else if (kind === "overview") {
      visualMain = buildOverviewGrid(related, escapeHtml) || buildConceptVisual(displaySteps, color, tabIcon);
    } else {
      visualMain = buildConceptVisual(displaySteps, color, tabIcon);
    }

    const stepItems = displaySteps
      .map((s, i) => `<li class="tp-step-item" style="--step-i:${i}"><span class="tp-step-bullet">${i + 1}</span><span>${escapeHtml(s)}</span></li>`)
      .join("");

    const refsHtml = topic.refs?.length
      ? `<section class="tp-refs" aria-label="Bijbelverwijzingen">
          <h2 class="tp-section-title">Schriften</h2>
          <div class="tp-ref-pills">${topic.refs.map((r) => `<span class="tp-ref-pill">${escapeHtml(r)}</span>`).join("")}</div>
        </section>`
      : "";

    const quotesHtml = topic.quotes?.length
      ? topic.quotes
          .map(
            (q) => `<article class="tp-quote-card" style="border-color:${escapeHtml(color)}">
          <blockquote>"${escapeHtml(q.text)}"</blockquote>
          <footer>
            <strong>${escapeHtml(q.source)}</strong>
            <span>${escapeHtml(q.author)}${q.date ? ` · ${escapeHtml(q.date)}` : ""}</span>
          </footer>
          <a class="tp-quote-link quote-link-loading" href="#" data-source="${escapeHtml(q.source)}">Zoeken op Verborgen Schatten…</a>
        </article>`
          )
          .join("")
      : `<p class="tp-no-quotes">Geen citaten voor dit onderwerp — bekijk gerelateerde onderwerpen.</p>`;

    const relatedHtml = related?.length
      ? `<section class="tp-related" aria-label="Gerelateerd">
          <h2 class="tp-section-title">Verder lezen</h2>
          <div class="tp-related-chips">${related
            .map((relId) => {
              const t = window.HT_TOPICS?.[relId];
              if (!t) return "";
              return `<button type="button" class="tp-related-chip" data-topic="${escapeHtml(relId)}">${escapeHtml(t.title)}</button>`;
            })
            .join("")}</div>
        </section>`
      : "";

    const contextBtn = tab
      ? `<button type="button" class="tp-btn tp-btn-primary tp-context" data-topic="${escapeHtml(rawTopicId || panelTopic)}">
          <span>Bekijk in het model</span>
          <span aria-hidden="true">→</span>
        </button>`
      : "";

    const walk = window.MENS_DIAGRAM?.walkNeighbors?.(rawTopicId || panelTopic);
    const walkZone = walk?.zone || zoneId || window.MENS_DIAGRAM?.topicToZone?.(rawTopicId || panelTopic);
    const zoneMeta = walkZone && window.MENS_DIAGRAM?.zoneMeta?.(walkZone);
    const mensMini = walkZone && window.MENS_DIAGRAM?.render?.({
      size: "mini",
      highlight: walkZone,
      interactive: false,
      uid: `tp${panelTopic}`,
    });

    const zonePill = zoneMeta
      ? `<span class="tp-zone-pill" style="--zone-color:${esc(zoneMeta.color)}">In de mens · ${esc(zoneMeta.label)}</span>`
      : "";

    const walkProgress = walk && walk.index >= 0
      ? `<span class="tp-walk-progress">${walk.index + 1} / ${walk.total}</span>`
      : "";

    const walkNav = walk && (walk.prev || walk.next)
      ? `<nav class="tp-mens-walk" aria-label="Door de mens">
          ${walk.prev
            ? `<button type="button" class="tp-walk-btn tp-walk-prev" data-topic="${esc(walk.prev.topic)}" style="--zone-color:${esc(walk.prev.color)}">
                <span class="tp-walk-arrow" aria-hidden="true">←</span>
                <span class="tp-walk-label">${esc(walk.prev.label)}</span>
              </button>`
            : `<span class="tp-walk-spacer"></span>`}
          <button type="button" class="tp-walk-btn tp-walk-home" aria-label="Terug naar de mens">◎</button>
          ${walk.next
            ? `<button type="button" class="tp-walk-btn tp-walk-next" data-topic="${esc(walk.next.topic)}" style="--zone-color:${esc(walk.next.color)}">
                <span class="tp-walk-label">${esc(walk.next.label)}</span>
                <span class="tp-walk-arrow" aria-hidden="true">→</span>
              </button>`
            : `<span class="tp-walk-spacer"></span>`}
        </nav>`
      : "";

    const mensContext = walkZone && mensMini
      ? `<div class="tp-mens-context" style="--zone-color:${esc(zoneMeta?.color || color)}">
          <div class="tp-mens-mini" aria-hidden="true">${mensMini}</div>
          <div class="tp-mens-context-text">
            ${walkProgress}
            <p>Je bent hier in het model van de mens.</p>
          </div>
        </div>`
      : "";

    return `<article class="tp-article" style="--tp-color:${escapeHtml(color)};--tp-hub:${escapeHtml(hubTheme || color)}">
      <header class="tp-hero">
        <button type="button" class="tp-back" aria-label="Terug">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>Terug</span>
        </button>
        <div class="tp-hero-glow" aria-hidden="true"></div>
        ${hubLabel || tabLabel || zonePill ? `<div class="tp-hero-meta">
          ${zonePill}
          ${hubLabel ? `<span class="tp-hub-pill">${escapeHtml(hubLabel)}</span>` : ""}
          ${tabLabel ? `<span class="tp-tab-pill">${escapeHtml(tabIcon || "")} ${escapeHtml(tabLabel)}</span>` : ""}
        </div>` : ""}
        <h1 class="tp-title">${escapeHtml(topic.title)}</h1>
        <p class="tp-lead">${escapeHtml(lead)}</p>
      </header>

      <div class="tp-body">
        ${walkNav}
        ${mensContext}
        <section class="tp-visual-section" aria-label="Visuele uitleg">
          <h2 class="tp-section-title">Hoe het werkt</h2>
          <div class="tp-visual-grid">
            <div class="tp-visual-main tp-visual-${kind}">${visualMain}</div>
            <div class="tp-steps-wrap">
              <ol class="tp-step-list">${stepItems}</ol>
            </div>
          </div>
        </section>

        <section class="tp-step-articles-section" id="tp-step-articles-section" aria-label="Uitleg per onderdeel in artikelen">
          <h2 class="tp-section-title">Verder uitgelegd in artikelen</h2>
          <p class="tp-step-articles-lead">Elk onderdeel is gekoppeld aan een artikel uit Verborgen Schatten — lees verder bij J.O. Smith en medeschrijvers.</p>
          <p class="tp-step-articles-loading" id="tp-step-articles-loading">Artikelen zoeken per onderdeel…</p>
          <ol class="tp-step-articles" id="tp-step-articles" hidden></ol>
        </section>

        ${refsHtml}

        <section class="tp-ht-section" id="tp-ht-section" aria-label="Artikelen uit Verborgen Schatten">
          <div class="tp-ht-head">
            <h2 class="tp-section-title">Lees in Verborgen Schatten</h2>
            <a class="tp-ht-more" id="tp-ht-more" href="https://app.hiddentreasures.org/nl/search" target="_blank" rel="noopener">Meer zoeken →</a>
          </div>
          <p class="tp-ht-loading" id="tp-ht-loading">Artikelen ophalen uit Hidden Treasures…</p>
          <div class="tp-ht-articles" id="tp-ht-articles" hidden></div>
        </section>

        <section class="tp-bronnen" id="tp-bronnen" aria-label="Bronnen">
          <h2 class="tp-section-title">Kerncitaten</h2>
          <div class="tp-quotes">${quotesHtml}</div>
        </section>

        ${relatedHtml}

        <footer class="tp-actions">
          ${contextBtn}
          <button type="button" class="tp-btn tp-btn-ghost tp-share" data-url="${escapeHtml(`${location.origin}${location.pathname}#/topic/${encodeURIComponent(rawTopicId || panelTopic)}`)}">Link kopiëren</button>
          <a class="tp-btn tp-btn-ghost tp-ext" href="https://www.hiddentreasures.org" target="_blank" rel="noopener">hiddentreasures.org</a>
        </footer>
        ${walkNav ? `<div class="tp-mens-walk-sticky" aria-hidden="true">${walkNav}</div>` : ""}
      </div>
    </article>`;
  };

  window.TP_PAGE = { summarySteps };
})();
