const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const googleBtn = btns.find(b => b.textContent.includes('Continue with Google'));
    if (googleBtn) googleBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'screenshot_after_login.png' });
  await browser.close();
  console.log('Screenshot saved');
})();
