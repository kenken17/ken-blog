// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredSortOrder,
  setStoredSortOrder,
  getDefaultSortOrder,
  getEffectiveSortOrder,
  toggleSortOrder,
  sortPosts,
  sortTags,
  STORAGE_KEY,
} from '../../../src/utils/sort-order';

describe('sort-order utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('STORAGE_KEY', () => {
    it('is "sort_order"', () => {
      expect(STORAGE_KEY).toBe('sort_order');
    });
  });

  describe('getStoredSortOrder', () => {
    it('returns null when no sort order is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(getStoredSortOrder()).toBeNull();
    });

    it('returns chronological when chronological is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('chronological');
      expect(getStoredSortOrder()).toBe('chronological');
    });

    it('returns reverse-chronological when reverse-chronological is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('reverse-chronological');
      expect(getStoredSortOrder()).toBe('reverse-chronological');
    });

    it('returns null for invalid stored value', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid');
      expect(getStoredSortOrder()).toBeNull();
    });

    it('returns null when localStorage throws', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(getStoredSortOrder()).toBeNull();
    });

    it('returns null when window is undefined (SSR)', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error — simulating SSR environment
      globalThis.window = undefined;
      expect(getStoredSortOrder()).toBeNull();
      globalThis.window = originalWindow;
    });
  });

  describe('setStoredSortOrder', () => {
    it('writes chronological to localStorage', () => {
      setStoredSortOrder('chronological');
      expect(localStorage.setItem).toHaveBeenCalledWith('sort_order', 'chronological');
    });

    it('writes reverse-chronological to localStorage', () => {
      setStoredSortOrder('reverse-chronological');
      expect(localStorage.setItem).toHaveBeenCalledWith('sort_order', 'reverse-chronological');
    });

    it('does not throw when localStorage is unavailable', () => {
      (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(() => setStoredSortOrder('chronological')).not.toThrow();
    });

    it('does nothing when window is undefined (SSR)', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error — simulating SSR environment
      globalThis.window = undefined;
      expect(() => setStoredSortOrder('chronological')).not.toThrow();
      globalThis.window = originalWindow;
    });
  });

  describe('getDefaultSortOrder', () => {
    it('returns reverse-chronological', () => {
      expect(getDefaultSortOrder()).toBe('reverse-chronological');
    });
  });

  describe('getEffectiveSortOrder', () => {
    it('returns stored value when present', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('chronological');
      expect(getEffectiveSortOrder()).toBe('chronological');
    });

    it('returns default when no stored value', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(getEffectiveSortOrder()).toBe('reverse-chronological');
    });
  });

  describe('toggleSortOrder', () => {
    it('returns reverse-chronological from chronological', () => {
      expect(toggleSortOrder('chronological')).toBe('reverse-chronological');
    });

    it('returns chronological from reverse-chronological', () => {
      expect(toggleSortOrder('reverse-chronological')).toBe('chronological');
    });
  });

  describe('sortPosts', () => {
    const posts = [
      { data: { pubDate: new Date('2024-03-15') } },
      { data: { pubDate: new Date('2024-01-10') } },
      { data: { pubDate: new Date('2024-06-20') } },
    ];

    it('sorts chronologically (oldest first)', () => {
      const sorted = sortPosts(posts, 'chronological');
      expect(sorted[0].data.pubDate.toISOString()).toBe('2024-01-10T00:00:00.000Z');
      expect(sorted[1].data.pubDate.toISOString()).toBe('2024-03-15T00:00:00.000Z');
      expect(sorted[2].data.pubDate.toISOString()).toBe('2024-06-20T00:00:00.000Z');
    });

    it('sorts reverse-chronologically (newest first)', () => {
      const sorted = sortPosts(posts, 'reverse-chronological');
      expect(sorted[0].data.pubDate.toISOString()).toBe('2024-06-20T00:00:00.000Z');
      expect(sorted[1].data.pubDate.toISOString()).toBe('2024-03-15T00:00:00.000Z');
      expect(sorted[2].data.pubDate.toISOString()).toBe('2024-01-10T00:00:00.000Z');
    });

    it('does not mutate the original array', () => {
      const original = [...posts];
      sortPosts(posts, 'chronological');
      expect(posts).toEqual(original);
    });
  });

  describe('sortTags', () => {
    const tags = ['css', 'astro', 'react'];

    it('sorts alphabetically A→Z for chronological', () => {
      const sorted = sortTags(tags, 'chronological');
      expect(sorted).toEqual(['astro', 'css', 'react']);
    });

    it('sorts reverse-alphabetically Z→A for reverse-chronological', () => {
      const sorted = sortTags(tags, 'reverse-chronological');
      expect(sorted).toEqual(['react', 'css', 'astro']);
    });

    it('does not mutate the original array', () => {
      const original = [...tags];
      sortTags(tags, 'chronological');
      expect(tags).toEqual(original);
    });
  });
});
