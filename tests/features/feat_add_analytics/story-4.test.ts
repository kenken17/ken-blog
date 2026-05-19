// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getConsent, setConsent, hasConsented } from '../../../src/utils/consent';

describe('consent utility', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      CustomEvent: class MockCustomEvent<T = unknown> extends Event {
        detail: T;
        constructor(type: string, eventInitDict?: { detail?: T }) {
          super(type);
          this.detail = eventInitDict?.detail as T;
        }
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getConsent returns null when no stored value', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    expect(getConsent()).toBeNull();
  });

  it('setConsent accepted persists and getConsent returns accepted', () => {
    setConsent('accepted');
    expect(localStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'accepted');
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('accepted');
    expect(getConsent()).toBe('accepted');
  });

  it('setConsent declined persists and getConsent returns declined', () => {
    setConsent('declined');
    expect(localStorage.setItem).toHaveBeenCalledWith('analytics_consent', 'declined');
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('declined');
    expect(getConsent()).toBe('declined');
  });

  it('hasConsented returns true only for accepted', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('accepted');
    expect(hasConsented()).toBe(true);
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('declined');
    expect(hasConsented()).toBe(false);
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    expect(hasConsented()).toBe(false);
  });

  it('localStorage errors are caught gracefully', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(getConsent()).toBeNull();
  });

  it('setConsent does not throw when localStorage is unavailable', () => {
    (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(() => setConsent('accepted')).not.toThrow();
  });

  it('consent:change event is dispatched on setConsent', () => {
    setConsent('accepted');
    expect(window.dispatchEvent).toHaveBeenCalledTimes(1);
    const dispatched = (window.dispatchEvent as ReturnType<typeof vi.fn>).mock.calls[0][0] as Event;
    expect(dispatched.type).toBe('consent:change');
    expect((dispatched as unknown as Record<string, unknown>).detail).toEqual({ choice: 'accepted' });
  });

  it('getConsent returns null for invalid stored value', () => {
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('invalid');
    expect(getConsent()).toBeNull();
  });
});
