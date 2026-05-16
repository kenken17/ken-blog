// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredTheme,
  setStoredTheme,
  getSystemPreference,
  getEffectiveTheme,
  applyTheme,
  toggleTheme,
  initTheme,
} from '../../../src/utils/theme';

describe('theme utility comprehensive tests', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });

    const htmlEl = document.createElement('html');
    vi.stubGlobal('document', { documentElement: htmlEl });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getStoredTheme edge cases', () => {
    it('handles corrupted localStorage values gracefully', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('garbage');
      expect(getStoredTheme()).toBeNull();
    });

    it('handles empty string in localStorage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('');
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('getSystemPreference edge cases', () => {
    it('returns light when matchMedia is unavailable', () => {
      vi.stubGlobal('window', { matchMedia: undefined });
      expect(getSystemPreference()).toBe('light');
    });
  });

  describe('getEffectiveTheme edge cases', () => {
    it('returns light when both stored and system are unavailable', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      vi.stubGlobal('window', { matchMedia: undefined });
      expect(getEffectiveTheme()).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('is safe when document is undefined', () => {
      vi.stubGlobal('document', undefined);
      expect(() => applyTheme('dark')).not.toThrow();
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark when no stored preference', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      vi.stubGlobal('window', {
        matchMedia: vi.fn().mockReturnValue({ matches: false }),
      });
      const result = toggleTheme();
      expect(result).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('toggles from dark to light when no stored preference', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      vi.stubGlobal('window', {
        matchMedia: vi.fn().mockReturnValue({ matches: true }),
      });
      document.documentElement.classList.add('dark');
      const result = toggleTheme();
      expect(result).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('initTheme', () => {
    it('returns light when document is undefined', () => {
      vi.stubGlobal('document', undefined);
      expect(initTheme()).toBe('light');
    });
  });
});
