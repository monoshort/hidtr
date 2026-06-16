const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

const marker = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Elke dag</span>
          <h3 class="scene-divider-title">Dagelijkse praktijk op de weg</h3>
        </div>`;

if (!s.includes(marker)) {
  console.error("insert marker not found");
  process.exit(1);
}

if (s.includes("hm-overzicht")) {
  console.log("hm section already present");
  process.exit(0);
}

const block = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Hemelse plaats</span>
          <h3 class="scene-divider-title">Met God in de hemel geplaatst — wat gebeurt er?</h3>
        </div>

        <div class="hm-scene reveal">
          <div class="hm-key tap" data-topic="hm-overzicht" tabindex="0" role="button">
            <strong>Kern:</strong> Met Christus <strong>opgewekt en in de hemel geplaatst</strong> (Ef. 2:6) —
            niet de oude mens, maar <strong>hart en gezindheid</strong>. Het leven is
            <strong>verborgen met Christus in God</strong> (Kol. 3:3) en werkt uit op aarde door de Geest.
          </div>

          <div class="hm-diagram">
            <div class="hm-main">
              <button type="button" class="hm-node hm-heaven tap" data-topic="hm-christus" tabindex="0">
                <span class="hm-node-eyebrow">Boven</span>
                <span class="hm-node-title">Christus in de hemel</span>
                <span class="hm-node-desc">Opgewekt · gezeten aan Gods rechterhand · Ef. 2:6</span>
              </button>

              <svg class="hm-beam-svg" viewBox="0 0 280 48" aria-hidden="true">
                <path d="M140 4v16" stroke="currentColor" stroke-width="2"/>
                <path d="M72 20 L140 44" stroke="currentColor" stroke-width="2"/>
                <path d="M208 20 L140 44" stroke="currentColor" stroke-width="2"/>
                <circle cx="140" cy="4" r="3" fill="currentColor"/>
                <circle cx="140" cy="44" r="4" fill="currentColor"/>
              </svg>

              <p class="hm-placed-label">In de hemel geplaatst</p>

              <div class="hm-placed-grid">
                <button type="button" class="hm-placed tap" data-topic="hm-hart" tabindex="0">
                  <span class="hm-placed-icon" aria-hidden="true">♥</span>
                  <span class="hm-placed-name">Hart</span>
                  <span class="hm-placed-desc">Overleggingen · Woord smelt samen</span>
                </button>
                <button type="button" class="hm-placed tap" data-topic="hm-gezindheid" tabindex="0">
                  <span class="hm-placed-icon" aria-hidden="true">◎</span>
                  <span class="hm-placed-name">Gezindheid</span>
                  <span class="hm-placed-desc">Wil · instemmen met Gods wet</span>
                </button>
              </div>

              <button type="button" class="hm-node hm-hidden tap" data-topic="hm-verborgen" tabindex="0">
                <span class="hm-node-eyebrow">Verborgen</span>
                <span class="hm-node-title">Leven met Christus in God</span>
                <span class="hm-node-desc">Niet zichtbaar voor de wereld · Kol. 3:3</span>
              </button>

              <div class="hm-earth-bridge">
                <svg class="hm-earth-svg" viewBox="0 0 24 64" aria-hidden="true">
                  <path d="M12 4v44" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>
                  <path d="M6 52 L12 60 L18 52 Z" fill="currentColor"/>
                </svg>
                <span class="hm-earth-label">Praktisch op aarde</span>
              </div>

              <button type="button" class="hm-node hm-earth tap" data-topic="hm-aarde" tabindex="0">
                <span class="hm-node-eyebrow">Hier</span>
                <span class="hm-node-title">Geest leidt ziel en lichaam</span>
                <span class="hm-node-desc">Zoek wat boven is · lichaam als werktuig der gerechtigheid · Kol. 3:1</span>
                <span class="hm-traits">
                  <span class="tap" data-topic="geest" tabindex="0" role="button">geest</span>
                  <span class="tap" data-topic="dw-discipel" tabindex="0" role="button">discipel</span>
                </span>
              </button>
            </div>

            <aside class="hm-aside" aria-label="Niet in de hemel">
              <span class="hm-aside-label">Niet geplaatst</span>
              <button type="button" class="hm-aside-card hm-aside-no tap" data-topic="hm-oude-mens" tabindex="0">
                <span class="hm-aside-title">Oude mens</span>
                <span class="hm-aside-desc">Geen plaats in de hemel — terecht aan het kruis · Rom. 6:6</span>
              </button>
              <button type="button" class="hm-aside-card hm-aside-no tap" data-topic="lichaam-vlezes" tabindex="0">
                <span class="hm-aside-title">Lichaam des vlezes</span>
                <span class="hm-aside-desc">Afgelegd in de doop · niet wat boven regeert · Kol. 2:11</span>
              </button>
              <button type="button" class="hm-aside-card hm-aside-yes tap" data-topic="dw-doel" tabindex="0">
                <span class="hm-aside-title">Wel: gelijk aan Christus</span>
                <span class="hm-aside-desc">Van licht tot licht — volmaakte rijpheid · 2 Kor. 3:18</span>
              </button>
            </aside>
          </div>
        </div>

        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Elke dag</span>
          <h3 class="scene-divider-title">Dagelijkse praktijk op de weg</h3>
        </div>`;

s = s.replace(marker, block);
writeFileSync(path, s, "utf8");
console.log("Hemel-geplaatst section inserted in weg tab");
