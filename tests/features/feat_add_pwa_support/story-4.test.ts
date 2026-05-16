import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/manifest.json');
const baseLayoutPath = path.resolve('src/layouts/BaseLayout.astro');

describe('PWA Meta Tags', () => {
  it('manifest theme_color matches meta tag value', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf-8');
    const themeColorMatch = layoutContent.match(/content="(#[A-Fa-f0-9]+)"/);
    const themeColor = themeColorMatch ? themeColorMatch[1] : null;

    expect(manifest.theme_color).toBe('#FAFAFA');
    expect(themeColor).toBe('#FAFAFA');
  });

  it('manifest background_color matches site background', () => {
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    expect(manifest.background_color).toBe('#FAFAFA');
  });

  it('BaseLayout contains all required PWA meta tags', () => {
    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf-8');

    expect(layoutContent).toContain('apple-mobile-web-app-capable');
    expect(layoutContent).toContain('apple-mobile-web-app-status-bar-style');
    expect(layoutContent).toContain('apple-mobile-web-app-title');
    expect(layoutContent).toContain('theme-color');
  });

  it('BaseLayout contains manifest link', () => {
    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf-8');
    expect(layoutContent).toContain('rel="manifest"');
    expect(layoutContent).toContain('href="/manifest.json"');
  });

  it('BaseLayout contains Apple touch icon link', () => {
    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf-8');
    expect(layoutContent).toContain('rel="apple-touch-icon"');
    expect(layoutContent).toContain('href="/icons/apple-touch-icon.png"');
  });

  it('BaseLayout contains service worker registration', () => {
    const layoutContent = fs.readFileSync(baseLayoutPath, 'utf-8');
    expect(layoutContent).toContain("'serviceWorker' in navigator");
    expect(layoutContent).toContain("navigator.serviceWorker.register('/sw.js')");
  });
});
