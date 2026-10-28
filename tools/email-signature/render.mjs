// Renders banner.html to assets/email-signature-banner.png (1200x280, shown at 600x140 in email).
// Needs Playwright once: npm i --no-save playwright && npx playwright install chromium
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "../../assets/email-signature-banner.png");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 280 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(here, "banner.html"));
await page.waitForTimeout(1200);
await page.locator(".b").screenshot({ path: out, omitBackground: true });
await browser.close();
console.log("wrote", out);
