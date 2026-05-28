const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  // Wait a few seconds to let splash screen finish
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
  console.log('Screenshot saved to screenshot.png');
})();
