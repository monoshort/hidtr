/**
 * Bouwt een doorzoekbare index uit HT_TOPICS.
 * Geladen vóór app.js.
 */
(function () {
  const TAB_LABELS = {
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

  function tabForTopic(topicId) {
    if (!topicId) return null;
    if (EXPLICIT_TOPIC_TAB[topicId]) return EXPLICIT_TOPIC_TAB[topicId];
    for (const [prefix, tab] of PREFIX_TAB) {
      if (topicId.startsWith(prefix)) return tab;
    }
    if (topicId.startsWith("woord")) return "woord";
    return null;
  }

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function buildIndex() {
    const topics = window.HT_TOPICS || {};
    return Object.entries(topics).map(([id, t]) => {
      const tab = tabForTopic(id);
      const quoteText = (t.quotes || []).map((q) => q.text).join(" ");
      const haystack = normalize(
        [id, t.title, t.summary, quoteText, (t.refs || []).join(" ")].join(" ")
      );
      return {
        id,
        title: t.title,
        summary: t.summary,
        color: t.color || "#818cf8",
        tab,
        tabLabel: tab ? TAB_LABELS[tab] : null,
        haystack,
      };
    });
  }

  function scoreEntry(entry, tokens) {
    let score = 0;
    const idNorm = normalize(entry.id);
    const titleNorm = normalize(entry.title);

    for (const tok of tokens) {
      if (!tok) continue;
      if (idNorm === tok || idNorm.includes(tok)) score += 12;
      if (titleNorm.startsWith(tok)) score += 10;
      if (titleNorm.includes(tok)) score += 6;
      if (entry.haystack.includes(tok)) score += 2;
    }
    return score;
  }

  function search(query, limit = 12) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    return window.HT_SEARCH_INDEX
      .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.entry);
  }

  window.HT_SEARCH = { buildIndex, search, tabForTopic, TAB_LABELS };
  window.HT_SEARCH_INDEX = buildIndex();
})();
