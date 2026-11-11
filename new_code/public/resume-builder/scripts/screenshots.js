// Run the server first (npm start), then: npm run screenshots
const puppeteer = require('puppeteer'), fs = require('fs');
(async () => {
  fs.mkdirSync('public/previews', { recursive: true });
  const b = await puppeteer.launch(), p = await b.newPage();
  await p.setViewport({ width: 816, height: 1056 });
  for (const k of ['modern', 'professional', 'minimal', 'creative', 'healthcare']) {
    await p.goto(`http://localhost:${process.env.PORT || 3000}/resume-builder.html?bare=${k}`, { waitUntil: 'networkidle0' });
    await (await p.$('.resume')).screenshot({ path: `public/previews/${k}.png` });
    console.log('saved', k);
  }
  await b.close();
})();
