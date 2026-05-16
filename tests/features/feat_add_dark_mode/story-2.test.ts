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

describe('theme utilities', () => {
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

  describe('getStoredTheme', () => {
    it('returns null when no theme is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(getStoredTheme()).toBeNull();
    });

    it('returns light when light is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns dark when dark is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('returns null for invalid stored value', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid');
      expect(getStoredTheme()).toBeNull();
    });

    it('returns null when localStorage throws', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(getStoredTheme()).toBeNull();
    });
  });

  describe('setStoredTheme', () => {
    it('writes light to localStorage', () => {
      setStoredTheme('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('writes dark to localStorage', () => {
      setStoredTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('does not throw when localStorage is unavailable', () => {
      (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(() => setStoredTheme('dark')).not.toThrow();
    });
  });

  describe('getSystemPreference', () => {
    it('returns dark when system prefers dark', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: vi.fn().mockReturnValue({ matches: true }),
        }
      );
      expect(getSystemPreference()).toBe('dark');
    });

    it('returns light when system prefers light', () => {
      vi.stubGlobal(
        'window',
        {
          matchMedia: vi.fn().mockReturnValue({ matches: false }),
        }
      );
      expect(getSystemPreference()).toBe('light');
    });
  });

  describe('getEffectiveTheme', () => {
    it('returns stored theme over system preference', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('light');
      vi.stubGlobal(
        'window',
        {
          matchMedia: vi.fn().mockReturnValue({ matches: true }),
        }
      );
      expect(getEffectiveTheme()).toBe('light');
    });

    it('falls back to system preference when no stored theme', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      vi.stubGlobal(
        'window',
        {
          matchMedia: vi.fn().mockReturnValue({ matches: true }),
        }
      );
      expect(getEffectiveTheme()).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    it('adds dark class for dark theme', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class for light theme', () => {
      document.documentElement.classList.add('dark');
      applyTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark and persists', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('light');
      const result = toggleTheme();
      expect(result).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('toggles from dark to light and persists', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('dark');
      document.documentElement.classList.add('dark');
      const result = toggleTheme();
      expect(result).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('initTheme', () => {
    it('applies and returns stored theme', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('dark');
      const result = initTheme();
      expect(result).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('applies and returns system preference when no stored theme', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      vi.stubGlobal(
        'window',
        {
          matchMedia: vi.fn().mockReturnValue({ matches: false }),
        }
      );
      const result = initTheme();
      expect(result).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
