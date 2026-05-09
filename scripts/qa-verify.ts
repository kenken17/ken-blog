import { chromium, type Browser, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:4321';
const VIEWPORTS = [
  { width: 320, height: 568, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'desktop-sm' },
  { width: 1440, height: 900, name: 'desktop-lg' },
];

const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/blog/', name: 'blog-listing' },
  { path: '/blog/trying-gemini-free-tier-on-avante-nvim/', name: 'blog-post' },
];

async function runVerification() {
  console.log('Starting visual verification...\n');
  
  const browser = await chromium.launch({ headless: true });
  const results: string[] = [];
  
  for (const pageConfig of PAGES) {
    console.log(`\n=== Testing ${pageConfig.name} (${pageConfig.path}) ===`);
    
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      
      // Collect console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Navigate
      const response = await page.goto(`${BASE_URL}${pageConfig.path}`, { waitUntil: 'networkidle' });
      
      // Check HTTP status
      const status = response?.status() || 0;
      
      // Check logo element
      const logo = await page.locator('header a[aria-label="Ken\'s Blog home"]').first();
      const logoVisible = await logo.isVisible().catch(() => false);
      const logoText = await logo.textContent().catch(() => 'NOT FOUND');
      
      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // Get logo bounding box
      const logoBox = await logo.boundingBox().catch(() => null);
      
      // Take screenshot
      const screenshotDir = path.join('/tmp', 'qa-screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      const screenshotPath = path.join(screenshotDir, `${pageConfig.name}-${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      
      // Performance metrics
      const performanceTiming = await page.evaluate(() => {
        const timing = performance.timing;
        return {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        };
      });
      
      const result = {
        page: pageConfig.name,
        viewport: viewport.name,
        status,
        logoVisible,
        logoText: logoText?.trim(),
        hasOverflow,
        logoWidth: logoBox?.width,
        logoHeight: logoBox?.height,
        loadTime: performanceTiming.loadTime,
        consoleErrors: errors.length,
        screenshot: screenshotPath,
      };
      
      results.push(JSON.stringify(result));
      
      console.log(`  ${viewport.name} (${viewport.width}x${viewport.height}):`);
      console.log(`    Status: ${status}`);
      console.log(`    Logo visible: ${logoVisible}`);
      console.log(`    Logo text: "${logoText?.trim()}"`);
      console.log(`    Logo size: ${Math.round(logoBox?.width || 0)}x${Math.round(logoBox?.height || 0)}px`);
      console.log(`    Horizontal overflow: ${hasOverflow}`);
      console.log(`    Load time: ${performanceTiming.loadTime}ms`);
      console.log(`    Console errors: ${errors.length}`);
      
      await context.close();
    }
  }
  
  await browser.close();
  
  // Write results
  fs.writeFileSync('/tmp/qa-results.json', '[\n' + results.join(',\n') + '\n]');
  console.log('\n\n=== QA SUMMARY ===');
  console.log('Screenshots saved to: /tmp/qa-screenshots/');
  console.log('Results saved to: /tmp/qa-results.json');
}

runVerification().catch(err => {
  console.error('QA failed:', err);
  process.exit(1);
});
