import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SITE_URL } from '../../../src/config/seo';

describe('analytics config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports correct shape and types', async () => {
    const { analyticsConfig, AnalyticsConfig } = await import('../../../src/config/analytics');
    expect(analyticsConfig).toBeDefined();
    expect(typeof analyticsConfig.enabled).toBe('boolean');
    expect(typeof analyticsConfig.measurementId).toBe('string');
    expect(typeof analyticsConfig.domain).toBe('string');
    expect(analyticsConfig.trackingMode).toBe('cookieless');
    expect(typeof analyticsConfig.scriptSrc).toBe('string');
    expect(AnalyticsConfig).toBeUndefined();
  });

  it('enabled is false when import.meta.env.PROD is false', async () => {
    import.meta.env.PROD = false;
    const { analyticsConfig } = await import('../../../src/config/analytics');
    expect(analyticsConfig.enabled).toBe(false);
  });

  it('measurementId reads from import.meta.env.PUBLIC_ANALYTICS_ID', async () => {
    import.meta.env.PROD = false;
    import.meta.env.PUBLIC_ANALYTICS_ID = 'test-domain.com';
    const { analyticsConfig } = await import('../../../src/config/analytics');
    expect(analyticsConfig.measurementId).toBe('test-domain.com');
  });

  it('domain matches SITE_URL without protocol', async () => {
    import.meta.env.PROD = false;
    const { analyticsConfig } = await import('../../../src/config/analytics');
    expect(analyticsConfig.domain).toBe(SITE_URL.replace(/^https?:\/\//, ''));
  });

  it('config includes fallback logic for measurementId', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/config/analytics.ts'),
      'utf-8'
    );
    expect(source).toContain('PUBLIC_ANALYTICS_ID');
    expect(source).toContain("?? ''");
  });
});
