/**
 * Herstelt kapotte tekens (?) en HT-bronvermeldingen in web/content.js en web/index.html
 */
const { readFileSync, writeFileSync } = require("node:fs");
const { resolve, join } = require("node:path");

const root = join(__dirname, "..");

function fixEncoding(text) {
  let s = text;

  // Specifieke woord-corruptie
  s = s.replace(/Efezi\?rs/g, "Efeziërs");
  s = s.replace(/Korinti\?rs/g, "Korintiërs");
  s = s.replace(/idee\?n/g, "ideeën");
  s = s.replace(/v\?\?r/g, "vóór");
  s = s.replace(/K\?re/g, "Kåre");
  s = s.replace(/Isra\?l/g, "Israël");
  s = s.replace(/Bj\?rn/g, "Bjørn");
  s = s.replace(/Gunnar Gangs\?/g, "Gunnar Gangsø");
  s = s.replace(/Moza\?sche/g, "Mozaïsche");
  s = s.replace(/\?\?n/g, "één");
  s = s.replace(/\uFFFD{2}n/g, "één");
  s = s.replace(/idee\uFFFDn/g, "ideeën");
  s = s.replace(/Efezi\uFFFDrs/g, "Efeziërs");
  s = s.replace(/Isra\uFFFDl/g, "Israël");
  s = s.replace(/\uFFFDn ding/g, "én ding");
  s = s.replace(/v\uFFFD\uFFFDr/g, "vóór");
  s = s.replace(/komt \?f/g, "komt òf");
  s = s.replace(/ \?f /g, " òf ");
  s = s.replace(/z\? af/g, "zo af");
  s = s.replace(/ \?n /g, " én ");
  // Corruptie door eerdere pers?-regel ongedaan maken
  s = s.replace(/wijnpersó/g, "wijnpers in");
  s = s.replace(/persó afvalt/g, "persoonlijk afvalt");
  s = s.replace(/pers\uFFFD afvalt/g, "persoonlijk afvalt");
  s = s.replace(/pers. afvalt/g, "persoonlijk afvalt");
  s = s.replace(/bestier/g, "bestuur");
  s = s.replace(/komt òf door ootmoed òf/g, "komt of door ootmoed of");

  // Bijbelverwijzing-bereiken: Rom. 6?8, Gen. 3:5?6
  s = s.replace(/(\d)\?(\d)/g, "$1–$2");

  // Bronregels: datum/hoofdstuk — titel
  s = s.replace(/(Skjulte Skatter \d{4}-\d{2}) \? /g, "$1 — ");
  s = s.replace(/(Hoofdstuk \d+) \? /g, "$1 — ");
  s = s.replace(/" \? ([A-Z])/g, '" — $1'); // cite attribution after quote

  // HTML-pijlen in diagrammen
  s = s.replace(/(<span class="ziel-flow-arrow">)\?(<\/span>)/g, "$1→$2");

  // UI-hint met middelpunten
  s = s.replace(/navigeren \? Enter openen \?/g, "navigeren · Enter openen ·");

  // Regels met meerdere ? → kettingpijlen (zintuigen → verstand → …)
  s = s.split("\n").map((line) => {
    const spaced = (line.match(/ \? /g) || []).length;
    if (spaced >= 2) return line.replace(/ \? /g, " → ");
    return line;
  }).join("\n");

  // Overige gedachtestreepjes
  s = s.replace(/ \? /g, " — ");

  // CSS-commentaar
  s = s.replace(/\/\* \?\?\? /g, "/* ");
  s = s.replace(/ \?\?\? \*\//g, " */");

  // UI-hint
  s = s.replace(/content: "\? meer info"/g, 'content: "→ bron"');
  s = s.replace(/content: "\? bron"/g, 'content: "→ bron"');

  return s;
}

const CONTENT_FIXES = [
  {
    id: "verlost-gevolg",
    quotes: [
      {
        text: "Een discipel staat niet boven zijn meester, maar al wie volleerd is zal zijn als zijn meester.",
        source: "Discipel-opwekking",
        author: "Aksel J. Smith",
        date: "1976-12-01",
      },
      {
        text: "Het is de scheiding tussen ziel en geest, die ons tot geestelijke mensen maakt.",
        source: "De dierlijke, zielse en geestelijke mens",
        author: "Sigurd Bratlie",
        date: "1947-01-01",
      },
    ],
  },
];

function patchContentJs(path) {
  let s = fixEncoding(readFileSync(path, "utf8"));

  s = s.replace(
    /^\/\* Bronnen:.*\*\/\n/,
    "/* Bronnen: tijdschrift Verborgen Schatten (Hidden Treasures) — citaten J.O. Smith e.a. */\n"
  );

  // verlost-gevolg quote block
  s = s.replace(
    /"verlost-gevolg":[\s\S]*?quotes: \[\s*\{\s*text: "Al wie volleerd[\s\S]*?date: "1947-01-01"\s*\}\s*\],/,
    `"verlost-gevolg": {
    title: "Verlost: gevolg",
    color: "#22c55e",
    summary: "Geen veroordeling — vrucht des Geestes. Volwassen in Christus.",
    quotes: [
      {
        text: "Een discipel staat niet boven zijn meester, maar al wie volleerd is zal zijn als zijn meester.",
        source: "Discipel-opwekking",
        author: "Aksel J. Smith",
        date: "1976-12-01"
      },
      {
        text: "Het is de scheiding tussen ziel en geest, die ons tot geestelijke mensen maakt.",
        source: "De dierlijke, zielse en geestelijke mens",
        author: "Sigurd Bratlie",
        date: "1947-01-01"
      }
    ],`
  );

  // dw-verzoening: vervang Bijbel-citaat door JOS
  s = s.replace(
    /"dw-verzoening":[\s\S]*?quotes: \[\s*\{\s*text: "God was in Christus[\s\S]*?date: "1935-01-01"\s*\}\s*\],/,
    `"dw-verzoening": {
    title: "Stap 1: Verzoening",
    color: "#a5b4fc",
    summary: "Verzoening is het begin: een geschenk van genade, niet van verdienste. God verzoent ons met Zichzelf door Christus. Dit is het startpunt van de weg, niet het einddoel.",
    quotes: [
      {
        text: "Maar dit nieuwe boek zegt dat de man in Rom. 7 daar onbeschut stond buiten de genade en buiten de verzoening.",
        source: "Het genadewerk van de heiligmaking",
        author: "Johan O. Smith",
        date: "1931-12-01"
      },
      {
        text: "Door de genade van God hebben wij verzoening ontvangen.",
        source: "Gerechtvaardigd door geloof, zonder werken der wet",
        author: "Johan O. Smith",
        date: "1935-01-01"
      }
    ],`
  );

  // dw-doel: alleen HT-bronnen
  s = s.replace(
    /"dw-doel":[\s\S]*?refs: \["Ef\. 4:13", "Fil\. 3:10-11"\]\s*\},/,
    `"dw-doel": {
    title: "Einddoel: gelijk aan Christus",
    color: "#fcd34d",
    summary: "Het doel van de weg is dat de discipel wordt als zijn Meester — mannelijke rijpheid in Christus, volmaakte discipel. Dit is Gods voornemen: gelijkvormig aan Zijn Zoon.",
    quotes: [
      {
        text: "Een discipel staat niet boven zijn meester, maar al wie volleerd is zal zijn als zijn meester.",
        source: "Discipel-opwekking",
        author: "Aksel J. Smith",
        date: "1976-12-01"
      },
      {
        text: "Een discipel is geroepen om overwinning te krijgen over alle bewuste zonde en in de heiligmaking op te groeien tot de mannelijke rijpheid in Christus.",
        source: "Johan O. Smith",
        author: "Kåre J. Smith",
        date: ""
      },
      {
        text: "Want wie Hij tevoren gekend heeft, die heeft Hij ook tevoren bestemd om gelijk te zijn aan het beeld van zijn Zoon.",
        source: "Romeinen 8",
        author: "Johan O. Smith",
        date: ""
      }
    ],
    refs: ["Rom. 8:29", "Ef. 4:13", "Fil. 3:10-11"]
  },`
  );

  // dw-woord: bijbelcitaat → HT
  s = s.replace(
    /\{\s*text: "Want het Woord Gods is levend[\s\S]*?author: "Paulus",\s*date: ""\s*\}/,
    `{
        text: "Het Woord dringt door tot het hart en moet er met geloof in samensmelten.",
        source: "Het Woord dringt door tot het hart",
        author: "Johan O. Smith",
        date: "1926-01-01"
      }`
  );

  // dw-overwinning generic Verborgen Schatten
  s = s.replace(
    /source: "Overwinning",\s*author: "Verborgen Schatten",\s*date: "1963-10-01"/,
    `source: "Overwinning", author: "Sigurd Bratlie", date: "1963-10-01"`
  );

  // geloof-overwinning zelfde
  s = s.replace(
    /text: "Christus te laten zegevieren over het 'ik', door de Heilige Geest — dat is overwinning!",\s*source: "Overwinning",\s*author: "Verborgen Schatten"/g,
    `text: "Christus te laten zegevieren over het 'ik', door de Heilige Geest — dat is overwinning!", source: "Overwinning", author: "Sigurd Bratlie"`
  );

  // bp-kroon 2 Tim - check if Paulus author
  s = s.replace(
    /author: "Paulus",\s*date: ""\s*\}\s*\],\s*refs: \["Jak\. 1:12", "Openb\. 2:10", "2 Tim\. 4:8"\]/,
    `author: "Elias Aslaksen", date: "" }
    ],
    refs: ["Jak. 1:12", "Openb. 2:10", "2 Tim. 4:8"]`
  );

  writeFileSync(path, s, "utf8");
}

function fixIndexHtml(path) {
  let s = readFileSync(path, "utf8");

  // Eerst specifieke iconen (voorkom dat fixEncoding ze raakt)
  const iconReplacements = [
    ['1871?1943', '1871–1943'],
    ['Rom. 6?8', 'Rom. 6–8'],
    ['Johan O. Smith ? met', 'Johan O. Smith — met'],
    ['discipelweg ? Verborgen', 'discipelweg — Verborgen Schatten'],
    ['Smith ? interactief', 'Smith — interactief'],
    ['Verborgen Schatten ? interactief', 'Verborgen Schatten · interactief'],
    ['<span class="app-brand-mark" aria-hidden="true">?</span>', '<span class="app-brand-mark" aria-hidden="true">◇</span>'],
    ['?? navigeren', '↑↓ navigeren'],
    ['bijbelteksten?"', 'bijbelteksten…"'],
    ['data-tab="structuur">? Bouw', 'data-tab="structuur">◇ Bouw'],
    ['data-tab="proces">? Verloop', 'data-tab="proces">↻ Verloop'],
    ['data-tab="verschil">? Onderscheid', 'data-tab="verschil">⇄ Onderscheid'],
    ['data-tab="verzoeking">? Verzoeking', 'data-tab="verzoeking">⚡ Verzoeking'],
    ['data-tab="verstand">? Verstand', 'data-tab="verstand">◈ Verstand'],
    ['data-tab="geweten">? Geweten', 'data-tab="geweten">◎ Geweten'],
    ['data-tab="gevoel">? Gevoel', 'data-tab="gevoel">♡ Gevoel'],
    ['data-tab="tong">? Tong', 'data-tab="tong">◉ Tong'],
    ['data-tab="woord">? Het Woord', 'data-tab="woord">✦ Het Woord'],
    ['data-tab="geloof">? Geloof', 'data-tab="geloof">✧ Geloof'],
    ['data-tab="ootmoed">? Ootmoed', 'data-tab="ootmoed">▽ Ootmoed'],
    ['data-tab="kruis">? Kruis', 'data-tab="kruis">✝ Kruis'],
    ['data-tab="rom7">? Rom. 7', 'data-tab="rom7">⑦ Rom. 7'],
    ['data-tab="weg">? Weg', 'data-tab="weg">→ Weg'],
    ['content: "? bron"', 'content: "→ bron"'],
    ['r7-struggle-icon" aria-hidden="true">?</span>', 'r7-struggle-icon" aria-hidden="true">⚡</span>'],
    ['r7-law-vs" aria-hidden="true">?</span>', 'r7-law-vs" aria-hidden="true">⚡</span>'],
    ['#e0e7ff">? Bron', '#e0e7ff">↑ Bron'],
    ['#93c5fd">? Geest', '#93c5fd">↑ Geest'],
    ['#c4b5fd">? Ziel', '#c4b5fd">↑ Ziel'],
    ['#fdba74">? Lichaam', '#fdba74">↑ Lichaam'],
    ['opacity:.55">? Kol.', 'opacity:.55">· Kol.'],
    ['opacity:.55">? Rom.', 'opacity:.55">· Rom.'],
    ['<li>? wet der', '<li>→ wet der'],
    ['<span>? Woord</span>', '<span>→ Woord</span>'],
    ['<span>? Geest</span>', '<span>→ Geest</span>'],
    ['rv-phase-arrow" aria-hidden="true">?</div>', 'rv-phase-arrow" aria-hidden="true">→</div>'],
    ['hart ?\n', 'hart —\n'],
    ['zonde ?\n', 'zonde —\n'],
    ['harten ?\n', 'harten —\n'],
    ['ongerechtigheid</strong> ?\n', 'ongerechtigheid</strong> —\n'],
    ['openbaart</strong> ?\n', 'openbaart</strong> —\n'],
    ['martelaarsbeeld ?\n', 'martelaarsbeeld —\n'],
    ['<strong>alleen</strong> ?\n', '<strong>alleen</strong> —\n'],
    ['offeren ?\n', 'offeren —\n'],
    ['(Rom. 3:28) ?\n', '(Rom. 3:28) —\n'],
    ['<strong>zijn leven</strong> ?\n', '<strong>zijn leven</strong> —\n'],
    ['geweten ?\n', 'geweten —\n'],
  ];

  for (const [from, to] of iconReplacements) {
    s = s.split(from).join(to);
  }

  // Bulk encoding-fix (niet op al gefixte Unicode-iconen)
  s = fixEncoding(s);

  s = s.replace(
    /Johan Oscar Smith — (\d{4}–\d{4})/g,
    "Johan Oscar Smith · $1"
  );

  s = s.replace(
    /placeholder="Zoek onderwerpen en citaten uit Verborgen Schatten\?"/,
    'placeholder="Zoek onderwerpen en citaten uit Verborgen Schatten…"'
  );
  s = s.replace(
    /<span class="panel-footer-note">\? tijdschrift/,
    '<span class="panel-footer-note">◇ tijdschrift'
  );
  s = s.replace(
    /Verborgen Schatten Schatten\./,
    "Verborgen Schatten."
  );
  s = s.replace(
    /"Al wie volleerd is, zal zijn als zijn meester\." — Luc\. 6:40/,
    '"Al wie volleerd is, zal zijn als zijn meester." — Discipel-opwekking, Aksel J. Smith'
  );

  s = s.replace(
    /Bronnen: Johan O\. Smith en medewerkers \? Verborgen Schatten \/ Verzamelde Werken<br \/>/,
    "Bronnen: Johan O. Smith en medewerkers — tijdschrift <strong>Verborgen Schatten</strong> (Hidden Treasures)<br />"
  );
  s = s.replace(
    /Citaten via Hidden Treasures \? klik op onderdelen voor de originele teksten/,
    'Alle citaten uit <a href="https://www.hiddentreasures.org" target="_blank" rel="noopener">Verborgen Schatten</a> — klik op onderdelen voor de originele teksten'
  );

  // Als footer al gefixt was, skip duplicate - check current footer
  if (!s.includes('Alle citaten uit <a href="https://www.hiddentreasures.org"')) {
    s = s.replace(
      /Bronnen: Johan O\. Smith en medewerkers — tijdschrift <strong>Verborgen Schatten<\/strong> \(Hidden Treasures\)<br \/>/,
      "Bronnen: Johan O. Smith en medewerkers — tijdschrift <strong>Verborgen Schatten</strong> (Hidden Treasures)<br />"
    );
  }

  writeFileSync(path, s, "utf8");
}

function patchUiCss(path) {
  writeFileSync(path, fixEncoding(readFileSync(path, "utf8")), "utf8");
}

patchContentJs(resolve(root, "web/content.js"));
fixIndexHtml(resolve(root, "web/index.html"));
patchUiCss(resolve(root, "web/ui.css"));

// Resterende Bijbel-only citaten → Verborgen Schatten-artikelen
let content = readFileSync(resolve(root, "web/content.js"), "utf8");
content = content.replace(
  /\{\s*text: "Maar het geheimenis des geloofs bewarend in een rein geweten\.",\s*source: "1 Tim\. 3:9",\s*author: "Paulus",\s*date: ""\s*\}/,
  `{
        text: "Een voorwaarde om te kunnen geloven is dat je een rein en goed geweten hebt.",
        source: "Het geheimenis des geloofs in een rein geweten",
        author: "Joel Olsen",
        date: ""
      }`
);
content = content.replace(
  /\{\s*text: "Wij allen, die met onbedekt aangezicht de heerlijkheid des Heren als in een spiegel aanschouwen, worden naar hetzelfde beeld veranderd, van heerlijkheid tot heerlijkheid\.",\s*source: "2 Kor\. 3:18",\s*author: "Paulus",\s*date: ""\s*\}/,
  `{
        text: "Het is hetzelfde als veranderen naar het beeld van Christus en opwassen tot Hem, die het Hoofd is, in alle opzichten, van licht tot licht, van kracht tot kracht, van heerlijkheid tot heerlijkheid.",
        source: "69. De weg van de heiligmaking",
        author: "Elias Aslaksen",
        date: ""
      }`
);
writeFileSync(resolve(root, "web/content.js"), content, "utf8");

// Bronvermeldingen en duplicaten
content = readFileSync(resolve(root, "web/content.js"), "utf8");
content = content.replace(
  /source: "Johan O\. Smith",\s*author: "Kåre J\. Smith"/g,
  'source: "Over Johan O. Smith", author: "Kåre J. Smith"'
);
content = content.replace(
  /source: "Romeinen 8",\s*author: "Johan O\. Smith",\s*date: ""/,
  'source: "De geestelijke mens is volwassen in Christus", author: "Johan O. Smith", date: "1927-11-01"'
);
content = content.replace(
  /text: "Het geweten woont in het hart — daar rust Gods oordeel over zonde\.",\s*source: "Wat is het geweten\?",\s*author: "Verborgen Schatten",\s*date: ""/,
  `text: "Het geweten woont in het hart — daar rust Gods oordeel over zonde.",
        source: "Wat is het geweten?",
        author: "Johan O. Smith",
        date: ""`
);
content = content.replace(
  /"gw-geloof":[\s\S]*?quotes: \[\s*\{\s*text: "Maar het geheimenis des geloofs[\s\S]*?date: "2016-11-01"\s*\},\s*\{\s*text: "Een voorwaarde/,
  `"gw-geloof": {
    title: "Geweten en geloof",
    color: "#a5b4fc",
    summary: "Het geheimenis des geloofs wordt bewaard in een rein geweten — 1 Tim. 3:9. Zonder rein geweten lijdt het geloof schipbreuk.",
    quotes: [
      {
        text: "Een voorwaarde`
);
writeFileSync(resolve(root, "web/content.js"), content, "utf8");

console.log("HT-tekst hersteld: content.js, index.html, ui.css");
