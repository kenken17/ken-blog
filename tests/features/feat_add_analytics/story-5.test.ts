// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackEvent } from '../../../src/utils/analytics';

describe('custom event tracking integration', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('SearchBar script would fire search event with query prop', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('search', { query: 'astro analytics' });
    expect(plausible).toHaveBeenCalledWith('search', {
      props: { query: 'astro analytics' },
    });
  });

  it('LikeButton script would fire like_click event with slug prop', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('like_click', { slug: 'my-post' });
    expect(plausible).toHaveBeenCalledWith('like_click', {
      props: { slug: 'my-post' },
    });
  });

  it('ThemeToggle script would fire theme_toggle event with theme prop', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('theme_toggle', { theme: 'dark' });
    expect(plausible).toHaveBeenCalledWith('theme_toggle', {
      props: { theme: 'dark' },
    });
  });

  it('SocialLinks script would fire outbound_click event with url and label props', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    trackEvent('outbound_click', { url: 'https://github.com/kenken17', label: 'GitHub' });
    expect(plausible).toHaveBeenCalledWith('outbound_click', {
      props: { url: 'https://github.com/kenken17', label: 'GitHub' },
    });
  });

  it('all events no-op when window.plausible is undefined', () => {
    vi.stubGlobal('window', {});
    expect(() => trackEvent('search', { query: 'test' })).not.toThrow();
    expect(() => trackEvent('like_click', { slug: 'test' })).not.toThrow();
    expect(() => trackEvent('theme_toggle', { theme: 'light' })).not.toThrow();
    expect(() => trackEvent('outbound_click', { url: 'https://example.com', label: 'Example' })).not.toThrow();
  });
});
