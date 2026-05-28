const sharp = require('sharp');
const path = require('path');

async function process() {
  const inputPath = '/Users/jithusreekumar111gmail.com/.gemini/antigravity-ide/brain/6c9b3c10-5ffe-41a0-8cce-787fd4436361/media__1779953713269.jpg';
  
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  
  // distance threshold for white
  const threshold = 50;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is close to white
    const distToWhite = Math.sqrt(
      Math.pow(255 - r, 2) + 
      Math.pow(255 - g, 2) + 
      Math.pow(255 - b, 2)
    );
    
    if (distToWhite < threshold) {
      data[i + 3] = 0; // Make transparent
    } else if (distToWhite < threshold + 30) {
      // Smooth anti-aliased edge
      const alpha = Math.floor(255 * ((distToWhite - threshold) / 30));
      data[i + 3] = alpha;
    }
  }

  const processed = sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  });

  await processed.toFile('public/logo.png');
  await processed.resize(192, 192).toFile('public/logo192.png');
  await processed.resize(512, 512).toFile('public/logo512.png');
  await processed.resize(32, 32).toFile('public/favicon.png');
}

process().then(() => console.log('Done')).catch(console.error);
