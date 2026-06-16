const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../web/index.html"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../web/content.js"), "utf8"), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../web/search-index.js"), "utf8"), sandbox);
const tabForTopic = sandbox.window.HT_SEARCH.tabForTopic;

const sections = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]).filter((id) => id !== "start");

function sectionHtml(id) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?(?=<section id=|<!-- Panel -->)`);
  return html.match(re)?.[0] || "";
}

const sceneClasses = [
  "layer", "process-card", "outcome", "law", "vz-", "r7-", "vs-", "gw-", "od-", "gv-", "tg-",
  "gst-", "gl-", "zg-", "rv-", "om-", "kr-", "bp-", "gs-", "wp-", "dw-", "hm-", "bz-",
  "compare", "highlight-box", "human-viz", "scene-divider", "journey-", "hub-card",
];

for (const id of sections) {
  const block = sectionHtml(id);
  const topics = new Set([...block.matchAll(/data-topic="([^"]+)"/g)].map((m) => m[1]));
  const taps = (block.match(/class="[^"]*\btap\b/g) || []).length;
  const buttons = (block.match(/<button/g) || []).length;
  const clickable = (block.match(/data-topic=|data-goto-tab=|data-goto-hub=/g) || []).length;

  const suspects = [];
  for (const cls of ["-node", "-step", "-card", "-chip", "-key", "-hub", "-outcome", "-path", "-col", "-row", "-zone", "-trait", "-pill", "-label", "-badge", "-fork", "-jstep", "-spirit", "-rung", "-placed", "-aside"]) {
    const re = new RegExp(`class="([^"]*${cls}[^"]*)"`, "g");
    let m;
    while ((m = re.exec(block))) {
      const full = m[0];
      if (full.includes("tap") || full.includes("data-topic") || full.includes("data-goto")) continue;
      if (full.includes("aria-hidden")) continue;
      suspects.push(full.slice(0, 80));
    }
  }

  if (suspects.length) {
    console.log(`\n=== ${id} (${topics.size} topics, ${taps} taps) ===`);
    console.log("Unwired class samples:", [...new Set(suspects)].slice(0, 12));
  }
}
