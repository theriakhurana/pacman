const fs = require('fs');
const path = require('path');
const http = require('http');
const serveHandler = require('serve-handler');
const puppeteer = require('puppeteer');

async function serve(dir, port) {
  const server = http.createServer((request, response) => {
    return serveHandler(request, response, { public: dir });
  });
  await new Promise((resolve) => server.listen(port, resolve));
  return server;
}

async function snapshotPages(baseUrl, pages, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setViewport({ width: 760, height: 760, deviceScaleFactor: 2 });

  for (const p of pages) {
    const url = `${baseUrl}/${p}`;
    console.log('Snapshotting', url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForTimeout(1000);
    const snapPath = path.join(outDir, p.replace(/\.html?$/, '') + '.png');
    await page.screenshot({ path: snapPath, fullPage: false });
  }

  await browser.close();
}

(async () => {
  const root = path.resolve(__dirname, '..');
  const port = 5050;
  const server = await serve(root, port);

  try {
    const baseUrl = `http://localhost:${port}`;
    await snapshotPages(baseUrl, ['index.html', 'level1.html', 'level2.html', 'level3.html'], path.join(root, 'snapshots'));
    console.log('Snapshots generated in snapshots/');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
