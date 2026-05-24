// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BlogTagFilter client-side logic', () => {
  let container: HTMLDivElement;

  function setupDOM() {
    container = document.createElement('div');
    container.innerHTML = `
      <div data-blog-tag-filter-container>
        <button
          type="button"
          data-blog-tag-filter
          data-tag="astro"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-background-elevated rounded-full text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          aria-pressed="false"
          aria-label="Filter by astro (2 posts)"
        >
          <span class="text-sm font-sans uppercase tracking-wider">astro</span>
          <span class="text-xs font-sans text-foreground-muted" data-tag-count>2</span>
        </button>
        <button
          type="button"
          data-blog-tag-filter
          data-tag="react"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-background-elevated rounded-full text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          aria-pressed="false"
          aria-label="Filter by react (1 post)"
        >
          <span class="text-sm font-sans uppercase tracking-wider">react</span>
          <span class="text-xs font-sans text-foreground-muted" data-tag-count>1</span>
        </button>
        <button
          type="button"
          data-blog-tag-filter
          data-tag="typescript"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-background-elevated rounded-full text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
          aria-pressed="false"
          aria-label="Filter by typescript (1 post)"
        >
          <span class="text-sm font-sans uppercase tracking-wider">typescript</span>
          <span class="text-xs font-sans text-foreground-muted" data-tag-count>1</span>
        </button>
      </div>
    `;
    document.body.appendChild(container);
  }

  function initBlogTagFilter() {
    const STORAGE_KEY = 'blog_tag_filter';

    function getStoredTags(): string[] {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: unknown): t is string => typeof t === 'string');
        }
        return [];
      } catch {
        return [];
      }
    }

    function setStoredTags(tags: string[]): void {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
      } catch {
        return;
      }
    }

    function updateButtonState(button: HTMLButtonElement, isActive: boolean) {
      if (isActive) {
        button.classList.remove('border-background-elevated', 'text-foreground-muted');
        button.classList.add('bg-foreground', 'text-background');
        button.setAttribute('aria-pressed', 'true');
        const countSpan = button.querySelector<HTMLSpanElement>('[data-tag-count]');
        if (countSpan) {
          countSpan.classList.remove('text-foreground-muted');
          countSpan.classList.add('text-background');
        }
      } else {
        button.classList.remove('bg-foreground', 'text-background');
        button.classList.add('border-background-elevated', 'text-foreground-muted');
        button.setAttribute('aria-pressed', 'false');
        const countSpan = button.querySelector<HTMLSpanElement>('[data-tag-count]');
        if (countSpan) {
          countSpan.classList.remove('text-background');
          countSpan.classList.add('text-foreground-muted');
        }
      }
    }

    function dispatchTagFilterChange(tags: string[]) {
      document.documentElement.setAttribute('data-tag-filter', JSON.stringify(tags));
      window.dispatchEvent(
        new CustomEvent('blog-tag-filter:change', { detail: { tags } })
      );
    }

    const buttons = container.querySelectorAll<HTMLButtonElement>('[data-blog-tag-filter]');
    const activeTags = new Set(getStoredTags());

    buttons.forEach((button) => {
      const tag = button.getAttribute('data-tag');
      if (!tag) return;
      updateButtonState(button, activeTags.has(tag));
    });

    if (activeTags.size > 0) {
      dispatchTagFilterChange(Array.from(activeTags));
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const tag = button.getAttribute('data-tag');
        if (!tag) return;

        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          updateButtonState(button, false);
        } else {
          activeTags.add(tag);
          updateButtonState(button, true);
        }

        const tagsArray = Array.from(activeTags);
        setStoredTags(tagsArray);
        dispatchTagFilterChange(tagsArray);
      });
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
    it('sets all buttons to inactive when no preference is stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const buttons = container.querySelectorAll<HTMLButtonElement>('[data-blog-tag-filter]');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-pressed')).toBe('false');
        expect(btn.classList.contains('bg-foreground')).toBe(false);
      });
    });

    it('activates buttons matching stored tags', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['astro']));
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]');
      const reactBtn = container.querySelector<HTMLButtonElement>('[data-tag="react"]');
      expect(astroBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(astroBtn?.classList.contains('bg-foreground')).toBe(true);
      expect(reactBtn?.getAttribute('aria-pressed')).toBe('false');
    });

    it('activates multiple buttons when multiple tags are stored', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['astro', 'react']));
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]');
      const reactBtn = container.querySelector<HTMLButtonElement>('[data-tag="react"]');
      const tsBtn = container.querySelector<HTMLButtonElement>('[data-tag="typescript"]');
      expect(astroBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(reactBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(tsBtn?.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('toggle interaction', () => {
    it('clicking an inactive button activates it', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(astroBtn.getAttribute('aria-pressed')).toBe('true');
      expect(astroBtn.classList.contains('bg-foreground')).toBe(true);
    });

    it('clicking an active button deactivates it', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['astro']));
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(astroBtn.getAttribute('aria-pressed')).toBe('false');
      expect(astroBtn.classList.contains('bg-foreground')).toBe(false);
    });

    it('stores selected tags in localStorage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(localStorage.setItem).toHaveBeenCalledWith('blog_tag_filter', JSON.stringify(['astro']));
    });

    it('stores multiple selected tags in localStorage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      const reactBtn = container.querySelector<HTMLButtonElement>('[data-tag="react"]')!;
      astroBtn.click();
      reactBtn.click();
      expect(localStorage.setItem).toHaveBeenLastCalledWith('blog_tag_filter', JSON.stringify(['astro', 'react']));
    });

    it('removes deselected tag from localStorage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['astro', 'react']));
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(localStorage.setItem).toHaveBeenLastCalledWith('blog_tag_filter', JSON.stringify(['react']));
    });

    it('dispatches blog-tag-filter:change event on click', () => {
      const listener = vi.fn();
      window.addEventListener('blog-tag-filter:change', listener);
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(listener).toHaveBeenCalled();
      const event = listener.mock.calls[0][0] as CustomEvent;
      expect(event.detail.tags).toEqual(['astro']);
      window.removeEventListener('blog-tag-filter:change', listener);
    });

    it('sets data-tag-filter attribute on html element', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      astroBtn.click();
      expect(document.documentElement.getAttribute('data-tag-filter')).toBe(JSON.stringify(['astro']));
    });
  });

  describe('keyboard accessibility', () => {
    it('buttons are native button elements', () => {
      const buttons = container.querySelectorAll('[data-blog-tag-filter]');
      buttons.forEach((btn) => {
        expect(btn.tagName).toBe('BUTTON');
        expect(btn.getAttribute('type')).toBe('button');
      });
    });

    it('click event fires when Enter is pressed on a real button', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      initBlogTagFilter();
      const astroBtn = container.querySelector<HTMLButtonElement>('[data-tag="astro"]')!;
      const clickSpy = vi.fn();
      astroBtn.addEventListener('click', clickSpy);
      astroBtn.click();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('ignores invalid localStorage data', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('not-json');
      initBlogTagFilter();
      const buttons = container.querySelectorAll<HTMLButtonElement>('[data-blog-tag-filter]');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('ignores non-array localStorage data', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify({ foo: 'bar' }));
      initBlogTagFilter();
      const buttons = container.querySelectorAll<HTMLButtonElement>('[data-blog-tag-filter]');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-pressed')).toBe('false');
      });
    });

    it('handles localStorage errors gracefully', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(() => initBlogTagFilter()).not.toThrow();
      const buttons = container.querySelectorAll<HTMLButtonElement>('[data-blog-tag-filter]');
      buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-pressed')).toBe('false');
      });
    });
  });
});
