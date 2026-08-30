const GRAPHQL_ENDPOINT = import.meta.env.VITE_SITE_URI + '/graphql';

export class GraphQLRequestError extends Error {}

interface GraphQLResponse<T> {
  data?: T;
  errors?: {message: string}[];
}

export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {'Content-Type': 'application/json'};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({query, variables}),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new GraphQLRequestError(json.errors[0].message || 'GraphQL request failed.');
  }

  if (!response.ok || !json.data) {
    throw new GraphQLRequestError('GraphQL request failed.');
  }

  return json.data;
}
