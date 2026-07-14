import { SEARCH_PRODUCTS_QUERY } from '../graphql/queries';
import { Product, ProductCategory, SearchProductsResult } from '../types';
import { fetchGraphQL } from './fetchGraphQL';

const COMPLEMENTARY_CATEGORIES: Record<ProductCategory, ProductCategory[]> = {
  Tools: ['Fasteners', 'Safety Equipment'],
  Fasteners: ['Tools', 'Power Tools'],
  'Safety Equipment': ['Tools', 'Power Tools'],
  'Power Tools': ['Fasteners', 'Safety Equipment'],
};

const DEFAULT_LIMIT = 4;

interface GetFrequentlyBoughtTogetherOptions {
  excludeProductIds: string[];
  categorySeeds?: string[];
  limit?: number;
  signal?: AbortSignal;
}

function buildCategoryPriority(seeds: string[]): string[] {
  const priority: string[] = [];

  for (const seed of seeds) {
    if (!priority.includes(seed)) {
      priority.push(seed);
    }

    const complementary = COMPLEMENTARY_CATEGORIES[seed as ProductCategory] ?? [];
    for (const category of complementary) {
      if (!priority.includes(category)) {
        priority.push(category);
      }
    }
  }

  return priority;
}

export async function getFrequentlyBoughtTogether({
  excludeProductIds,
  categorySeeds = [],
  limit = DEFAULT_LIMIT,
  signal,
}: GetFrequentlyBoughtTogetherOptions): Promise<Product[]> {
  const data = await fetchGraphQL<SearchProductsResult>(
    SEARCH_PRODUCTS_QUERY,
    { q: '' },
    { signal }
  );

  const excludeSet = new Set(excludeProductIds);
  const seeds =
    categorySeeds.length > 0
      ? categorySeeds
      : [
          ...new Set(
            data.searchProducts
              .filter(product => excludeSet.has(product.id))
              .map(product => product.category)
          ),
        ];

  if (!seeds.length) {
    return [];
  }

  const categoryPriority = buildCategoryPriority(seeds);
  const recommendations: Product[] = [];
  const seen = new Set<string>();

  for (const category of categoryPriority) {
    for (const product of data.searchProducts) {
      if (recommendations.length >= limit) {
        return recommendations;
      }

      if (product.category !== category) continue;
      if (excludeSet.has(product.id) || seen.has(product.id)) continue;
      if (product.stock <= 0) continue;

      seen.add(product.id);
      recommendations.push(product);
    }
  }

  return recommendations;
}
