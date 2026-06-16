const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve(__dirname, "../web/index.html");
let s = readFileSync(path, "utf8");

if (s.includes("illus-panel-proces")) {
  console.log("illus panels already present");
  process.exit(0);
}

const startIllus = `
      <div class="illus-panel illus-panel-start reveal" aria-label="Klik op het model">
        <p class="illus-title">Klik op het model</p>
        <svg class="illus-svg" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mens diagram">
          <defs><radialGradient id="igG"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#4338ca"/></radialGradient></defs>
          <rect class="illus-zone" data-topic="god" x="22" y="4" width="56" height="22" rx="10" fill="url(#igG)" opacity=".9"/>
          <text x="50" y="18" text-anchor="middle" fill="#fff" font-size="5" font-weight="700" pointer-events="none">GOD</text>
          <rect class="illus-zone" data-topic="geest" x="28" y="34" width="44" height="18" rx="8" fill="#2563eb" opacity=".8"/>
          <text x="50" y="46" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="600" pointer-events="none">GEEST</text>
          <rect class="illus-zone" data-topic="ziel" x="24" y="58" width="52" height="72" rx="8" fill="#7c3aed" opacity=".7"/>
          <text x="50" y="70" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="600" pointer-events="none">ZIEL</text>
          <rect class="illus-zone" data-topic="verstand" x="28" y="76" width="44" height="10" rx="3" fill="#f59e0b" opacity=".85"/>
          <rect class="illus-zone" data-topic="fantasie" x="28" y="88" width="44" height="10" rx="3" fill="#06b6d4" opacity=".9"/>
          <rect class="illus-zone" data-topic="hart" x="28" y="100" width="44" height="10" rx="3" fill="#dc2626" opacity=".85"/>
          <rect class="illus-zone" data-topic="wil" x="28" y="112" width="44" height="8" rx="2" fill="#a78bfa" opacity=".8"/>
          <rect class="illus-zone" data-topic="lichaam" x="26" y="124" width="48" height="52" rx="9" fill="#ea580c" opacity=".65"/>
          <text x="50" y="138" text-anchor="middle" fill="#fff" font-size="4.5" font-weight="600" pointer-events="none">LICHAAM</text>
          <rect class="illus-zone" data-topic="zintuigen" x="30" y="148" width="40" height="8" rx="2" fill="#f97316" opacity=".8"/>
        </svg>
        <p class="illus-hint">Elke zone opent de volgende pagina</p>
      </div>
`;

