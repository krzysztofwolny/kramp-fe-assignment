import type { NextApiRequest, NextApiResponse } from 'next';

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql';

interface GraphQLRequestBody {
  query?: unknown;
  variables?: unknown;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as GraphQLRequestBody;

  if (!body || typeof body.query !== 'string' || !body.query.trim()) {
    return res.status(400).json({ error: 'Invalid GraphQL request' });
  }

  if (
    body.variables !== undefined &&
    (body.variables === null || typeof body.variables !== 'object' || Array.isArray(body.variables))
  ) {
    return res.status(400).json({ error: 'Invalid GraphQL variables' });
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
      }),
    });

    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch {
    return res.status(502).json({ error: 'GraphQL proxy unavailable' });
  }
}
