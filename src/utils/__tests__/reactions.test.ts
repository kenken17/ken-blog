import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.resetModules();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('fetchReactionCount', () => {
  it('returns 0 when no token is set', async () => {
    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');
    expect(result).toBe(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns correct count on successful fetch', async () => {
    vi.stubEnv('PUBLIC_GITHUB_TOKEN', 'test-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          search: {
            nodes: [{ reactions: { totalCount: 42 } }],
          },
        },
      }),
    });

    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');

    expect(result).toBe(42);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('returns 0 when response is not ok', async () => {
    vi.stubEnv('PUBLIC_GITHUB_TOKEN', 'test-token');
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');

    expect(result).toBe(0);
  });

  it('returns 0 when GraphQL returns errors', async () => {
    vi.stubEnv('PUBLIC_GITHUB_TOKEN', 'test-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        errors: [{ message: 'Bad query' }],
      }),
    });

    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');

    expect(result).toBe(0);
  });

  it('returns 0 when no discussions are found', async () => {
    vi.stubEnv('PUBLIC_GITHUB_TOKEN', 'test-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          search: {
            nodes: [],
          },
        },
      }),
    });

    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');

    expect(result).toBe(0);
  });

  it('returns 0 on network failure', async () => {
    vi.stubEnv('PUBLIC_GITHUB_TOKEN', 'test-token');
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { fetchReactionCount } = await import('../reactions');
    const result = await fetchReactionCount('my-post');

    expect(result).toBe(0);
  });
});