const procesIllus = `
      <div class="illus-row illus-row-proces">
        <aside class="illus-panel illus-panel-proces reveal" aria-label="Klik op het verloop">
          <p class="illus-title">Klik op het verloop</p>
          <svg class="illus-svg illus-svg-tall" viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gevallen en verlost verloop">
            <text x="72" y="16" text-anchor="middle" fill="#fca5a5" font-size="9" font-weight="700">GEVALLEN</text>
            <text x="208" y="16" text-anchor="middle" fill="#6ee7b7" font-size="9" font-weight="700">VERLOST</text>
            <rect class="illus-zone" data-topic="gevallen-zintuigen" x="22" y="26" width="100" height="26" rx="8" fill="rgba(234,88,12,.45)" stroke="rgba(251,146,60,.5)"/>
            <text x="72" y="42" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">1 Zintuigen</text>
            <rect class="illus-zone" data-topic="gevallen-verstand" x="22" y="58" width="100" height="26" rx="8" fill="rgba(245,158,11,.4)" stroke="rgba(251,191,36,.45)"/>
            <text x="72" y="74" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">2 Verstand</text>
            <rect class="illus-zone" data-topic="gevallen-hart" x="22" y="90" width="100" height="26" rx="8" fill="rgba(220,38,38,.35)" stroke="rgba(248,113,113,.45)"/>
            <text x="72" y="106" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">3 Hart</text>
            <rect class="illus-zone" data-topic="gevallen-gezindheid" x="22" y="122" width="100" height="26" rx="8" fill="rgba(234,179,8,.35)" stroke="rgba(250,204,21,.4)"/>
            <text x="72" y="138" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">4 Gezindheid</text>
            <rect class="illus-zone" data-topic="gevallen-lichaam" x="22" y="154" width="100" height="26" rx="8" fill="rgba(234,88,12,.4)" stroke="rgba(251,146,60,.45)"/>
            <text x="72" y="170" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">5 Lichaam</text>
            <rect class="illus-zone" data-topic="gevallen-gevolg" x="22" y="186" width="100" height="26" rx="8" fill="rgba(239,68,68,.35)" stroke="rgba(248,113,113,.5)"/>
            <text x="72" y="202" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">6 Gevolg</text>
            <path d="M122 198 Q170 120 122 42" fill="none" stroke="rgba(248,113,113,.45)" stroke-width="1.5" stroke-dasharray="4 3"/>
            <text x="168" y="118" fill="#fca5a5" font-size="6" pointer-events="none">kringloop</text>
            <rect class="illus-zone" data-topic="verlost-woord" x="158" y="26" width="100" height="26" rx="8" fill="rgba(52,211,153,.25)" stroke="rgba(110,231,183,.45)"/>
            <text x="208" y="42" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">1 Woord</text>
            <rect class="illus-zone" data-topic="verlost-geest" x="158" y="58" width="100" height="26" rx="8" fill="rgba(37,99,235,.35)" stroke="rgba(96,165,250,.45)"/>
            <text x="208" y="74" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">2 Geest</text>
            <rect class="illus-zone" data-topic="verlost-hart" x="158" y="90" width="100" height="26" rx="8" fill="rgba(220,38,38,.3)" stroke="rgba(248,113,113,.4)"/>
            <text x="208" y="106" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">3 Hart</text>
            <rect class="illus-zone" data-topic="verlost-gezindheid" x="158" y="122" width="100" height="26" rx="8" fill="rgba(167,139,250,.3)" stroke="rgba(196,181,253,.45)"/>
            <text x="208" y="138" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">4 Gezindheid</text>
            <rect class="illus-zone" data-topic="verlost-lichaam" x="158" y="154" width="100" height="26" rx="8" fill="rgba(234,88,12,.3)" stroke="rgba(251,146,60,.4)"/>
            <text x="208" y="170" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">5 Lichaam</text>
            <rect class="illus-zone" data-topic="verlost-gevolg" x="158" y="186" width="100" height="26" rx="8" fill="rgba(34,197,94,.3)" stroke="rgba(134,239,172,.5)"/>
            <text x="208" y="202" text-anchor="middle" fill="#fff" font-size="7" pointer-events="none">6 Vrucht</text>
            <line x1="140" y1="150" x2="158" y2="150" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
          </svg>
        </aside>
        <div class="illus-main">
`;

const procesClose = `
        </div>
      </div>`;

