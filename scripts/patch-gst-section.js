const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

const marker = `      <div class="laws" style="margin-top:1.75rem">
        <div class="law green tap" data-topic="woord-licht" tabindex="0" role="button">
          <strong>1. Ontvang licht</strong>`;

if (!s.includes(marker)) {
  console.error("insert marker not found");
  process.exit(1);
}

if (s.includes("gst-overzicht")) {
  console.log("gst section already present");
  process.exit(0);
}

const block = `      <div class="scene-divider" style="margin-top:2rem">
        <span class="scene-divider-eyebrow">Openbaring</span>
        <h3 class="scene-divider-title">Hoe spreekt God tot een mens?</h3>
      </div>

      <div class="gst-scene reveal">
        <div class="gst-key tap" data-topic="gst-overzicht" tabindex="0" role="button">
          <strong>Kern:</strong> God spreekt door <strong>het Woord</strong> én <strong>de Geest</strong> —
          niet via zielse gevoelens of eigen beelden. Het <strong>geestelijk oor</strong> hoort wat de Geest zegt;
          het Woord dringt door tot het <strong>hart</strong> en werkt uit in <strong>gehoorzaamheid</strong>.
        </div>

        <div class="gst-diagram">
          <div class="gst-main">
            <button type="button" class="gst-node gst-god tap" data-topic="geloof-god-spreekt" tabindex="0">
              <span class="gst-node-eyebrow">Bron</span>
              <span class="gst-node-title">GOD spreekt</span>
              <span class="gst-node-desc">Woord + Geest · Rom. 10:17</span>
            </button>

            <svg class="gst-fork-svg" viewBox="0 0 280 56" aria-hidden="true">
              <path d="M140 4v20" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M140 24 L52 52" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M140 24 L228 52" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="140" cy="4" r="3" fill="currentColor"/>
              <circle cx="52" cy="52" r="3" fill="currentColor"/>
              <circle cx="228" cy="52" r="3" fill="currentColor"/>
            </svg>

            <div class="gst-fork">
              <button type="button" class="gst-node gst-woord tap" data-topic="woord" tabindex="0">
                <span class="gst-node-eyebrow">Kanaal 1</span>
                <span class="gst-node-title">Het Woord</span>
                <span class="gst-node-desc">Levend en krachtig · Hebr. 4:12</span>
              </button>
              <button type="button" class="gst-node gst-geest-kanaal tap" data-topic="geloof-geest" tabindex="0">
                <span class="gst-node-eyebrow">Kanaal 2</span>
                <span class="gst-node-title">De Geest</span>
                <span class="gst-node-desc">Wat de Geest zegt · Openb. 2:7</span>
              </button>
            </div>

            <div class="gst-merge-label">Geloof hoort in de geest · niet in het gevoel</div>

            <svg class="gst-merge-svg" viewBox="0 0 280 40" aria-hidden="true">
              <path d="M52 4 L140 36" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M228 4 L140 36" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="140" cy="36" r="4" fill="currentColor"/>
            </svg>

            <div class="gst-node gst-human tap" data-topic="geloof-hoort" tabindex="0" role="button">
              <span class="gst-badge">Menselijke geest</span>
              <span class="gst-node-title">Geestelijk oor hoort</span>
              <span class="gst-node-desc">Gezalfde ogen zien · geloof onderzoekt · Openb. 2:7</span>
              <span class="gst-traits">
                <span class="tap" data-topic="geloof-hoort" tabindex="0" role="button">oor</span>
                <span class="tap" data-topic="geloof-ziet" tabindex="0" role="button">ogen</span>
                <span class="tap" data-topic="geloof-onderzoekt" tabindex="0" role="button">onderzoekt</span>
              </span>
            </div>

            <div class="gst-pierce">
              <svg class="gst-pierce-svg" viewBox="0 0 24 80" aria-hidden="true">
                <path d="M12 4v52" stroke="currentColor" stroke-width="2"/>
                <path d="M6 56 L12 72 L18 56 Z" fill="currentColor"/>
              </svg>
              <span class="gst-pierce-label">Woord dringt door · scheidt ziel en geest</span>
            </div>

            <div class="gst-ladder" role="list" aria-label="Van hart tot gehoorzaamheid">
              <button type="button" class="gst-rung tap" data-topic="geloof-hart" tabindex="0">
                <span class="gst-rung-num">1</span>
                <span class="gst-rung-body">
                  <span class="gst-rung-where">Hart</span>
                  <span class="gst-rung-title">Woord bereikt het hart</span>
                  <span class="gst-rung-desc">Verlichte ogen · overleggingen beoordeeld · Ef. 1:18</span>
                </span>
              </button>
              <button type="button" class="gst-rung tap" data-topic="geloof-gezindheid" tabindex="0">
                <span class="gst-rung-num">2</span>
                <span class="gst-rung-body">
                  <span class="gst-rung-where">Gezindheid</span>
                  <span class="gst-rung-title">Instemmen met Gods wil</span>
                  <span class="gst-rung-desc">Woord en geloof smelten samen in het hart</span>
                </span>
              </button>
              <button type="button" class="gst-rung tap gst-rung-out" data-topic="geloof-gehoorzaamheid" tabindex="0">
                <span class="gst-rung-num">3</span>
                <span class="gst-rung-body">
                  <span class="gst-rung-where">Hele mens</span>
                  <span class="gst-rung-title">Gehoorzaamheid des geloofs</span>
                  <span class="gst-rung-desc">Wat God in ons bewerkt · Jak. 2:17</span>
                </span>
              </button>
            </div>
          </div>

          <aside class="gst-aside" aria-label="Niet zo spreekt God">
            <span class="gst-aside-label">Niet via</span>
            <button type="button" class="gst-aside-card gst-aside-no tap" data-topic="geloof-zielse" tabindex="0">
              <span class="gst-aside-title">Zielse mens</span>
              <span class="gst-aside-desc">Gevoelens, opwekking, natuurlijk verstand aanvaardt geestelijke dingen niet · 1 Kor. 2:14</span>
            </button>
            <button type="button" class="gst-aside-card gst-aside-no tap" data-topic="fantasie-gevaar" tabindex="0">
              <span class="gst-aside-title">Eigen beelden</span>
              <span class="gst-aside-desc">Zelf visualiseren, in denkbeelden verliezen — voer voor verzoeking</span>
            </button>
            <button type="button" class="gst-aside-card gst-aside-yes tap" data-topic="fantasie-geest" tabindex="0">
              <span class="gst-aside-title">Wel: door Woord</span>
              <span class="gst-aside-desc">Geen eigen visualisatie — de Geest verlicht verstand en fantasie</span>
            </button>
          </aside>
        </div>
      </div>

      <div class="laws" style="margin-top:1.75rem">
        <div class="law green tap" data-topic="woord-licht" tabindex="0" role="button">
          <strong>1. Ontvang licht</strong>`;

s = s.replace(marker, block);
writeFileSync(path, s, "utf8");
console.log("God-spreekt visual inserted in woord tab");
