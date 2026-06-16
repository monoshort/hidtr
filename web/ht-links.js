(function () {
  const ES_URL = "https://search.hiddentreasures.org/elasticsearch/search-nl/_search";
  const API_KEY = "MEVCX1NwSUI5bklnQTlEMDRRakU6TVFEc3kyOWVTMldlRlF6dWUzY0VEZw==";
  const APP_BASE = "https://app.hiddentreasures.org";
  const LOCALE = "nl";
  const PERIODICAL = "hidden-treasures";

  const urlCache = new Map();
  const relatedCache = new Map();
  const searchCache = new Map();
  const articleCache = new Map();

  const JOS_AUTHOR_IDS = [20, 80, 432, 543, 577, 578, 583, 586];

  const TOPIC_HT_QUERY = {
    god: "God Geest leven",
    geest: "menselijke geest",
    ziel: "ziel geest lichaam",
    verstand: "verstand verzoeking",
    fantasie: "fantasie ziel",
    hart: "hart gedachten",
    wil: "wil gezindheid",
    geweten: "geweten licht",
    gevoel: "gevoelens ziel",
    tong: "tong spreken",
    zintuigen: "zintuigen verzoeking",
    lichaam: "lichaam vlees",
    leden: "leden zonde",
    "r7-overzicht": "Rom 7 zonde",
    "vz-overzicht": "verzoeking verstand",
    "gst-overzicht": "Woord Gods",
    "geloof-overzicht": "geloof geest",
    "kr-overzicht": "kruis wil",
    "dw-overzicht": "weg des levens",
    "bz-overzicht": "bezoedeling reiniging",
    "hm-overzicht": "hemel Christus",
    "om-overzicht": "ootmoed wil",
    "cmp-vlezes": "ziel geest onderscheid",
    "wet-geest": "wet des geestes",
    "wet-zonde": "wet der zonde",
    "wet-doods": "wet des doods",
    "gw-gezindheid": "gezindheid geweten begeerte",
    "gw-bekering": "bekering geweten tuchtiging",
    "gw-licht": "geweten licht",
    "gw-oordeelt": "geweten oordeel zonde",
    "vs-fantasie": "fantasie verstand beeld",
    "vs-gevallen": "verstand verduisterd zonde",
    "vz-zintuigen": "zintuigen verzoeking",
  };

  const PREFIX_HT_QUERY = [
    ["gw-", "geweten"],
    ["gv-", "gevoel ziel"],
    ["tg-", "tong spreken"],
    ["vs-", "verstand fantasie"],
    ["vz-", "verzoeking zintuigen"],
    ["r7-", "Rom 7 zonde"],
    ["dw-", "weg des levens discipel"],
    ["kr-", "kruis eigen wil"],
    ["bz-", "bezoedeling reiniging"],
    ["hm-", "hemel Christus geest"],
    ["om-", "ootmoed gehoorzaamheid"],
    ["gst-", "Woord Gods"],
    ["gl-", "geloof geest"],
    ["geloof-", "geloof geest"],
    ["cmp-", "ziel geest onderscheid"],
    ["lichaam-", "lichaam vlees zonde"],
    ["gevallen-", "zonde verzoeking"],
    ["verlost-", "verlossing geest"],
    ["od-", "omgang Gods"],
    ["rv-", "rechtvaardiging geloof"],
    ["zg-", "zegen Gods"],
    ["proces-", "val verlossing"],
    ["woord", "Woord Gods"],
  ];

  const STOPWORDS = new Set([
    "de", "het", "een", "en", "van", "in", "op", "aan", "die", "dat", "als", "na", "met",
    "niet", "door", "tot", "zijn", "kan", "wordt", "weer", "ook", "om", "te", "bij", "is",
    "er", "zo", "dan", "dit", "maar", "omdat", "want", "hun", "ons", "men", "wie", "waar",
    "wat", "hoe", "nog", "wel", "geen", "alleen", "daar", "hier", "der", "des", "hetzelfde",
    "dezelfde", "worden", "heeft", "hebben", "waren", "was", "zonder", "onder", "over",
    "tussen", "waarop", "waarin", "daarom", "daarna", "voelt", "voelen", "moet", "kunnen",
  ]);

  function cleanTitle(title) {
    return (title || "").replace(/\([^)]*\)/g, " ").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function queryFromTopicId(topicId, topic) {
    if (!topicId) return "";
    for (const [prefix, base] of PREFIX_HT_QUERY) {
      if (!topicId.startsWith(prefix)) continue;
      const slug = topicId.slice(prefix.length).replace(/-/g, " ").trim();
      if (slug && slug !== "overzicht") {
        return [slug, base].join(" ").split(/\s+/).slice(0, 4).join(" ");
      }
      const titleQ = cleanTitle(topic?.title).split(/\s+/).slice(0, 3).join(" ");
      return [base, titleQ].filter(Boolean).join(" ").split(/\s+/).slice(0, 4).join(" ");
    }
    return "";
  }

  function extractStepKeywords(step) {
    return (step || "")
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  }

  function extractStepQuery(step) {
    return extractStepKeywords(step).slice(0, 3).join(" ");
  }

  function scoreArticleForStep(article, keywords) {
    if (!article || !keywords.length) return 0;
    const hay = `${article.title} ${article.excerpt}`.toLowerCase();
    return keywords.reduce((score, word) => (hay.includes(word) ? score + 1 : score), 0);
  }

  function isGranularTopic(topicId) {
    return !!(topicId && topicId.includes("-") && !topicId.endsWith("-overzicht"));
  }

  function stripHighlight(html) {
    return String(html || "")
      .replace(/<\/?em>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatHtDate(iso) {
    if (!iso) return "";
    const [y, m] = iso.split("-");
    const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    const mi = parseInt(m, 10);
    return mi >= 1 && mi <= 12 ? `${months[mi - 1]} ${y}` : iso;
  }

  function buildQueryForTopic(topic, topicId) {
    if (topicId && TOPIC_HT_QUERY[topicId]) return TOPIC_HT_QUERY[topicId];
    const fromPrefix = queryFromTopicId(topicId, topic);
    if (fromPrefix) return fromPrefix;
    const title = cleanTitle(topic?.title);
    if (title.length > 2) return title.split(/\s+/).slice(0, 3).join(" ");
    return (topic?.summary || "").replace(/[^\w\s]/g, " ").split(/\s+/).slice(0, 4).join(" ");
  }

  function queryVariants(topic, topicId) {
    const variants = [];
    if (topicId && TOPIC_HT_QUERY[topicId]) variants.push(TOPIC_HT_QUERY[topicId]);
    const fromPrefix = queryFromTopicId(topicId, topic);
    if (fromPrefix) variants.push(fromPrefix);
    const title = cleanTitle(topic?.title);
    if (title) variants.push(title);
    const summaryWords = (topic?.summary || "")
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4 && !STOPWORDS.has(w.toLowerCase()))
      .slice(0, 3);
    if (summaryWords.length) variants.push(summaryWords.join(" "));
    return [...new Set(variants.filter((v) => v && v.length > 2))];
  }

  function articlesFromQuotes(quotes) {
    const seen = new Set();
    const articles = [];
    for (const quote of quotes || []) {
      const parsed = parseSource(quote.source, quote.date);
      const title = parsed?.title || (quote.source || "").trim();
      if (!title) continue;
      const key = title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      articles.push({
        title,
        author: quote.author || "",
        date: quote.date || "",
        dateLabel: formatHtDate(quote.date),
        publication: "Verborgen Schatten",
        excerpt: (quote.text || "").slice(0, 220),
        url: buildSearchUrl(parsed?.title || title),
        kind: "cite",
        citeText: quote.text,
        isJos: /smith|bratlie/i.test(quote.author || ""),
      });
    }
    return articles;
  }

  function articleFromHit(hit) {
    const s = hit._source || {};
    const rawExcerpt =
      hit.highlight?.public_section_lang_body_plain?.[0] ||
      hit.highlight?.public_section_lang_title?.[0] ||
      (s.public_section_lang_body_plain || "").slice(0, 240);
    const excerpt = stripHighlight(rawExcerpt);
    const authors = s.public_section_lang_author_full_name || [];
    return {
      title: s.public_section_lang_title || "Artikel",
      author: authors.join(", "),
      authors,
      date: s.public_section_lang_combined_date,
      dateLabel: formatHtDate(s.public_section_lang_combined_date),
      publication: s.public_section_lang_publication_name || "Verborgen Schatten",
      excerpt: excerpt.length > 220 ? `${excerpt.slice(0, 217)}…` : excerpt,
      url: buildArticleUrl(hit),
      isJos: authors.some((a) => /smith|bratlie/i.test(a)),
    };
  }

  async function searchArticlesOnce(query, size = 5, operator = "or") {
    const q = (query || "").trim();
    if (!q) return [];

    const body = {
      size,
      query: {
        function_score: {
          query: {
            bool: {
              must: [
                { range: { public_section_lang_access_level: { lte: 2 } } },
                {
                  simple_query_string: {
                    query: q,
                    fields: ["public_section_lang_body_plain", "public_section_lang_title"],
                    default_operator: operator,
                  },
                },
              ],
            },
          },
          functions: [
            {
              filter: { terms: { public_section_lang_author_id: JOS_AUTHOR_IDS } },
              weight: 1.5,
            },
          ],
        },
      },
      highlight: {
        fields: {
          public_section_lang_body_plain: { fragment_size: 260, number_of_fragments: 1 },
          public_section_lang_title: {},
        },
      },
    };

    const data = await esSearch(body);
    return (data.hits?.hits || []).map(articleFromHit);
  }

  async function searchArticles(query, size = 5) {
    const q = (query || "").trim();
    if (!q) return [];
    const variants = [q];
    const words = q.split(/\s+/).filter(Boolean);
    if (words.length > 3) variants.push(words.slice(0, 3).join(" "));
    if (words.length > 2) variants.push(words.slice(0, 2).join(" "));

    for (const variant of [...new Set(variants)]) {
      const cacheKey = `${variant}|${size}`;
      if (searchCache.has(cacheKey)) {
        const cached = searchCache.get(cacheKey);
        if (cached.length) return cached;
        continue;
      }
      try {
        let hits = await searchArticlesOnce(variant, size, "or");
        searchCache.set(cacheKey, hits);
        if (hits.length) return hits;
      } catch {
        /* volgende variant */
      }
    }
    return [];
  }

  async function findRelatedArticles(topic, quotes, topicId, { size = 4 } = {}) {
    const cacheKey = `${topicId || topic?.title}|${size}`;
    if (relatedCache.has(cacheKey)) return relatedCache.get(cacheKey);

    const seen = new Set();
    const articles = [];

    const quoteFallback = articlesFromQuotes(quotes);
    for (const a of quoteFallback) {
      seen.add(a.title.toLowerCase());
      articles.push(a);
    }

    for (const quote of (quotes || []).slice(0, 4)) {
      const parsed = parseSource(quote.source, quote.date);
      if (!parsed?.title) continue;
      try {
        const hit = await findArticle(parsed);
        if (!hit) continue;
        const article = articleFromHit(hit);
        const key = article.title.toLowerCase();
        if (seen.has(key)) {
          const idx = articles.findIndex((x) => x.title.toLowerCase() === key);
          if (idx >= 0) articles[idx] = { ...articles[idx], ...article, kind: "cite", citeText: quote.text?.slice(0, 120) };
          continue;
        }
        seen.add(key);
        articles.push({ ...article, kind: "cite", citeText: quote.text?.slice(0, 120) });
      } catch {
        /* cite-fallback blijft staan */
      }
    }

    if (articles.length < size) {
      const variants = queryVariants(topic, topicId);
      for (const query of variants) {
        try {
          const found = await searchArticlesOnce(query, size + 2, "or");
          for (const article of found) {
            const key = article.title.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            articles.push({ ...article, kind: "search" });
            if (articles.length >= size) break;
          }
          if (articles.length >= size) break;
        } catch {
          /* volgende variant */
        }
      }
    }

    if (articles.length) relatedCache.set(cacheKey, articles);
    return articles;
  }

  async function findStepExplanations(steps, topic, quotes, topicId) {
    const stepList = (steps || []).filter((s) => s && s.length > 8).slice(0, 6);
    if (!stepList.length) return [];

    const cacheKey = `stepxp|${topicId}|${stepList.join("||")}`;
    if (relatedCache.has(cacheKey)) return relatedCache.get(cacheKey);

    const articleSize = isGranularTopic(topicId) ? 10 : 7;
    const pool = [];
    const seen = new Set();

    function addToPool(list) {
      for (const article of list || []) {
        const key = article.title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        pool.push(article);
      }
    }

    addToPool(articlesFromQuotes(quotes));
    const related = await findRelatedArticles(topic, quotes, topicId, { size: articleSize });
    addToPool(related);

    if (pool.length < stepList.length) {
      const variants = queryVariants(topic, topicId);
      for (const query of variants) {
        try {
          addToPool(await searchArticlesOnce(query, articleSize, "or"));
          if (pool.length >= stepList.length + 2) break;
        } catch {
          /* volgende variant */
        }
      }
    }

    const used = new Set();
    const explanations = [];

    for (let i = 0; i < stepList.length; i++) {
      const step = stepList[i];
      const keywords = extractStepKeywords(step);
      let best = null;
      let bestScore = 0;

      for (const article of pool) {
        const key = article.title.toLowerCase();
        if (used.has(key)) continue;
        const score = scoreArticleForStep(article, keywords);
        if (score > bestScore) {
          bestScore = score;
          best = article;
        }
      }

      if (!best) {
        best = pool.find((a) => !used.has(a.title.toLowerCase())) || null;
      }

      if (best) used.add(best.title.toLowerCase());

      explanations.push({
        step,
        stepIndex: i,
        article: best,
        query: extractStepQuery(step),
      });
    }

    const unmatched = explanations.filter((e) => !e.article || scoreArticleForStep(e.article, extractStepKeywords(e.step)) === 0);
    await Promise.all(
      unmatched.slice(0, 3).map(async (entry) => {
        const q = entry.query || buildQueryForTopic(topic, topicId);
        if (!q) return;
        try {
          const hits = await searchArticlesOnce(q, 3, "or");
          const article = hits.find((h) => !used.has(h.title.toLowerCase()));
          if (article) {
            used.add(article.title.toLowerCase());
            entry.article = article;
          }
        } catch {
          /* stap blijft zonder artikel */
        }
      })
    );

    if (explanations.some((e) => e.article)) {
      relatedCache.set(cacheKey, explanations);
    }
    return explanations;
  }

  async function lookupArticle(source, quoteDate) {
    const parsed = parseSource(source, quoteDate);
    if (!parsed) return buildSearchUrl(source || "");

    const cacheKey = `${parsed.title}|${parsed.issueDate || ""}|${quoteDate || ""}`;
    if (urlCache.has(cacheKey)) return urlCache.get(cacheKey);

    let url;
    try {
      const hit = await findArticle(parsed);
      url = hit ? buildArticleUrl(hit) : buildSearchUrl(parsed.title);
    } catch {
      url = buildSearchUrl(parsed.title);
    }

    urlCache.set(cacheKey, url);
    return url;
  }

  function slugify(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function monthRange(ym) {
    const [y, m] = ym.split("-").map(Number);
    const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
    return { gte: `${y}-${String(m).padStart(2, "0")}-01`, lt: next };
  }

  function parseSource(source, quoteDate) {
    if (!source || source === "?") return null;

    const magazine = source.match(
      /^(?:Skjulte Skatter|Verborgen Schatten)\s+(\d{4})-(\d{2})\s*[?–-]\s*(.+)$/i
    );
    if (magazine) {
      return {
        title: magazine[3].trim(),
        issueDate: `${magazine[1]}-${magazine[2]}`,
      };
    }

    const hoofdstuk = source.match(/^Hoofdstuk\s+\d+\s*[?–-]\s*(.+)$/i);
    if (hoofdstuk) return { title: hoofdstuk[1].trim() };

    const numbered = source.match(/^\d+\.\s+(.+)$/);
    if (numbered) return { title: numbered[1].trim() };

    const parsed = { title: source.trim() };
    if (quoteDate) {
      const ym = quoteDate.slice(0, 7);
      if (/^\d{4}-\d{2}$/.test(ym)) parsed.issueDate = ym;
    }
    return parsed;
  }

  function buildSearchUrl(query) {
    return `${APP_BASE}/${LOCALE}/search?q=${encodeURIComponent(query)}`;
  }

  function buildArticleUrl(hit) {
    const s = hit._source;
    const type = s.public_section_lang_publication_type;

    if (type === "book_chapter") {
      return buildSearchUrl(s.public_section_lang_title);
    }

    const date = s.public_section_lang_combined_date;
    if (!date) return buildSearchUrl(s.public_section_lang_title);

    const [year, month] = date.split("-");
    const chapterNo = s.public_section_lang_sub_index_id;
    if (chapterNo == null) {
      return buildSearchUrl(s.public_section_lang_title);
    }

    const chapterSlug = `${chapterNo}-${slugify(s.public_section_lang_title)}`;
    return `${APP_BASE}/${LOCALE}/${PERIODICAL}/${year}/${parseInt(month, 10)}/${chapterSlug}`;
  }

  async function esSearch(body, timeoutMs = 15000) {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(ES_URL, {
        method: "POST",
        headers: {
          Authorization: `ApiKey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`ES ${res.status}`);
      return res.json();
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function findArticle(parsed) {
    const must = [
      { range: { public_section_lang_access_level: { lte: 2 } } },
      { match_phrase: { public_section_lang_title: parsed.title } },
    ];

    let data = await esSearch({ size: 1, query: { bool: { must } } });
    let hit = data.hits?.hits?.[0];

    if (!hit) {
      const fuzzyMust = [
        { range: { public_section_lang_access_level: { lte: 2 } } },
        { match: { public_section_lang_title: { query: parsed.title, operator: "and" } } },
      ];
      if (parsed.issueDate) {
        fuzzyMust.push({ range: { public_section_lang_combined_date: monthRange(parsed.issueDate) } });
      }
      data = await esSearch({ size: 1, query: { bool: { must: fuzzyMust } } });
      hit = data.hits?.hits?.[0];
    }

    if (!hit && parsed.issueDate) {
      must.pop();
      must.push({ match: { public_section_lang_title: { query: parsed.title, operator: "and" } } });
      must.push({ range: { public_section_lang_combined_date: monthRange(parsed.issueDate) } });
      data = await esSearch({ size: 1, query: { bool: { must } } });
      hit = data.hits?.hits?.[0];
    }

    return hit ?? null;
  }

  function parseArticleUrl(url) {
    if (!url) return null;
    const match = url.match(/\/hidden-treasures\/(\d{4})\/(\d{1,2})\/(\d+)-/i);
    if (!match) return null;
    return {
      year: match[1],
      month: String(parseInt(match[2], 10)).padStart(2, "0"),
      chapterNo: parseInt(match[3], 10),
    };
  }

  async function fetchFullArticle(article) {
    const cacheKey = `${article.title}|${article.date || ""}|${article.url || ""}`;
    if (articleCache.has(cacheKey)) return articleCache.get(cacheKey);

    let hit = null;

    if (article.title) {
      const parsed = { title: article.title };
      if (article.date) {
        const ym = article.date.slice(0, 7);
        if (/^\d{4}-\d{2}$/.test(ym)) parsed.issueDate = ym;
      }
      hit = await findArticle(parsed);
    }

    if (!hit && article.url) {
      const parts = parseArticleUrl(article.url);
      if (parts) {
        const must = [
          { range: { public_section_lang_access_level: { lte: 2 } } },
          { term: { public_section_lang_sub_index_id: parts.chapterNo } },
          { range: { public_section_lang_combined_date: monthRange(`${parts.year}-${parts.month}`) } },
        ];
        const data = await esSearch({ size: 1, query: { bool: { must } } });
        hit = data.hits?.hits?.[0] || null;
      }
    }

    if (!hit) throw new Error("Artikel niet gevonden");

    const s = hit._source || {};
    const full = {
      title: s.public_section_lang_title || article.title,
      author: (s.public_section_lang_author_full_name || []).join(", ") || article.author || "",
      date: s.public_section_lang_combined_date || article.date || "",
      dateLabel: formatHtDate(s.public_section_lang_combined_date || article.date),
      publication: s.public_section_lang_publication_name || article.publication || "Verborgen Schatten",
      body: s.public_section_lang_body_plain || article.excerpt || "",
      url: buildArticleUrl(hit),
    };

    articleCache.set(cacheKey, full);
    return full;
  }

  window.HT_LINKS = {
    lookupArticle,
    buildSearchUrl,
    parseSource,
    searchArticles,
    searchArticlesOnce,
    findRelatedArticles,
    findStepExplanations,
    fetchFullArticle,
    articlesFromQuotes,
    buildQueryForTopic,
    queryVariants,
    articleFromHit,
    formatHtDate,
    isGranularTopic,
  };
})();