const verschilIllus = `
      <div class="illus-panel illus-panel-verschil reveal" aria-label="Klik op de lichamen">
        <p class="illus-title">Klik op elk lichaam en type mens</p>
        <svg class="illus-svg illus-svg-wide" viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Onderscheid lichamen en mensen">
          <text x="90" y="18" text-anchor="middle" fill="#86efac" font-size="8" font-weight="700">LICHAMEN</text>
          <rect class="illus-zone" data-topic="cmp-vlezes" x="10" y="28" width="150" height="72" rx="12" fill="rgba(52,211,153,.12)" stroke="rgba(134,239,172,.4)"/>
          <ellipse cx="85" cy="52" rx="22" ry="14" fill="rgba(52,211,153,.25)" pointer-events="none"/>
          <line x1="85" y1="66" x2="85" y2="82" stroke="rgba(134,239,172,.6)" stroke-width="2" pointer-events="none"/>
          <text x="85" y="92" text-anchor="middle" fill="#a7f3d0" font-size="7" font-weight="700" pointer-events="none">des vlezes</text>
          <text x="85" y="102" text-anchor="middle" fill="#6ee7b7" font-size="6" pointer-events="none">afgelegd</text>
          <rect class="illus-zone" data-topic="cmp-zonde" x="185" y="28" width="150" height="72" rx="12" fill="rgba(245,158,11,.1)" stroke="rgba(251,191,36,.4)"/>
          <ellipse cx="260" cy="52" rx="22" ry="14" fill="rgba(245,158,11,.2)" pointer-events="none"/>
          <line x1="260" y1="66" x2="260" y2="82" stroke="rgba(251,191,36,.5)" stroke-width="2" pointer-events="none"/>
          <text x="260" y="92" text-anchor="middle" fill="#fde68a" font-size="7" font-weight="700" pointer-events="none">der zonde</text>
          <text x="260" y="102" text-anchor="middle" fill="#fbbf24" font-size="6" pointer-events="none">kruis</text>
          <rect class="illus-zone" data-topic="cmp-doods" x="360" y="28" width="150" height="72" rx="12" fill="rgba(100,116,139,.15)" stroke="rgba(148,163,184,.35)"/>
          <ellipse cx="435" cy="52" rx="22" ry="14" fill="rgba(148,163,184,.25)" pointer-events="none"/>
          <line x1="435" y1="66" x2="435" y2="82" stroke="rgba(148,163,184,.5)" stroke-width="2" pointer-events="none"/>
          <text x="435" y="92" text-anchor="middle" fill="#cbd5e1" font-size="7" font-weight="700" pointer-events="none">des doods</text>
          <text x="435" y="102" text-anchor="middle" fill="#94a3b8" font-size="6" pointer-events="none">dragen</text>
          <rect class="illus-zone" data-topic="cmp-werkingen" x="60" y="118" width="180" height="36" rx="10" fill="rgba(99,102,241,.15)" stroke="rgba(129,140,248,.35)"/>
          <text x="150" y="138" text-anchor="middle" fill="#c7d2fe" font-size="7" pointer-events="none">Werkingen des lichaams</text>
          <rect class="illus-zone" data-topic="cmp-vlees-werken" x="280" y="118" width="180" height="36" rx="10" fill="rgba(239,68,68,.12)" stroke="rgba(248,113,113,.35)"/>
          <text x="370" y="138" text-anchor="middle" fill="#fecaca" font-size="7" pointer-events="none">Werken van het vlees</text>
          <text x="260" y="168" text-anchor="middle" fill="#a5b4fc" font-size="8" font-weight="700">MENSEN</text>
          <rect class="illus-zone" data-topic="cmp-zielse" x="60" y="176" width="180" height="36" rx="10" fill="rgba(245,158,11,.12)" stroke="rgba(251,191,36,.35)"/>
          <text x="150" y="196" text-anchor="middle" fill="#fde68a" font-size="7" pointer-events="none">Zielse christen</text>
          <rect class="illus-zone" data-topic="cmp-geestelijk" x="280" y="176" width="180" height="36" rx="10" fill="rgba(34,197,94,.12)" stroke="rgba(134,239,172,.4)"/>
          <text x="370" y="196" text-anchor="middle" fill="#bbf7d0" font-size="7" pointer-events="none">Geestelijke mens</text>
        </svg>
      </div>
`;

