const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

const start = s.indexOf("    <!-- ROMEINEN 7 -->");
const end = s.indexOf("    <!-- VERZOEKING -->");
if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}

const replacement = `    <!-- ROMEINEN 7 -->
    <section id="rom7">
      <div class="section-head">
        <span class="section-eyebrow">Romeinen 7</span>
        <h2 class="section-title">Hoe Rom. 7 werkt</h2>
        <p class="section-sub">
          Twee wetten in één mens — klik op elk onderdeel voor citaten uit <strong>Verborgen Schatten</strong>.
        </p>
      </div>

      <div class="r7-scene">
        <div class="r7-key tap" data-topic="r7-overzicht" tabindex="0" role="button">
          <strong>Kern:</strong> De man in Rom. 7 staat buiten de volle genade — maar Paulus beschrijft de strijd
          tussen Gods wet in het innerlijk en de wet der zonde in de leden. Één mens, twee wetten (Rom. 7:25).
        </div>

        <div class="r7-context" role="navigation" aria-label="Context Rom. 7">
          <button type="button" class="r7-chip tap" data-topic="r7-man" tabindex="0">De man in Rom. 7</button>
          <button type="button" class="r7-chip tap" data-topic="r7-bekering" tabindex="0">Geweten wordt wakker</button>
        </div>

        <div class="r7-split">
          <div class="r7-zone r7-zone-ziel">
            <span class="r7-zone-badge">Ziel</span>
            <button type="button" class="r7-node tap" data-topic="r7-verstand" tabindex="0">
              <span class="r7-node-title">Verstand</span>
              <span class="r7-node-desc">Dient de wet van God · Rom. 7:23, 7:25</span>
            </button>
            <button type="button" class="r7-node tap" data-topic="r7-innerlijk" tabindex="0">
              <span class="r7-node-title">Innerlijke mens</span>
              <span class="r7-node-desc">Verblijd in Gods wet · Rom. 7:22</span>
            </button>
            <button type="button" class="r7-node tap" data-topic="r7-gezindheid" tabindex="0">
              <span class="r7-node-title">Gezindheid</span>
              <span class="r7-node-desc">Dienstbaar aan Gods wet · Rom. 7:25</span>
            </button>
          </div>

          <div class="r7-struggle">
            <button type="button" class="r7-struggle-label tap" data-topic="r7-strijd" tabindex="0">
              <span class="r7-struggle-icon" aria-hidden="true">⚡</span>
              <span class="r7-node-title">Strijd</span>
              <span class="r7-node-desc">"Wat ik wil, doe ik niet" · Rom. 7:15–19</span>
            </button>
            <svg class="r7-struggle-svg" viewBox="0 0 48 120" aria-hidden="true">
              <path d="M24 4v112" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/>
              <path d="M8 30 L24 44 L40 30" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M8 90 L24 76 L40 90" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>

          <div class="r7-zone r7-zone-lichaam">
            <span class="r7-zone-badge">Lichaam</span>
            <button type="button" class="r7-node tap" data-topic="r7-zonde-vlees" tabindex="0">
              <span class="r7-node-title">Zonde in het vlees</span>
              <span class="r7-node-desc">Niet ik, maar zonde in mij · Rom. 7:17, 7:20</span>
            </button>
            <button type="button" class="r7-node tap" data-topic="r7-leden" tabindex="0">
              <span class="r7-node-title">Leden</span>
              <span class="r7-node-desc">Andere wet · wet der zonde · Rom. 7:23</span>
            </button>
            <button type="button" class="r7-node tap" data-topic="r7-vlees" tabindex="0">
              <span class="r7-node-title">Vlees</span>
              <span class="r7-node-desc">Dienstbaar aan wet der zonde · Rom. 7:25</span>
            </button>
            <button type="button" class="r7-node r7-node-doods tap" data-topic="r7-lichaam-doods" tabindex="0">
              <span class="r7-node-title">Lichaam des doods</span>
              <span class="r7-node-desc">"Wie zal mij verlossen?" · Rom. 7:24</span>
            </button>
          </div>
        </div>

        <div class="scene-divider">
          <h3 class="scene-divider-title">Twee wetten — Rom. 7:25</h3>
        </div>

        <button type="button" class="r7-twee-wetten tap" data-topic="r7-twee-wetten" tabindex="0">
          <span class="r7-law r7-law-god">
            <span class="r7-law-label">Wet Gods</span>
            <span class="r7-law-text">Gezindheid en verstand</span>
          </span>
          <span class="r7-law-vs" aria-hidden="true">⇄</span>
          <span class="r7-law r7-law-zonde">
            <span class="r7-law-label">Wet der zonde</span>
            <span class="r7-law-text">Vlees en leden</span>
          </span>
        </button>

        <div class="scene-divider">
          <h3 class="scene-divider-title">Door naar Rom. 8</h3>
        </div>

        <button type="button" class="r7-bridge tap" data-topic="r7-naar-rom8" tabindex="0">
          <span class="r7-bridge-label">Rom. 8:2</span>
          <span class="r7-bridge-title">Dank zij God — de wet van de Geest des levens maakt vrij</span>
        </button>
      </div>
    </section>

`;

writeFileSync(path, s.slice(0, start) + replacement + s.slice(end), "utf8");
console.log("Rom 7 section patched");
