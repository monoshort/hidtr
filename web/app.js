(function () {
  "use strict";

  const STORAGE_KEY = "jos-visited-topics";
  const WELCOME_KEY = "jos-welcome-seen";
  const MILESTONE_KEY = "jos-milestones";

  const navSub = document.getElementById("nav-sub");
  const sections = document.querySelectorAll("section");
  const overlay = document.getElementById("overlay");
  const panel = document.getElementById("panel");
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");
  const panelDot = document.getElementById("panel-dot");
  const panelClose = document.getElementById("panel-close");
  const searchOverlay = document.getElementById("search-overlay");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const appBar = document.getElementById("app-bar");
  const navWrap = document.querySelector(".nav-wrap");
  const uxContext = document.getElementById("ux-context");
  const uxContextText = document.getElementById("ux-context-text");
  const uxContextDot = document.getElementById("ux-context-dot");
  const uxContextBack = document.getElementById("ux-context-back");
  const uxContextBron = document.getElementById("ux-context-bron");
  const uxContextDeepen = document.getElementById("ux-context-deepen");
  const uxContextMens = document.getElementById("ux-context-mens");
  const mensHomeDiagram = document.getElementById("mens-home-diagram");
  const mensZoneHint = document.getElementById("mens-zone-hint");
  const navBackBtn = document.getElementById("nav-back");
  const uxToastStack = document.getElementById("ux-toast-stack");
  const bronRail = document.getElementById("bron-rail");
  const bronRailBody = document.getElementById("bron-rail-body");
  const topicPage = document.getElementById("topic-page");
  const topicPageInner = document.getElementById("topic-page-inner");

  const HUB_THEME = {
    start: "#818cf8",
    fundament: "#6366f1",
    innerlijk: "#f59e0b",
    geloof: "#22d3ee",
    weg: "#a78bfa",
  };

  let activeEl = null;
  let currentTopicId = null;
  let topicPageRawId = null;
  let searchActiveIndex = 0;
  let lastSearchResults = [];

  const TAB_LABELS = window.HT_SEARCH?.TAB_LABELS || {
    structuur: "Bouw",
    proces: "Verloop",
    rom7: "Rom. 7",
    verzoeking: "Verzoeking",
    verstand: "Verstand",
    geweten: "Geweten",
    gevoel: "Gevoel",
    tong: "Tong",
    verschil: "Onderscheid",
    woord: "Het Woord",
    geloof: "Geloof",
    ootmoed: "Ootmoed",
    kruis: "Kruis",
    weg: "Weg",
  };

  const HUBS = {
    start: { label: "De mens", icon: "◎", tabs: [] },
    fundament: { label: "Verloop", icon: "◇", tabs: ["proces", "structuur", "rom7", "verschil"] },
    innerlijk: { label: "Verzoeking", icon: "◈", tabs: ["verzoeking", "verstand", "geweten", "gevoel", "tong"] },
    geloof: { label: "Geloof", icon: "✧", tabs: ["woord", "geloof"] },
    weg: { label: "Weg", icon: "→", tabs: ["ootmoed", "kruis", "weg"] },
  };

  const TAB_ANATOMY_ZONE = {
    structuur: "ziel",
    proces: "zintuigen",
    rom7: "leden",
    verschil: "ziel",
    verzoeking: "zintuigen",
    verstand: "verstand",
    geweten: "geweten",
    gevoel: "gevoel",
    tong: "tong",
    woord: "geest",
    geloof: "geest",
    ootmoed: "wil",
    kruis: "wil",
    weg: "wil",
  };

  const TAB_ORDER = [
    "structuur", "proces", "rom7", "verschil",
    "verzoeking", "verstand", "geweten", "gevoel", "tong",
    "woord", "geloof",
    "ootmoed", "kruis", "weg",
  ];

  const TAB_CITE_TOPIC = {
    structuur: "god",
    proces: "gevallen-zintuigen",
    rom7: "r7-overzicht",
    verschil: "cmp-vlezes",
    verzoeking: "vz-overzicht",
    verstand: "vs-overzicht",
    geweten: "gw-overzicht",
    gevoel: "gv-overzicht",
    tong: "tg-overzicht",
    woord: "gst-overzicht",
    geloof: "geloof-overzicht",
    ootmoed: "om-overzicht",
    kruis: "kr-overzicht",
    weg: "dw-overzicht",
  };

  const TAB_CROSS_LINKS = {
    structuur: ["proces", "verzoeking", "geloof"],
    proces: ["structuur", "rom7", "verzoeking"],
    rom7: ["structuur", "verzoeking", "geloof"],
    verschil: ["structuur", "geloof", "weg"],
    verzoeking: ["structuur", "verstand", "geweten"],
    verstand: ["verzoeking", "geweten", "woord"],
    geweten: ["verstand", "gevoel", "geloof"],
    gevoel: ["geweten", "tong", "geloof"],
    tong: ["gevoel", "geloof", "ootmoed"],
    woord: ["verstand", "geloof", "weg"],
    geloof: ["woord", "structuur", "kruis"],
    ootmoed: ["geloof", "kruis", "weg"],
    kruis: ["geloof", "ootmoed", "weg"],
    weg: ["geloof", "kruis", "woord"],
  };

  const ATLAS_W = 920;
  const ATLAS_H = 480;
  const ATLAS_HUB_X = { fundament: 115, innerlijk: 355, geloof: 595, weg: 795 };
  const ATLAS_HUB_LABELS = { fundament: "Fundament", innerlijk: "Innerlijk", geloof: "Geloof", weg: "Weg" };
  const ANATOMY_ATLAS = [
    { id: "god", label: "God" },
    { id: "geest", label: "Geest" },
    { id: "ziel", label: "Ziel" },
    { id: "verstand", label: "Verstand" },
    { id: "hart", label: "Hart" },
    { id: "geweten", label: "Geweten" },
    { id: "gevoel", label: "Gevoel" },
    { id: "tong", label: "Tong" },
    { id: "wil", label: "Wil" },
    { id: "zintuigen", label: "Zintuigen" },
    { id: "lichaam", label: "Lichaam" },
    { id: "kruis", label: "Kruis" },
    { id: "weg", label: "Weg" },
  ];

  function buildAtlasNodes() {
    const nodes = [];
    for (const [hubId, hub] of Object.entries(HUBS)) {
      if (hubId === "start" || !hub.tabs?.length) continue;
      const x = ATLAS_HUB_X[hubId] || 100;
      hub.tabs.forEach((tab, i) => {
        nodes.push({ tab, x, y: 88 + i * 78, hub: hubId });
      });
    }
    return nodes;
  }

  const ATLAS_NODES = buildAtlasNodes();
  const ATLAS_POS = Object.fromEntries(ATLAS_NODES.map((n) => [n.tab, n]));

  function getVisitedTabs() {
    const tabs = new Set();
    getVisitedSet().forEach((topicId) => {
      const tab = tabForTopic(topicId);
      if (tab) tabs.add(tab);
    });
    return tabs;
  }

  function buildSectionXrefHtml(tabId, prevTab, nextTab, cross) {
    const hubId = hubForTab(tabId);
    const icon = TAB_ICONS[tabId] || "•";
    const label = TAB_LABELS[tabId] || tabId;

    let pathSvg = `<svg class="xref-path-svg" viewBox="0 0 400 48" preserveAspectRatio="none" aria-hidden="true">`;
    pathSvg += `<line class="xref-path-line" x1="24" y1="24" x2="376" y2="24"/>`;
    if (prevTab) pathSvg += `<circle class="xref-path-node xref-path-prev" cx="24" cy="24" r="6"/>`;
    pathSvg += `<circle class="xref-path-node xref-path-current hub-${hubId}" cx="200" cy="24" r="9"/>`;
    if (nextTab) pathSvg += `<circle class="xref-path-node xref-path-next" cx="376" cy="24" r="6"/>`;
    pathSvg += `</svg>`;

    let navRow = `<div class="section-nav-row xref-nav-row">`;
    if (prevTab) {
      navRow += `<button type="button" class="section-nav-btn section-nav-prev" data-goto-tab="${prevTab}"><span class="xref-nav-icon" aria-hidden="true">${TAB_ICONS[prevTab] || "←"}</span><span class="xref-nav-text">← ${TAB_LABELS[prevTab]}</span></button>`;
    } else {
      navRow += `<button type="button" class="section-nav-btn section-nav-prev" data-goto-hub="start"><span class="xref-nav-text">← Start</span></button>`;
    }
    navRow += `<div class="xref-current-pill hub-${hubId}" aria-current="page"><span class="xref-current-icon" aria-hidden="true">${icon}</span><span>${label}</span></div>`;
    if (nextTab) {
      navRow += `<button type="button" class="section-nav-btn section-nav-next" data-goto-tab="${nextTab}"><span class="xref-nav-text">${TAB_LABELS[nextTab]} →</span><span class="xref-nav-icon" aria-hidden="true">${TAB_ICONS[nextTab] || "→"}</span></button>`;
    }
    navRow += `</div>`;

    let crossHtml = "";
    if (cross.length) {
      crossHtml = `<div class="section-xref-cross"><span class="section-cross-label">Kruisverwijzingen</span>`;
      crossHtml += `<div class="section-xref-spokes" style="--spoke-count:${cross.length}">`;
      crossHtml += `<div class="xref-hub-center hub-${hubId}"><span class="xref-hub-icon" aria-hidden="true">${icon}</span><span>${label}</span></div>`;
      cross.forEach((relTab, i) => {
        const relHub = hubForTab(relTab);
        crossHtml += `<button type="button" class="section-xref-spoke hub-${relHub}" data-goto-tab="${relTab}" style="--spoke-i:${i}"><span class="xref-spoke-connector" aria-hidden="true"></span><span class="xref-spoke-label"><span class="xref-spoke-icon" aria-hidden="true">${TAB_ICONS[relTab] || "•"}</span>${TAB_LABELS[relTab]}</span></button>`;
      });
      crossHtml += `</div></div>`;
    }

    return `<div class="section-xref-visual">${pathSvg}${navRow}${crossHtml}</div>`;
  }

  function buildAtlasSvg() {
    const visited = getVisitedTabs();
  const activeTab = document.querySelector("section.active:not(#start)")?.id || null;

    let svg = `<svg class="atlas-lines" viewBox="0 0 ${ATLAS_W} ${ATLAS_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
    svg += `<defs><linearGradient id="atlas-path-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#6366f1"/><stop offset="35%" stop-color="#f59e0b"/><stop offset="65%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient></defs>`;

    for (const [hubId, hub] of Object.entries(HUBS)) {
      if (hubId === "start" || !hub.tabs?.length) continue;
      const tabs = hub.tabs.map((t) => ATLAS_POS[t]).filter(Boolean);
      if (!tabs.length) continue;
      const minY = Math.min(...tabs.map((t) => t.y)) - 36;
      const maxY = Math.max(...tabs.map((t) => t.y)) + 36;
      const x = ATLAS_HUB_X[hubId] - 58;
      svg += `<rect class="atlas-hub-zone hub-${hubId}" x="${x}" y="${minY}" width="116" height="${maxY - minY}" rx="14"/>`;
      svg += `<text class="atlas-hub-label hub-${hubId}" x="${ATLAS_HUB_X[hubId]}" y="${minY + 14}" text-anchor="middle">${ATLAS_HUB_LABELS[hubId]}</text>`;
    }

    const pathPts = TAB_ORDER.map((tab) => ATLAS_POS[tab]).filter(Boolean);
    if (pathPts.length > 1) {
      const d = pathPts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
      svg += `<path class="atlas-main-path" d="${d}"/>`;
    }

    const drawn = new Set();
    TAB_ORDER.forEach((tab) => {
      (TAB_CROSS_LINKS[tab] || []).forEach((rel) => {
        const key = [tab, rel].sort().join("|");
        if (drawn.has(key)) return;
        drawn.add(key);
        const a = ATLAS_POS[tab];
        const b = ATLAS_POS[rel];
        if (!a || !b) return;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 - 28;
        svg += `<path class="atlas-cross-link" d="M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}"/>`;
      });
    });

    ATLAS_NODES.forEach((n) => {
      const isActive = n.tab === activeTab;
      const isVisited = visited.has(n.tab);
      svg += `<circle class="atlas-node-ring hub-${n.hub}${isActive ? " is-active" : ""}${isVisited ? " is-visited" : ""}" cx="${n.x}" cy="${n.y}" r="22"/>`;
    });

    svg += `</svg>`;
    return svg;
  }

  function buildAtlasNodesHtml() {
    const visited = getVisitedTabs();
    const activeTab = document.querySelector("section.active:not(#start)")?.id || null;
    return ATLAS_NODES.map((n) => {
      const pctX = (n.x / ATLAS_W) * 100;
      const pctY = (n.y / ATLAS_H) * 100;
      const icon = TAB_ICONS[n.tab] || "•";
      const label = TAB_LABELS[n.tab] || n.tab;
      const cls = [
        "atlas-node",
        `hub-${n.hub}`,
        n.tab === activeTab ? "is-active" : "",
        visited.has(n.tab) ? "is-visited" : "",
      ].filter(Boolean).join(" ");
      return `<button type="button" class="${cls}" data-goto-tab="${n.tab}" style="left:${pctX}%;top:${pctY}%"><span class="atlas-node-icon" aria-hidden="true">${icon}</span><span class="atlas-node-label">${label}</span></button>`;
    }).join("");
  }

  function injectModelAtlas() {
    if (document.getElementById("model-atlas")) return;

    const anatomyChips = ANATOMY_ATLAS.map((part) => {
      const nav = ANATOMY_NAV[part.id];
      if (!nav) return "";
      return `<button type="button" class="atlas-anatomy-chip" data-anatomy="${part.id}">${part.label}</button>`;
    }).join("");

    const el = document.createElement("div");
    el.id = "model-atlas";
    el.className = "model-atlas";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "model-atlas-title");
    el.innerHTML = `
      <div class="model-atlas-backdrop" id="model-atlas-backdrop"></div>
      <div class="model-atlas-dialog">
        <header class="model-atlas-head">
          <div class="model-atlas-head-text">
            <h2 id="model-atlas-title">Modelkaart</h2>
            <p>Alle 14 onderdelen · gekleurde lijn = hoofdroute · stippellijn = kruisverwijzing</p>
          </div>
          <button type="button" class="model-atlas-close" id="model-atlas-close" aria-label="Sluiten">&times;</button>
        </header>
        <div class="model-atlas-body">
          <div class="model-atlas-canvas" id="model-atlas-canvas">
            ${buildAtlasSvg()}
            <div class="model-atlas-nodes" id="model-atlas-nodes">${buildAtlasNodesHtml()}</div>
          </div>
          <div class="model-atlas-footer">
            <div class="model-atlas-anatomy">
              <span class="model-atlas-anatomy-label">Anatomie — snel springen</span>
              <div class="model-atlas-anatomy-chips">${anatomyChips}</div>
            </div>
            <div class="model-atlas-legend" aria-hidden="true">
              <span class="legend-item legend-path"><span class="legend-swatch"></span>Hoofdroute</span>
              <span class="legend-item legend-cross"><span class="legend-swatch"></span>Kruisverwijzing</span>
              <span class="legend-item legend-visited"><span class="legend-swatch"></span>Bezocht</span>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);

    el.querySelector("#model-atlas-close")?.addEventListener("click", closeAtlas);
    el.querySelector("#model-atlas-backdrop")?.addEventListener("click", closeAtlas);
    el.querySelectorAll(".atlas-node[data-goto-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeAtlas();
        goToTab(btn.dataset.gotoTab, { toast: true });
      });
    });
    el.querySelectorAll(".atlas-anatomy-chip[data-anatomy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dest = ANATOMY_NAV[btn.dataset.anatomy];
        if (!dest) return;
        closeAtlas();
        openTopicPage(btn.dataset.anatomy, null, null);
      });
    });
  }

  function refreshModelAtlas() {
    const canvas = document.getElementById("model-atlas-canvas");
    if (!canvas) return;
    const nodes = canvas.querySelector(".model-atlas-nodes");
    const oldSvg = canvas.querySelector(".atlas-lines");
    const newSvg = document.createRange().createContextualFragment(buildAtlasSvg());
    if (oldSvg) oldSvg.replaceWith(newSvg.firstChild);
    else canvas.prepend(newSvg.firstChild);
    if (nodes) nodes.innerHTML = buildAtlasNodesHtml();
    canvas.querySelectorAll(".atlas-node[data-goto-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeAtlas();
        goToTab(btn.dataset.gotoTab, { toast: true });
      });
    });
  }

  function openAtlas() {
    injectModelAtlas();
    refreshModelAtlas();
    const el = document.getElementById("model-atlas");
    if (!el) return;
    el.hidden = false;
    document.body.classList.add("modal-open", "atlas-open");
    requestAnimationFrame(() => el.classList.add("open"));
  }

  function closeAtlas() {
    const el = document.getElementById("model-atlas");
    if (!el) return;
    el.classList.remove("open");
    document.body.classList.remove("atlas-open");
    if (!document.getElementById("ux-shortcuts")?.classList.contains("open") && !document.getElementById("ux-welcome")?.classList.contains("open")) {
      document.body.classList.remove("modal-open");
    }
    window.setTimeout(() => { el.hidden = true; }, 320);
  }

  function syncAtlasActive() {
    if (!document.getElementById("model-atlas")?.classList.contains("open")) return;
    refreshModelAtlas();
  }

  const RELATED_TOPICS = {
    geest: ["geloof-geest", "god", "hm-gezindheid"],
    ziel: ["verstand", "hart", "cmp-vlezes"],
    hart: ["gw-plaats", "hm-hart", "od-woord"],
    verstand: ["vs-overzicht", "woord", "vz-overzicht"],
    "wet-geest": ["geloof-geest", "kr-overzicht", "dw-discipel"],
    "wet-zonde": ["r7-overzicht", "vz-overzicht", "kr-overzicht"],
    "gst-overzicht": ["woord", "geloof-geest", "vs-overzicht"],
    "hm-overzicht": ["hm-hart", "hm-gezindheid", "dw-doel"],
    "zg-overzicht": ["geloof-geest", "woord", "rv-overzicht"],
    "dw-gebed": ["dw-woord", "dw-discipel", "om-gehoorzaamheid"],
    "bz-overzicht": ["dw-heiligmaking", "gw-hele-mens", "bz-reinigen"],
    "dw-heiligmaking": ["bz-overzicht", "hm-overzicht", "dw-doel"],
    "gw-hele-mens": ["bz-overzicht", "bz-reinigen", "od-zelf"],
    "tg-overzicht": ["bz-tong", "bz-vlees", "od-anderen"],
  };

  const TAB_ICONS = {
    structuur: "◇",
    proces: "↻",
    rom7: "⑦",
    verzoeking: "⚡",
    verstand: "◈",
    geweten: "◎",
    gevoel: "♡",
    tong: "◉",
    verschil: "⇄",
    woord: "✦",
    geloof: "✧",
    ootmoed: "▽",
    kruis: "✝",
    weg: "→",
  };

  const SCENE_FOCUS = {
    structuur: ".diagram-row",
    proces: ".process-grid",
    rom7: ".r7-scene",
    proces: ".process-grid",
    rom7: ".r7-scene",
    verzoeking: ".vz-scene",
    verstand: ".vs-scene",
    geweten: ".gw-scene",
    gevoel: ".gv-scene",
    tong: ".tg-scene",
    verschil: ".compare-wrap",
    woord: ".gst-scene, .wp-scene",
    geloof: ".gl-scene",
    ootmoed: ".om-scene",
    kruis: ".kr-scene",
    weg: ".dw-scene, .bz-scene, .hm-scene",
  };

  const VISUAL_NAV = {
    god: { tab: "structuur", focus: ".layer-god" },
    geest: { tab: "geloof", focus: ".gl-scene" },
    ziel: { tab: "structuur", focus: ".layer-ziel" },
    verstand: { tab: "verstand", focus: ".vs-scene" },
    fantasie: { tab: "verstand", focus: ".vs-scene" },
    "fantasie-gevaar": { tab: "verstand", focus: ".vs-scene" },
    "fantasie-geest": { tab: "verstand", focus: ".vs-scene" },
    hart: { tab: "geweten", focus: ".gw-scene" },
    wil: { tab: "ootmoed", focus: ".om-scene" },
    zintuigen: { tab: "verzoeking", focus: ".vz-scene" },
    lichaam: { tab: "structuur", focus: ".layer-lichaam" },
    leden: { tab: "rom7", focus: ".r7-scene" },
    "lichaam-vlezes": { tab: "structuur", focus: ".body-row.vlezes" },
    "lichaam-zonde": { tab: "rom7", focus: ".r7-scene" },
    "lichaam-doods": { tab: "structuur", focus: ".body-row.doods" },
    "wet-geest": { tab: "geloof", focus: ".gl-scene" },
    "wet-zonde": { tab: "structuur", focus: ".law.red" },
    "wet-doods": { tab: "geweten", focus: ".gw-scene" },
    "werkingen-lichaam": { tab: "structuur", focus: ".outcome.werking" },
    "zondige-werking": { tab: "structuur", focus: ".outcome.zonde" },
    woord: { tab: "woord", focus: ".gst-scene, .wp-scene" },
    weg: { tab: "weg", focus: ".dw-scene" },
    "gv-plaats": { tab: "gevoel", focus: ".gv-scene" },
    "tg-plaats": { tab: "tong", focus: ".tg-scene" },
    "kr-overzicht": { tab: "kruis", focus: ".kr-scene" },
    "gst-overzicht": { tab: "woord", focus: ".gst-scene" },
    "hm-overzicht": { tab: "weg", focus: ".hm-scene" },
    "bz-overzicht": { tab: "weg", focus: ".bz-scene" },
    "dw-overzicht": { tab: "weg", focus: ".dw-scene" },
    "dw-heiligmaking": { tab: "weg", focus: ".bz-scene, .dw-jstep[data-topic='dw-heiligmaking']" },
    "geloof-overzicht": { tab: "geloof", focus: ".gl-scene" },
    "vz-overzicht": { tab: "verzoeking", focus: ".vz-scene" },
    "vs-overzicht": { tab: "verstand", focus: ".vs-scene" },
    "gw-overzicht": { tab: "geweten", focus: ".gw-scene" },
    "gv-overzicht": { tab: "gevoel", focus: ".gv-scene" },
    "tg-overzicht": { tab: "tong", focus: ".tg-scene" },
    "om-overzicht": { tab: "ootmoed", focus: ".om-scene" },
    "r7-overzicht": { tab: "rom7", focus: ".r7-scene" },
    "zg-overzicht": { tab: "geloof", focus: ".zg-block" },
    "rv-overzicht": { tab: "geloof", focus: ".rv-key" },
    "bp-overzicht": { tab: "kruis", focus: ".bp-key" },
    "gs-overzicht": { tab: "kruis", focus: ".gs-key" },
    "wp-overzicht": { tab: "kruis", focus: ".wp-key" },
    "cmp-vlezes": { tab: "verschil", focus: ".compare-wrap" },
    "cmp-zonde": { tab: "verschil", focus: ".compare-wrap" },
    "cmp-doods": { tab: "verschil", focus: ".compare-wrap" },
    geweten: { tab: "geweten", focus: ".gw-scene" },
    gevoel: { tab: "gevoel", focus: ".gv-scene" },
    tong: { tab: "tong", focus: ".tg-scene" },
    "cmp-werkingen": { tab: "verschil", focus: ".compare-wrap" },
    "cmp-vlees-werken": { tab: "verschil", focus: ".compare-wrap" },
    "cmp-zielse": { tab: "verschil", focus: ".compare-wrap" },
    "cmp-geestelijk": { tab: "verschil", focus: ".compare-wrap" },
  };

  const ANATOMY_NAV = {
    zintuigen: { tab: "verzoeking", focus: ".vz-scene" },
    verstand: { tab: "verstand", focus: ".vs-scene" },
    fantasie: { tab: "verstand", focus: "[data-topic='fantasie'], [data-topic='vs-fantasie']" },
    hart: { tab: "geweten", focus: ".gw-scene" },
    geweten: { tab: "geweten", focus: ".gw-scene" },
    gevoel: { tab: "gevoel", focus: ".gv-scene" },
    tong: { tab: "tong", focus: ".tg-scene" },
    wil: { tab: "ootmoed", focus: ".om-scene" },
    gezindheid: { tab: "ootmoed", focus: ".om-scene" },
    geest: { tab: "geloof", focus: ".gl-scene" },
    woord: { tab: "woord", focus: ".gst-scene" },
    geloof: { tab: "geloof", focus: ".gl-scene" },
    god: { tab: "structuur", focus: ".layer-god" },
    ziel: { tab: "structuur", focus: ".layer-ziel" },
    lichaam: { tab: "structuur", focus: ".layer-lichaam" },
    leden: { tab: "rom7", focus: ".r7-scene" },
    kruis: { tab: "kruis", focus: ".kr-scene" },
    weg: { tab: "weg", focus: ".dw-scene" },
    ootmoed: { tab: "ootmoed", focus: ".om-scene" },
  };

  const WHERE_KEYWORDS = [
    ["zintuigen", "zintuigen"],
    ["fantasie", "fantasie"],
    ["verstand", "verstand"],
    ["geweten", "gw-overzicht"],
    ["gevoel", "gv-overzicht"],
    ["tong", "tg-overzicht"],
    ["gezindheid", "wil"],
    ["hart", "hart"],
    ["geest", "geest"],
    ["woord", "woord"],
    ["geloof", "geloof-overzicht"],
    ["lichaam", "lichaam"],
    ["wil", "wil"],
    ["kruis", "kr-overzicht"],
    ["ootmoed", "om-overzicht"],
  ];

  const MODEL_FLOW = [
    { topic: "structuur", label: "Bouw", tab: "structuur", hub: "fundament" },
    { topic: "gevallen-zintuigen", label: "Verloop", tab: "proces" },
    { topic: "r7-overzicht", label: "Rom. 7", tab: "rom7" },
    { topic: "zintuigen", label: "Zintuigen", tab: "verzoeking" },
    { topic: "verstand", label: "Verstand", tab: "verstand" },
    { topic: "fantasie", label: "Fantasie", tab: "verstand" },
    { topic: "hart", label: "Hart", tab: "geweten" },
    { topic: "gv-plaats", label: "Gevoel", tab: "gevoel" },
    { topic: "tg-plaats", label: "Tong", tab: "tong" },
    { topic: "cmp-geestelijk", label: "Onderscheid", tab: "verschil" },
    { topic: "wil", label: "Wil", tab: "ootmoed" },
    { topic: "geest", label: "Geest", tab: "geloof" },
    { topic: "woord", label: "Woord", tab: "woord" },
    { topic: "kr-overzicht", label: "Kruis", tab: "kruis" },
    { topic: "bz-overzicht", label: "Reinigen", tab: "weg" },
    { topic: "weg", label: "Weg", tab: "weg" },
  ];

  const MODEL_FLOW_TABS = new Set([
    "proces", "rom7", "verschil",
    "verzoeking", "verstand", "geweten", "gevoel", "tong", "woord", "geloof", "ootmoed", "kruis", "weg",
  ]);

  let activeVisualTopic = null;
  let skipHistoryPush = false;
  let handlingHistory = false;

  const PREFIX_TAB = [
    ["od-", "geweten"],
    ["gw-", "geweten"],
    ["vs-", "verstand"],
    ["gv-", "gevoel"],
    ["tg-", "tong"],
    ["gl-", "geloof"],
    ["geloof-", "geloof"],
    ["rv-", "geloof"],
    ["om-", "ootmoed"],
    ["kr-", "kruis"],
    ["wp-", "kruis"],
    ["bp-", "kruis"],
    ["gs-", "kruis"],
    ["dw-", "weg"],
    ["hm-", "weg"],
    ["bz-", "weg"],
    ["zg-", "geloof"],
    ["gst-", "woord"],
    ["r7-", "rom7"],
    ["vz-", "verzoeking"],
    ["cmp-", "verschil"],
    ["gevallen-", "proces"],
    ["verlost-", "proces"],
  ];

  const EXPLICIT_TOPIC_TAB = {
    god: "structuur",
    geest: "geloof",
    ziel: "structuur",
    verstand: "verstand",
    fantasie: "verstand",
    "fantasie-gevaar": "verstand",
    "fantasie-geest": "verstand",
    hart: "geweten",
    wil: "ootmoed",
    zintuigen: "verzoeking",
    lichaam: "structuur",
    leden: "structuur",
    "lichaam-vlezes": "structuur",
    "lichaam-zonde": "structuur",
    "lichaam-doods": "structuur",
    "werkingen-lichaam": "structuur",
    "zondige-werking": "structuur",
    "wet-geest": "geloof",
    "wet-zonde": "structuur",
    "wet-doods": "geweten",
    woord: "woord",
    "woord-licht": "woord",
    "woord-instem": "woord",
    "woord-doen": "woord",
  };

  const PANEL_TOPIC_ALIAS = {
    verstand: "vs-overzicht",
    fantasie: "vs-fantasie",
    "fantasie-gevaar": "vs-fantasie",
    "fantasie-geest": "vs-verlicht",
    hart: "gw-plaats",
    wil: "om-gezindheid",
    geest: "geloof-geest",
    zintuigen: "vz-overzicht",
    "gevallen-verstand": "vs-gevallen",
    "verlost-woord": "woord",
    "verlost-hart": "od-woord",
    "verlost-gezindheid": "om-gehoorzaamheid",
    "verlost-geest": "geloof-geest",
    "wet-geest": "wet-geest",
    "wet-doods": "gw-slecht",
  };

  function tabForTopic(topicId) {
    if (window.HT_SEARCH?.tabForTopic) return window.HT_SEARCH.tabForTopic(topicId);
    if (!topicId) return null;
    if (EXPLICIT_TOPIC_TAB[topicId]) return EXPLICIT_TOPIC_TAB[topicId];
    for (const [prefix, tab] of PREFIX_TAB) {
      if (topicId.startsWith(prefix)) return tab;
    }
    if (topicId.startsWith("woord")) return "woord";
    return null;
  }

  function resolvePanelTopic(topicId) {
    const alias = PANEL_TOPIC_ALIAS[topicId];
    if (alias && window.HT_TOPICS[alias]) return alias;
    if (window.HT_TOPICS[topicId]) return topicId;
    if (alias) return alias;
    return topicId;
  }

  function hubForTab(tabId) {
    for (const [hubId, hub] of Object.entries(HUBS)) {
      if (hub.tabs.includes(tabId)) return hubId;
    }
    return "fundament";
  }

  function getActiveTabId() {
    const activeSection = document.querySelector("section.active:not(#start)");
    if (activeSection) return activeSection.id;
    return document.querySelector(".nav-sub button.active")?.dataset.tab || "start";
  }

  function isOnStart() {
    return document.getElementById("start")?.classList.contains("active");
  }

  function getVisitedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      return new Set();
    }
  }

  function markVisited(topicId) {
    const set = getVisitedSet();
    set.add(topicId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    updateProgress();
  }

  function updateProgress() {
    const total = Object.keys(window.HT_TOPICS || {}).length;
    const visited = getVisitedSet().size;
    const pct = total ? Math.round((visited / total) * 100) : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressLabel) progressLabel.textContent = `${visited} / ${total}`;
    checkMilestone(pct);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function showToast(message, { type = "nav", duration = 2800 } = {}) {
    if (!uxToastStack || !message) return;
    const el = document.createElement("div");
    el.className = `ux-toast ux-toast-${type}`;
    el.textContent = message;
    uxToastStack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    window.setTimeout(() => {
      el.classList.remove("show");
      el.classList.add("hide");
      window.setTimeout(() => el.remove(), 400);
    }, duration);
  }

  function updateContextBar(tabId, topicId) {
    if (!uxContext || !uxContextText) return;
    const citeTopicId = topicId || getContextCiteTopic();
    const anatomyZone =
      (citeTopicId && window.MENS_DIAGRAM?.topicToZone(citeTopicId)) ||
      (tabId && TAB_ANATOMY_ZONE[tabId]) ||
      null;

    if (!tabId || tabId === "start") {
      if (!isTopicPageOpen()) {
        uxContext.hidden = true;
        if (uxContextBron) uxContextBron.hidden = true;
        if (uxContextDeepen) uxContextDeepen.hidden = true;
        if (uxContextMens) uxContextMens.innerHTML = "";
        document.body.classList.remove("has-context");
        return;
      }
    }

    const hubId = tabId ? hubForTab(tabId) : null;
    const tabLabel = tabId && TAB_LABELS[tabId];
    const zoneMeta = anatomyZone && window.MENS_DIAGRAM?.zoneMeta(anatomyZone);
    const topic = citeTopicId && window.HT_TOPICS[resolvePanelTopic(citeTopicId)];
    let text;
    if (isTopicPageOpen() && topic?.title) {
      text = topic.title;
    } else if (activeVisualTopic) {
      const visTopic = window.HT_TOPICS[resolvePanelTopic(activeVisualTopic)];
      text = visTopic?.title || zoneMeta?.label || TAB_LABELS[tabForTopic(activeVisualTopic)] || "In de mens";
    } else if (zoneMeta?.label) {
      text = zoneMeta.label;
    } else if (tabLabel) {
      text = tabLabel;
    } else {
      text = "In de mens";
    }

    uxContextText.textContent = text;
    if (uxContextDot) {
      uxContextDot.style.background = zoneMeta?.color || HUB_THEME[hubId] || HUB_THEME.fundament;
    }
    if (uxContextMens) {
      uxContextMens.innerHTML = "";
      uxContextMens.hidden = true;
      uxContextMens.setAttribute("aria-hidden", "true");
    }
    const onDeepPage = isTopicPageOpen();
    if (uxContextBron) uxContextBron.hidden = onDeepPage || !topicHasQuotes(citeTopicId || activeVisualTopic || "");
    const deepenId = topicId || activeVisualTopic;
    const panelForDeepen = deepenId && resolvePanelTopic(deepenId);
    const canDeepen = !!(panelForDeepen && window.HT_TOPICS[panelForDeepen] && !isTopicPageOpen());
    if (uxContextDeepen) {
      uxContextDeepen.hidden = !canDeepen;
      uxContextDeepen.dataset.topic = canDeepen ? deepenId : "";
    }
    uxContext.hidden = false;
    document.body.classList.add("has-context");
    if (!prefersReducedMotion()) {
      uxContext.classList.remove("pulse");
      void uxContext.offsetWidth;
      uxContext.classList.add("pulse");
    }
    syncMensHighlights(anatomyZone);
  }

  function syncMensHighlights(zoneOrTopic) {
    const zone =
      zoneOrTopic && ZONE_META_HAS(zoneOrTopic)
        ? zoneOrTopic
        : window.MENS_DIAGRAM?.topicToZone(zoneOrTopic);
    if (mensHomeDiagram && window.MENS_DIAGRAM) {
      window.MENS_DIAGRAM.updateHighlights(mensHomeDiagram, zone);
    }
    if (uxContextMens && window.MENS_DIAGRAM) {
      window.MENS_DIAGRAM.updateHighlights(uxContextMens, zone);
    }
    const structuurViz = document.getElementById("structuur-mens-viz");
    if (structuurViz && window.MENS_DIAGRAM) {
      window.MENS_DIAGRAM.updateHighlights(structuurViz, zone);
    }
    const modelNavViz = document.querySelector("#model-nav .model-nav-diagram");
    if (modelNavViz && window.MENS_DIAGRAM) {
      window.MENS_DIAGRAM.updateHighlights(modelNavViz, zone);
    }
    document.querySelectorAll(".mens-zone, .illus-zone").forEach((el) => {
      const z = el.dataset.topic;
      const elZone = window.MENS_DIAGRAM?.topicToZone(z) || z;
      el.classList.toggle("active-zone", !!(zone && (elZone === zone || z === zone)));
    });
  }

  function ZONE_META_HAS(id) {
    return !!(window.MENS_DIAGRAM?.ZONE_META?.[id]);
  }

  function topicHasQuotes(topicId) {
    const panelTopic = resolvePanelTopic(topicId);
    const topic = window.HT_TOPICS[panelTopic];
    return !!(topic?.quotes?.length);
  }

  function isTopicPageOpen() {
    return topicPage?.classList.contains("open");
  }

  function getContextCiteTopic() {
    if (isTopicPageOpen() && currentTopicId) return topicPageRawId || currentTopicId;
    if (panel.classList.contains("open") && currentTopicId) return currentTopicId;
    if (activeVisualTopic && topicHasQuotes(activeVisualTopic)) return activeVisualTopic;
    if (activeEl?.dataset?.topic && topicHasQuotes(activeEl.dataset.topic)) return activeEl.dataset.topic;
    const tab = getActiveTabId();
    if (tab && TAB_CITE_TOPIC[tab] && window.HT_TOPICS[TAB_CITE_TOPIC[tab]]) return TAB_CITE_TOPIC[tab];
    return null;
  }

  function getCiteableTopicsForTab(tabId) {
    const section = document.getElementById(tabId);
    if (!section) return [];
    const seen = new Set();
    const items = [];
    section.querySelectorAll("[data-topic]").forEach((el) => {
      const rawId = el.dataset.topic;
      if (!rawId || seen.has(rawId) || !topicHasQuotes(rawId)) return;
      seen.add(rawId);
      const panelId = resolvePanelTopic(rawId);
      const topic = window.HT_TOPICS[panelId];
      if (!topic) return;
      items.push({ id: rawId, panelId, topic });
    });
    return items.sort((a, b) => a.topic.title.localeCompare(b.topic.title, "nl"));
  }

  function getVisitedCiteTopics(limit = 10) {
    const items = [];
    const seen = new Set();
    [...getVisitedSet()].reverse().forEach((id) => {
      if (items.length >= limit) return;
      const panelId = resolvePanelTopic(id);
      if (seen.has(panelId)) return;
      const topic = window.HT_TOPICS[panelId];
      if (!topic?.quotes?.length) return;
      seen.add(panelId);
      items.push({ id, panelId, topic });
    });
    return items;
  }

  function renderBronRail() {
    if (!bronRailBody) return;
    const tab = getActiveTabId();
    const contextId = getContextCiteTopic();
    const contextTopic = contextId ? window.HT_TOPICS[resolvePanelTopic(contextId)] : null;
    const onPage = tab ? getCiteableTopicsForTab(tab) : [];
    const visited = getVisitedCiteTopics();

    let html = "";

    if (contextTopic) {
      const quoteCount = contextTopic.quotes?.length || 0;
      html += `<button type="button" class="bron-rail-primary" data-topic="${escapeHtml(contextId)}">
        <span class="bron-rail-primary-icon" aria-hidden="true">📖</span>
        <span class="bron-rail-primary-body">
          <strong>${escapeHtml(contextTopic.title)}</strong>
          <span>${quoteCount} citaat${quoteCount === 1 ? "" : "en"} · huidige context</span>
        </span>
        <span class="bron-rail-primary-go" aria-hidden="true">→</span>
      </button>`;
    }

    if (onPage.length) {
      html += `<div class="bron-rail-section"><h3>Op deze pagina</h3><div class="bron-rail-list">`;
      onPage.forEach(({ id, topic }) => {
        const n = topic.quotes?.length || 0;
        html += `<button type="button" class="bron-rail-item" data-topic="${escapeHtml(id)}">
          <span class="bron-rail-item-dot" style="background:${topic.color || "#818cf8"}"></span>
          <span class="bron-rail-item-body">
            <strong>${escapeHtml(topic.title)}</strong>
            <span>${n} citaat${n === 1 ? "" : "en"}</span>
          </span>
        </button>`;
      });
      html += `</div></div>`;
    }

    if (visited.length) {
      html += `<div class="bron-rail-section"><h3>Laatst bekeken</h3><div class="bron-rail-list">`;
      visited.forEach(({ id, topic }) => {
        const n = topic.quotes?.length || 0;
        const tabLabel = TAB_LABELS[tabForTopic(id)];
        html += `<button type="button" class="bron-rail-item" data-topic="${escapeHtml(id)}">
          <span class="bron-rail-item-dot" style="background:${topic.color || "#818cf8"}"></span>
          <span class="bron-rail-item-body">
            <strong>${escapeHtml(topic.title)}</strong>
            <span>${tabLabel ? `${escapeHtml(tabLabel)} · ` : ""}${n} citaat${n === 1 ? "" : "en"}</span>
          </span>
        </button>`;
      });
      html += `</div></div>`;
    }

    if (!html) {
      html = `<p class="bron-rail-empty">Klik op een onderdeel in het model en open daarna Bronnen — of zoek met <kbd>Ctrl</kbd>+<kbd>K</kbd>.</p>`;
    }

    bronRailBody.innerHTML = html;
    bronRailBody.querySelectorAll("[data-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeBronRail();
        navigateToTopic(btn.dataset.topic, null, null);
      });
    });
    enrichBronRailHt();
  }

  async function enrichBronRailHt() {
    const topicId = getContextCiteTopic();
    const panelTopic = topicId ? resolvePanelTopic(topicId) : TAB_CITE_TOPIC[getActiveTabId()];
    const topic = panelTopic && window.HT_TOPICS[panelTopic];
    if (!topic || !window.HT_LINKS || !bronRailBody) return;

    const slot = document.createElement("div");
    slot.className = "bron-rail-ht-slot";
    slot.innerHTML = `<p class="bron-rail-ht-loading">Artikelen uit Hidden Treasures…</p>`;
    bronRailBody.prepend(slot);

    const instant = window.HT_LINKS.articlesFromQuotes?.(topic.quotes) || [];
    const query = window.HT_LINKS.buildQueryForTopic(topic, panelTopic);

    function renderSlot(articles) {
      let html = `<div class="bron-rail-section bron-rail-ht"><h3>Uit Hidden Treasures</h3><div class="bron-rail-ht-list">`;
      articles.forEach((a) => {
        const excerpt = (a.excerpt || "").slice(0, 100);
        html += `<button type="button" class="bron-rail-ht-item ht-article-open" ${htArticleDataAttrs(a)}>
          <strong>${escapeHtml(a.title)}</strong>
          <span>${escapeHtml([a.author, a.dateLabel].filter(Boolean).join(" · "))}</span>
          ${excerpt ? `<span class="bron-rail-ht-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 100 ? "…" : ""}</span>` : ""}
        </button>`;
      });
      html += `</div><a class="bron-rail-ht-more" href="${escapeHtml(window.HT_LINKS.buildSearchUrl(query))}" target="_blank" rel="noopener">Meer zoeken →</a></div>`;
      slot.innerHTML = html;
    }

    if (instant.length) renderSlot(instant.slice(0, 3));

    try {
      const articles = await window.HT_LINKS.findRelatedArticles(topic, topic.quotes, panelTopic, { size: 3 });
      if (articles.length) {
        renderSlot(articles);
      } else if (!instant.length) {
        slot.innerHTML = `<div class="bron-rail-section bron-rail-ht"><p class="bron-rail-ht-empty">Geen artikelen gevonden — <a href="${escapeHtml(window.HT_LINKS.buildSearchUrl(query))}" target="_blank" rel="noopener">zoek in Verborgen Schatten</a>.</p></div>`;
      }
    } catch {
      if (!instant.length) {
        slot.innerHTML = `<div class="bron-rail-section bron-rail-ht"><p class="bron-rail-ht-empty">Kon artikelen niet laden — <a href="${escapeHtml(window.HT_LINKS.buildSearchUrl(query))}" target="_blank" rel="noopener">zoek handmatig</a>.</p></div>`;
      }
    }
  }

  function openBronRail() {
    if (!bronRail) return;
    closeSearch();
    closeDrawer();
    renderBronRail();
    bronRail.classList.add("open");
    bronRail.setAttribute("aria-hidden", "false");
    document.body.classList.add("bron-open");
    bronRail.querySelector(".bron-rail-primary, .bron-rail-item")?.focus();
  }

  function closeBronRail() {
    if (!bronRail) return;
    bronRail.classList.remove("open");
    bronRail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bron-open");
  }

  function openContextBron() {
    closeSearch();
    closeDrawer();
    const topicId = getContextCiteTopic();
    if (topicId && topicHasQuotes(topicId)) {
      if (isTopicPageOpen()) {
        topicPageInner?.querySelector("#tp-bronnen")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      openTopicPage(topicId, activeEl, null, { scrollTo: "bron" });
      return;
    }
    openBronRail();
  }

  function revealSectionContent(section) {
    if (!section) return;
    section.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    if (typeof IntersectionObserver !== "undefined") {
      window.requestAnimationFrame(() => {
        section.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
          el.classList.add("visible");
        });
      });
    }
  }

  function animateSectionEnter(section) {
    revealSectionContent(section);
    if (!section || prefersReducedMotion()) return;
    section.classList.remove("section-enter");
    void section.offsetWidth;
    section.classList.add("section-enter");
  }

  function checkMilestone(pct) {
    const thresholds = [25, 50, 75, 100];
    let seen = [];
    try {
      seen = JSON.parse(localStorage.getItem(MILESTONE_KEY) || "[]");
    } catch {
      seen = [];
    }
    const msgs = {
      25: "Goed begin — een kwart verkend",
      50: "Halverwege — je volgt het model",
      75: "Bijna alles bezocht",
      100: "Alle onderwerpen verkend",
    };
    for (const t of thresholds) {
      if (pct >= t && !seen.includes(t)) {
        seen.push(t);
        localStorage.setItem(MILESTONE_KEY, JSON.stringify(seen));
        showToast(msgs[t], { type: "milestone", duration: 4200 });
      }
    }
  }

  function openShortcuts() {
    const el = document.getElementById("ux-shortcuts");
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("open"));
    document.body.classList.add("modal-open");
  }

  function closeShortcuts() {
    const el = document.getElementById("ux-shortcuts");
    if (!el) return;
    el.classList.remove("open");
    document.body.classList.remove("modal-open");
    window.setTimeout(() => { el.hidden = true; }, 320);
  }

  function openWelcome() {
    const welcome = document.getElementById("ux-welcome");
    if (!welcome) return;
    welcome.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => welcome.classList.add("open"));
  }

  function closeWelcome() {
    const welcome = document.getElementById("ux-welcome");
    if (!welcome) return;
    welcome.classList.remove("open");
    document.body.classList.remove("modal-open");
    localStorage.setItem(WELCOME_KEY, "1");
    window.setTimeout(() => { welcome.hidden = true; }, 350);
  }

  function initWelcome() {
    const welcome = document.getElementById("ux-welcome");
    if (!welcome) return;
    if (!localStorage.getItem(WELCOME_KEY)) {
      window.setTimeout(openWelcome, 700);
    }
    document.getElementById("ux-welcome-go")?.addEventListener("click", () => {
      closeWelcome();
      goToHub("fundament", { tab: "structuur" });
    });
    document.getElementById("ux-welcome-dismiss")?.addEventListener("click", closeWelcome);
    document.getElementById("ux-welcome-backdrop")?.addEventListener("click", closeWelcome);
  }

  function initHelpFab() {
    document.getElementById("ux-help-fab")?.addEventListener("click", openShortcuts);
    document.getElementById("ux-shortcuts-close")?.addEventListener("click", closeShortcuts);
    document.getElementById("ux-shortcuts-backdrop")?.addEventListener("click", closeShortcuts);
    document.getElementById("open-atlas")?.addEventListener("click", openAtlas);
    document.getElementById("open-atlas-start")?.addEventListener("click", openAtlas);
    document.getElementById("ux-map-fab")?.addEventListener("click", openAtlas);
    navBackBtn?.addEventListener("click", goBack);
    uxContextBack?.addEventListener("click", (e) => {
      e.stopPropagation();
      goBack();
    });
  }

  function buildUrlFromSnap(snap) {
    if (snap.panelOpen && snap.panelTopic) {
      return `#/topic/${encodeURIComponent(snap.panelTopic)}`;
    }
    if (!snap.tab || snap.tab === "start") return "#/start";
    return `#/${encodeURIComponent(snap.tab)}`;
  }

  function snapKey(snap) {
    if (!snap) return "";
    return `${snap.tab || "start"}|${snap.topic || ""}|${snap.panelOpen ? snap.panelTopic || "" : ""}`;
  }

  function getNavLabel(snap) {
    if (!snap) return "Start";
    if (snap.panelOpen && snap.panelTopic) {
      const t = window.HT_TOPICS[snap.panelTopic];
      return t?.title || TAB_LABELS[snap.tab] || snap.panelTopic;
    }
    if (snap.topic) {
      const t = window.HT_TOPICS[snap.topic] || window.HT_TOPICS[resolvePanelTopic(snap.topic)];
      if (t?.title) return t.title;
    }
    if (snap.tab === "start") return "Start";
    return TAB_LABELS[snap.tab] || snap.tab;
  }

  function captureNavSnapshot(overrides = {}) {
    const tab = overrides.tab ?? (isOnStart() ? "start" : getActiveTabId());
    return {
      tab,
      topic: overrides.topic !== undefined ? overrides.topic : activeVisualTopic,
      scrollY: overrides.scrollY ?? window.scrollY,
      panelOpen: overrides.panelOpen ?? (isTopicPageOpen() || panel.classList.contains("open")),
      panelTopic: overrides.panelTopic !== undefined
        ? overrides.panelTopic
        : (isTopicPageOpen() || panel.classList.contains("open") ? currentTopicId : null),
    };
  }

  function canGoBack() {
    return (history.state?._idx ?? 0) > 0;
  }

  function syncBackButton() {
    const can = canGoBack();
    const label = history.state?._backLabel;
    const backText = label ? `Terug · ${label}` : "Terug";

    if (navBackBtn) {
      navBackBtn.disabled = !can;
      navBackBtn.classList.toggle("is-available", can);
      navBackBtn.setAttribute("aria-label", can ? `Terug naar ${label || "vorige plek"}` : "Geen vorige plek");
      const textEl = navBackBtn.querySelector(".nav-back-label");
      if (textEl) textEl.textContent = backText;
    }

    if (uxContextBack) {
      uxContextBack.hidden = !can;
      uxContextBack.setAttribute("aria-label", label ? `Terug naar ${label}` : "Terug");
      uxContext?.classList.toggle("has-back", can);
    }
  }

  function commitNavHistory(overrides = {}, { replace = false } = {}) {
    if (skipHistoryPush) return;

    const snap = captureNavSnapshot(overrides);
    const prev = history.state;
    if (!replace && prev && snapKey(prev) === snapKey(snap)) return;

    snap._backLabel = replace ? (prev?._backLabel ?? null) : getNavLabel(prev);
    snap._idx = replace ? (prev?._idx ?? 0) : ((prev?._idx ?? 0) + 1);

    const url = buildUrlFromSnap(snap);
    if (replace) history.replaceState(snap, "", url);
    else history.pushState(snap, "", url);

    syncBackButton();
  }

  function updateHash({ tab, topic, replace = false } = {}) {
    const overrides = {};
    if (tab !== undefined) overrides.tab = tab;
    if (topic !== undefined) overrides.topic = topic;
    commitNavHistory(overrides, { replace });
  }

  function restoreNavSnapshot(snap) {
    if (!snap) return;

    skipHistoryPush = true;
    try {
      if (isTopicPageOpen()) closeTopicPage({ updateUrl: false });
      if (panel.classList.contains("open")) {
        overlay.classList.remove("open");
        panel.classList.remove("open");
        document.body.classList.remove("panel-open");
        if (activeEl) {
          activeEl.classList.remove("active-topic");
          activeEl = null;
        }
        document.querySelectorAll("#structuur-mens-viz .mens-zone, .illus-zone").forEach((z) => z.classList.remove("lit"));
      }

      activeVisualTopic = snap.topic || null;

      if (snap.tab === "start") {
        goToStart({ scroll: false, updateUrl: false, toast: false });
      } else {
        goToTab(snap.tab, { scroll: false, flash: false, toast: false, updateUrl: false });
      }

      if (snap.panelOpen && snap.panelTopic) {
        openTopicPage(snap.topic || snap.panelTopic, null, null, { updateUrl: false });
      } else if (snap.topic) {
        const nav = getVisualNav(snap.topic);
        if (nav) {
          window.requestAnimationFrame(() => {
            scrollToFocus(nav, { smooth: false });
            highlightVisualTopic(snap.topic);
          });
        } else {
          window.scrollTo({ top: snap.scrollY || 0, behavior: "auto" });
        }
      } else {
        window.scrollTo({ top: snap.scrollY || 0, behavior: "auto" });
      }
    } finally {
      skipHistoryPush = false;
      syncBackButton();
    }
  }

  function goBack() {
    if (!canGoBack()) return;
    const label = history.state?._backLabel;
    history.back();
    if (label) showToast(`← ${label}`, { type: "nav", duration: 2200 });
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    if (!raw) return {};
    if (raw.startsWith("topic/")) {
      return { topic: decodeURIComponent(raw.slice(6)) };
    }
    return { tab: decodeURIComponent(raw) };
  }

  function syncHubButtons(hubId) {
    document.querySelectorAll(".nav-hub-btn").forEach((btn) => {
      const active = btn.dataset.hub === hubId;
      btn.classList.toggle("active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function renderSubNav(hubId, activeTabId) {
    if (!navSub) return;
    const hub = HUBS[hubId];
    if (!hub?.tabs?.length) {
      navSub.hidden = true;
      navSub.innerHTML = "";
      return;
    }

    navSub.hidden = false;
    navSub.innerHTML = `<div class="nav-sub-inner"><div class="nav-sub-indicator" id="nav-sub-indicator" aria-hidden="true"></div></div>`;
    const inner = navSub.querySelector(".nav-sub-inner");

    hub.tabs.forEach((tabId) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-sub-btn";
      btn.dataset.tab = tabId;
      btn.setAttribute("role", "tab");
      const icon = TAB_ICONS[tabId];
      if (icon) {
        const span = document.createElement("span");
        span.className = "nav-icon";
        span.setAttribute("aria-hidden", "true");
        span.textContent = icon;
        btn.appendChild(span);
      }
      btn.appendChild(document.createTextNode(TAB_LABELS[tabId] || tabId));
      btn.classList.toggle("active", tabId === activeTabId);
      btn.addEventListener("click", () => goToTab(tabId, { flash: false, toast: true }));
      inner.appendChild(btn);
    });

    const activeBtn = inner.querySelector(`button[data-tab="${activeTabId}"]`);
    if (activeBtn) updateSubNavIndicator(activeBtn);
  }

  function updateSubNavIndicator(activeBtn) {
    const indicator = document.getElementById("nav-sub-indicator");
    const inner = navSub?.querySelector(".nav-sub-inner");
    if (!indicator || !activeBtn || !inner) return;
    const innerRect = inner.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicator.style.left = `${btnRect.left - innerRect.left + inner.scrollLeft}px`;
    indicator.style.width = `${btnRect.width}px`;
  }

  function goToStart({ scroll = true, updateUrl = true } = {}) {
    if (isTopicPageOpen()) closeTopicPage({ updateUrl: false });
    syncHubButtons("start");
    renderSubNav("start");
    sections.forEach((s) => s.classList.remove("active"));
    const startSection = document.getElementById("start");
    startSection?.classList.add("active");
    revealSectionContent(startSection);
    document.body.classList.add("view-start");
    syncDrawerActive(null);
    if (updateUrl) {
      activeVisualTopic = null;
      commitNavHistory({ tab: "start", topic: null, panelOpen: false, panelTopic: null });
    }
    syncModelNavVisibility();
    syncModelFlowActive("start");
    updateContextBar(null);
    syncAtlasActive();
    syncMensFab();
    if (scroll) {
      window.requestAnimationFrame(() => {
        document.getElementById("mens-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    return true;
  }

  function goToHub(hubId, { tab, scroll = true, flash = true, toast = flash, updateUrl = true } = {}) {
    if (hubId === "start") return goToStart({ scroll, updateUrl });
    const hub = HUBS[hubId];
    if (!hub?.tabs?.length) return false;
    return goToTab(tab || hub.tabs[0], { scroll, flash, toast, updateUrl });
  }

  function goToTab(tabId, { scroll = true, flash = true, toast = flash, updateUrl = true } = {}) {
    if (tabId === "start") return goToStart({ scroll, updateUrl });

    if (isTopicPageOpen() && updateUrl) closeTopicPage({ updateUrl: false });

    const section = document.getElementById(tabId);
    if (!section) return false;

    const hubId = hubForTab(tabId);
    document.body.classList.remove("view-start");
    syncHubButtons(hubId);
    renderSubNav(hubId, tabId);

    sections.forEach((s) => s.classList.remove("active"));
    section.classList.add("active");
    syncDrawerActive(tabId);

    if (updateUrl) {
      activeVisualTopic = null;
      commitNavHistory({ tab: tabId, topic: null, panelOpen: false, panelTopic: null });
    }

    syncModelNavVisibility();
    syncModelFlowActive(tabId);
    updateContextBar(tabId);
    syncAtlasActive();
    syncMensFab();
    animateSectionEnter(section);

    if (scroll && navWrap) {
      const top = navWrap.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - (appBar?.offsetHeight || 0)), behavior: "smooth" });
      const subBtn = navSub?.querySelector(`button[data-tab="${tabId}"]`);
      subBtn?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }

    if (flash) {
      section.classList.remove("tab-flash");
      void section.offsetWidth;
      section.classList.add("tab-flash");
      window.setTimeout(() => section.classList.remove("tab-flash"), 1400);
    }

    if (toast) {
      const hub = HUBS[hubForTab(tabId)];
      const icon = hub?.icon ? `${hub.icon} ` : "";
      showToast(`${icon}${TAB_LABELS[tabId] || tabId}`, { type: "nav", duration: 2400 });
    }

    return true;
  }

  function syncDrawerActive(tabId) {
    document.querySelectorAll(".drawer-link").forEach((link) => {
      link.classList.toggle("active", tabId && link.dataset.tab === tabId);
    });
  }

  document.querySelectorAll(".nav-hub-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hubId = btn.dataset.hub;
      if (hubId === "start") goToStart({ flash: false });
      else goToHub(hubId, { flash: false, toast: true });
    });
  });

  document.getElementById("hero-start")?.addEventListener("click", () => {
    goToStart({ flash: false });
  });

  document.getElementById("scroll-to-mens")?.addEventListener("click", () => {
    document.getElementById("mens-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("mens-fab")?.addEventListener("click", () => {
    if (isTopicPageOpen()) closeTopicPage({ updateUrl: true });
    else if (panel.classList.contains("open")) closePanel();
    goToStart({ flash: false });
  });

  uxContext?.addEventListener("click", (e) => {
    if (e.target.closest(".ux-context-back, .ux-context-bron, .ux-context-deepen, .mens-zone, .illus-zone")) return;
    if (isTopicPageOpen()) return;
    goToStart({ flash: false });
  });

  function syncMensFab() {
    const fab = document.getElementById("mens-fab");
    if (!fab) return;
    const show = !isOnStart() || isTopicPageOpen();
    fab.hidden = !show;
    fab.setAttribute("aria-hidden", show ? "false" : "true");
  }

  document.getElementById("hero-verzoeking")?.addEventListener("click", () => {
    goToHub("innerlijk", { tab: "verzoeking" });
  });

  document.getElementById("hero-weg")?.addEventListener("click", () => {
    goToHub("weg", { tab: "weg" });
  });

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function resolveAnatomyCrossNav(topicId) {
    const homeTab = tabForTopic(topicId);
    if (!homeTab) return null;

    if (ANATOMY_NAV[topicId]) {
      const dest = ANATOMY_NAV[topicId];
      if (dest.tab !== homeTab) return dest;
    }

    for (const [part, dest] of Object.entries(ANATOMY_NAV)) {
      if (topicId === part) continue;
      if (topicId.endsWith(`-${part}`)) {
        if (dest.tab !== homeTab) return { tab: dest.tab, focus: dest.focus };
      }
    }
    return null;
  }

  function getVisualNav(topicId) {
    if (!topicId) return null;
    if (VISUAL_NAV[topicId]) return VISUAL_NAV[topicId];

    const cross = resolveAnatomyCrossNav(topicId);
    if (cross) {
      const destSection = document.getElementById(cross.tab);
      const specific = destSection?.querySelector(`[data-topic="${topicId}"]`);
      if (specific) return { tab: cross.tab, focus: `[data-topic="${topicId}"]` };
      return cross;
    }

    const tab = tabForTopic(topicId);
    if (!tab) return null;
    const section = document.getElementById(tab);
    if (section?.querySelector(`[data-topic="${topicId}"]`)) {
      return { tab, focus: `[data-topic="${topicId}"]` };
    }
    const focus = SCENE_FOCUS[tab] || `#${tab}`;
    return { tab, focus };
  }

  function highlightVisualTopic(topicId) {
    activeVisualTopic = topicId;
    const zone = window.MENS_DIAGRAM?.topicToZone(topicId);
    document.querySelectorAll(".illus-zone, .mens-zone").forEach((z) => {
      const zt = z.dataset.topic;
      const zz = window.MENS_DIAGRAM?.topicToZone(zt) || zt;
      z.classList.toggle("active-zone", zt === topicId || zz === zone);
    });
    document.querySelectorAll(".model-flow-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.navTopic === topicId);
    });
    syncMensHighlights(zone || topicId);
    updateContextBar(getActiveTabId(), topicId);
  }

  function scrollToFocus(nav, { smooth = true } = {}) {
    const section = document.getElementById(nav.tab);
    if (!section) return null;
    const selectors = String(nav.focus || SCENE_FOCUS[nav.tab] || "").split(",").map((s) => s.trim()).filter(Boolean);
    let focusEl = null;
    for (const sel of selectors) {
      focusEl = section.querySelector(sel) || document.querySelector(sel);
      if (focusEl) break;
    }
    if (!focusEl) focusEl = section.querySelector(".section-head") || section;
    const offset = (appBar?.offsetHeight || 0) + (navWrap?.offsetHeight || 0) + 12;
    const top = focusEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? "smooth" : "auto" });
    focusEl.classList.remove("nav-flash");
    void focusEl.offsetWidth;
    focusEl.classList.add("nav-flash");
    window.setTimeout(() => focusEl.classList.remove("nav-flash"), 1600);
    return focusEl;
  }

  function navigateVisual(topicId, sourceEl, { updateUrl = true } = {}) {
    const nav = getVisualNav(topicId);
    if (!nav) return false;

    if (panel.classList.contains("open")) closePanel();
    if (isTopicPageOpen()) closeTopicPage({ updateUrl: false });
    const sameTab = getActiveTabId() === nav.tab && !isOnStart();
    if (nav.tab === "structuur") goToHub("fundament", { tab: "structuur", flash: false, updateUrl: false });
    else if (isOnStart() || getActiveTabId() !== nav.tab) {
      goToTab(nav.tab, { scroll: false, flash: false, updateUrl: false });
    }
    if (updateUrl) {
      window.requestAnimationFrame(() => {
        commitNavHistory({
          tab: nav.tab,
          topic: topicId,
          scrollY: window.scrollY,
          panelOpen: false,
          panelTopic: null,
        });
      });
    }
    window.requestAnimationFrame(() => {
      scrollToFocus(nav, { smooth: sameTab });
      highlightVisualTopic(topicId);
      const panelTopic = resolvePanelTopic(topicId);
      const topic = window.HT_TOPICS[panelTopic];
      if (topic?.title) {
        showToast("Nogmaals klikken of «Verdiep» voor uitleg en artikelen", { type: "nav", duration: 2800 });
      }
      if (sourceEl) {
        if (activeEl) activeEl.classList.remove("active-topic");
        activeEl = sourceEl;
        sourceEl.classList.add("active-topic");
      }
    });
    return true;
  }

  function wantsCitePanel(e) {
    return !!(e?.shiftKey || e?.altKey || e?.target?.closest?.(".cite-btn"));
  }

  function isRepeatVisualClick(topicId) {
    if (!activeVisualTopic) return false;
    if (activeVisualTopic === topicId) return true;
    const a = resolvePanelTopic(activeVisualTopic);
    const b = resolvePanelTopic(topicId);
    return !!(a && b && a === b);
  }

  function handleTopicClick(topicId, el, e) {
    const panelTopic = resolvePanelTopic(topicId);
    const hasTopicPage = !!(panelTopic && window.HT_TOPICS[panelTopic]);
    const hasVisual = !!getVisualNav(topicId);

    if (hasTopicPage) markVisited(panelTopic);

    if (hasTopicPage && wantsCitePanel(e)) {
      if (e?.type === "click" && e.clientX && el) ripple(e, el);
      openTopicPage(topicId, el, e, { scrollTo: "bron" });
      return;
    }

    if (hasTopicPage && isRepeatVisualClick(topicId) && el?.classList?.contains("active-topic")) {
      if (e?.type === "click" && e.clientX && el) ripple(e, el);
      openTopicPage(topicId, el, e);
      return;
    }

    if (hasVisual) {
      if (e?.type === "click" && e.clientX && el) ripple(e, el);
      navigateVisual(topicId, el);
      return;
    }

    if (hasTopicPage) {
      if (e?.type === "click" && e.clientX && el) ripple(e, el);
      openTopicPage(topicId, el, e);
    }
  }

  function openContextDeepen() {
    const topicId = uxContextDeepen?.dataset.topic || activeVisualTopic || getContextCiteTopic();
    if (!topicId) return;
    openTopicPage(topicId, activeEl, null);
  }

  async function resolveTopicPageQuoteLinks(root, quotes) {
    if (!window.HT_LINKS || !root) return;
    const links = root.querySelectorAll(".tp-quote-link[data-source], .quote-link[data-source]");
    await Promise.all(
      [...links].map(async (a, i) => {
        const url = await window.HT_LINKS.lookupArticle(a.dataset.source, quotes[i]?.date);
        a.href = url;
        a.classList.remove("quote-link-loading");
        a.textContent = "Lees op Verborgen Schatten →";
      })
    );
  }

  function htArticleDataAttrs(article) {
    return `data-ht-title="${escapeHtml(article.title)}" data-ht-date="${escapeHtml(article.date || "")}" data-ht-url="${escapeHtml(article.url || "")}" data-ht-author="${escapeHtml(article.author || "")}"`;
  }

  function renderHtArticleCards(articles) {
    return articles
      .map((a) => {
        const meta = [a.author, a.dateLabel, a.publication].filter(Boolean).join(" · ");
        const badge = a.kind === "cite"
          ? `<span class="tp-ht-badge tp-ht-badge-cite">Bij dit citaat</span>`
          : a.isJos
            ? `<span class="tp-ht-badge">J.O. Smith / HT</span>`
            : "";
        const citeNote = a.citeText
          ? `<p class="tp-ht-cite-note">"${escapeHtml(a.citeText)}${a.citeText.length >= 120 ? "…" : ""}"</p>`
          : "";
        const excerpt = a.excerpt
          ? `<p class="tp-ht-card-excerpt">${escapeHtml(a.excerpt)}</p>`
          : "";
        return `<article class="tp-ht-card">
          <button type="button" class="tp-ht-card-link ht-article-open" ${htArticleDataAttrs(a)}>
            ${badge}
            <h3 class="tp-ht-card-title">${escapeHtml(a.title)}</h3>
            <p class="tp-ht-card-meta">${escapeHtml(meta)}</p>
            ${citeNote}
            ${excerpt}
            <span class="tp-ht-card-action">Lees volledig artikel →</span>
          </button>
        </article>`;
      })
      .join("");
  }

  function getTopicDisplaySteps(topic) {
    const steps = window.TP_PAGE?.summarySteps?.(topic?.summary) || [];
    if (steps.length) return steps;
    if (topic?.summary) return [topic.summary];
    return [];
  }

  function renderStepArticleExplanations(explanations) {
    return explanations
      .filter((e) => e.article)
      .map(({ step, article, stepIndex }) => {
        const meta = [article.author, article.dateLabel].filter(Boolean).join(" · ");
        const badge = article.kind === "cite"
          ? `<span class="tp-step-article-badge">Bij citaat</span>`
          : article.isJos
            ? `<span class="tp-step-article-badge">J.O. Smith / HT</span>`
            : `<span class="tp-step-article-badge">Artikel</span>`;
        return `<li class="tp-step-article-item" style="--step-i:${stepIndex}">
          <div class="tp-step-article-step">
            <span class="tp-step-bullet">${stepIndex + 1}</span>
            <p>${escapeHtml(step)}</p>
          </div>
          <button type="button" class="tp-step-article-card ht-article-open" ${htArticleDataAttrs(article)}>
            ${badge}
            <strong class="tp-step-article-title">${escapeHtml(article.title)}</strong>
            <p class="tp-step-article-excerpt">${escapeHtml(article.excerpt || "")}</p>
            ${meta ? `<span class="tp-step-article-meta">${escapeHtml(meta)}</span>` : ""}
            <span class="tp-step-article-action">Lees volledig artikel →</span>
          </button>
        </li>`;
      })
      .join("");
  }

  async function loadStepArticleExplanations(topic, topicId, root) {
    const section = root?.querySelector("#tp-step-articles-section");
    const loading = root?.querySelector("#tp-step-articles-loading");
    const list = root?.querySelector("#tp-step-articles");
    if (!section || !loading || !list || !window.HT_LINKS?.findStepExplanations) return;

    const steps = getTopicDisplaySteps(topic);
    if (steps.length < 2) {
      section.hidden = true;
      return;
    }

    try {
      const explanations = await window.HT_LINKS.findStepExplanations(steps, topic, topic.quotes, topicId);
      const html = renderStepArticleExplanations(explanations);
      if (html) {
        list.innerHTML = html;
        loading.hidden = true;
        list.hidden = false;
      } else {
        loading.textContent = "Geen passende artikelen per onderdeel — zie de artikelen hieronder.";
      }
    } catch {
      loading.textContent = "Kon onderdelen niet koppelen aan artikelen.";
    }
  }

  async function loadHtArticlesForTopic(topic, quotes, topicId, root) {
    const section = root?.querySelector("#tp-ht-section");
    const loading = root?.querySelector("#tp-ht-loading");
    const list = root?.querySelector("#tp-ht-articles");
    const moreLink = root?.querySelector("#tp-ht-more");
    if (!section || !loading || !list || !window.HT_LINKS) return;

    const query = window.HT_LINKS.buildQueryForTopic(topic, topicId);
    if (moreLink) {
      moreLink.href = window.HT_LINKS.buildSearchUrl(query);
    }

    const instant = window.HT_LINKS.articlesFromQuotes?.(quotes) || [];
    if (instant.length) {
      list.innerHTML = renderHtArticleCards(instant);
      loading.hidden = true;
      list.hidden = false;
      instant.forEach((a, i) => {
        const quote = quotes[i];
        if (!quote?.source) return;
        window.HT_LINKS.lookupArticle(quote.source, quote.date).then((url) => {
          list.querySelectorAll(".ht-article-open")[i]?.setAttribute("data-ht-url", url);
        }).catch(() => {});
      });
    }

    try {
      const size = window.HT_LINKS.isGranularTopic?.(topicId) ? 6 : 4;
      const articles = await window.HT_LINKS.findRelatedArticles(topic, quotes, topicId, { size });
      if (articles.length) {
        list.innerHTML = renderHtArticleCards(articles);
        loading.hidden = true;
        list.hidden = false;
      } else if (!instant.length) {
        loading.textContent = "Geen artikelen gevonden — gebruik ‘Meer zoeken’ voor Verborgen Schatten.";
      }
    } catch {
      if (!instant.length) {
        loading.textContent = "Kon artikelen niet laden — zoek via de link hierboven.";
      } else {
        loading.hidden = true;
      }
    }
  }

  function wireTopicPageActions(root, rawTopicId, panelTopic) {
    if (!root) return;

    root.querySelector(".tp-back")?.addEventListener("click", () => {
      if (canGoBack()) goBack();
      else closeTopicPage();
    });

    root.querySelectorAll(".tp-walk-home").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeTopicPage({ updateUrl: true });
        goToStart({ flash: false });
        window.requestAnimationFrame(() => {
          document.getElementById("mens-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    });

    root.querySelectorAll(".tp-walk-prev, .tp-walk-next, .tp-related-chip").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        if (btn.dataset.topic) handleTopicClick(btn.dataset.topic, btn, ev);
      });
    });

    root.querySelector(".tp-context")?.addEventListener("click", () => {
      const id = rawTopicId || panelTopic;
      closeTopicPage({ updateUrl: false });
      navigateVisual(id, null);
    });

    root.querySelector(".tp-share")?.addEventListener("click", async (e) => {
      const url = e.currentTarget.dataset.url;
      try {
        await navigator.clipboard.writeText(url);
        e.currentTarget.textContent = "Link gekopieerd!";
        setTimeout(() => { e.currentTarget.textContent = "Link kopiëren"; }, 2000);
      } catch {
        e.currentTarget.textContent = url;
      }
    });

    root.querySelectorAll("[data-topic]").forEach((btn) => {
      if (
        btn.classList.contains("tp-context") ||
        btn.classList.contains("tp-walk-prev") ||
        btn.classList.contains("tp-walk-next") ||
        btn.classList.contains("tp-related-chip")
      ) return;
      btn.addEventListener("click", (ev) => {
        handleTopicClick(btn.dataset.topic, btn, ev);
      });
    });
  }

  function openTopicPage(rawTopicId, sourceEl, e, { updateUrl = true, scrollTo = null } = {}) {
    const panelTopic = resolvePanelTopic(rawTopicId);
    const topic = window.HT_TOPICS[panelTopic];
    if (!topic || !window.renderTopicPage) {
      if (getVisualNav(rawTopicId)) navigateVisual(rawTopicId, sourceEl, { updateUrl });
      return;
    }

    closePanel();
    closeBronRail();

    currentTopicId = panelTopic;
    topicPageRawId = rawTopicId || panelTopic;
    markVisited(panelTopic);

    if (activeEl) activeEl.classList.remove("active-topic");
    activeEl = sourceEl;
    if (sourceEl) sourceEl.classList.add("active-topic");

    const tab = tabForTopic(rawTopicId) || tabForTopic(panelTopic);
    const hubId = tab ? hubForTab(tab) : null;
    const related = RELATED_TOPICS[panelTopic] || RELATED_TOPICS[rawTopicId] || [];

    topicPageInner.innerHTML = window.renderTopicPage({
      panelTopic,
      rawTopicId: rawTopicId || panelTopic,
      topic,
      tab,
      tabLabel: tab && TAB_LABELS[tab],
      hubLabel: hubId && HUBS[hubId]?.label,
      hubTheme: hubId && HUB_THEME[hubId],
      tabIcon: tab && TAB_ICONS[tab],
      related,
      escapeHtml,
    });

    wireTopicPageActions(topicPageInner, rawTopicId || panelTopic, panelTopic);
    resolveTopicPageQuoteLinks(topicPageInner, topic.quotes);
    loadStepArticleExplanations(topic, panelTopic, topicPageInner);
    loadHtArticlesForTopic(topic, topic.quotes, panelTopic, topicPageInner);

    topicPage.hidden = false;
    topicPage.classList.add("open");
    topicPage.setAttribute("aria-hidden", "false");
    document.body.classList.add("topic-page-open");
    topicPage.querySelector(".topic-page-scroll")?.scrollTo(0, 0);

    updateContextBar(tab || getActiveTabId(), rawTopicId || panelTopic);

    if (updateUrl) {
      commitNavHistory({
        tab: tab || (isOnStart() ? "start" : getActiveTabId()),
        topic: rawTopicId || panelTopic,
        panelOpen: true,
        panelTopic,
      });
    }

    syncMensFab();
    syncModelNavVisibility();

    if (scrollTo === "bron") {
      window.requestAnimationFrame(() => {
        topicPageInner.querySelector("#tp-bronnen")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    topicPageInner.querySelector(".tp-back")?.focus();
  }

  function closeTopicPage({ updateUrl = true } = {}) {
    if (!topicPage) return;
    topicPage.classList.remove("open");
    topicPage.setAttribute("aria-hidden", "true");
    document.body.classList.remove("topic-page-open");
    window.setTimeout(() => {
      if (topicPage && !topicPage.classList.contains("open")) topicPage.hidden = true;
    }, 300);
    if (activeEl) {
      activeEl.classList.remove("active-topic");
      activeEl = null;
    }
    currentTopicId = null;
    topicPageRawId = null;
    if (updateUrl) commitNavHistory({ panelOpen: false, panelTopic: null }, { replace: true });
    syncMensFab();
    syncModelNavVisibility();
  }

  async function resolveQuoteLinks(quotes) {
    if (!window.HT_LINKS) return;
    const links = panelBody.querySelectorAll(".quote-link[data-source]");
    await Promise.all(
      [...links].map(async (a, i) => {
        const url = await window.HT_LINKS.lookupArticle(a.dataset.source, quotes[i]?.date);
        a.href = url;
        a.classList.remove("quote-link-loading");
        a.textContent = "Lees op Verborgen Schatten →";
      })
    );
  }

  function openPanel(topicId, sourceEl, rawTopicId, { updateUrl = true } = {}) {
    const topic = window.HT_TOPICS[topicId];
    if (!topic) return;

    currentTopicId = topicId;
    const sourceTopicId = rawTopicId || topicId;
    markVisited(topicId);

    if (activeEl) activeEl.classList.remove("active-topic");
    activeEl = sourceEl;
    if (sourceEl) sourceEl.classList.add("active-topic");

    document.querySelectorAll("#structuur-mens-viz .mens-zone").forEach((z) => {
      z.classList.toggle(
        "lit",
        z.dataset.topic === sourceTopicId || resolvePanelTopic(z.dataset.topic) === topicId
      );
    });
    document.querySelectorAll(".illus-zone").forEach((z) => {
      z.classList.toggle(
        "lit",
        z.dataset.topic === sourceTopicId || resolvePanelTopic(z.dataset.topic) === topicId
      );
    });

    panelTitle.textContent = topic.title;
    panelDot.style.background = topic.color || "#818cf8";
    panelDot.style.color = topic.color || "#818cf8";

    let html = `<p class="panel-summary">${escapeHtml(topic.summary)}</p>`;
    if (topic.refs?.length) {
      html += `<div class="panel-refs">${topic.refs.map((r) => `<span>${escapeHtml(r)}</span>`).join("")}</div>`;
    }
    topic.quotes.forEach((q) => {
      html += `<div class="quote-card" style="border-color:${topic.color || "#818cf8"}">
        <p>"${escapeHtml(q.text)}"</p>
        <div class="quote-meta">
          <strong>${escapeHtml(q.source)}</strong><br />
          ${escapeHtml(q.author)}${q.date ? ` · ${escapeHtml(q.date)}` : ""}
        </div>
        <a class="quote-link quote-link-loading" href="#" data-source="${escapeHtml(q.source)}" target="_blank" rel="noopener">Zoeken op Verborgen Schatten…</a>
      </div>`;
    });

    const tab = tabForTopic(topicId);
    if (tab && TAB_LABELS[tab]) {
      html += `<button type="button" class="panel-tab-link" data-goto-tab="${tab}">Open ${TAB_LABELS[tab]} →</button>`;
    }

    const related = RELATED_TOPICS[topicId] || RELATED_TOPICS[rawTopicId || topicId];
    if (related?.length) {
      html += `<div class="panel-related"><span class="panel-related-label">Zie ook</span><div class="panel-related-chips">`;
      related.forEach((relId) => {
        const relTab = tabForTopic(relId);
        const relTopic = window.HT_TOPICS[relId];
        const label = relTopic?.title || (relTab && TAB_LABELS[relTab]) || relId;
        if (relTopic) {
          html += `<button type="button" class="panel-related-chip" data-goto-topic="${escapeHtml(relId)}">${escapeHtml(label)}</button>`;
        } else if (relTab) {
          html += `<button type="button" class="panel-related-chip" data-goto-tab="${escapeHtml(relTab)}">${escapeHtml(TAB_LABELS[relTab])}</button>`;
        }
      });
      html += `</div></div>`;
    }

    const shareUrl = `${location.origin}${location.pathname}#/topic/${encodeURIComponent(rawTopicId || topicId)}`;
    html += `<button type="button" class="panel-share" id="panel-share" data-url="${escapeHtml(shareUrl)}">Link kopiëren</button>`;

    panelBody.innerHTML = html;
    panelBody.querySelector(".panel-tab-link")?.addEventListener("click", () => {
      const topic = rawTopicId || topicId;
      closePanel();
      if (getVisualNav(topic)) navigateVisual(topic, null);
      else goToTab(tab);
    });
    panelBody.querySelectorAll(".panel-related-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        closePanel();
        if (chip.dataset.gotoTopic) navigateToTopic(chip.dataset.gotoTopic, null, null);
        else if (chip.dataset.gotoTab) goToTab(chip.dataset.gotoTab);
      });
    });
    panelBody.querySelector("#panel-share")?.addEventListener("click", async (e) => {
      const url = e.currentTarget.dataset.url;
      try {
        await navigator.clipboard.writeText(url);
        e.currentTarget.textContent = "Link gekopieerd!";
        setTimeout(() => { e.currentTarget.textContent = "Link kopiëren"; }, 2000);
      } catch {
        e.currentTarget.textContent = url;
      }
    });
    resolveQuoteLinks(topic.quotes);

    if (updateUrl) {
      const destTab = tabForTopic(rawTopicId || topicId) || (isOnStart() ? null : getActiveTabId());
      commitNavHistory({
        tab: destTab || "start",
        topic: rawTopicId || topicId,
        panelOpen: true,
        panelTopic: topicId,
      });
    }

    overlay.classList.add("open");
    panel.classList.add("open");
    document.body.classList.add("panel-open");
    panelBody.classList.remove("panel-content-enter");
    void panelBody.offsetWidth;
    panelBody.classList.add("panel-content-enter");
    showToast(`📖 ${topic.title}`, { type: "cite", duration: 2600 });
    panelClose.focus();
  }

  function navigateToTopic(rawTopicId, sourceEl, e, opts = {}) {
    if (opts.scrollTo || wantsCitePanel(e)) {
      openTopicPage(rawTopicId, sourceEl, e, opts);
      return;
    }
    handleTopicClick(rawTopicId, sourceEl, e || {});
  }

  function closePanel() {
    overlay.classList.remove("open");
    panel.classList.remove("open");
    document.body.classList.remove("panel-open");
    if (activeEl) {
      activeEl.classList.remove("active-topic");
      activeEl = null;
    }
    document.querySelectorAll("#structuur-mens-viz .mens-zone").forEach((z) => z.classList.remove("lit"));
    document.querySelectorAll(".illus-zone").forEach((z) => z.classList.remove("lit"));
    commitNavHistory({ panelOpen: false, panelTopic: null }, { replace: true });
  }

  function wireTopicElement(el, topicId) {
    if (!el || !topicId || el.dataset.topic) return;
    el.dataset.topic = topicId;
    el.classList.add("tap", "wire-tap");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (!el.hasAttribute("role")) el.setAttribute("role", "button");
  }

  function findTopicAfter(el) {
    let node = el.nextElementSibling;
    while (node) {
      if (node.dataset?.topic) return node.dataset.topic;
      const inner = node.querySelector?.("[data-topic]");
      if (inner) return inner.dataset.topic;
      node = node.nextElementSibling;
    }
    return null;
  }

  function wireInheritedTopic(el, topicId) {
    if (!el || !topicId || el.dataset.topic) return;
    wireTopicElement(el, topicId);
  }

  function wireFromHost(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.topic || el.classList.contains("wire-tap")) return;
      const host = el.closest("[data-topic]");
      if (host?.dataset.topic) wireInheritedTopic(el, host.dataset.topic);
    });
  }

  function wireFlowArrows() {
    document.querySelectorAll(".ziel-flow-arrow, .dw-jarrow").forEach((arrow) => {
      if (arrow.dataset.topic) return;
      let next = arrow.nextElementSibling;
      while (next && !next.dataset?.topic) next = next.nextElementSibling;
      if (next?.dataset.topic) wireInheritedTopic(arrow, next.dataset.topic);
    });
  }

  function wireConnectors() {
    document.querySelectorAll(".connector").forEach((conn) => {
      if (conn.dataset.topic) return;
      let sib = conn.nextElementSibling;
      while (sib) {
        const topic = sib.dataset?.topic || sib.querySelector?.("[data-topic]")?.dataset.topic;
        if (topic) {
          wireInheritedTopic(conn, topic);
          break;
        }
        sib = sib.nextElementSibling;
      }
    });
  }

  function wireR7Zones() {
    document.querySelectorAll(".r7-zone").forEach((zone) => {
      if (zone.dataset.topic) return;
      const node = zone.querySelector("[data-topic]");
      if (node) wireInheritedTopic(zone, node.dataset.topic);
      else if (zone.classList.contains("r7-zone-ziel")) wireInheritedTopic(zone, "ziel");
      else if (zone.classList.contains("r7-zone-lichaam")) wireInheritedTopic(zone, "lichaam");
    });
    document.querySelectorAll(".r7-law").forEach((law) => {
      if (law.dataset.topic) return;
      const parent = law.closest("[data-topic]");
      wireInheritedTopic(law, parent?.dataset.topic || "r7-twee-wetten");
    });
  }

  function wireWhereKeywords() {
    document.querySelectorAll('[class*="-where"]').forEach((el) => {
      if (el.dataset.topic) return;
      const lower = el.textContent.toLowerCase();
      for (const [kw, topic] of WHERE_KEYWORDS) {
        if (lower.includes(kw)) {
          wireInheritedTopic(el, topic);
          return;
        }
      }
      const host = el.closest(".tap[data-topic]");
      if (host) wireInheritedTopic(el, host.dataset.topic);
    });
  }

  function wireKeywordTraits() {
    const rules = [
      { re: /woord/i, topic: "woord" },
      { re: /geest/i, topic: "geest" },
      { re: /oor|hoort/i, topic: "geloof-hoort" },
      { re: /oog|zien|ogen/i, topic: "geloof-ziet" },
      { re: /onderzoek/i, topic: "geloof-onderzoekt" },
      { re: /discipel/i, topic: "dw-discipel" },
      { re: /heilig/i, topic: "dw-heiligmaking" },
      { re: /overwin/i, topic: "dw-overwinning" },
      { re: /licht/i, topic: "gw-licht" },
    ];
    document.querySelectorAll(
      '[class*="-hub-traits"] span:not([data-topic]), [class*="-light-tags"] span:not([data-topic]), [class*="-god-arrows"] span:not([data-topic]), [class*="-hub-ref"], [class*="-hub-badge"], [class*="-traits"] span:not([data-topic])'
    ).forEach((el) => {
      if (el.dataset.topic || el.classList.contains("wire-tap")) return;
      const text = el.textContent;
      for (const { re, topic } of rules) {
        if (re.test(text)) {
          wireInheritedTopic(el, topic);
          return;
        }
      }
      const host = el.closest("[data-topic]");
      if (host) wireInheritedTopic(el, host.dataset.topic);
    });
  }

  function wireSceneContainers() {
    const selectors = [
      ".vz-step-card", ".vz-step-marker", ".vz-fork",
      ".vs-outcomes", ".gw-outcomes", ".gv-outcomes", ".tg-outcomes", ".gl-outcomes", ".om-outcomes", ".kr-outcomes", ".dw-outcomes",
      ".vs-side", ".gw-side", ".gv-side", ".tg-side", ".gl-side", ".om-side",
      ".bz-col", ".bz-center",
      ".process-card", ".fantasie-callout", ".chips",
      ".diagram-row", ".stack", ".body-rows",
      ".layer .desc", ".layer .ref", ".layer h3", ".layer-badge",
      ".ziel-flow-label", ".ziel-box h4", ".ziel-box p",
      ".outcome h4", ".outcome p", ".outcome li", ".outcome li strong",
      ".law strong", ".law p", ".body-row strong", ".body-row p", ".body-row .status",
      ".human-viz-title",
      ".human-viz-tab", ".scene-divider-title",
      "[class*='-arrow-col']", "[class*='-flow-down']", "[class*='-flow-label']",
      "[class*='-callout']", "[class*='-span']",
      ".dw-hub-row", ".dw-triad", ".dw-side",
      ".hm-diagram", ".hm-placed-grid", ".hm-earth-bridge",
      ".gst-fork", ".gst-ladder", ".zg-grid",
    ];
    selectors.forEach((sel) => wireFromHost(sel));
    wireFlowArrows();
    wireConnectors();
    wireR7Zones();
    wireWhereKeywords();
    wireKeywordTraits();
  }

  function wireAllClickables() {
    const connectorTopics = ["geest", "ziel", "lichaam"];
    document.querySelectorAll(".connector-label").forEach((el, i) => {
      wireTopicElement(el, connectorTopics[i]);
    });

    document.querySelectorAll(".layer-badge").forEach((badge) => {
      const layer = badge.closest(".layer[data-topic]");
      if (layer) wireTopicElement(badge, layer.dataset.topic);
    });

    document.querySelectorAll(".scene-divider").forEach((div) => {
      const topic = findTopicAfter(div);
      if (topic) wireTopicElement(div, topic);
    });

    document.querySelectorAll(".vz-fork-label").forEach((el) => wireTopicElement(el, "vz-gezindheid"));
    document.querySelectorAll(".gst-merge-label").forEach((el) => wireTopicElement(el, "geloof-hoort"));
    document.querySelectorAll(".gst-pierce-label").forEach((el) => wireTopicElement(el, "woord"));
    document.querySelectorAll(".gl-flow-label").forEach((el) => wireTopicElement(el, "geloof-verlichte-ogen"));

    document.querySelectorAll(".gl-god-arrows span").forEach((span, i) => {
      wireTopicElement(span, i === 0 ? "woord" : "geloof-geest");
    });

    document.querySelectorAll(".vs-senses span").forEach((span) => wireTopicElement(span, "zintuigen"));
    document.querySelectorAll(".gw-light-tags span").forEach((span) => wireTopicElement(span, "gw-licht"));

    document.querySelectorAll(".r7-zone-badge").forEach((badge) => {
      const zone = badge.closest(".r7-zone");
      const node = zone?.querySelector("[data-topic]");
      if (node) wireTopicElement(badge, node.dataset.topic);
    });

    document.querySelectorAll(".process-card").forEach((card) => {
      const first = card.querySelector("[data-topic]");
      if (first) wireTopicElement(card, first.dataset.topic);
    });

    const journeyHubs = ["fundament", "innerlijk", "geloof", "weg"];
    const journeyTabs = ["structuur", "verzoeking", "woord", "weg"];
    document.querySelectorAll(".journey-step").forEach((el, i) => {
      el.classList.add("tap", "wire-tap");
      el.dataset.gotoHub = journeyHubs[i];
      el.dataset.gotoTab = journeyTabs[i];
      el.removeAttribute("aria-hidden");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
    });

    document.querySelectorAll(".hero-pill").forEach((el) => {
      if (el.dataset.gotoTab || el.dataset.topic || el.dataset.action) return;
      const text = el.textContent.trim();
      if (/Hebr/i.test(text)) wireTopicElement(el, "woord");
      else if (/Rom\.\s*6/i.test(text)) wireTopicElement(el, "rom7");
      else if (/190\+/i.test(text)) {
        el.classList.add("tap", "wire-tap");
        el.dataset.action = "search";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
      } else if (/Ctrl/i.test(text)) {
        el.classList.add("tap", "wire-tap");
        el.dataset.action = "search";
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
      }
    });

    document.querySelectorAll("section [class*='-where'], section [class*='-label']:not(.model-flow-label):not(.scene-divider-eyebrow)").forEach((el) => {
      if (el.dataset.topic || el.closest("[data-topic]") === el) return;
      const host = el.closest("[data-topic]");
      if (host) wireTopicElement(el, host.dataset.topic);
    });

    wireSceneContainers();
    wireStructuurExtras();
  }

  function wireStructuurExtras() {
    const structuur = document.getElementById("structuur");
    if (!structuur) return;

    structuur.querySelectorAll(".layer > h3, .layer > .desc, .layer > .ref").forEach((el) => {
      if (el.dataset.topic) return;
      const layer = el.closest(".layer[data-topic]");
      if (layer) wireInheritedTopic(el, layer.dataset.topic);
    });

    structuur.querySelectorAll(".connector-line").forEach((line) => {
      if (line.dataset.topic) return;
      const conn = line.closest(".connector");
      if (conn?.dataset.topic) wireInheritedTopic(line, conn.dataset.topic);
    });

    structuur.querySelectorAll(".ziel-grid, .ziel-flow, .body-rows, .outcomes, .laws").forEach((block) => {
      if (block.dataset.topic) return;
      const host = block.closest("[data-topic]") || block.querySelector("[data-topic]");
      if (host?.dataset.topic) wireInheritedTopic(block, host.dataset.topic);
    });

    initStructuurViz();
  }

  function setupTopicDelegation() {
    const root = document.getElementById("main-content");
    if (!root || root.dataset.topicDelegated) return;
    root.dataset.topicDelegated = "1";

    root.addEventListener("click", (e) => {
      if (e.target.closest(".cite-btn")) return;

      const actionEl = e.target.closest("[data-action='search']");
      if (actionEl) {
        e.preventDefault();
        openSearch();
        return;
      }

      const topicEl = e.target.closest("[data-topic]");
      if (topicEl) {
        handleTopicClick(topicEl.dataset.topic, topicEl, e);
        return;
      }

      const hubEl = e.target.closest("[data-goto-hub]");
      if (hubEl) {
        e.preventDefault();
        if (panel.classList.contains("open")) closePanel();
        goToHub(hubEl.dataset.gotoHub, { tab: hubEl.dataset.gotoTab });
      }
    });

    root.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const topicEl = e.target.closest("[data-topic], [data-action='search']");
      if (!topicEl) return;
      e.preventDefault();
      topicEl.click();
    });
  }

  function ripple(e, el) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const r = document.createElement("span");
    r.className = "ripple";
    r.style.width = r.style.height = size + "px";
    r.style.left = (e.clientX - rect.left - size / 2) + "px";
    r.style.top = (e.clientY - rect.top - size / 2) + "px";
    el.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }

  initStructuurViz();

  function initMensHome() {
    if (!window.MENS_DIAGRAM) return;
    if (mensHomeDiagram) {
      window.MENS_DIAGRAM.mountHome(mensHomeDiagram);
      mensHomeDiagram.querySelectorAll(".mens-zone, .illus-zone").forEach((zone) => {
        zone.classList.add("tap");
        zone.setAttribute("tabindex", "0");
        zone.setAttribute("role", "button");
        const meta =
          window.MENS_DIAGRAM.zoneMeta(zone.dataset.topic) ||
          window.MENS_DIAGRAM.zoneMeta(window.MENS_DIAGRAM.topicToZone(zone.dataset.topic));
        if (meta) zone.setAttribute("title", `${meta.label} — ${meta.sub}`);
        zone.addEventListener("mouseenter", () => {
          const z = window.MENS_DIAGRAM.topicToZone(zone.dataset.topic) || zone.dataset.topic;
          if (mensZoneHint) {
            mensZoneHint.innerHTML = window.MENS_DIAGRAM.hintHtml(z);
          }
          syncMensHighlights(z);
        });
        zone.addEventListener("focus", () => {
          const z = window.MENS_DIAGRAM.topicToZone(zone.dataset.topic) || zone.dataset.topic;
          if (mensZoneHint) {
            mensZoneHint.innerHTML = window.MENS_DIAGRAM.hintHtml(z);
          }
        });
      });
      mensHomeDiagram.addEventListener("mouseleave", () => {
        if (mensZoneHint) mensZoneHint.innerHTML = window.MENS_DIAGRAM.hintHtml(null);
        syncMensHighlights(null);
      });
    }

    uxContextMens?.addEventListener("click", (e) => {
      const zone = e.target.closest(".mens-zone[data-topic], .illus-zone[data-topic]");
      if (!zone) return;
      e.preventDefault();
      e.stopPropagation();
      openTopicPage(zone.dataset.topic, zone, e);
    });

    document.querySelectorAll(".mens-situatie-chip[data-goto-topic]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (panel.classList.contains("open")) closePanel();
        handleTopicClick(el.dataset.gotoTopic, el, e);
      });
    });
  }

  function wireIllusZones() {
    document.querySelectorAll(".illus-zone").forEach((zone) => {
      if (zone.classList.contains("tap")) return;
      zone.classList.add("tap");
      zone.setAttribute("tabindex", "0");
      zone.setAttribute("role", "button");
      const nav = getVisualNav(zone.dataset.topic);
      if (nav && TAB_LABELS[nav.tab]) {
        zone.setAttribute("title", `Ga naar ${TAB_LABELS[nav.tab]} · Alt+klik = citaten`);
      }
    });
  }

  wireIllusZones();

  document.querySelectorAll("[data-goto-tab]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (panel.classList.contains("open")) closePanel();
      if (isTopicPageOpen()) closeTopicPage({ updateUrl: false });
      if (searchOverlay?.classList.contains("open")) closeSearch();
      if (el.dataset.gotoTopic) {
        openTopicPage(el.dataset.gotoTopic, null, null);
      } else goToTab(el.dataset.gotoTab);
    });
  });

  document.querySelectorAll("[data-goto-hub]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (panel.classList.contains("open")) closePanel();
      if (searchOverlay?.classList.contains("open")) closeSearch();
      goToHub(el.dataset.gotoHub, { tab: el.dataset.gotoTab });
    });
  });

  function injectSectionChrome() {
    TAB_ORDER.forEach((tabId) => {
      const section = document.getElementById(tabId);
      if (!section || section.querySelector(".section-breadcrumb")) return;

      const hubId = hubForTab(tabId);
      const hub = HUBS[hubId];
      const head = section.querySelector(".section-head");
      if (!head) return;

      const crumb = document.createElement("nav");
      crumb.className = "section-breadcrumb";
      crumb.setAttribute("aria-label", "Locatie");
      crumb.innerHTML = `
        <button type="button" class="crumb-link" data-goto-hub="start">De mens</button>
        <span class="crumb-sep" aria-hidden="true">›</span>
        <button type="button" class="crumb-link" data-goto-hub="${hubId}">${hub?.label || hubId}</button>
        <span class="crumb-sep" aria-hidden="true">›</span>
        <span class="crumb-current">${TAB_LABELS[tabId] || tabId}</span>`;
      head.prepend(crumb);

      const idx = TAB_ORDER.indexOf(tabId);
      const prevTab = idx > 0 ? TAB_ORDER[idx - 1] : null;
      const nextTab = idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null;
      const cross = TAB_CROSS_LINKS[tabId] || [];

      const nav = document.createElement("nav");
      nav.className = "section-nav";
      nav.setAttribute("aria-label", "Navigatie");
      nav.innerHTML = buildSectionXrefHtml(tabId, prevTab, nextTab, cross);

      section.appendChild(nav);
    });

    wireSectionNavButtons();
  }

  function wireSectionNavButtons() {
    document.querySelectorAll(".section-breadcrumb .crumb-link, .section-nav button, .section-cross-chip, .section-xref-spoke").forEach((btn) => {
      if (btn.dataset.xrefWired) return;
      btn.dataset.xrefWired = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (btn.dataset.gotoHub) goToHub(btn.dataset.gotoHub, { tab: btn.dataset.gotoTab });
        else if (btn.dataset.gotoTab) goToTab(btn.dataset.gotoTab);
      });
    });
  }

  function upgradeSectionXrefVisual() {
    TAB_ORDER.forEach((tabId) => {
      const section = document.getElementById(tabId);
      if (!section) return;
      const nav = section.querySelector(".section-nav");
      if (!nav || nav.querySelector(".section-xref-visual")) return;

      const idx = TAB_ORDER.indexOf(tabId);
      const prevTab = idx > 0 ? TAB_ORDER[idx - 1] : null;
      const nextTab = idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null;
      const cross = TAB_CROSS_LINKS[tabId] || [];
      nav.innerHTML = buildSectionXrefHtml(tabId, prevTab, nextTab, cross);
    });
    wireSectionNavButtons();
  }

  const CITE_BTN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;

  function shouldHaveCiteBtn(el) {
    if (el.classList.contains("wire-tap")) return false;
    if (el.matches(".layer, .ziel-box, .outcome, .law, .body-row, .process-card, .vz-step-card, .dw-triad-card, .dw-hub, .dw-daily-key, .human-viz-diagram .mens-zone, .illus-zone, .mens-zone, .r7-zone, .zg-block, .hm-aside-card")) {
      return topicHasQuotes(el.dataset.topic);
    }
    if (el.matches(".chip, .ziel-flow-node, .hero-pill, .section-cross-chip, .section-xref-spoke, .model-flow-chip, .model-zone, .connector-label, .layer-badge, .scene-divider, .journey-step, .hub-card, .start-chip, .vz-fork-label, .gst-merge-label, .gst-pierce-label, .gl-flow-label, .gl-god-arrows span, .vs-senses span, .gw-light-tags span, .r7-zone-badge")) return false;
    const { width, height } = el.getBoundingClientRect();
    return width >= 72 && height >= 40;
  }

  function injectCiteButtons() {
    document.querySelectorAll(".tap[data-topic]").forEach((el) => {
      if (el.querySelector(":scope > .cite-btn")) return;
      if (!shouldHaveCiteBtn(el)) return;
      const panelTopic = resolvePanelTopic(el.dataset.topic);
      if (!window.HT_TOPICS[panelTopic]) return;
      el.classList.add("has-cite");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cite-btn";
      btn.setAttribute("aria-label", "Citaten uit Verborgen Schatten");
      btn.setAttribute("title", "Citaten (bron)");
      btn.innerHTML = CITE_BTN_ICON;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openTopicPage(el.dataset.topic, el, e, { scrollTo: "bron" });
      });
      el.appendChild(btn);
    });
  }

  function injectModelFlow() {
    const targets = ["structuur", ...MODEL_FLOW_TABS];
    targets.forEach((tabId) => {
      const section = document.getElementById(tabId);
      if (!section || section.querySelector(".model-flow")) return;
      const head = section.querySelector(".section-head");
      if (!head) return;

      const flow = document.createElement("nav");
      flow.className = "model-flow";
      flow.setAttribute("aria-label", "Door het model van de mens");

      let html = `<button type="button" class="model-flow-chip model-flow-home" data-nav-topic="structuur">◇ Bouw</button>`;
      MODEL_FLOW.filter((p) => p.topic !== "structuur").forEach((part) => {
        html += `<span class="model-flow-arrow" aria-hidden="true">→</span>`;
        html += `<button type="button" class="model-flow-chip" data-nav-topic="${part.topic}">${part.label}</button>`;
      });
      flow.innerHTML = html;
      head.insertAdjacentElement("afterend", flow);
    });

    document.querySelectorAll(".model-flow-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const topic = chip.dataset.navTopic;
        if (topic === "structuur") goToHub("fundament", { tab: "structuur" });
        else handleTopicClick(topic, chip, e);
      });
    });
  }

  function wireMensDiagramZones(root, stopPropagation) {
    if (!root) return;
    root.querySelectorAll(".mens-zone, .illus-zone").forEach((zone) => {
      zone.classList.add("tap");
      zone.setAttribute("tabindex", "0");
      zone.setAttribute("role", "button");
      const meta =
        window.MENS_DIAGRAM?.zoneMeta(zone.dataset.topic) ||
        window.MENS_DIAGRAM?.zoneMeta(window.MENS_DIAGRAM?.topicToZone(zone.dataset.topic));
      if (meta) zone.setAttribute("title", `${meta.label} — ${meta.sub}`);
      zone.addEventListener("click", (e) => {
        if (stopPropagation) e.stopPropagation();
        handleTopicClick(zone.dataset.topic, zone, e);
      });
    });
  }

  function initStructuurViz() {
    const slot = document.getElementById("structuur-mens-viz");
    if (!slot || !window.MENS_DIAGRAM || slot.dataset.mounted) return;
    slot.dataset.mounted = "1";
    window.MENS_DIAGRAM.mountMini(slot, null);
    wireMensDiagramZones(slot);
  }

  function initModelNavDiagram() {
    const slot = document.querySelector("#model-nav .model-nav-diagram");
    if (!slot || !window.MENS_DIAGRAM || slot.dataset.mounted) return;
    slot.dataset.mounted = "1";
    window.MENS_DIAGRAM.mountMini(slot, null);
    wireMensDiagramZones(slot, true);
  }

  function injectModelNav() {
    if (document.getElementById("model-nav")) return;

    const nav = document.createElement("aside");
    nav.id = "model-nav";
    nav.className = "model-nav";
    nav.setAttribute("aria-label", "Model van de mens — klik om te navigeren");
    nav.innerHTML = `
      <button type="button" class="model-nav-toggle" aria-expanded="false" aria-controls="model-nav-panel">
        <span class="model-nav-toggle-icon" aria-hidden="true">◎</span>
        <span class="model-nav-toggle-label">Mens</span>
      </button>
      <div class="model-nav-panel" id="model-nav-panel" hidden>
        <p class="model-nav-title">In de mens</p>
        <div class="model-nav-diagram" role="img" aria-label="Silhouet mens"></div>
      </div>`;
    document.body.appendChild(nav);

    const collapsedDefault = window.matchMedia("(max-width: 720px)").matches;
    if (collapsedDefault) nav.classList.add("collapsed");
    const panel = nav.querySelector("#model-nav-panel");
    const toggle = nav.querySelector(".model-nav-toggle");
    if (panel) panel.hidden = collapsedDefault;
    toggle?.setAttribute("aria-expanded", String(!collapsedDefault));

    nav.querySelector(".model-nav-toggle")?.addEventListener("click", () => {
      const collapsed = nav.classList.toggle("collapsed");
      const panelEl = nav.querySelector("#model-nav-panel");
      const toggleEl = nav.querySelector(".model-nav-toggle");
      toggleEl?.setAttribute("aria-expanded", String(!collapsed));
      if (panelEl) panelEl.hidden = collapsed;
      if (!collapsed) initModelNavDiagram();
    });

    if (!collapsedDefault) initModelNavDiagram();
  }

  function annotateVisualHints() {
    document.querySelectorAll("[data-topic]").forEach((el) => {
      const nav = getVisualNav(el.dataset.topic);
      const panel = resolvePanelTopic(el.dataset.topic);
      const hasDeepen = !!(panel && window.HT_TOPICS[panel]);
      if (nav && TAB_LABELS[nav.tab]) {
        let hint = `Klik = in ${TAB_LABELS[nav.tab]}`;
        if (hasDeepen) hint += " · nogmaals = verdiep";
        hint += " · Alt = citaten";
        el.setAttribute("title", hint);
      }
    });
  }

  function syncModelFlowActive(tabId) {
    document.querySelectorAll(".model-flow-chip").forEach((chip) => {
      const topic = chip.dataset.navTopic;
      if (tabId === "start") {
        chip.classList.remove("active");
        return;
      }
      if (topic === "structuur") {
        chip.classList.toggle("active", tabId === "structuur");
        return;
      }
      const nav = getVisualNav(topic);
      chip.classList.toggle("active", nav?.tab === tabId);
    });
  }

  function syncModelNavVisibility() {
    const nav = document.getElementById("model-nav");
    if (!nav) return;
    const tab = getActiveTabId();
    const hide = isOnStart() || tab === "structuur" || isTopicPageOpen();
    nav.classList.toggle("is-hidden", hide);
  }

  overlay.addEventListener("click", closePanel);
  panelClose.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (window.HT_READER?.isOpen?.()) window.HT_READER.close();
      else if (isTopicPageOpen()) closeTopicPage();
      else if (bronRail?.classList.contains("open")) closeBronRail();
      else if (document.getElementById("model-atlas")?.classList.contains("open")) closeAtlas();
      else if (document.getElementById("ux-shortcuts")?.classList.contains("open")) closeShortcuts();
      else if (document.getElementById("ux-welcome")?.classList.contains("open")) closeWelcome();
      else if (searchOverlay?.classList.contains("open")) closeSearch();
      else closePanel();
    }
  });

  /* ——— Zoeken (command palette) ——— */
  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("open");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("search-open");
    searchInput.value = "";
    renderSearchResults([]);
    searchInput.focus();
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("open");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("search-open");
  }

  function renderSearchResults(results) {
    lastSearchResults = results;
    searchActiveIndex = 0;
    if (!results.length) {
      searchResults.innerHTML = `<p class="search-empty">${searchInput.value.trim() ? "Geen resultaten" : "Typ om te zoeken in 190+ onderwerpen…"}</p>`;
      return;
    }
    searchResults.innerHTML = results
      .map(
        (r, i) => `
        <button type="button" class="search-item${i === 0 ? " active" : ""}" data-topic="${escapeHtml(r.id)}" data-index="${i}">
          <span class="search-item-dot" style="background:${r.color}"></span>
          <span class="search-item-body">
            <strong>${escapeHtml(r.title)}</strong>
            <span>${escapeHtml(r.summary).slice(0, 120)}${r.summary.length > 120 ? "…" : ""}</span>
          </span>
          ${r.tabLabel ? `<span class="search-item-tab">${escapeHtml(r.tabLabel)}</span>` : ""}
        </button>`
      )
      .join("");

    searchResults.querySelectorAll(".search-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeSearch();
        navigateToTopic(btn.dataset.topic, null, null);
      });
    });
  }

  function onSearchInput() {
    const q = searchInput.value.trim();
    const results = window.HT_SEARCH?.search(q) || [];
    renderSearchResults(results);
  }

  function moveSearchSelection(delta) {
    if (!lastSearchResults.length) return;
    searchActiveIndex = (searchActiveIndex + delta + lastSearchResults.length) % lastSearchResults.length;
    searchResults.querySelectorAll(".search-item").forEach((el, i) => {
      el.classList.toggle("active", i === searchActiveIndex);
      if (i === searchActiveIndex) el.scrollIntoView({ block: "nearest" });
    });
  }

  document.getElementById("open-search")?.addEventListener("click", openSearch);
  document.getElementById("open-search-mobile")?.addEventListener("click", openSearch);
  document.getElementById("open-bron")?.addEventListener("click", openContextBron);
  document.getElementById("open-bron-mobile")?.addEventListener("click", () => {
    closeDrawer();
    openContextBron();
  });
  uxContextBron?.addEventListener("click", openContextBron);
  uxContextDeepen?.addEventListener("click", openContextDeepen);
  bronRail?.querySelector(".bron-rail-backdrop")?.addEventListener("click", closeBronRail);
  searchOverlay?.querySelector(".search-backdrop")?.addEventListener("click", closeSearch);
  searchInput?.addEventListener("input", onSearchInput);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSearchSelection(1); }
    if (e.key === "ArrowUp") { e.preventDefault(); moveSearchSelection(-1); }
    if (e.key === "Enter" && lastSearchResults[searchActiveIndex]) {
      e.preventDefault();
      closeSearch();
      navigateToTopic(lastSearchResults[searchActiveIndex].id, null, null);
    }
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "?" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT") {
      e.preventDefault();
      openShortcuts();
    }
    if (e.key.toLowerCase() === "v" && !e.metaKey && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      if (uxContextDeepen && !uxContextDeepen.hidden) {
        e.preventDefault();
        openContextDeepen();
      }
    }
    if (e.key.toLowerCase() === "b" && !e.metaKey && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (bronRail?.classList.contains("open")) closeBronRail();
      else if (isTopicPageOpen()) {
        topicPageInner?.querySelector("#tp-bronnen")?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (panel.classList.contains("open")) closePanel();
      else openContextBron();
    }
    if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (document.getElementById("model-atlas")?.classList.contains("open")) closeAtlas();
      else openAtlas();
    }
    if (e.altKey && e.key === "ArrowLeft" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      e.preventDefault();
      goBack();
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (e.button !== 3 || !canGoBack()) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    e.preventDefault();
    goBack();
  });

  /* ——— Drawer (mobiel) ——— */
  const drawer = document.getElementById("nav-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");

  function openDrawer() {
    drawer?.classList.add("open");
    drawerOverlay?.classList.add("open");
    document.body.classList.add("drawer-open");
  }

  function closeDrawer() {
    drawer?.classList.remove("open");
    drawerOverlay?.classList.remove("open");
    document.body.classList.remove("drawer-open");
  }

  document.getElementById("open-drawer")?.addEventListener("click", openDrawer);
  document.getElementById("close-drawer")?.addEventListener("click", closeDrawer);
  drawerOverlay?.addEventListener("click", closeDrawer);
  drawer?.querySelectorAll(".drawer-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.dataset.hub === "start") goToStart();
      else goToTab(link.dataset.tab);
      closeDrawer();
    });
  });

  /* ——— App bar scroll ——— */
  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (appBar) appBar.classList.toggle("scrolled", y > 40);
      if (navWrap) navWrap.classList.toggle("elevated", y > 120);
      lastScroll = y;
    },
    { passive: true }
  );

  /* ——— Reveal ——— */
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
    { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".layer, .process-card, .outcome, .law, .hub-card, .illus-panel, .vz-scene, .r7-scene, .zg-block, .gst-scene, .hm-scene, .bz-scene, .highlight-box, .gl-scene, .vs-scene, .gw-scene, .gv-scene, .tg-scene, .om-scene, .kr-scene, .dw-scene, .bp-scene, .gs-scene, .od-key, .rv-key, .wp-key, #structuur .reveal").forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  revealSectionContent(document.getElementById("start"));

  /* ——— Hash routing ——— */
  function applyRoute() {
    if (handlingHistory) return;
    const route = parseHash();
    if (route.topic) {
      const panelTopic = resolvePanelTopic(route.topic);
      if (window.HT_TOPICS[panelTopic]) {
        const tab = tabForTopic(route.topic);
        if (tab) goToTab(tab, { scroll: true, flash: false, updateUrl: false });
        openTopicPage(route.topic, null, null, { updateUrl: false });
      }
    } else if (route.tab === "start") {
      goToStart({ scroll: false, updateUrl: false });
    } else if (route.tab && document.getElementById(route.tab)) {
      goToTab(route.tab, { scroll: false, flash: false, updateUrl: false });
    }
  }

  window.addEventListener("popstate", (e) => {
    handlingHistory = true;
    skipHistoryPush = true;
    try {
      if (e.state && typeof e.state.tab === "string") {
        restoreNavSnapshot(e.state);
      } else {
        applyRoute();
      }
    } finally {
      skipHistoryPush = false;
      handlingHistory = false;
      syncBackButton();
    }
  });

  window.addEventListener("hashchange", applyRoute);

  /* ——— Init ——— */
  injectSectionChrome();
  upgradeSectionXrefVisual();
  injectModelAtlas();
  injectModelFlow();
  injectModelNav();
  wireAllClickables();
  injectCiteButtons();
  annotateVisualHints();
  setupTopicDelegation();
  initMensHome();
  initWelcome();
  initHelpFab();
  window.HT_READER?.init?.();
  document.body.classList.add("view-start");

  window.addEventListener("resize", () => {
    const btn = navSub?.querySelector("button.active");
    if (btn) updateSubNavIndicator(btn);
  });

  document.getElementById("app-brand")?.addEventListener("click", (e) => {
    e.preventDefault();
    closePanel();
    closeSearch();
    closeDrawer();
    goToStart({ flash: false });
  });

  updateProgress();
  skipHistoryPush = true;
  if (!location.hash) {
    goToStart({ scroll: false, updateUrl: false });
  }
  applyRoute();
  const route = parseHash();
  let initial = captureNavSnapshot();
  if (route.topic) {
    initial = captureNavSnapshot({
      tab: tabForTopic(route.topic) || "start",
      topic: route.topic,
      panelOpen: true,
      panelTopic: resolvePanelTopic(route.topic),
    });
  } else if (route.tab) {
    initial = captureNavSnapshot({ tab: route.tab });
  }
  initial._idx = 0;
  initial._backLabel = null;
  history.replaceState(initial, "", buildUrlFromSnap(initial));
  skipHistoryPush = false;
  syncBackButton();
  syncMensFab();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  window.JOS_APP = { goToTab, goToHub, goToStart, goBack, navigateToTopic, navigateVisual, openSearch, closePanel, closeTopicPage, openTopicPage, openShortcuts, openWelcome, openAtlas, closeAtlas, openContextBron, openBronRail, closeBronRail, openArticleReader: (a) => window.HT_READER?.open?.(a), closeArticleReader: () => window.HT_READER?.close?.() };
})();
