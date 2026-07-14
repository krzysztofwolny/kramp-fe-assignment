function getGraphQLUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.GRAPHQL_URL || 'http://localhost:4000/graphql';
  }

  return '/api/graphql';
}

interface FetchGraphQLOptions {
  signal?: AbortSignal;
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options?: FetchGraphQLOptions
): Promise<T> {
  const response = await fetch(getGraphQLUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}