const rom7Illus = `
        <div class="illus-row illus-row-rom7">
          <aside class="illus-panel illus-panel-rom7 reveal" aria-label="Klik op Rom. 7">
            <p class="illus-title">Rom. 7 in een plaatje</p>
            <svg class="illus-svg illus-svg-tall" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rom. 7 twee wetten">
              <text x="55" y="16" text-anchor="middle" fill="#c4b5fd" font-size="7" font-weight="700">ZIEL</text>
              <rect class="illus-zone" data-topic="r7-verstand" x="10" y="22" width="90" height="30" rx="8" fill="rgba(245,158,11,.3)" stroke="rgba(251,191,36,.4)"/>
              <text x="55" y="40" text-anchor="middle" fill="#fff" font-size="6" pointer-events="none">Verstand</text>
              <rect class="illus-zone" data-topic="r7-innerlijk" x="10" y="56" width="90" height="30" rx="8" fill="rgba(129,140,248,.25)" stroke="rgba(165,180,252,.4)"/>
              <text x="55" y="74" text-anchor="middle" fill="#fff" font-size="6" pointer-events="none">Innerlijk</text>
              <rect class="illus-zone" data-topic="r7-gezindheid" x="10" y="90" width="90" height="30" rx="8" fill="rgba(167,139,250,.25)" stroke="rgba(196,181,253,.4)"/>
              <text x="55" y="108" text-anchor="middle" fill="#fff" font-size="6" pointer-events="none">Gezindheid</text>
              <rect class="illus-zone" data-topic="r7-strijd" x="70" y="128" width="60" height="44" rx="10" fill="rgba(239,68,68,.2)" stroke="rgba(248,113,113,.5)"/>
              <text x="100" y="148" text-anchor="middle" fill="#fecaca" font-size="6" font-weight="700" pointer-events="none">STRIJD</text>
              <text x="100" y="160" text-anchor="middle" fill="#fca5a5" font-size="5" pointer-events="none">Rom. 7:15</text>
              <text x="145" y="16" text-anchor="middle" fill="#fdba74" font-size="7" font-weight="700">LICHAAM</text>
              <rect class="illus-zone" data-topic="r7-zonde-vlees" x="100" y="22" width="90" height="28" rx="8" fill="rgba(168,85,247,.25)" stroke="rgba(192,132,252,.4)"/>
              <text x="145" y="38" text-anchor="middle" fill="#fff" font-size="5.5" pointer-events="none">Zonde in vlees</text>
              <rect class="illus-zone" data-topic="r7-leden" x="100" y="54" width="90" height="28" rx="8" fill="rgba(234,88,12,.25)" stroke="rgba(251,146,60,.4)"/>
              <text x="145" y="70" text-anchor="middle" fill="#fff" font-size="5.5" pointer-events="none">Leden</text>
              <rect class="illus-zone" data-topic="r7-vlees" x="100" y="86" width="90" height="28" rx="8" fill="rgba(234,88,12,.3)" stroke="rgba(251,146,60,.45)"/>
              <text x="145" y="102" text-anchor="middle" fill="#fff" font-size="5.5" pointer-events="none">Vlees</text>
              <rect class="illus-zone" data-topic="r7-lichaam-doods" x="100" y="118" width="90" height="28" rx="8" fill="rgba(100,116,139,.3)" stroke="rgba(148,163,184,.4)"/>
              <text x="145" y="134" text-anchor="middle" fill="#fff" font-size="5.5" pointer-events="none">Lichaam des doods</text>
              <rect class="illus-zone" data-topic="r7-twee-wetten" x="20" y="188" width="160" height="32" rx="10" fill="rgba(99,102,241,.15)" stroke="rgba(129,140,248,.4)"/>
              <text x="100" y="206" text-anchor="middle" fill="#c7d2fe" font-size="6" pointer-events="none">Twee wetten \u00b7 Rom. 7:25</text>
              <rect class="illus-zone" data-topic="r7-naar-rom8" x="20" y="228" width="160" height="32" rx="10" fill="rgba(34,197,94,.15)" stroke="rgba(134,239,172,.4)"/>
              <text x="100" y="246" text-anchor="middle" fill="#bbf7d0" font-size="6" pointer-events="none">Naar Rom. 8 \u2192</text>
            </svg>
          </aside>
          <div class="illus-main">
`;

const rom7Close = `
          </div>
        </div>`;

