const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

if (!s.includes('id="ux-welcome"')) {
  const block = `
  <div class="ux-context" id="ux-context" aria-live="polite" hidden>
    <span class="ux-context-pulse" aria-hidden="true"></span>
    <span class="ux-context-dot" id="ux-context-dot" aria-hidden="true"></span>
    <span class="ux-context-text" id="ux-context-text"></span>
  </div>

  <div class="ux-toast-stack" id="ux-toast-stack" aria-live="polite" aria-atomic="true"></div>

  <button type="button" class="ux-help-fab" id="ux-help-fab" aria-label="Hulp en sneltoetsen" title="Hulp">
    <span aria-hidden="true">?</span>
  </button>

  <div class="ux-welcome" id="ux-welcome" role="dialog" aria-modal="true" aria-labelledby="ux-welcome-title" hidden>
    <div class="ux-welcome-backdrop" id="ux-welcome-backdrop"></div>
    <div class="ux-welcome-card">
      <div class="ux-welcome-glow" aria-hidden="true"></div>
      <span class="ux-welcome-eyebrow">Welkom</span>
      <h2 id="ux-welcome-title">Ontdek de mens — visueel</h2>
      <p class="ux-welcome-lead">Een interactieve reis door geest, ziel, hart en lichaam. Alles is klikbaar — volg het model zoals een kaart.</p>
      <ul class="ux-welcome-tips">
        <li><strong>Klik</strong> op elk onderdeel → ga naar die pagina</li>
        <li><strong>bron</strong> of <kbd>Alt</kbd>+klik → citaten uit Verborgen Schatten</li>
        <li><strong>Model</strong> rechtsonder → altijd verder navigeren</li>
        <li><kbd>Ctrl</kbd>+<kbd>K</kbd> → direct zoeken in 190+ onderwerpen</li>
      </ul>
      <div class="ux-welcome-actions">
        <button type="button" class="ux-welcome-primary" id="ux-welcome-go">Start met het diagram</button>
        <button type="button" class="ux-welcome-ghost" id="ux-welcome-dismiss">Verken zelf</button>
      </div>
    </div>
  </div>

  <div class="ux-shortcuts" id="ux-shortcuts" role="dialog" aria-modal="true" aria-label="Sneltoetsen" hidden>
    <div class="ux-shortcuts-backdrop" id="ux-shortcuts-backdrop"></div>
    <div class="ux-shortcuts-card">
      <h2>Sneltoetsen</h2>
      <dl class="ux-shortcuts-list">
        <div><dt><kbd>Ctrl</kbd> <kbd>K</kbd></dt><dd>Zoeken</dd></div>
        <div><dt><kbd>/</kbd></dt><dd>Snel zoeken</dd></div>
        <div><dt><kbd>?</kbd></dt><dd>Dit overzicht</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Sluit paneel of zoeken</dd></div>
        <div><dt><kbd>Alt</kbd>+klik</dt><dd>Citaten openen</dd></div>
      </dl>
      <button type="button" class="ux-shortcuts-close" id="ux-shortcuts-close">Sluiten</button>
    </div>
  </div>

  <!-- Panel -->`;

  s = s.replace("  <!-- Panel -->", block);
}

const heroFixes = [
  ["Verborgen Schatten ? interactief", "Verborgen Schatten · interactief"],
  ["Een visuele gids over geest, ziel, hart en lichaam ? volgens", "Een visuele gids over geest, ziel, hart en lichaam — volgens"],
  ["Klik op elk onderdeel voor citaten uit het tijdschrift.", "Klik je weg door het model — elk onderdeel opent de volgende pagina."],
  ['<span class="nav-icon" aria-hidden="true">?</span> Start', '<span class="nav-icon" aria-hidden="true">◎</span> Start'],
  ['<span class="nav-icon" aria-hidden="true">?</span> Fundament', '<span class="nav-icon" aria-hidden="true">◇</span> Fundament'],
  ['<span class="nav-icon" aria-hidden="true">?</span> Innerlijk', '<span class="nav-icon" aria-hidden="true">◈</span> Innerlijk'],
  ['<span class="nav-icon" aria-hidden="true">?</span> Geloof', '<span class="nav-icon" aria-hidden="true">✧</span> Geloof'],
  ['<span class="nav-icon" aria-hidden="true">?</span> Weg', '<span class="nav-icon" aria-hidden="true">→</span> Weg'],
];

for (const [from, to] of heroFixes) {
  s = s.split(from).join(to);
}

writeFileSync(path, s, "utf8");
console.log("patch-ux-wow: klaar");
