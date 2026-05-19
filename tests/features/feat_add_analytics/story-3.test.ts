// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackEvent } from '../../../src/utils/analytics';

describe('analytics event utility', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls window.plausible when available', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', {
      plausible,
    });
    trackEvent('test_event');
    expect(plausible).toHaveBeenCalledTimes(1);
  });

  it('no-ops when window.plausible is undefined', () => {
    vi.stubGlobal('window', {});
    expect(() => trackEvent('test_event')).not.toThrow();
  });

  it('passes correct event name and props', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('search', { query: 'astro' });
    expect(plausible).toHaveBeenCalledWith('search', { props: { query: 'astro' } });
  });

  it('handles missing props gracefully', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('page_view');
    expect(plausible).toHaveBeenCalledWith('page_view', { props: {} });
  });

  it('no-ops when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(() => trackEvent('test_event')).not.toThrow();
  });

  it('no-ops when plausible throws', () => {
    const plausible = vi.fn().mockImplementation(() => {
      throw new Error('Analytics error');
    });
    vi.stubGlobal('window', { plausible });
    expect(() => trackEvent('test_event')).not.toThrow();
  });
});