const ootmoedIllus = `
        <div class="illus-panel illus-panel-om reveal" aria-label="Klik op ootmoed">
          <p class="illus-title">Ootmoed of hoogmoed?</p>
          <svg class="illus-svg illus-svg-wide" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ootmoed keuze">
            <rect class="illus-zone" data-topic="om-hoogmoed" x="8" y="20" width="115" height="88" rx="12" fill="rgba(239,68,68,.12)" stroke="rgba(248,113,113,.4)"/>
            <text x="65" y="42" text-anchor="middle" fill="#fca5a5" font-size="8" font-weight="700" pointer-events="none">Hoogmoed</text>
            <text x="65" y="58" text-anchor="middle" fill="#fecaca" font-size="6" pointer-events="none">eigen wil</text>
            <text x="65" y="72" text-anchor="middle" fill="#fecaca" font-size="6" pointer-events="none">als God zijn</text>
            <rect class="illus-zone" data-topic="om-gezindheid" x="142" y="28" width="116" height="72" rx="12" fill="rgba(167,139,250,.2)" stroke="rgba(196,181,253,.45)"/>
            <text x="200" y="52" text-anchor="middle" fill="#e9d5ff" font-size="8" font-weight="700" pointer-events="none">GEZINDHEID</text>
            <text x="200" y="68" text-anchor="middle" fill="#ddd6fe" font-size="6" pointer-events="none">wie regeert?</text>
            <rect class="illus-zone" data-topic="om-wat" x="277" y="20" width="115" height="88" rx="12" fill="rgba(45,212,191,.12)" stroke="rgba(94,234,212,.4)"/>
            <text x="334" y="42" text-anchor="middle" fill="#5eead4" font-size="8" font-weight="700" pointer-events="none">Ootmoed</text>
            <text x="334" y="58" text-anchor="middle" fill="#99f6e4" font-size="6" pointer-events="none">Gods wil</text>
            <text x="334" y="72" text-anchor="middle" fill="#99f6e4" font-size="6" pointer-events="none">gehoorzaam</text>
            <rect class="illus-zone" data-topic="om-plaats" x="80" y="4" width="240" height="14" rx="6" fill="rgba(99,102,241,.12)" stroke="rgba(129,140,248,.3)"/>
            <text x="200" y="13" text-anchor="middle" fill="#a5b4fc" font-size="6" pointer-events="none">hart + verstand</text>
          </svg>
        </div>
`;

// Start: diagram + hubs
s = s.replace(
  `      <div class="hub-grid">`,
  `      <div class="start-illus-row">${startIllus}<div class="start-main"><div class="hub-grid">`
);
s = s.replace(
  `        <button type="button" class="start-chip" data-goto-tab="weg">Discipelweg</button>
      </div>
    </section>

    <!-- STRUCTUUR -->`,
  `        <button type="button" class="start-chip" data-goto-tab="weg">Discipelweg</button>
      </div></div></div>
    </section>

    <!-- STRUCTUUR -->`
);

// Proces wrap
s = s.replace(`      <div class="process-grid">`, procesIllus + `      <div class="process-grid">`);
s = s.replace(
  `      </div>
    </section>

    <!-- ROMEINEN 7 -->`,
  `      </div>${procesClose}
    </section>

    <!-- ROMEINEN 7 -->`
);

// Verschil
s = s.replace(`      <div class="compare-wrap">`, verschilIllus + `\n      <div class="compare-wrap">`);

// Rom7 - wrap r7-split through r7-bridge
s = s.replace(`        <div class="r7-split">`, rom7Illus + `        <div class="r7-split">`);
s = s.replace(
  `        <button type="button" class="r7-bridge tap" data-topic="r7-naar-rom8"`,
  rom7Close + `
        <button type="button" class="r7-bridge tap" data-topic="r7-naar-rom8"`
);

// Ootmoed - after om-key
s = s.replace(
  `        </div>

        <div class="om-god-source tap" data-topic="om-gods-wil"`,
  `        </div>
${ootmoedIllus}
        <div class="om-god-source tap" data-topic="om-gods-wil"`
);

writeFileSync(path, s, "utf8");
console.log("patch-illus-panels: klaar");
