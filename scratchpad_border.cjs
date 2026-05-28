const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://sjithu2255-debug.github.io/saathi-app/', { waitUntil: 'networkidle0' });
  
  // Extract all elements containing "border" or outline in computed styles, or class names
  const borders = await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    const borderElements = [];
    els.forEach(el => {
      const cls = el.className;
      if (typeof cls === 'string' && cls.includes('logo')) {
        const style = window.getComputedStyle(el);
        borderElements.push({
          tag: el.tagName,
          class: cls,
          border: style.border,
          outline: style.outline,
          boxShadow: style.boxShadow,
          stroke: style.stroke,
          rect: el.getBoundingClientRect()
        });
      }
    });
    return borderElements;
  });
  console.log(JSON.stringify(borders, null, 2));
  await browser.close();
})();
