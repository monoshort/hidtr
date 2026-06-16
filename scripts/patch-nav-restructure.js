/**
 * Herstructureert navigatie: 5 hubs + start-sectie met leerpad.
 * Idempotent — veilig meerdere keren uit te voeren.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "web", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

/* ——— Hub-nav vervangt platte 15-tab nav ——— */
if (!html.includes('class="nav-hub"')) {
  const oldNav = html.match(/<div class="nav-wrap">[\s\S]*?<\/nav>\s*<\/div>/);
  if (!oldNav) throw new Error("nav-wrap niet gevonden");

  const newNav = `<div class="nav-wrap" id="nav-wrap">
      <nav class="nav-hub" role="navigation" aria-label="Hoofdonderdelen">
        <button type="button" class="nav-hub-btn active" data-hub="start" aria-current="page">
          <span class="nav-icon" aria-hidden="true">◎</span> Start
        </button>
        <button type="button" class="nav-hub-btn" data-hub="fundament">
          <span class="nav-icon" aria-hidden="true">◇</span> Fundament
        </button>
        <button type="button" class="nav-hub-btn" data-hub="innerlijk">
          <span class="nav-icon" aria-hidden="true">◈</span> Innerlijk
        </button>
        <button type="button" class="nav-hub-btn" data-hub="geloof">
          <span class="nav-icon" aria-hidden="true">✧</span> Geloof
        </button>
        <button type="button" class="nav-hub-btn" data-hub="weg">
          <span class="nav-icon" aria-hidden="true">→</span> Weg
        </button>
      </nav>
      <nav class="nav-sub" id="nav-sub" role="tablist" aria-label="Subonderdelen" hidden></nav>
      <nav class="nav nav-registry" aria-hidden="true" hidden>
        <button data-tab="structuur">Bouw</button>
        <button data-tab="proces">Verloop</button>
        <button data-tab="rom7">Rom. 7</button>
        <button data-tab="verzoeking">Verzoeking</button>
        <button data-tab="verstand">Verstand</button>
        <button data-tab="geweten">Geweten</button>
        <button data-tab="gevoel">Gevoel</button>
        <button data-tab="tong">Tong</button>
        <button data-tab="verschil">Onderscheid</button>
        <button data-tab="woord">Het Woord</button>
        <button data-tab="geloof">Geloof</button>
        <button data-tab="ootmoed">Ootmoed</button>
        <button data-tab="kruis">Kruis</button>
        <button data-tab="weg">Weg</button>
      </nav>
    </div>`;

  html = html.replace(oldNav[0], newNav);
}

/* ——— Start-sectie met leerpad ——— */
if (!html.includes('id="start"')) {
  const startSection = `
    <section id="start" class="active">
      <div class="section-head section-head-start">
        <span class="section-eyebrow">Overzicht</span>
        <h2 class="section-title">Het leerpad</h2>
        <p class="section-sub">Vijf samenhangende delen — van de bouw van de mens tot de dagelijkse discipelweg. Klik een kaart om te beginnen, of gebruik <kbd class="inline-kbd">Ctrl K</kbd> om direct te zoeken.</p>
      </div>

      <div class="journey-path" aria-hidden="true">
        <span class="journey-step done">Fundament</span>
        <span class="journey-arrow">→</span>
        <span class="journey-step">Innerlijk</span>
        <span class="journey-arrow">→</span>
        <span class="journey-step">Geloof</span>
        <span class="journey-arrow">→</span>
        <span class="journey-step">Weg</span>
      </div>

      <div class="hub-grid">
        <button type="button" class="hub-card hub-card-fundament tap" data-goto-hub="fundament" data-goto-tab="structuur">
          <span class="hub-card-num">1</span>
          <span class="hub-card-icon" aria-hidden="true">◇</span>
          <h3>Fundament</h3>
          <p>De bouw van de mens, het verloop van verzoeking, Romeinen 7 en het onderscheid tussen ziel en geest.</p>
          <span class="hub-card-topics">Bouw · Verloop · Rom. 7 · Onderscheid</span>
        </button>
        <button type="button" class="hub-card hub-card-innerlijk tap" data-goto-hub="innerlijk" data-goto-tab="verzoeking">
          <span class="hub-card-num">2</span>
          <span class="hub-card-icon" aria-hidden="true">◈</span>
          <h3>Innerlijk leven</h3>
          <p>Waar verzoeking binnenkomt en hoe verstand, geweten, gevoel en tong reageren.</p>
          <span class="hub-card-topics">Verzoeking · Verstand · Geweten · Gevoel · Tong</span>
        </button>
        <button type="button" class="hub-card hub-card-geloof tap" data-goto-hub="geloof" data-goto-tab="woord">
          <span class="hub-card-num">3</span>
          <span class="hub-card-icon" aria-hidden="true">✧</span>
          <h3>Geloof &amp; Woord</h3>
          <p>Hoe God spreekt, wat geloof is, rechtvaardiging en de zeven geesten van God.</p>
          <span class="hub-card-topics">Het Woord · Geloof</span>
        </button>
        <button type="button" class="hub-card hub-card-weg tap" data-goto-hub="weg" data-goto-tab="ootmoed">
          <span class="hub-card-num">4</span>
          <span class="hub-card-icon" aria-hidden="true">→</span>
          <h3>Weg des levens</h3>
          <p>Ootmoed, het kruis, hemelse plaatsing en dagelijkse discipelschap.</p>
          <span class="hub-card-topics">Ootmoed · Kruis · Weg</span>
        </button>
      </div>

      <div class="start-quick">
        <span class="start-quick-label">Snel naar</span>
        <button type="button" class="start-chip" data-goto-tab="structuur">Diagram mens</button>
        <button type="button" class="start-chip" data-goto-tab="rom7">Rom. 7</button>
        <button type="button" class="start-chip" data-goto-tab="gst-overzicht" data-goto-topic="gst-overzicht">God spreekt</button>
        <button type="button" class="start-chip" data-goto-tab="geloof">Geloof</button>
        <button type="button" class="start-chip" data-goto-tab="hm-overzicht" data-goto-topic="hm-overzicht">In de hemel</button>
        <button type="button" class="start-chip" data-goto-tab="weg">Discipelweg</button>
      </div>
    </section>
`;

  html = html.replace(
    /<!-- STRUCTUUR -->\s*<section id="structuur" class="active">/,
    `${startSection}\n    <!-- STRUCTUUR -->\n    <section id="structuur">`
  );
} else if (html.includes('<section id="structuur" class="active">')) {
  html = html.replace('<section id="structuur" class="active">', '<section id="structuur">');
}

/* ——— Hero-knoppen naar logische startpunten ——— */
html = html.replace(
  'id="hero-start"',
  'id="hero-start" data-goto-hub="fundament" data-goto-tab="structuur"'
);

fs.writeFileSync(htmlPath, html, "utf8");
console.log("patch-nav-restructure: klaar");
