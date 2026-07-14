import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { ProductsGrid } from '../components/ProductsGrid/ProductsGrid';
import { GET_PRODUCT_QUERY } from '../graphql/queries';
import { GetProductResult, Product, ProductCategory } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { getImageSrc } from '../utils/getImageSrc';
import styles from './index.module.css';

const CATEGORIES: ProductCategory[] = [
  'Tools',
  'Fasteners',
  'Safety Equipment',
  'Power Tools',
];

export const getServerSideProps: GetServerSideProps = async () => {
  const FEATURED_IDS = ['1', '4', '11', '17'];

  const featured = (
    await Promise.all(
      FEATURED_IDS.map(async id => {
        try {
          const data = await fetchGraphQL<GetProductResult>(GET_PRODUCT_QUERY, { id });
          return data.product ?? null;
        } catch {
          return null;
        }
      })
    )
  ).filter((product): product is Product => product !== null);

  return {
    props: {
      featured,
    },
  };
};

interface HomePageProps {
  featured: Product[];
}

export default function HomePage({ featured }: HomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <Image
          src={getImageSrc('https://placehold.co/1200x800/e63329/ffffff?text=Kramp+Webshop')}
          alt="Kramp — Your industrial supply partner"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for professionals.
          </p>
        </div>
      </section>

      <ProductsGrid products={featured} title="Featured products" />

      <section className={styles.categories}>
        <h2>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/search?q=${encodeURIComponent(cat)}`}
              className={styles.categoryCard}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
