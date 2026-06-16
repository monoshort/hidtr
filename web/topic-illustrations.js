/* Illustraties voor onderwerp-pagina's */
(function () {
  "use strict";

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const TOPIC_MAP = {
    god: "divine-source",
    geest: "anatomy-highlight",
    ziel: "anatomy-highlight",
    verstand: "anatomy-highlight",
    fantasie: "anatomy-highlight",
    hart: "anatomy-highlight",
    wil: "anatomy-highlight",
    geweten: "anatomy-highlight",
    gevoel: "anatomy-highlight",
    tong: "anatomy-highlight",
    zintuigen: "senses-wheel",
    lichaam: "anatomy-highlight",
    leden: "anatomy-highlight",
    "vz-overzicht": "temptation-flow",
    "r7-overzicht": "rom7-battle",
    "gevallen-zintuigen": "fallen-loop",
    "verlost-woord": "redeemed-path",
    "cmp-vlezes": "compare-split",
    "cmp-zonde": "compare-split",
    "cmp-doods": "compare-split",
    "cmp-werkingen": "compare-split",
    "cmp-vlees-werken": "compare-split",
    "cmp-zielse": "compare-split",
    "cmp-geestelijk": "compare-split-spirit",
    "wet-geest": "three-laws",
    "wet-zonde": "three-laws",
    "wet-doods": "three-laws",
    "gst-overzicht": "word-flow",
    woord: "word-flow",
    "geloof-overzicht": "faith-light",
    "kr-overzicht": "cross-daily",
    "dw-overzicht": "disciple-path",
    "bz-overzicht": "purification",
    "hm-overzicht": "heavenly-seat",
    "om-overzicht": "humility",
    "proces-fallen": "fallen-loop",
  };

  const PREFIX_MAP = [
    ["vz-", "temptation-flow"],
    ["r7-", "rom7-battle"],
    ["dw-", "disciple-path"],
    ["kr-", "cross-daily"],
    ["bz-", "purification"],
    ["hm-", "heavenly-seat"],
    ["om-", "humility"],
    ["gst-", "word-flow"],
    ["gl-", "faith-light"],
    ["geloof-", "faith-light"],
    ["gv-", "inner-faculty"],
    ["gw-", "inner-faculty"],
    ["tg-", "inner-faculty"],
    ["vs-", "temptation-flow"],
    ["gevallen-", "fallen-loop"],
    ["verlost-", "redeemed-path"],
    ["cmp-", "compare-split"],
    ["lichaam-", "anatomy-highlight"],
  ];

  function resolveKey(rawId, panelId, kind, zoneId) {
    const id = rawId || panelId;
    if (TOPIC_MAP[id]) return TOPIC_MAP[id];
    if (TOPIC_MAP[panelId]) return TOPIC_MAP[panelId];
    for (const [prefix, key] of PREFIX_MAP) {
      if (id.startsWith(prefix)) return key;
    }
    if (kind === "anatomy" && zoneId) return "anatomy-highlight";
    if (kind === "compare") return id.includes("geestelijk") ? "compare-split-spirit" : "compare-split";
    if (kind === "law") return "three-laws";
    return null;
  }

  function wrapSvg(inner, viewBox, label, cls) {
    return `<svg class="tp-illus-svg ${cls || ""}" viewBox="${viewBox}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  }

  function anatomyHighlight(zone, color) {
    const z = zone || "ziel";
    const glow = (id) => (id === z ? `filter="url(#tpGlow)" opacity="1"` : 'opacity="0.35"');
    const stroke = (id) => (id === z ? esc(color) : "transparent");
    const sw = (id) => (id === z ? 2.5 : 0);
    return wrapSvg(`
      <defs>
        <radialGradient id="tpGodG"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#312e81"/></radialGradient>
        <filter id="tpGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="tpArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${esc(color)}"/></marker>
      </defs>
      <ellipse cx="100" cy="22" rx="38" ry="16" fill="url(#tpGodG)" ${glow("god")} stroke="${stroke("god")}" stroke-width="${sw("god")}"/>
      <text x="100" y="25" text-anchor="middle" fill="#fff" font-size="7" font-weight="700">GOD</text>
      <line x1="100" y1="38" x2="100" y2="48" stroke="#6366f1" stroke-width="1.2" opacity=".5"/>
      <ellipse cx="100" cy="58" rx="32" ry="14" fill="#2563eb" ${glow("geest")} stroke="${stroke("geest")}" stroke-width="${sw("geest")}"/>
      <text x="100" y="60" text-anchor="middle" fill="#fff" font-size="6" font-weight="600">GEEST</text>
      <rect x="62" y="76" width="76" height="72" rx="10" fill="#7c3aed" ${glow("ziel")} stroke="${stroke("ziel")}" stroke-width="${sw("ziel")}"/>
      <text x="100" y="88" text-anchor="middle" fill="#fff" font-size="6" font-weight="600">ZIEL</text>
      <rect x="68" y="92" width="64" height="10" rx="3" fill="#f59e0b" ${glow("verstand")} stroke="${stroke("verstand")}" stroke-width="${sw("verstand")}"/>
      <text x="100" y="99" text-anchor="middle" fill="#000" font-size="4.5" font-weight="700">verstand</text>
      <rect x="68" y="104" width="64" height="10" rx="3" fill="#06b6d4" ${glow("fantasie")} stroke="${stroke("fantasie")}" stroke-width="${sw("fantasie")}"/>
      <text x="100" y="111" text-anchor="middle" fill="#000" font-size="4.5" font-weight="700">fantasie</text>
      <rect x="68" y="116" width="64" height="10" rx="3" fill="#dc2626" ${glow("hart")} stroke="${stroke("hart")}" stroke-width="${sw("hart")}"/>
      <text x="100" y="123" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="700">hart</text>
      <rect x="68" y="128" width="64" height="8" rx="2" fill="#a78bfa" ${glow("wil")} stroke="${stroke("wil")}" stroke-width="${sw("wil")}"/>
      <text x="100" y="134" text-anchor="middle" fill="#fff" font-size="4" font-weight="600">wil</text>
      <rect x="60" y="152" width="80" height="58" rx="12" fill="#ea580c" ${glow("lichaam")} stroke="${stroke("lichaam")}" stroke-width="${sw("lichaam")}"/>
      <text x="100" y="168" text-anchor="middle" fill="#fff" font-size="6" font-weight="600">LICHAAM</text>
      <rect x="66" y="178" width="68" height="9" rx="2" fill="#f97316" ${glow("zintuigen")} stroke="${stroke("zintuigen")}" stroke-width="${sw("zintuigen")}"/>
      <text x="100" y="184" text-anchor="middle" fill="#fff" font-size="4">zintuigen</text>
      <line x1="100" y1="38" x2="100" y2="210" stroke="${esc(color)}" stroke-width="1" stroke-dasharray="3,3" opacity=".35"/>
      ${z === "geest" ? '<path d="M100 38 L100 58" stroke="' + esc(color) + '" stroke-width="2" marker-end="url(#tpArr)"/>' : ""}
      ${z === "zintuigen" ? '<path d="M100 187 L100 200" stroke="' + esc(color) + '" stroke-width="2" marker-end="url(#tpArr)"/>' : ""}
    `, "0 0 200 220", "Model van de mens met highlight");
  }

  function temptationFlow(color) {
    const steps = [
      { x: 12, icon: "👁", label: "Zien" },
      { x: 52, icon: "👂", label: "Horen" },
      { x: 92, icon: "👃", label: "Ruiken" },
      { x: 132, icon: "👅", label: "Proeven" },
      { x: 172, icon: "✋", label: "Voelen" },
    ];
    let nodes = steps.map((s, i) => `
      <g transform="translate(${s.x},28)">
        <circle r="18" fill="rgba(249,115,22,0.15)" stroke="${esc(color)}" stroke-width="1.5"/>
        <text y="5" text-anchor="middle" font-size="14">${s.icon}</text>
        <text y="32" text-anchor="middle" fill="#94a3b8" font-size="6">${s.label}</text>
      </g>
      ${i < 4 ? `<line x1="${s.x + 20}" y1="28" x2="${steps[i + 1].x - 20}" y2="28" stroke="${esc(color)}" stroke-width="1.5" marker-end="url(#tfArr)"/>` : ""}
    `).join("");
    return wrapSvg(`
      <defs><marker id="tfArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${esc(color)}"/></marker></defs>
      ${nodes}
      <line x1="100" y1="66" x2="100" y2="82" stroke="${esc(color)}" stroke-width="2" marker-end="url(#tfArr)"/>
      <rect x="55" y="84" width="90" height="22" rx="8" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="100" y="98" text-anchor="middle" fill="#fde68a" font-size="8" font-weight="700">VERSTAND</text>
      <line x1="100" y1="106" x2="100" y2="118" stroke="${esc(color)}" stroke-width="1.5" marker-end="url(#tfArr)"/>
      <rect x="55" y="120" width="90" height="20" rx="6" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" stroke-width="1.5"/>
      <text x="100" y="133" text-anchor="middle" fill="#a5f3fc" font-size="7" font-weight="600">fantasie / beeld</text>
      <line x1="100" y1="140" x2="100" y2="152" stroke="${esc(color)}" stroke-width="1.5" marker-end="url(#tfArr)"/>
      <rect x="55" y="154" width="90" height="20" rx="6" fill="rgba(220,38,38,0.15)" stroke="#dc2626" stroke-width="1.5"/>
      <text x="100" y="167" text-anchor="middle" fill="#fca5a5" font-size="7" font-weight="600">hart + wil</text>
      <text x="100" y="195" text-anchor="middle" fill="#94a3b8" font-size="7">Verzoeking volgt deze route — niet direct naar het lichaam</text>
    `, "0 0 200 205", "Verloop van verzoeking");
  }

  function fallenLoop(color) {
    return wrapSvg(`
      <defs><marker id="flR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker></defs>
      <ellipse cx="100" cy="100" rx="70" ry="55" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8,5" opacity=".5"/>
      <circle cx="100" cy="42" r="16" fill="rgba(249,115,22,0.2)" stroke="#f97316" stroke-width="1.5"/>
      <text x="100" y="46" text-anchor="middle" font-size="6" fill="#fdba74">zintuigen</text>
      <circle cx="158" cy="78" r="16" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="158" y="82" text-anchor="middle" font-size="6" fill="#fde68a">verstand</text>
      <circle cx="158" cy="140" r="16" fill="rgba(220,38,38,0.2)" stroke="#dc2626" stroke-width="1.5"/>
      <text x="158" y="144" text-anchor="middle" font-size="6" fill="#fca5a5">wil</text>
      <circle cx="100" cy="168" r="16" fill="rgba(234,88,12,0.2)" stroke="#ea580c" stroke-width="1.5"/>
      <text x="100" y="172" text-anchor="middle" font-size="6" fill="#fdba74">lichaam</text>
      <circle cx="42" cy="140" r="16" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.5"/>
      <text x="42" y="144" text-anchor="middle" font-size="6" fill="#fca5a5">zonde</text>
      <circle cx="42" cy="78" r="16" fill="rgba(148,163,184,0.15)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="42" y="82" text-anchor="middle" font-size="5" fill="#cbd5e1">resultaat</text>
      <path d="M115 48 Q145 55 155 68" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <path d="M168 95 Q170 120 160 130" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <path d="M145 155 Q120 175 105 168" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <path d="M85 168 Q60 155 48 148" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <path d="M35 125 Q30 95 48 78" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <path d="M55 68 Q75 48 88 44" fill="none" stroke="#ef4444" stroke-width="1.5" marker-end="url(#flR)"/>
      <text x="100" y="108" text-anchor="middle" fill="${esc(color)}" font-size="8" font-weight="700">gevallen kringloop</text>
    `, "0 0 200 200", "Gevallen kringloop");
  }

  function redeemedPath(color) {
    return wrapSvg(`
      <defs><marker id="rpG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e"/></marker></defs>
      <circle cx="100" cy="28" r="20" fill="rgba(129,140,248,0.25)" stroke="#818cf8" stroke-width="2"/>
      <text x="100" y="32" text-anchor="middle" fill="#c7d2fe" font-size="8" font-weight="700">GOD</text>
      <path d="M100 48 L100 72" stroke="#22c55e" stroke-width="2" marker-end="url(#rpG)"/>
      <rect x="72" y="74" width="56" height="22" rx="8" fill="rgba(37,99,235,0.2)" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="100" y="88" text-anchor="middle" fill="#93c5fd" font-size="7" font-weight="600">GEEST vernieuwd</text>
      <path d="M100 96 L100 118" stroke="#22c55e" stroke-width="2" marker-end="url(#rpG)"/>
      <rect x="68" y="120" width="64" height="22" rx="8" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="100" y="134" text-anchor="middle" fill="#ddd6fe" font-size="7" font-weight="600">wil kiest God</text>
      <path d="M100 142 L100 162" stroke="#22c55e" stroke-width="2" marker-end="url(#rpG)"/>
      <rect x="72" y="164" width="56" height="22" rx="8" fill="rgba(34,197,94,0.15)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="100" y="178" text-anchor="middle" fill="#86efac" font-size="7" font-weight="600">vrucht / overwinning</text>
      <path d="M28 50 Q45 90 68 120" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4,3"/>
      <text x="22" y="95" fill="#fde68a" font-size="6" transform="rotate(-65 22 95)">Het Woord</text>
    `, "0 0 200 200", "Weg des verlossings");
  }

  function rom7Battle(color) {
    return wrapSvg(`
      <circle cx="100" cy="100" r="55" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
      <circle cx="100" cy="88" r="22" fill="rgba(148,163,184,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="100" y="92" text-anchor="middle" fill="#e2e8f0" font-size="7" font-weight="600">ik</text>
      <line x1="45" y1="100" x2="72" y2="95" stroke="#ef4444" stroke-width="3" marker-end="url(#rbR)"/>
      <text x="28" y="88" fill="#fca5a5" font-size="7" font-weight="700">vlees</text>
      <line x1="155" y1="100" x2="128" y2="95" stroke="#22c55e" stroke-width="3" marker-end="url(#rbG)"/>
      <text x="148" y="88" fill="#86efac" font-size="7" font-weight="700">geest</text>
      <defs>
        <marker id="rbR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker>
        <marker id="rbG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#22c55e"/></marker>
      </defs>
      <rect x="55" y="118" width="90" height="36" rx="8" fill="rgba(99,102,241,0.1)" stroke="${esc(color)}" stroke-width="1.2"/>
      <text x="100" y="132" text-anchor="middle" fill="#c7d2fe" font-size="6" font-weight="600">wet in de leden</text>
      <text x="100" y="144" text-anchor="middle" fill="#94a3b8" font-size="5.5">vs. wet des geestes</text>
      <text x="100" y="175" text-anchor="middle" fill="#94a3b8" font-size="6.5">Rom. 7:23 — wie redt mij?</text>
    `, "0 0 200 185", "Strijd in Rom. 7");
  }

  function compareSplit(spiritSide) {
    const leftActive = !spiritSide;
    const rightActive = spiritSide;
    return wrapSvg(`
      <rect x="8" y="20" width="88" height="150" rx="12" fill="${leftActive ? "rgba(239,68,68,0.12)" : "rgba(0,0,0,0.2)"}" stroke="${leftActive ? "#ef4444" : "rgba(255,255,255,0.1)"}" stroke-width="${leftActive ? 2 : 1}"/>
      <text x="52" y="42" text-anchor="middle" fill="#fca5a5" font-size="8" font-weight="700">Vlees / ziel</text>
      <text x="52" y="58" text-anchor="middle" fill="#94a3b8" font-size="5.5">eigen wil</text>
      <text x="52" y="70" text-anchor="middle" fill="#94a3b8" font-size="5.5">begeerte</text>
      <text x="52" y="82" text-anchor="middle" fill="#94a3b8" font-size="5.5">ziels wijsheid</text>
      <circle cx="52" cy="115" r="22" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.5"/>
      <text x="52" y="119" text-anchor="middle" font-size="16">⚡</text>
      <rect x="104" y="20" width="88" height="150" rx="12" fill="${rightActive ? "rgba(34,197,94,0.12)" : "rgba(0,0,0,0.2)"}" stroke="${rightActive ? "#22c55e" : "rgba(255,255,255,0.1)"}" stroke-width="${rightActive ? 2 : 1}"/>
      <text x="148" y="42" text-anchor="middle" fill="#86efac" font-size="8" font-weight="700">Geest / geloof</text>
      <text x="148" y="58" text-anchor="middle" fill="#94a3b8" font-size="5.5">Gods wil</text>
      <text x="148" y="70" text-anchor="middle" fill="#94a3b8" font-size="5.5">door het Woord</text>
      <text x="148" y="82" text-anchor="middle" fill="#94a3b8" font-size="5.5">vrucht des Geestes</text>
      <circle cx="148" cy="115" r="22" fill="rgba(34,197,94,0.15)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="148" y="119" text-anchor="middle" font-size="16">✧</text>
      <text x="100" y="188" text-anchor="middle" fill="#94a3b8" font-size="6.5">Hebr. 4:12 — scheiding ziel en geest</text>
    `, "0 0 200 195", "Onderscheid vlees en geest");
  }

  function threeLaws(rawId, color) {
    const active = rawId?.includes("geest") ? 0 : rawId?.includes("zonde") ? 1 : rawId?.includes("doods") ? 2 : -1;
    const laws = [
      { label: "Wet des geestes", sub: "leven", c: "#22c55e" },
      { label: "Wet der zonde", sub: "begeerte", c: "#ef4444" },
      { label: "Wet des doods", sub: "geweten", c: "#94a3b8" },
    ];
    const cols = laws.map((law, i) => {
      const on = active === -1 || active === i;
      return `<g transform="translate(${18 + i * 58},30)">
        <rect width="50" height="100" rx="8" fill="${on ? law.c + "22" : "rgba(0,0,0,0.2)"}" stroke="${on ? law.c : "rgba(255,255,255,0.1)"}" stroke-width="${on ? 2 : 1}"/>
        <text x="25" y="38" text-anchor="middle" fill="${law.c}" font-size="5" font-weight="700">${esc(law.label.split(" ")[0])}</text>
        <text x="25" y="48" text-anchor="middle" fill="${law.c}" font-size="5" font-weight="700">${esc(law.label.split(" ").slice(1).join(" "))}</text>
        <text x="25" y="72" text-anchor="middle" fill="#94a3b8" font-size="5">${esc(law.sub)}</text>
      </g>`;
    }).join("");
    return wrapSvg(cols + `<text x="100" y="155" text-anchor="middle" fill="#94a3b8" font-size="6.5">Drie wetten tegelijk in één mens</text>`, "0 0 200 165", "Drie wetten");
  }

  function wordFlow(color) {
    return wrapSvg(`
      <defs><marker id="wfA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24"/></marker></defs>
      <circle cx="100" cy="30" r="18" fill="rgba(129,140,248,0.2)" stroke="#818cf8" stroke-width="2"/>
      <text x="100" y="34" text-anchor="middle" fill="#c7d2fe" font-size="7" font-weight="700">GOD spreekt</text>
      <path d="M100 48 L100 68" stroke="#fbbf24" stroke-width="2" marker-end="url(#wfA)"/>
      <rect x="68" y="70" width="64" height="28" rx="6" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="100" y="82" text-anchor="middle" fill="#fde68a" font-size="6" font-weight="700">📖 WOORD</text>
      <text x="100" y="92" text-anchor="middle" fill="#94a3b8" font-size="5">scherper dan een zwaard</text>
      <path d="M100 98 L100 118" stroke="#fbbf24" stroke-width="2" marker-end="url(#wfA)"/>
      <ellipse cx="100" cy="138" rx="28" ry="18" fill="rgba(37,99,235,0.15)" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="100" y="142" text-anchor="middle" fill="#93c5fd" font-size="7" font-weight="600">geest</text>
      <path d="M100 156 L100 172" stroke="#22c55e" stroke-width="2"/>
      <text x="100" y="186" text-anchor="middle" fill="#86efac" font-size="6.5">geloof + gehoorzaamheid</text>
    `, "0 0 200 195", "God spreekt door het Woord");
  }

  function faithLight(color) {
    return wrapSvg(`
      <circle cx="100" cy="70" r="35" fill="rgba(251,191,36,0.08)" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,3"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const x2 = 100 + Math.cos(r) * 55;
        const y2 = 70 + Math.sin(r) * 40;
        return `<line x1="100" y1="70" x2="${x2}" y2="${y2}" stroke="#fbbf24" stroke-width="1.5" opacity=".5"/>`;
      }).join("")}
      <ellipse cx="78" cy="68" rx="8" ry="5" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
      <ellipse cx="122" cy="68" rx="8" ry="5" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
      <circle cx="78" cy="68" r="3" fill="${esc(color)}"/>
      <circle cx="122" cy="68" r="3" fill="${esc(color)}"/>
      <rect x="62" y="110" width="76" height="40" rx="10" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" stroke-width="1.5"/>
      <text x="100" y="128" text-anchor="middle" fill="#a5f3fc" font-size="7" font-weight="600">verlichte ogen</text>
      <text x="100" y="140" text-anchor="middle" fill="#94a3b8" font-size="5.5">ziet wat God bedoelt</text>
      <text x="100" y="175" text-anchor="middle" fill="#94a3b8" font-size="6.5">Geloof is geen zielsgevoel — het is geestelijk zien</text>
    `, "0 0 200 185", "Geloof verlicht de ogen");
  }

  function crossDaily(color) {
    return wrapSvg(`
      <line x1="100" y1="40" x2="100" y2="130" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
      <line x1="72" y1="72" x2="128" y2="72" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="72" r="8" fill="${esc(color)}" opacity=".6"/>
      <path d="M100 130 L85 165 M100 130 L115 165" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="85" cy="168" r="6" fill="rgba(239,68,68,0.3)" stroke="#ef4444"/>
      <circle cx="115" cy="168" r="6" fill="rgba(239,68,68,0.3)" stroke="#ef4444"/>
      <text x="100" y="188" text-anchor="middle" fill="#94a3b8" font-size="6.5">Dagelijks het kruis opnemen — eigen wil sterft</text>
    `, "0 0 200 195", "Het kruis dagelijks");
  }

  function disciplePath(color) {
    return wrapSvg(`
      <path d="M40 170 Q70 140 90 120 T130 70 T155 35" fill="none" stroke="${esc(color)}" stroke-width="2.5" stroke-dasharray="6,4"/>
      <circle cx="40" cy="170" r="8" fill="rgba(148,163,184,0.2)" stroke="#94a3b8"/>
      <text x="40" y="188" text-anchor="middle" fill="#94a3b8" font-size="5">start</text>
      <circle cx="90" cy="120" r="8" fill="rgba(245,158,11,0.2)" stroke="#f59e0b"/>
      <text x="90" y="108" text-anchor="middle" fill="#fde68a" font-size="5">beproeving</text>
      <circle cx="130" cy="70" r="8" fill="rgba(34,197,94,0.2)" stroke="#22c55e"/>
      <text x="130" y="58" text-anchor="middle" fill="#86efac" font-size="5">groei</text>
      <circle cx="155" cy="35" r="10" fill="rgba(129,140,248,0.25)" stroke="#818cf8" stroke-width="2"/>
      <text x="155" y="39" text-anchor="middle" fill="#c7d2fe" font-size="6" font-weight="700">doel</text>
      <text x="100" y="22" text-anchor="middle" fill="#94a3b8" font-size="6.5">Weg des levens — geen sprint, wel richting</text>
    `, "0 0 200 195", "Discipelweg");
  }

  function purification(color) {
    return wrapSvg(`
      <path d="M100 30 Q120 60 100 90 Q80 60 100 30" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" stroke-width="1.5"/>
      <text x="100" y="58" text-anchor="middle" font-size="14">💧</text>
      <rect x="70" y="100" width="60" height="24" rx="8" fill="rgba(220,38,38,0.1)" stroke="#dc2626" stroke-width="1.2"/>
      <text x="100" y="115" text-anchor="middle" fill="#fca5a5" font-size="6.5">tong / vlees</text>
      <line x1="100" y1="90" x2="100" y2="100" stroke="#22d3ee" stroke-width="1.5"/>
      <line x1="100" y1="124" x2="100" y2="140" stroke="#22c55e" stroke-width="2"/>
      <rect x="70" y="142" width="60" height="24" rx="8" fill="rgba(34,197,94,0.12)" stroke="#22c55e" stroke-width="1.5"/>
      <text x="100" y="157" text-anchor="middle" fill="#86efac" font-size="6.5">rein geheel</text>
      <text x="100" y="185" text-anchor="middle" fill="#94a3b8" font-size="6">Bezoedeling → reiniging van geest, ziel én lichaam</text>
    `, "0 0 200 195", "Reiniging en heiligmaking");
  }

  function heavenlySeat(color) {
    return wrapSvg(`
      <ellipse cx="100" cy="45" rx="50" ry="20" fill="rgba(129,140,248,0.1)" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="5,3"/>
      <text x="100" y="48" text-anchor="middle" fill="#c7d2fe" font-size="7" font-weight="600">hemelse plaats</text>
      <line x1="100" y1="65" x2="100" y2="95" stroke="${esc(color)}" stroke-width="2"/>
      <circle cx="100" cy="110" r="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="14" fill="rgba(129,140,248,0.15)" stroke="#818cf8"/>
      <text x="100" y="104" text-anchor="middle" fill="#e0e7ff" font-size="6">mij</text>
      <text x="100" y="150" text-anchor="middle" fill="#94a3b8" font-size="6">In Christus — maar nog op aardse weg</text>
      <path d="M60 165 L100 145 L140 165" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <text x="100" y="178" text-anchor="middle" fill="#86efac" font-size="5.5">van glorie tot glorie</text>
    `, "0 0 200 190", "Hemelse plaatsing");
  }

  function humility(color) {
    return wrapSvg(`
      <circle cx="100" cy="55" r="20" fill="rgba(148,163,184,0.1)" stroke="#94a3b8" stroke-width="1.5"/>
      <path d="M85 95 Q100 115 115 95 L115 130 Q100 125 85 130 Z" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" stroke-width="1.5"/>
      <path d="M70 130 L85 95 M130 130 L115 95" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <path d="M85 130 L70 155 M115 130 L130 155" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <path d="M88 75 Q100 82 112 75" fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="100" y="165" text-anchor="middle" fill="#c4b5fd" font-size="7" font-weight="600">geknield — niet mijn wil</text>
      <text x="100" y="180" text-anchor="middle" fill="#94a3b8" font-size="6">Ootmoed opent de weg tot overwinning</text>
    `, "0 0 200 190", "Ootmoed");
  }

  function sensesWheel(color) {
    return wrapSvg(`
      <circle cx="100" cy="95" r="28" fill="rgba(249,115,22,0.12)" stroke="${esc(color)}" stroke-width="2"/>
      <text x="100" y="99" text-anchor="middle" fill="#fdba74" font-size="7" font-weight="700">IN</text>
      ${[
        { a: -90, e: "👁", l: "zien" },
        { a: -18, e: "👂", l: "horen" },
        { a: 54, e: "👃", l: "ruiken" },
        { a: 126, e: "👅", l: "proeven" },
        { a: 198, e: "✋", l: "voelen" },
      ].map((s) => {
        const r = (s.a * Math.PI) / 180;
        const cx = 100 + Math.cos(r) * 58;
        const cy = 95 + Math.sin(r) * 58;
        return `<g>
          <line x1="100" y1="95" x2="${cx}" y2="${cy}" stroke="${esc(color)}" stroke-width="1" opacity=".4"/>
          <circle cx="${cx}" cy="${cy}" r="16" fill="rgba(249,115,22,0.1)" stroke="#f97316" stroke-width="1.2"/>
          <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="12">${s.e}</text>
          <text x="${cx}" y="${cy + 22}" text-anchor="middle" fill="#94a3b8" font-size="5">${s.l}</text>
        </g>`;
      }).join("")}
      <text x="100" y="175" text-anchor="middle" fill="#94a3b8" font-size="6.5">Poort naar verstand en ziel</text>
    `, "0 0 200 185", "Vijf zintuigen");
  }

  function innerFaculty(color, rawId) {
    const focus = rawId?.startsWith("gw") ? "geweten" : rawId?.startsWith("gv") ? "gevoel" : rawId?.startsWith("tg") ? "tong" : "hart";
    const items = [
      { id: "geweten", y: 50, label: "geweten", c: "#22c55e" },
      { id: "gevoel", y: 85, label: "gevoel", c: "#f472b6" },
      { id: "hart", y: 120, label: "hart", c: "#dc2626" },
      { id: "tong", y: 155, label: "tong", c: "#f59e0b" },
    ];
    const rows = items.map((it) => {
      const on = focus === it.id;
      return `<rect x="50" y="${it.y - 12}" width="100" height="24" rx="8" fill="${on ? it.c + "22" : "rgba(0,0,0,0.15)"}" stroke="${on ? it.c : "rgba(255,255,255,0.08)"}" stroke-width="${on ? 2 : 1}"/>
      <text x="100" y="${it.y + 4}" text-anchor="middle" fill="${on ? it.c : "#94a3b8"}" font-size="7" font-weight="${on ? 700 : 500}">${it.label}</text>`;
    }).join("");
    return wrapSvg(rows + `<text x="100" y="188" text-anchor="middle" fill="#94a3b8" font-size="6">Innerlijk leven — onderling verbonden</text>`, "0 0 200 195", "Innerlijke faculteiten");
  }

  function divineSource(color) {
    return wrapSvg(`
      <circle cx="100" cy="80" r="45" fill="rgba(129,140,248,0.15)" stroke="#818cf8" stroke-width="2"/>
      ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return `<line x1="100" y1="80" x2="${100 + Math.cos(r) * 70}" y2="${80 + Math.sin(r) * 50}" stroke="#818cf8" stroke-width="1.5" opacity=".35"/>`;
      }).join("")}
      <text x="100" y="76" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="700">GOD</text>
      <text x="100" y="92" text-anchor="middle" fill="#c7d2fe" font-size="6">bron van leven</text>
      <path d="M100 125 L100 155" stroke="#22c55e" stroke-width="2"/>
      <ellipse cx="100" cy="172" rx="35" ry="14" fill="rgba(37,99,235,0.15)" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="100" y="176" text-anchor="middle" fill="#93c5fd" font-size="6.5">Geest des levens</text>
    `, "0 0 200 195", "God als bron");
  }

  const CAPTIONS = {
    "anatomy-highlight": "Waar dit onderdeel zit in het model van geest, ziel en lichaam",
    "temptation-flow": "Verzoeking komt via de zintuigen binnen — niet rechtstreeks in het lichaam",
    "fallen-loop": "De gevallen kringloop: van zintuigen tot zonde en terug",
    "redeemed-path": "Verloste weg: Woord en Geest vernieuwen de hele mens",
    "rom7-battle": "Twee krachten trekken aan dezelfde mens — Rom. 7",
    "compare-split": "Onderscheid tussen wat van het vlees komt en wat van de Geest is",
    "compare-split-spirit": "Geestelijk leven groeit waar het Woord de ziel verlicht",
    "three-laws": "Drie wetten die tegelijk in de mens kunnen werken",
    "word-flow": "God spreekt — het Woord dringt door tot geest en geloof",
    "faith-light": "Geloof opent geestelijk zien — niet alleen gevoel",
    "cross-daily": "Het kruis is geen moment maar een dagelijkse weg",
    "disciple-path": "Discipelschap is een levensweg met beproevingen en groei",
    "purification": "Reiniging raakt geest, ziel én lichaam",
    "heavenly-seat": "Plaats in Christus — terwijl we nog op aarde wandelen",
    "humility": "Ootmoed: eigen wil buigen voor Gods wil",
    "senses-wheel": "De vijf zintuigen zijn de poort naar binnen",
    "inner-faculty": "Geweten, gevoel, hart en tong hangen samen in de ziel",
    "divine-source": "Alle leven en verlichting komt van God",
  };

  const BUILDERS = {
    "anatomy-highlight": (o) => anatomyHighlight(o.zoneId, o.color),
    "temptation-flow": (o) => temptationFlow(o.color),
    "fallen-loop": (o) => fallenLoop(o.color),
    "redeemed-path": (o) => redeemedPath(o.color),
    "rom7-battle": (o) => rom7Battle(o.color),
    "compare-split": () => compareSplit(false),
    "compare-split-spirit": () => compareSplit(true),
    "three-laws": (o) => threeLaws(o.rawId, o.color),
    "word-flow": (o) => wordFlow(o.color),
    "faith-light": (o) => faithLight(o.color),
    "cross-daily": (o) => crossDaily(o.color),
    "disciple-path": (o) => disciplePath(o.color),
    "purification": (o) => purification(o.color),
    "heavenly-seat": (o) => heavenlySeat(o.color),
    "humility": (o) => humility(o.color),
    "senses-wheel": (o) => sensesWheel(o.color),
    "inner-faculty": (o) => innerFaculty(o.color, o.rawId),
    "divine-source": (o) => divineSource(o.color),
  };

  window.TP_ILLUSTRATION = {
    resolve(rawId, panelId, kind, color, zoneId) {
      const key = resolveKey(rawId, panelId, kind, zoneId);
      const build = BUILDERS[key];
      if (!build) return null;
      const html = build({ rawId, panelId, kind, color, zoneId });
      return {
        key,
        html: `<figure class="tp-figure tp-figure-${key}">${html}<figcaption class="tp-figcaption">${esc(CAPTIONS[key] || "")}</figcaption></figure>`,
        caption: CAPTIONS[key] || "",
      };
    },
  };
})();
