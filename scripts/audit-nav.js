const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "../web/index.html"), "utf8");
const vm = require("node:vm");

const contentSrc = fs.readFileSync(path.join(__dirname, "../web/content.js"), "utf8");
const searchSrc = fs.readFileSync(path.join(__dirname, "../web/search-index.js"), "utf8");

const sandbox = { window: {} };
vm.runInNewContext(contentSrc, sandbox);
vm.runInNewContext(searchSrc, sandbox);

const tabForTopic = sandbox.window.HT_SEARCH.tabForTopic;
const topics = Object.keys(sandbox.window.HT_TOPICS || {});

const htmlTopics = [...new Set([...html.matchAll(/data-topic="([^"]+)"/g)].map((m) => m[1]))];
const sections = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
const gotoTabs = [...new Set([...html.matchAll(/data-goto-tab="([^"]+)"/g)].map((m) => m[1]))];

const noTab = htmlTopics.filter((t) => !tabForTopic(t));
const noTabContent = topics.filter((t) => !tabForTopic(t));
const badGoto = gotoTabs.filter((t) => !sections.includes(t));

console.log("HTML topics without tab:", noTab.length, noTab.slice(0, 30));
console.log("Content topics without tab:", noTabContent.length, noTabContent.slice(0, 30));
console.log("Bad data-goto-tab:", badGoto);
console.log("bz in html:", html.includes("bz-overzicht"));
