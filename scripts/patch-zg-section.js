const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

const marker = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Rechtvaardiging</span>
          <h3 class="scene-divider-title">Gerechtvaardigd door geloof`;

if (!s.includes(marker)) {
  console.error("insert marker not found");
  process.exit(1);
}

const block = `        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Heilige Geest</span>
          <h3 class="scene-divider-title">De zeven Geesten Gods</h3>
        </div>

        <div class="zg-block reveal">
          <div class="zg-key tap" data-topic="zg-overzicht" tabindex="0" role="button">
            <strong>Kern:</strong> De <strong>zeven Geesten Gods</strong> zijn de volheid van Gods Geest —
            zoals die op <strong>Christus</strong> rustte (Jes. 11:2) en in de Openbaring als zeven vurige fakkels
            en zeven ogen op het Lam verschijnen (Openb. 4:5; 5:6).
          </div>

          <button type="button" class="zg-christus tap" data-topic="zg-christus" tabindex="0">
            <span class="zg-christus-label">Op de Meester</span>
            <span class="zg-christus-text">Op Hem rust de Geest des Heren — alle zeven Geesten in één</span>
            <span class="zg-christus-ref">Jes. 11:2 · Openb. 5:6</span>
          </button>

          <div class="zg-grid" role="list" aria-label="De zeven Geesten Gods volgens Jesaja 11">
            <button type="button" class="zg-spirit tap" data-topic="zg-heren" tabindex="0">
              <span class="zg-spirit-num">1</span>
              <span class="zg-spirit-name">Geest des Heren</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-wijsheid" tabindex="0">
              <span class="zg-spirit-num">2</span>
              <span class="zg-spirit-name">Wijsheid</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-verstand" tabindex="0">
              <span class="zg-spirit-num">3</span>
              <span class="zg-spirit-name">Verstand</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-raad" tabindex="0">
              <span class="zg-spirit-num">4</span>
              <span class="zg-spirit-name">Raad</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-sterkte" tabindex="0">
              <span class="zg-spirit-num">5</span>
              <span class="zg-spirit-name">Sterkte</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-kennis" tabindex="0">
              <span class="zg-spirit-num">6</span>
              <span class="zg-spirit-name">Kennis</span>
            </button>
            <button type="button" class="zg-spirit tap" data-topic="zg-vreze" tabindex="0">
              <span class="zg-spirit-num">7</span>
              <span class="zg-spirit-name">Vreze des Heren</span>
            </button>
          </div>

          <button type="button" class="zg-voor-ons tap" data-topic="zg-voor-ons" tabindex="0">
            <span class="zg-voor-ons-label">Voor de discipel</span>
            <span class="zg-voor-ons-text">De zeven Geesten kunnen hart en denken vervullen — bid om Geest en wijsheid</span>
            <span class="zg-voor-ons-ref">Ef. 1:17 · Jak. 1:5</span>
          </button>
        </div>

        <div class="scene-divider">
          <span class="scene-divider-eyebrow">Rechtvaardiging</span>
          <h3 class="scene-divider-title">Gerechtvaardigd door geloof`;

if (s.includes("zg-overzicht")) {
  console.log("zg section already present");
  process.exit(0);
}

s = s.replace(marker, block);
writeFileSync(path, s, "utf8");
console.log("Seven spirits section inserted in geloof tab");
