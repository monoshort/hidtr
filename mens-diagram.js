/* Interactief mens-model — gedeeld voor start, contextbalk en topic-pagina's */
(function () {
  "use strict";

  const WALK_ORDER = [
    "god", "geest", "zintuigen", "ziel", "verstand", "fantasie",
    "hart", "geweten", "gevoel", "tong", "wil", "lichaam", "leden",
  ];

  const ZONE_META = {
    god: { label: "God", sub: "Bron van leven en licht", color: "#818cf8", topic: "god" },
    geest: { label: "Geest", sub: "Godsbewustzijn", color: "#3b82f6", topic: "geest" },
    ziel: { label: "Ziel", sub: "Zelfbewustzijn — psyche", color: "#a78bfa", topic: "ziel" },
    verstand: { label: "Verstand", sub: "Verwerkt wat binnenkomt", color: "#f59e0b", topic: "verstand" },
    fantasie: { label: "Fantasie", sub: "Innerlijk zien", color: "#22d3ee", topic: "fantasie" },
    hart: { label: "Hart", sub: "Gedachten en overleggingen", color: "#f87171", topic: "hart" },
    geweten: { label: "Geweten", sub: "Oordeel en stem", color: "#f472b6", topic: "geweten" },
    gevoel: { label: "Gevoel", sub: "Emoties en stemming", color: "#fb7185", topic: "gevoel" },
    tong: { label: "Tong", sub: "Woorden en klank", color: "#e879f9", topic: "tong" },
    wil: { label: "Wil", sub: "Kiest geest of vlees", color: "#c4b5fd", topic: "wil" },
    zintuigen: { label: "Zintuigen", sub: "Vijf poorten naar binnen", color: "#fb923c", topic: "zintuigen" },
    lichaam: { label: "Lichaam", sub: "Vlees — begeerte", color: "#ea580c", topic: "lichaam" },
    leden: { label: "Leden", sub: "Handen en voeten", color: "#c2410c", topic: "leden" },
  };

  const PREFIX_ZONE = [
    ["gw-", "geweten"], ["gv-", "gevoel"], ["tg-", "tong"], ["vs-", "verstand"],
    ["vz-", "zintuigen"], ["r7-", "leden"], ["kr-", "wil"], ["om-", "wil"],
    ["gl-", "geest"], ["gst-", "geest"], ["geloof-", "geest"], ["woord", "geest"],
    ["bz-", "hart"], ["hm-", "geest"], ["dw-", "wil"], ["cmp-", "ziel"],
    ["wet-geest", "geest"], ["wet-zonde", "lichaam"], ["wet-doods", "geweten"],
    ["gevallen-", "zintuigen"], ["verlost-", "geest"], ["lichaam-", "lichaam"],
    ["fantasie", "fantasie"],
  ];

  const EXPLICIT_ZONE = {
    god: "god", geest: "geest", ziel: "ziel", verstand: "verstand", fantasie: "fantasie",
    "fantasie-gevaar": "fantasie", "fantasie-geest": "fantasie", "vs-fantasie": "fantasie",
    hart: "hart", wil: "wil", gezindheid: "wil", geweten: "geweten", "gw-plaats": "geweten",
    gevoel: "gevoel", "gv-plaats": "gevoel", tong: "tong", "tg-plaats": "tong",
    zintuigen: "zintuigen", lichaam: "lichaam", leden: "leden",
    "lichaam-vlezes": "lichaam", "lichaam-zonde": "lichaam", "lichaam-doods": "lichaam",
    woord: "geest", geloof: "geest", "geloof-overzicht": "geest", kruis: "wil", ootmoed: "wil",
    weg: "wil", structuur: "ziel", "vz-overzicht": "zintuigen", "r7-overzicht": "leden",
    "gevallen-zintuigen": "zintuigen", "cmp-geestelijk": "geest",
  };

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function topicToZone(topicId) {
    if (!topicId) return null;
    if (EXPLICIT_ZONE[topicId]) return EXPLICIT_ZONE[topicId];
    for (const [prefix, zone] of PREFIX_ZONE) {
      if (topicId.startsWith(prefix)) return zone;
    }
    if (topicId.endsWith("-hart")) return "hart";
    if (topicId.endsWith("-gezindheid") || topicId.endsWith("-wil")) return "wil";
    if (topicId.endsWith("-verstand")) return "verstand";
    if (topicId.endsWith("-geest")) return "geest";
    if (topicId.endsWith("-lichaam")) return "lichaam";
    if (topicId.endsWith("-zintuigen")) return "zintuigen";
    return null;
  }

  function zoneLabel(zone) { return ZONE_META[zone]?.label || zone || ""; }
  function zoneMeta(zone) { return ZONE_META[zone] || null; }

  function walkNeighbors(topicId) {
    const zone = topicToZone(topicId);
    if (!zone) return { zone: null, prev: null, next: null, index: -1, total: WALK_ORDER.length };
    const index = WALK_ORDER.indexOf(zone);
    if (index < 0) return { zone, prev: null, next: null, index: -1, total: WALK_ORDER.length };
    return {
      zone,
      index,
      total: WALK_ORDER.length,
      prev: index > 0 ? ZONE_META[WALK_ORDER[index - 1]] : null,
      next: index < WALK_ORDER.length - 1 ? ZONE_META[WALK_ORDER[index + 1]] : null,
    };
  }

  function lit(zone, highlight) {
    if (!highlight) return 1;
    return zone === highlight ? 1 : 0.18;
  }

  function stroke(zone, highlight) {
    if (!highlight || zone !== highlight) return "rgba(255,255,255,0.08)";
    return ZONE_META[zone]?.color || "#818cf8";
  }

  function sw(zone, highlight) {
    return highlight && zone === highlight ? 2.8 : 0.6;
  }

  function subLit(zone, highlight, parent) {
    if (!highlight) return 0.92;
    if (zone === highlight) return 1;
    if (parent === highlight) return 0.55;
    return 0.2;
  }

  function render(opts = {}) {
    const highlight = opts.highlight || null;
    const size = opts.size === "mini" ? "mini" : "full";
    const interactive = opts.interactive !== false;
    const uid = opts.uid || "m";
    const cls = `mens-diagram mens-diagram-${size}${interactive ? " mens-diagram-interactive" : ""}`;
    const zoneCls = interactive ? "mens-zone illus-zone" : "mens-zone-static";
    const pointer = interactive ? "" : ' pointer-events="none"';

    if (size === "mini") {
      const h = highlight;
      return `<svg class="${cls}" viewBox="0 0 52 108" role="img" aria-label="Positie in de mens"${pointer}>
        <defs>
          <linearGradient id="${uid}mGod" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c7d2fe"/><stop offset="100%" stop-color="#4f46e5"/></linearGradient>
          <linearGradient id="${uid}mGeest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
          <linearGradient id="${uid}mZiel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
          <linearGradient id="${uid}mBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>
        </defs>
        <ellipse class="${zoneCls}" data-topic="god" data-zone="god" cx="26" cy="9" rx="11" ry="5.5" fill="url(#${uid}mGod)" opacity="${lit("god", h)}" stroke="${stroke("god", h)}" stroke-width="${sw("god", h)}"/>
        <ellipse class="${zoneCls}" data-topic="geest" data-zone="geest" cx="26" cy="20" rx="10" ry="5.5" fill="url(#${uid}mGeest)" opacity="${lit("geest", h)}" stroke="${stroke("geest", h)}" stroke-width="${sw("geest", h)}"/>
        <circle class="${zoneCls}" data-topic="ziel" data-zone="ziel" cx="26" cy="42" r="15" fill="url(#${uid}mZiel)" opacity="${lit("ziel", h)}" stroke="${stroke("ziel", h)}" stroke-width="${sw("ziel", h)}"/>
        <rect class="${zoneCls}" data-topic="verstand" data-zone="verstand" x="17" y="32" width="18" height="5" rx="2" fill="#f59e0b" opacity="${subLit("verstand", h, "ziel")}"/>
        <rect class="${zoneCls}" data-topic="hart" data-zone="hart" x="17" y="38" width="18" height="5" rx="2" fill="#f87171" opacity="${subLit("hart", h, "ziel")}"/>
        <rect class="${zoneCls}" data-topic="wil" data-zone="wil" x="17" y="44" width="18" height="4" rx="2" fill="#c4b5fd" opacity="${subLit("wil", h, "ziel")}"/>
        <circle class="${zoneCls}" data-topic="lichaam" data-zone="lichaam" cx="26" cy="68" r="11" fill="url(#${uid}mBody)" opacity="${lit("lichaam", h)}" stroke="${stroke("lichaam", h)}" stroke-width="${sw("lichaam", h)}"/>
        <rect class="${zoneCls}" data-topic="zintuigen" data-zone="zintuigen" x="18" y="57" width="16" height="3.5" rx="1.5" fill="#fb923c" opacity="${subLit("zintuigen", h, null)}"/>
      </svg>`;
    }

    const g = `g${uid}`;
    const h = highlight;

    return `<svg class="${cls}" viewBox="0 0 260 500" role="img" aria-label="De mens volgens Johan O. Smith — klik op een zone">
      <defs>
        <radialGradient id="${g}Aura" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.18"/>
          <stop offset="55%" stop-color="#7c3aed" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#060912" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${g}God" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0e7ff"/><stop offset="50%" stop-color="#818cf8"/><stop offset="100%" stop-color="#4338ca"/></linearGradient>
        <linearGradient id="${g}Geest" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bfdbfe"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>
        <linearGradient id="${g}Ziel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ddd6fe"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>
        <linearGradient id="${g}Body" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fed7aa"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>
        <linearGradient id="${g}Beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#818cf8" stop-opacity="0.5"/><stop offset="100%" stop-color="#818cf8" stop-opacity="0"/></linearGradient>
        <filter id="${g}Glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="${g}Soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <ellipse cx="130" cy="240" rx="110" ry="200" fill="url(#${g}Aura)" pointer-events="none"/>
      <rect x="124" y="30" width="12" height="380" fill="url(#${g}Beam)" opacity=".35" pointer-events="none" class="mens-light-beam"/>

      <text x="130" y="28" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600" letter-spacing="0.08em" pointer-events="none">HEBR. 4:12</text>

      <!-- GOD -->
      <g class="mens-layer mens-layer-god" data-zone="god">
        <ellipse class="${zoneCls} mens-shape-god" data-topic="god" data-zone="god" cx="130" cy="58" rx="58" ry="24" fill="url(#${g}God)" opacity="${lit("god", h)}" stroke="${stroke("god", h)}" stroke-width="${sw("god", h)}"${h === "god" ? ` filter="url(#${g}Glow)"` : ""}/>
        <text x="130" y="54" text-anchor="middle" fill="#fff" font-size="13" font-weight="700" pointer-events="none">GOD</text>
        <text x="130" y="68" text-anchor="middle" fill="#e0e7ff" font-size="8" pointer-events="none">Bron</text>
      </g>

      <line x1="130" y1="82" x2="130" y2="96" stroke="#818cf8" stroke-width="2" stroke-linecap="round" opacity=".55" pointer-events="none" class="mens-connector"/>
      <circle cx="130" cy="89" r="3" fill="#818cf8" opacity=".7" pointer-events="none"/>

      <!-- GEEST -->
      <g class="mens-layer mens-layer-geest" data-zone="geest">
        <ellipse class="${zoneCls} mens-shape-geest" data-topic="geest" data-zone="geest" cx="130" cy="118" rx="52" ry="22" fill="url(#${g}Geest)" opacity="${lit("geest", h)}" stroke="${stroke("geest", h)}" stroke-width="${sw("geest", h)}"${h === "geest" ? ` filter="url(#${g}Glow)"` : ""}/>
        <text x="130" y="114" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" pointer-events="none">GEEST</text>
        <text x="130" y="127" text-anchor="middle" fill="#dbeafe" font-size="7.5" pointer-events="none">pneuma · Godsbewustzijn</text>
      </g>

      <line x1="130" y1="140" x2="130" y2="154" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity=".45" pointer-events="none" class="mens-connector"/>

      <!-- ZINTUIGEN -->
      <g class="mens-layer mens-layer-zintuigen" data-zone="zintuigen">
        <path class="${zoneCls}" data-topic="zintuigen" data-zone="zintuigen" d="M 52 168 Q 90 148 130 144 Q 170 148 208 168 L 208 178 Q 170 162 130 158 Q 90 162 52 178 Z" fill="#fb923c" opacity="${subLit("zintuigen", h, null)}" stroke="${stroke("zintuigen", h)}" stroke-width="${sw("zintuigen", h)}"/>
        <g pointer-events="none" fill="#fde68a" font-size="7" font-weight="600">
          <text x="62" y="164">zien</text><text x="98" y="152">horen</text>
          <text x="130" y="148" text-anchor="middle">ruiken</text>
          <text x="158" y="152">proeven</text><text x="192" y="164">voelen</text>
        </g>
      </g>

      <!-- ZIEL (hoofd) -->
      <g class="mens-layer mens-layer-ziel" data-zone="ziel">
        <circle class="${zoneCls} mens-shape-ziel" data-topic="ziel" data-zone="ziel" cx="130" cy="248" r="72" fill="url(#${g}Ziel)" opacity="${lit("ziel", h)}" stroke="${stroke("ziel", h)}" stroke-width="${sw("ziel", h)}"${h === "ziel" ? ` filter="url(#${g}Glow)"` : ""}/>
        <ellipse cx="130" cy="248" rx="68" ry="70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" pointer-events="none"/>
        <line x1="62" y1="248" x2="198" y2="248" stroke="rgba(255,255,255,0.15)" stroke-width="1" pointer-events="none"/>
        <text x="130" y="198" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" pointer-events="none">ZIEL</text>
        <text x="130" y="212" text-anchor="middle" fill="#ede9fe" font-size="8" pointer-events="none">psyche · zelfbewustzijn</text>

        <rect class="${zoneCls}" data-topic="verstand" data-zone="verstand" x="72" y="218" width="116" height="18" rx="6" fill="#f59e0b" opacity="${subLit("verstand", h, "ziel")}" stroke="${stroke("verstand", h)}" stroke-width="${sw("verstand", h)}"/>
        <text x="130" y="230" text-anchor="middle" fill="#1c1917" font-size="8" font-weight="700" pointer-events="none">verstand</text>

        <rect class="${zoneCls}" data-topic="fantasie" data-zone="fantasie" x="72" y="238" width="116" height="16" rx="5" fill="#22d3ee" opacity="${subLit("fantasie", h, "ziel")}" stroke="${stroke("fantasie", h)}" stroke-width="${sw("fantasie", h)}"/>
        <text x="130" y="249" text-anchor="middle" fill="#042f2e" font-size="7.5" font-weight="600" pointer-events="none">fantasie</text>

        <rect class="${zoneCls}" data-topic="hart" data-zone="hart" x="72" y="256" width="54" height="16" rx="5" fill="#f87171" opacity="${subLit("hart", h, "ziel")}" stroke="${stroke("hart", h)}" stroke-width="${sw("hart", h)}"/>
        <text x="99" y="267" text-anchor="middle" fill="#fff" font-size="7" font-weight="600" pointer-events="none">hart</text>

        <rect class="${zoneCls}" data-topic="geweten" data-zone="geweten" x="134" y="256" width="54" height="16" rx="5" fill="#f472b6" opacity="${subLit("geweten", h, "ziel")}" stroke="${stroke("geweten", h)}" stroke-width="${sw("geweten", h)}"/>
        <text x="161" y="267" text-anchor="middle" fill="#fff" font-size="7" font-weight="600" pointer-events="none">geweten</text>

        <rect class="${zoneCls}" data-topic="gevoel" data-zone="gevoel" x="72" y="274" width="54" height="14" rx="4" fill="#fb7185" opacity="${subLit("gevoel", h, "ziel")}" stroke="${stroke("gevoel", h)}" stroke-width="${sw("gevoel", h)}"/>
        <text x="99" y="284" text-anchor="middle" fill="#fff" font-size="6.5" font-weight="600" pointer-events="none">gevoel</text>

        <rect class="${zoneCls}" data-topic="tong" data-zone="tong" x="134" y="274" width="54" height="14" rx="4" fill="#e879f9" opacity="${subLit("tong", h, "ziel")}" stroke="${stroke("tong", h)}" stroke-width="${sw("tong", h)}"/>
        <text x="161" y="284" text-anchor="middle" fill="#fff" font-size="6.5" font-weight="600" pointer-events="none">tong</text>

        <rect class="${zoneCls}" data-topic="wil" data-zone="wil" x="72" y="290" width="116" height="16" rx="5" fill="#c4b5fd" opacity="${subLit("wil", h, "ziel")}" stroke="${stroke("wil", h)}" stroke-width="${sw("wil", h)}"/>
        <text x="130" y="301" text-anchor="middle" fill="#312e81" font-size="7.5" font-weight="700" pointer-events="none">wil — kiest geest of vlees</text>
      </g>

      <!-- Nek / torso lijn -->
      <line x1="130" y1="320" x2="130" y2="348" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round" pointer-events="none"/>

      <!-- LICHAAM -->
      <g class="mens-layer mens-layer-lichaam" data-zone="lichaam">
        <circle class="${zoneCls} mens-shape-body" data-topic="lichaam" data-zone="lichaam" cx="130" cy="388" r="44" fill="url(#${g}Body)" opacity="${lit("lichaam", h)}" stroke="${stroke("lichaam", h)}" stroke-width="${sw("lichaam", h)}"${h === "lichaam" ? ` filter="url(#${g}Glow)"` : ""}/>
        <text x="130" y="380" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" pointer-events="none">LICHAAM</text>
        <text x="130" y="394" text-anchor="middle" fill="#ffedd5" font-size="7.5" pointer-events="none">sarx · vlees</text>
        <text x="130" y="406" text-anchor="middle" fill="#fed7aa" font-size="7" pointer-events="none">begeerte · werken</text>
      </g>

      <!-- Leden / stick limbs -->
      <g class="mens-limbs" pointer-events="none" opacity=".45">
        <line x1="130" y1="428" x2="72" y2="468" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="130" y1="428" x2="188" y2="468" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="130" y1="428" x2="98" y2="482" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <line x1="130" y1="428" x2="162" y2="482" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
      </g>
      <rect class="${zoneCls}" data-topic="leden" data-zone="leden" x="58" y="448" width="144" height="32" rx="12" fill="#9a3412" opacity="${subLit("leden", h, "lichaam")}" stroke="${stroke("leden", h)}" stroke-width="${sw("leden", h)}"/>
      <text x="130" y="468" text-anchor="middle" fill="#fff" font-size="8" font-weight="600" pointer-events="none">leden — handen en voeten</text>
    </svg>`;
  }

  function updateHighlights(root, highlight) {
    if (!root) return;
    root.querySelectorAll(".mens-zone, .illus-zone[data-topic]").forEach((el) => {
      const z = el.dataset.topic;
      const zone = topicToZone(z) || z;
      const active = highlight && (zone === highlight || z === highlight);
      el.classList.toggle("active-zone", !!active);
      const meta = ZONE_META[zone] || ZONE_META[z];
      if (!meta) return;
      if (highlight) {
        el.setAttribute("opacity", active ? "1" : "0.18");
        el.setAttribute("stroke", active ? meta.color : "rgba(255,255,255,0.06)");
        el.setAttribute("stroke-width", active ? "2.8" : "0.5");
      } else {
        el.setAttribute("opacity", "1");
        el.setAttribute("stroke", "rgba(255,255,255,0.08)");
        el.setAttribute("stroke-width", "0.6");
      }
    });
    root.querySelectorAll(".mens-layer").forEach((layer) => {
      const z = layer.dataset.zone;
      layer.classList.toggle("is-lit", !!(highlight && (z === highlight || topicToZone(highlight) === z)));
    });
  }

  function hintHtml(zone) {
    const meta = ZONE_META[zone];
    if (!meta) {
      return `<div class="mens-hint-inner mens-hint-empty">
        <span class="mens-hint-icon" aria-hidden="true">◎</span>
        <div><p class="mens-hint-label">Kies een plek</p>
        <p class="mens-hint-text">Tik op God, geest, ziel of lichaam — elke zone opent uitleg en artikelen.</p></div>
      </div>`;
    }
    return `<div class="mens-hint-inner" style="--zone-color:${esc(meta.color)}">
      <span class="mens-hint-dot" aria-hidden="true"></span>
      <div>
        <p class="mens-hint-label">${esc(meta.label)}</p>
        <p class="mens-hint-text">${esc(meta.sub)}</p>
        <p class="mens-hint-cta">Klik om in het model te zien · nogmaals om te verdiepen</p>
      </div>
    </div>`;
  }

  function mountHome(container) {
    if (!container) return;
    container.innerHTML = render({ uid: "home", interactive: true });
  }

  function mountMini(container, highlight) {
    if (!container) return;
    container.innerHTML = render({ size: "mini", highlight, interactive: true, uid: `ctx${highlight || "x"}` });
  }

  window.MENS_DIAGRAM = {
    WALK_ORDER,
    ZONE_META,
    topicToZone,
    zoneLabel,
    zoneMeta,
    walkNeighbors,
    render,
    mountHome,
    mountMini,
    updateHighlights,
    hintHtml,
  };
})();
