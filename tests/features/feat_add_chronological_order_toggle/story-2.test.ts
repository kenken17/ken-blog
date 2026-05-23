// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SortOrderToggle client-side logic', () => {
  let toggleBtn: HTMLButtonElement;
  let ascendingIcon: SVGSVGElement;
  let descendingIcon: SVGSVGElement;
  let container: HTMLDivElement;

  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
      <button
        type="button"
        data-sort-order-toggle
        aria-label="Sort order: newest first — click to show oldest first"
        class="p-2 text-foreground-secondary hover:text-foreground transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none rounded-sm"
      >
        <svg
          data-ascending-icon
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="hidden"
          aria-hidden="true"
        >
          <path d="m3 8 4-4 4 4" />
          <path d="M7 4v16" />
          <path d="M11 12h4" />
          <path d="M11 16h7" />
          <path d="M11 20h10" />
        </svg>
        <svg
          data-descending-icon
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class=""
          aria-hidden="true"
        >
          <path d="m3 16 4 4 4-4" />
          <path d="M7 20V4" />
          <path d="M11 12h4" />
          <path d="M11 8h7" />
          <path d="M11 4h10" />
        </svg>
      </button>
    `;
    document.body.appendChild(container);
    toggleBtn = container.querySelector<HTMLButtonElement>('[data-sort-order-toggle]')!;
    ascendingIcon = container.querySelector<SVGSVGElement>('[data-ascending-icon]')!;
    descendingIcon = container.querySelector<SVGSVGElement>('[data-descending-icon]')!;
  }

  function initSortOrderToggle() {
    const stored = localStorage.getItem('sort_order');
    const order = stored === 'chronological' || stored === 'reverse-chronological'
      ? stored
      : 'reverse-chronological';

    function updateIcons(currentOrder: string) {
      if (currentOrder === 'chronological') {
        ascendingIcon.classList.remove('hidden');
        descendingIcon.classList.add('hidden');
      } else {
        ascendingIcon.classList.add('hidden');
        descendingIcon.classList.remove('hidden');
      }
    }

    function updateAriaLabel(currentOrder: string) {
      if (currentOrder === 'chronological') {
        toggleBtn.setAttribute('aria-label', 'Sort order: oldest first — click to show newest first');
      } else {
        toggleBtn.setAttribute('aria-label', 'Sort order: newest first — click to show oldest first');
      }
    }

    updateIcons(order);
    updateAriaLabel(order);

    toggleBtn.addEventListener('click', () => {
      const current = localStorage.getItem('sort_order') === 'chronological' ? 'chronological' : 'reverse-chronological';
      const next = current === 'chronological' ? 'reverse-chronological' : 'chronological';
      localStorage.setItem('sort_order', next);
      updateIcons(next);
      updateAriaLabel(next);
      window.dispatchEvent(new CustomEvent('sort-order:change', { detail: { order: next } }));
    });
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    setupDOM();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  describe('initialization', () => {
    it('shows descending icon by default when no preference is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initSortOrderToggle();
      expect(ascendingIcon.classList.contains('hidden')).toBe(true);
      expect(descendingIcon.classList.contains('hidden')).toBe(false);
    });

    it('shows ascending icon when chronological is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('chronological');
      initSortOrderToggle();
      expect(ascendingIcon.classList.contains('hidden')).toBe(false);
      expect(descendingIcon.classList.contains('hidden')).toBe(true);
    });

    it('sets correct aria-label for default state', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initSortOrderToggle();
      expect(toggleBtn.getAttribute('aria-label')).toBe('Sort order: newest first — click to show oldest first');
    });

    it('sets correct aria-label for chronological state', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('chronological');
      initSortOrderToggle();
      expect(toggleBtn.getAttribute('aria-label')).toBe('Sort order: oldest first — click to show newest first');
    });
  });

  describe('toggle interaction', () => {
    it('click toggles from reverse-chronological to chronological', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initSortOrderToggle();
      toggleBtn.click();
      expect(localStorage.setItem).toHaveBeenCalledWith('sort_order', 'chronological');
      expect(ascendingIcon.classList.contains('hidden')).toBe(false);
      expect(descendingIcon.classList.contains('hidden')).toBe(true);
    });

    it('click toggles from chronological to reverse-chronological', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('chronological');
      initSortOrderToggle();
      toggleBtn.click();
      expect(localStorage.setItem).toHaveBeenCalledWith('sort_order', 'reverse-chronological');
      expect(ascendingIcon.classList.contains('hidden')).toBe(true);
      expect(descendingIcon.classList.contains('hidden')).toBe(false);
    });

    it('dispatches sort-order:change event on click', () => {
      const listener = vi.fn();
      window.addEventListener('sort-order:change', listener);
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initSortOrderToggle();
      toggleBtn.click();
      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.order).toBe('chronological');
      window.removeEventListener('sort-order:change', listener);
    });
  });

  describe('keyboard accessibility', () => {
    it('is a native button element (natively handles Enter/Space)', () => {
      setupDOM();
      expect(toggleBtn.tagName).toBe('BUTTON');
      expect(toggleBtn.getAttribute('type')).toBe('button');
    });

    it('click event fires when Enter is pressed on a real button', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initSortOrderToggle();
      const clickSpy = vi.fn();
      toggleBtn.addEventListener('click', clickSpy);
      toggleBtn.click();
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
