/**
 * Smoke test: start preview, check layout + navigation flows in headless Chromium.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

async function ensurePlaywright() {
  try {
    return require("playwright");
  } catch {
    console.log("Installing playwright (one-time)…");
    await run("npm", ["install", "--no-save", "playwright@1.52.0"], root);
    await run("npx", ["playwright", "install", "chromium"], root);
    return require("playwright");
  }
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: true, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

async function startPreview() {
  const port = 4321;
  const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(process.execPath, [viteBin, "preview", "--port", String(port), "--host", "127.0.0.1"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let bootLog = "";
  child.stdout?.on("data", (d) => { bootLog += d; });
  child.stderr?.on("data", (d) => { bootLog += d; });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 50; i++) {
    await sleep(300);
    try {
      const res = await fetch(base);
      if (res.ok) return { child, base };
    } catch {
      /* retry */
    }
    if (child.exitCode != null) {
      throw new Error(`Preview exited (${child.exitCode}):\n${bootLog}`);
    }
  }
  child.kill();
  throw new Error(`Preview server did not start:\n${bootLog}`);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const { chromium } = await ensurePlaywright();
  const { child, base } = await startPreview();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  const results = [];

  try {
    await page.addInitScript(() => {
      localStorage.setItem("jos-welcome-seen", "1");
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      const w = document.getElementById("ux-welcome");
      if (!w) return;
      w.classList.remove("open");
      w.hidden = true;
      document.body.classList.remove("modal-open");
    });

    const diagramZones = await page.locator("#mens-home-diagram .mens-zone").count();
    results.push(["Startdiagram zones", diagramZones > 5, `${diagramZones} zones`]);

    // 2. Centered home layout
    const layoutBox = await page.locator(".mens-home-layout").boundingBox();
    const vp = page.viewportSize();
    const layoutCenter = layoutBox.x + layoutBox.width / 2;
    const vpCenter = vp.width / 2;
    results.push([
      "Start layout gecentreerd",
      Math.abs(layoutCenter - vpCenter) < 80,
      `offset ${Math.round(layoutCenter - vpCenter)}px`,
    ]);

    // 3. Visual-first click: geest on diagram
    await page.locator('#mens-home-diagram [data-topic="geest"]').click();
    await page.waitForTimeout(600);
    const onGeloof = await page.locator("#geloof.active").count();
    const contextAfterVisual = await page.locator("#ux-context:not([hidden])").count();
    const deepenVisible = await page.locator("#ux-context-deepen:not([hidden])").count();
    results.push(["Klik geest → tab Geloof", onGeloof === 1, `active=${onGeloof}`]);
    results.push(["Contextbalk zichtbaar", contextAfterVisual === 1, ""]);
    results.push(["Verdiep-knop zichtbaar", deepenVisible === 1, ""]);

    // 4. Context bar centered (desktop)
    const ctxBox = await page.locator("#ux-context").boundingBox();
    const ctxCenter = ctxBox.x + ctxBox.width / 2;
    results.push([
      "Contextbalk gecentreerd",
      Math.abs(ctxCenter - vpCenter) < 60,
      `offset ${Math.round(ctxCenter - vpCenter)}px`,
    ]);

    // 5. Verdiep via contextknop
    await page.locator("#ux-context-deepen:not([hidden])").click();
    await page.waitForTimeout(500);
    const topicOpen = await page.locator("#topic-page.open").count();
    results.push(["Verdiep → uitlegpagina", topicOpen === 1, ""]);

    // 6. Back to visual via tp-context / close
    await page.locator(".tp-back").click();
    await page.waitForTimeout(400);
    const topicClosed = await page.locator("#topic-page.open").count();
    results.push(["Terug sluit verdiep", topicClosed === 0, ""]);

    // 7. Structuur tab — no atlas tiles, centered section
    await page.goto(`${base}#/structuur`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const atlasGone = await page.locator(".structuur-atlas").count();
    const structuurActive = await page.locator("#structuur.active").count();
    const structBox = await page.locator("#structuur.active").boundingBox();
    const structCenter = structBox.x + structBox.width / 2;
    results.push(["Geen tegel-atlas", atlasGone === 0, ""]);
    results.push(["Structuur tab actief", structuurActive === 1, ""]);
    results.push([
      "Structuur gecentreerd",
      Math.abs(structCenter - vpCenter) < 120,
      `offset ${Math.round(structCenter - vpCenter)}px`,
    ]);

    // 8. Mobile context bar
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}#/verstand`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.locator('[data-topic="verstand"]').first().click();
    await page.waitForTimeout(500);
    const mCtx = await page.locator("#ux-context:not([hidden])").boundingBox();
    const mCenter = mCtx.x + mCtx.width / 2;
    results.push([
      "Mobiel: context gecentreerd",
      Math.abs(mCenter - 195) < 50,
      `offset ${Math.round(mCenter - 195)}px`,
    ]);

    // Report
    let failed = 0;
    console.log("\n=== Smoke test resultaten ===\n");
    for (const [name, ok, detail] of results) {
      const mark = ok ? "OK" : "FAIL";
      console.log(`${mark.padEnd(5)} ${name}${detail ? ` (${detail})` : ""}`);
      if (!ok) failed++;
    }
    if (errors.length) {
      console.log("\nPagina-errors:");
      errors.forEach((e) => console.log(" -", e));
      failed++;
    }
    assert(failed === 0, `${failed} check(s) mislukt`);
    console.log("\nAlles groen.\n");
  } finally {
    await browser.close();
    child.kill();
  }
}

main().catch((err) => {
  console.error("\nSmoke test mislukt:", err.message);
  process.exit(1);
});
