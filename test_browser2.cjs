const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    // Wait for splash screen to disappear
    await new Promise(r => setTimeout(r, 4000));
    
    console.log('Clicking Google login...');
    // Find the Google login button and click it
    // The button has text "Continue with Google"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const googleBtn = btns.find(b => b.textContent.includes('Continue with Google'));
      if (googleBtn) googleBtn.click();
    });
    
    // Wait for the login to process (setTimeout 1200ms) + transition
    await new Promise(r => setTimeout(r, 3000));
    console.log('Done waiting.');
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  
  await browser.close();
})();
