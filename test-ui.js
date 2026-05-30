import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const server = spawn('npm', ['run', 'dev'], { cwd: '/Users/jithusreekumar111gmail.com/Saathi/saathi-app-main' });

server.stdout.on('data', (data) => {
  if (data.toString().includes('Local:')) {
    setTimeout(runTest, 2000); // Give it time to fully load
  }
});

async function runTest() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173');
    await page.waitForSelector('text/Proceed to Platform');
    
    // Login as Admin
    await page.evaluate(() => {
      document.querySelector('select').value = 'Admin';
      const event = new Event('change', { bubbles: true });
      document.querySelector('select').dispatchEvent(event);
    });
    
    // Click Proceed
    const proceedBtns = await page.$$('button');
    for (const btn of proceedBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Proceed to Platform')) {
        await btn.click();
        break;
      }
    }
    
    // Wait for the app to load
    await page.waitForSelector('.hyperlocal-card');
    
    const cardsBefore = await page.$$('.hyperlocal-card');
    console.log(`Cards before removal: ${cardsBefore.length}`);
    
    // Click the first "Remove" button
    const removeBtns = await page.$$('button');
    let removeBtnClicked = false;
    for (const btn of removeBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text === 'Remove') {
        await btn.click();
        removeBtnClicked = true;
        console.log("Clicked Remove button");
        break;
      }
    }
    
    if (!removeBtnClicked) {
      console.log("Could not find Remove button!");
    }
    
    // Wait for a short time for state update
    await new Promise(r => setTimeout(r, 500));
    
    const cardsAfter = await page.$$('.hyperlocal-card');
    console.log(`Cards after removal: ${cardsAfter.length}`);
    
    if (cardsAfter.length < cardsBefore.length) {
      console.log("SUCCESS: A card was removed!");
    } else {
      console.log("FAILED: The card was NOT removed.");
    }
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}
