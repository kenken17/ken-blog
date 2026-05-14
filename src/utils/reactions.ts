import { giscusConfig } from '../config/giscus.ts';

interface GitHubGraphQLResponse {
  data?: {
    search?: {
      nodes?: Array<{
        reactions?: {
          totalCount?: number;
        };
      }>;
    };
  };
  errors?: unknown[];
}

const GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

export async function fetchReactionCount(slug: string): Promise<number> {
  const token =
    import.meta.env.PUBLIC_GITHUB_TOKEN ?? import.meta.env.GITHUB_TOKEN;

  if (!token || typeof token !== 'string') {
    return 0;
  }

  const [owner, repo] = giscusConfig.repo.split('/');

  if (!owner || !repo) {
    return 0;
  }

  const query = `
    query SearchDiscussions($query: String!) {
      search(query: $query, type: DISCUSSION, first: 1) {
        nodes {
          ... on Discussion {
            reactions(content: THUMBS_UP) {
              totalCount
            }
          }
        }
      }
    }
  `;

  const searchQuery = `repo:${owner}/${repo} in:title "${slug}"`;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { query: searchQuery } }),
    });

    if (!response.ok) {
      return 0;
    }

    const json = (await response.json()) as GitHubGraphQLResponse;

    if (json.errors || !json.data?.search?.nodes?.length) {
      return 0;
    }

    const discussion = json.data.search.nodes[0];
    return discussion.reactions?.totalCount ?? 0;
  } catch {
    return 0;
  }
}
