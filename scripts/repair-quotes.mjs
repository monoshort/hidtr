#!/usr/bin/env node
/* Eenmalig: content.js rechtzetten tegen de Hidden Treasures-API. */
import fs from "fs";
import vm from "vm";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const contentPath = `${root}/content.js`;
const linksPath = `${root}/ht-links.js`;

const linksSrc = fs.readFileSync(linksPath, "utf8");
const ES_URL = linksSrc.match(/const ES_URL = "([^"]+)"/)[1];
const API_KEY = linksSrc.match(/const API_KEY = "([^"]+)"/)[1];

function fixText(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/K\?re/g, "Kåre")
    .replace(/Bj\?rn/g, "Bjørn")
    .replace(/Gangs\?/g, "Gangsø")
    .replace(/Efezi\?rs/g, "Efeziërs")
    .replace(/Isra\?l/g, "Israël")
    .replace(/Moza\?sche/g, "Mozaische")
    .replace(/idee\?n/g, "ideeën")
    .replace(/v\?\?r/g, "vóór")
    .replace(/\?\?n/g, "één")
    .replace(/ is \?n /g, " is één ")
    .replace(/w\?l /g, "wél ")
    .replace(/ \? /g, " — ");
}

function walkFix(value) {
  if (typeof value === "string") return fixText(value);
  if (Array.isArray(value)) return value.map(walkFix);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walkFix(v);
    return out;
  }
  return value;
}

