const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

const marker = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Hemelse plaats</span>
          <h3 class="scene-divider-title">Met God in de hemel geplaatst`;

if (!s.includes(marker)) {
  console.error("insert marker not found");
  process.exit(1);
}

if (s.includes("bz-overzicht")) {
  console.log("bz section already present");
  process.exit(0);
}

const block = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Heiligmaking</span>
          <h3 class="scene-divider-title">Bezoedeling des vleses en des geestes</h3>
        </div>

        <div class="bz-scene reveal">
          <div class="bz-key tap" data-topic="bz-overzicht" tabindex="0" role="button">
            <strong>Kern (2 Kor. 7:1):</strong> Reinig je van <strong>alle bezoedeling des vleses</strong>
            (lichaam, begeerte, wereld) \u00e9n <strong>des geestes</strong> (leer, leugen, verkeerde geest) —
            en <strong>volmaak je heiligheid</strong> in de vreze Gods.
          </div>

          <div class="bz-split">
            <div class="bz-col bz-col-vlees">
              <div class="bz-col-head">
                <span class="bz-col-icon" aria-hidden="true">\u25c7</span>
                <div>
                  <h4>Bezoedeling des vlezes</h4>
                  <p class="bz-col-sub">Lichaam \u00b7 begeerte \u00b7 wereld</p>
                </div>
              </div>
              <button type="button" class="bz-node tap" data-topic="bz-vlees" tabindex="0">
                <span class="bz-node-title">Wat is het?</span>
                <span class="bz-node-desc">Vleselijke natuur, leden, zinnelijkheid</span>
              </button>
              <button type="button" class="bz-node tap" data-topic="bz-ongelijk-span" tabindex="0">
                <span class="bz-node-title">Ongelijk span</span>
                <span class="bz-node-desc">2 Kor. 6:14 \u2014 besmetting door de wereld</span>
              </button>
              <button type="button" class="bz-node tap" data-topic="bz-tong" tabindex="0">
                <span class="bz-node-title">Tong &amp; lichaam</span>
                <span class="bz-node-desc">Jak. 3:6 \u2014 het hele lichaam bezoedelen</span>
              </button>
            </div>

            <div class="bz-center">
              <div class="bz-verse-badge">2 Kor. 7:1</div>
              <p class="bz-center-text">Reinigen van <strong>alle</strong> bezoedeling</p>
              <svg class="bz-center-arrows" viewBox="0 0 120 80" aria-hidden="true">
                <path d="M10 40 H45 M38 33 L45 40 L38 47" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M110 40 H75 M82 33 L75 40 L82 47" fill="none" stroke="currentColor" stroke-width="2"/>
                <rect x="46" y="22" width="28" height="36" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <p class="bz-center-goal">Heiligheid volmaken<br /><span>in de vreze Gods</span></p>
              <button type="button" class="bz-reinigen tap" data-topic="bz-reinigen" tabindex="0">
                Hoe reinigen? \u2192
              </button>
            </div>

            <div class="bz-col bz-col-geest">
              <div class="bz-col-head">
                <span class="bz-col-icon" aria-hidden="true">\u2727</span>
                <div>
                  <h4>Bezoedeling des geestes</h4>
                  <p class="bz-col-sub">Leer \u00b7 houding \u00b7 leugen</p>
                </div>
              </div>
              <button type="button" class="bz-node tap" data-topic="bz-geest" tabindex="0">
                <span class="bz-node-title">Wat is het?</span>
                <span class="bz-node-desc">Geestelijke onreinheid, niet lichaam</span>
              </button>
              <button type="button" class="bz-node tap" data-topic="bz-leer" tabindex="0">
                <span class="bz-node-title">Vreemde leer</span>
                <span class="bz-node-desc">Afdrijven van de waarheid</span>
              </button>
              <button type="button" class="bz-node tap" data-topic="bz-leugen" tabindex="0">
                <span class="bz-node-title">Wereld van leugen</span>
                <span class="bz-node-desc">Gevoelens, achterdocht, leugen</span>
              </button>
            </div>
          </div>

          <div class="bz-bridge tap" data-topic="dw-heiligmaking" tabindex="0" role="button">
            <span class="bz-bridge-label">Op de discipelweg</span>
            <strong>Stap 7: Heiligmaking</strong> \u2014 van licht tot licht, geleidelijk gereinigd
          </div>
        </div>

        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Hemelse plaats</span>
          <h3 class="scene-divider-title">Met God in de hemel geplaatst`;

s = s.replace(marker, block);
writeFileSync(path, s, "utf8");
console.log("patch-bz-section: klaar");
