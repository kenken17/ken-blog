import { describe, it, expect, beforeEach, vi } from 'vitest';
import { transform } from '@astrojs/compiler';
import fs from 'fs';
import path from 'path';

const analyticsPath = path.resolve(process.cwd(), 'src/components/Analytics.astro');
const cookieConsentPath = path.resolve(process.cwd(), 'src/components/CookieConsent.astro');

async function compileComponent(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf-8');
  const result = await transform(source, {
    filename: path.basename(filePath),
    moduleId: path.basename(filePath),
    sourcemap: false,
  });
  return result.code;
}

describe('Analytics component', () => {
  it('renders script injection logic when enabled is true', async () => {
    const code = await compileComponent(analyticsPath);
    expect(code).toContain('data-domain');
    expect(code).toContain('plausible');
    expect(code).toContain('injectAnalytics');
  });

  it('includes consent check in client script', async () => {
    const source = fs.readFileSync(analyticsPath, 'utf-8');
    expect(source).toContain('getConsent');
    expect(source).toContain('consent:change');
    expect(source).toContain('accepted');
  });

  it('reads analyticsConfig from config module', async () => {
    const source = fs.readFileSync(analyticsPath, 'utf-8');
    expect(source).toContain("from '../config/analytics'");
    expect(source).toContain('analyticsConfig');
  });
});

describe('CookieConsent component', () => {
  it('renders banner with Accept and Decline buttons', async () => {
    const code = await compileComponent(cookieConsentPath);
    expect(code).toContain('Accept');
    expect(code).toContain('Decline');
    expect(code).toContain('data-consent-accept');
    expect(code).toContain('data-consent-decline');
  });

  it('renders privacy learn more link', async () => {
    const code = await compileComponent(cookieConsentPath);
    expect(code).toContain('Learn more');
    expect(code).toContain('/privacy');
  });

  it('imports consent utilities', async () => {
    const source = fs.readFileSync(cookieConsentPath, 'utf-8');
    expect(source).toContain("from '../utils/consent.ts'");
    expect(source).toContain('getConsent');
    expect(source).toContain('setConsent');
  });

  it('imports analytics config to conditionally render', async () => {
    const source = fs.readFileSync(cookieConsentPath, 'utf-8');
    expect(source).toContain("from '../config/analytics'");
    expect(source).toContain('{ enabled }');
  });
});