function parseSource(source, quoteDate) {
  if (!source || source === "?") return null;
  const magazine = source.match(
    /^(?:Skjulte Skatter|Verborgen Schatten)\s+(\d{4})-(\d{2})\s*[?–—\-]\s*(.+)$/i
  );
  if (magazine) return { title: magazine[3].trim(), issueDate: `${magazine[1]}-${magazine[2]}` };
  const hoofdstuk = source.match(/^Hoofdstuk\s+\d+\s*[?–—\-]\s*(.+)$/i);
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

function monthRange(ym) {
  const [y, m] = ym.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { gte: `${y}-${String(m).padStart(2, "0")}-01`, lt: next };
}

function snippet(text) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  const words = t.split(" ").filter(Boolean);
  if (words.length <= 10) return t;
  const start = Math.min(2, Math.max(0, words.length - 10));
  return words.slice(start, start + 10).join(" ");
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[‘’´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set("de het een en van in op aan die dat als na met niet door tot zijn kan wordt weer ook om te bij is er zo dan dit maar omdat want hun ons men wie waar wat hoe nog wel geen alleen daar hier der des".split(" "));

function tokens(s) {
  return normalize(s)
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

function overlapScore(a, b) {
  const ta = tokens(a);
  const tb = new Set(tokens(b));
  if (!ta.length) return 0;
  return ta.filter((w) => tb.has(w)).length / ta.length;
}

function bestSentence(body, quote) {
  if (!body) return null;
  const nQuote = normalize(quote);
  const nBody = normalize(body);
  if (nQuote.length >= 24 && nBody.includes(nQuote)) return { exact: true, text: quote, score: 1 };

  const sentences = String(body)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z"“‘(])/)
    .map((x) => x.trim())
    .filter((x) => x.length > 30);
  let best = null;
  let bestScore = 0;
  for (const sent of sentences) {
    const score = overlapScore(quote, sent);
    if (score > bestScore) {
      bestScore = score;
      best = sent;
    }
  }
  if (best && bestScore >= 0.55) return { exact: false, text: best, score: bestScore };
  return null;
}

function metaFromHit(hit) {
  const s = hit._source || {};
  return {
    title: s.public_section_lang_title || "",
    author: (s.public_section_lang_author_full_name || []).join(", "),
    date: s.public_section_lang_combined_date || "",
    body: s.public_section_lang_body_plain || "",
  };
}

function scoreHit(hit, parsed) {
  const s = hit._source || {};
  const title = String(s.public_section_lang_title || "").toLowerCase();
  const authors = (s.public_section_lang_author_full_name || []).join(" ").toLowerCase();
  const htDate = String(s.public_section_lang_combined_date || "");
  const wantTitle = String(parsed.title || "").toLowerCase();
  const wantAuthor = String(parsed.author || "").toLowerCase();
  const wantDate = parsed.issueDate || "";
  let score = 0;
  if (wantTitle && title === wantTitle) score += 8;
  else if (wantTitle && (title.startsWith(`${wantTitle} (`) || title.startsWith(`${wantTitle} —`) || title.startsWith(`${wantTitle} -`))) score += 7;
  else if (wantTitle && title.includes(wantTitle)) score += 4;
  if (wantAuthor) {
    const parts = wantAuthor.split(/\s+/).filter((w) => w.length > 1);
    const first = parts[0];
    const last = parts[parts.length - 1];
    if (first && authors.includes(first)) score += 8;
    if (last && last !== first && authors.includes(last)) score += 6;
  }
  if (wantDate && htDate.startsWith(wantDate)) score += 10;
  else if (wantDate && htDate.slice(0, 4) === wantDate.slice(0, 4)) score += 2;
  return score;
}

async function esSearch(body) {
  const res = await fetch(ES_URL, {
    method: "POST",
    headers: { Authorization: `ApiKey ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ES ${res.status}`);
  return res.json();
}

const SOURCE_FIELDS = [
  "public_section_lang_title",
  "public_section_lang_author_full_name",
  "public_section_lang_combined_date",
  "public_section_lang_body_plain",
];

async function searchBody(snip) {
  if (!snip || snip.length < 12) return null;
  const data = await esSearch({
    size: 3,
    query: {
      bool: {
        must: [
          { range: { public_section_lang_access_level: { lte: 2 } } },
          { match_phrase: { public_section_lang_body_plain: snip } },
        ],
      },
    },
    _source: SOURCE_FIELDS,
  });
  return data.hits?.hits?.[0] || null;
}

async function searchTitle(parsed) {
  const access = { range: { public_section_lang_access_level: { lte: 2 } } };
  const should = [
    { match_phrase: { public_section_lang_title: parsed.title } },
    { match: { public_section_lang_title: { query: parsed.title, operator: "and" } } },
  ];
  const must = [access];
  if (parsed.issueDate) must.push({ range: { public_section_lang_combined_date: monthRange(parsed.issueDate) } });
  let data = await esSearch({
    size: 8,
    query: { bool: { must, should, minimum_should_match: 1 } },
    _source: SOURCE_FIELDS,
  });
  let hits = data.hits?.hits || [];
  if (!hits.length && parsed.issueDate) {
    data = await esSearch({
      size: 8,
      query: { bool: { must: [access], should, minimum_should_match: 1 } },
      _source: SOURCE_FIELDS,
    });
    hits = data.hits?.hits || [];
  }
  if (!hits.length) return null;
  hits.sort((a, b) => scoreHit(b, parsed) - scoreHit(a, parsed));
  return hits[0];
}

async function poolMap(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

const raw = fs.readFileSync(contentPath);
const src = raw.toString("latin1");
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const topics = walkFix(ctx.window.HT_TOPICS);

const unique = new Map();
for (const [id, topic] of Object.entries(topics)) {
  for (const q of topic.quotes || []) {
    const key = `${q.text}||${q.source}||${q.author}||${q.date || ""}`;
    if (!unique.has(key)) unique.set(key, { ...q, _ids: [id] });
    else unique.get(key)._ids.push(id);
  }
}

const bodyCache = new Map();
const titleCache = new Map();
const resolved = new Map();

const stats = {
  exactBody: 0,
  closeSentence: 0,
  metaOnly: 0,
  unchanged: 0,
};

const items = [...unique.entries()];
await poolMap(items, 4, async ([key, q]) => {
  const parsed = parseSource(q.source, q.date) || { title: q.source };
  parsed.author = q.author;
  const snip = snippet(q.text);

  let hit = null;
  if (bodyCache.has(snip)) hit = bodyCache.get(snip);
  else {
    try {
      hit = await searchBody(snip);
    } catch {
      hit = null;
    }
    bodyCache.set(snip, hit);
  }

  if (!hit && parsed.title && parsed.title.length > 3 && !/^\d+\s/.test(parsed.title) && !/^(1 |2 |Rom|Ef|Hebr|Joh|Kor|Pet|Tim|Thess|Gal|Kol|Jak)/i.test(parsed.title)) {
    const ck = `${parsed.title}|${parsed.issueDate || ""}|${parsed.author || ""}`;
    if (titleCache.has(ck)) hit = titleCache.get(ck);
    else {
      try {
        hit = await searchTitle(parsed);
      } catch {
        hit = null;
      }
      titleCache.set(ck, hit);
    }
  }

  if (!hit) {
    stats.unchanged++;
    resolved.set(key, q);
    return;
  }

  const meta = metaFromHit(hit);
  const found = bestSentence(meta.body, q.text);
  const next = {
    text: q.text,
    source: meta.title || q.source,
    author: meta.author || q.author,
    date: meta.date || q.date || "",
  };

  if (found?.exact) {
    stats.exactBody++;
  } else if (found?.text) {
    next.text = found.text;
    stats.closeSentence++;
  } else {
    stats.metaOnly++;
  }

  resolved.set(key, next);
});

for (const topic of Object.values(topics)) {
  topic.quotes = (topic.quotes || []).map((q) => {
    const key = `${q.text}||${q.source}||${q.author}||${q.date || ""}`;
    const r = resolved.get(key);
    if (!r) return q;
    return {
      text: r.text,
      source: r.source,
      author: r.author,
      date: r.date,
    };
  });
}

const header = "/* Bronnen: tijdschrift Verborgen Schatten (Hidden Treasures) — citaten J.O. Smith e.a. */\n";
const out = `${header}window.HT_TOPICS = ${JSON.stringify(topics, null, 2)};\n`;
fs.writeFileSync(contentPath, out, "utf8");

console.log(JSON.stringify({ unique: unique.size, ...stats, bytes: out.length }, null, 2));
