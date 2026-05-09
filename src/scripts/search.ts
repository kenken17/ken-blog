export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
}

export interface SearchResult {
  entry: SearchIndexEntry;
  highlightedTitle: string;
  highlightedDescription: string;
}

let indexCache: SearchIndexEntry[] | null = null;

export function clearSearchIndexCache(): void {
  indexCache = null;
}

export async function fetchSearchIndex(): Promise<SearchIndexEntry[]> {
  if (indexCache) {
    return indexCache;
  }

  const response = await fetch('/search-index.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch search index: ${response.status}`);
  }

  const data = (await response.json()) as SearchIndexEntry[];
  indexCache = data;
  return data;
}

export function searchPosts(index: SearchIndexEntry[], query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const entry of index) {
    const titleMatch = entry.title.toLowerCase().includes(normalizedQuery);
    const descMatch = entry.description.toLowerCase().includes(normalizedQuery);
    const tagMatch = entry.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    if (titleMatch || descMatch || tagMatch) {
      results.push({
        entry,
        highlightedTitle: highlightText(entry.title, normalizedQuery),
        highlightedDescription: highlightText(entry.description, normalizedQuery),
      });
    }
  }

  return results.slice(0, 8);
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-foreground text-foreground-inverse px-0.5 rounded">$1</mark>');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function renderResults(results: SearchResult[], listEl: HTMLElement, emptyEl: HTMLElement): void {
  listEl.innerHTML = '';

  if (results.length === 0) {
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');

  for (const result of results) {
    const li = document.createElement('li');
    li.innerHTML = `
      <a
        href="/blog/${result.entry.slug}/"
        class="block px-4 py-3 hover:bg-background-elevated focus:bg-background-elevated transition-colors outline-none"
        data-search-result
      >
        <div class="text-sm font-medium text-foreground mb-0.5">${result.highlightedTitle}</div>
        <div class="text-xs text-foreground-secondary line-clamp-2">${result.highlightedDescription}</div>
        <div class="mt-1.5 flex items-center gap-2 text-xs text-foreground-muted">
          <time datetime="${result.entry.pubDate}">${formatDate(result.entry.pubDate)}</time>
          ${result.entry.tags.length > 0 ? `
            <span class="flex gap-1">
              ${result.entry.tags.map(tag => `<span class="bg-background-elevated px-1.5 py-0.5 rounded">${tag}</span>`).join('')}
            </span>
          ` : ''}
        </div>
      </a>
    `;
    listEl.appendChild(li);
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function initSearch(): void {
  const container = document.querySelector<HTMLElement>('[data-search-container]');
  if (!container) return;

  const desktopInput = container.querySelector<HTMLInputElement>('[data-search-input]');
  const mobileToggle = container.querySelector<HTMLButtonElement>('[data-search-mobile-toggle]');
  const mobileOverlay = container.querySelector<HTMLElement>('[data-search-mobile-overlay]');
  const mobileInput = container.querySelector<HTMLInputElement>('[data-search-mobile-input]');
  const mobileClose = container.querySelector<HTMLButtonElement>('[data-search-mobile-close]');
  const resultsDropdown = container.querySelector<HTMLElement>('[data-search-results]');
  const resultsList = container.querySelector<HTMLElement>('[data-search-list]');
  const emptyState = container.querySelector<HTMLElement>('[data-search-empty]');

  if (!resultsList || !emptyState || !resultsDropdown) return;

  const listEl = resultsList;
  const emptyEl = emptyState;
  const dropdownEl = resultsDropdown;

  let activeInput: HTMLInputElement | null = null;
  let selectedIndex = -1;

  async function performSearch(query: string) {
    try {
      const index = await fetchSearchIndex();
      const results = searchPosts(index, query);
      renderResults(results, listEl, emptyEl);
      selectedIndex = -1;
    } catch (err) {
      console.error('Search error:', err);
      listEl.innerHTML = '';
      emptyEl.textContent = 'Search unavailable';
      emptyEl.classList.remove('hidden');
    }
  }

  const debouncedSearch = debounce(performSearch, 200);

  function openDropdown() {
    dropdownEl.classList.remove('hidden');
  }

  function closeDropdown() {
    dropdownEl.classList.add('hidden');
    selectedIndex = -1;
  }

  function openMobileSearch() {
    mobileOverlay?.classList.remove('hidden');
    mobileOverlay?.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => mobileInput?.focus(), 50);
    activeInput = mobileInput;
  }

  function closeMobileSearch() {
    mobileOverlay?.classList.add('hidden');
    mobileOverlay?.classList.remove('flex');
    document.body.style.overflow = '';
    if (mobileInput) mobileInput.value = '';
    closeDropdown();
    activeInput = desktopInput;
  }

  function handleInput(input: HTMLInputElement) {
    const query = input.value;
    if (query.trim().length === 0) {
      closeDropdown();
      return;
    }
    openDropdown();
    debouncedSearch(query);
  }

  function updateSelection() {
    const items = listEl.querySelectorAll<HTMLElement>('[data-search-result]');
    items.forEach((item, i) => {
      if (i === selectedIndex) {
        item.classList.add('bg-background-elevated');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-background-elevated');
      }
    });
  }

  function handleKeydown(e: KeyboardEvent) {
    const items = listEl.querySelectorAll<HTMLElement>('[data-search-result]');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < items.length - 1) {
        selectedIndex++;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0) {
        selectedIndex--;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex]!.click();
      } else if (activeInput?.value.trim()) {
        performSearch(activeInput.value);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
      if (mobileOverlay && !mobileOverlay.classList.contains('hidden')) {
        closeMobileSearch();
      }
    }
  }

  if (desktopInput) {
    activeInput = desktopInput;
    desktopInput.addEventListener('input', () => handleInput(desktopInput));
    desktopInput.addEventListener('keydown', handleKeydown);
    desktopInput.addEventListener('focus', () => {
      if (desktopInput.value.trim()) openDropdown();
    });
  }

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', openMobileSearch);
  }

  if (mobileInput) {
    mobileInput.addEventListener('input', () => handleInput(mobileInput));
    mobileInput.addEventListener('keydown', handleKeydown);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileSearch);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileSearch();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (window.innerWidth >= 768) {
        desktopInput?.focus();
      } else {
        openMobileSearch();
      }
    }
  });
}
