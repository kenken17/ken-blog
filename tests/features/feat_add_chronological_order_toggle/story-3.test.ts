// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import {
  SORT_PREFERENCE_KEY,
  getSortPreference,
  setSortPreference,
} from '../../../src/utils/sortPreference';

describe('story 3: sort preference storage service', () => {
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

  it('returns desc by default when preference is missing', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    expect(getSortPreference()).toBe('desc');
  });

  it('returns saved asc preference when present', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('asc');
    expect(getSortPreference()).toBe('asc');
  });

  it('falls back to desc for invalid stored values', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid-value');
    expect(getSortPreference()).toBe('desc');
  });

  it('writes preference to localStorage', () => {
    setSortPreference('asc');
    expect(localStorage.setItem).toHaveBeenCalledWith(SORT_PREFERENCE_KEY, 'asc');
  });

  it('gracefully falls back to desc when localStorage throws on read', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    expect(getSortPreference()).toBe('desc');
  });

  it('does not throw when localStorage throws on write', () => {
    (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });

    expect(() => setSortPreference('desc')).not.toThrow();
  });
});
