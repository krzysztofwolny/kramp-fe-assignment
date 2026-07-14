import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import { ProductSearchHit, SearchProductsResult } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { SearchDialog } from './SearchDialog';
import { CartIcon } from './cartIcon';
import { useDebounce } from '../hooks/useDebounce';
import styles from './Header.module.css';

const SEARCH_QUERY = `
  query Search($q: String!) {
    searchProducts(query: $q) {
      id
      name
      price
      imageUrl
      description
      stock
      createdAt
    }
  }
`;

export function Header() {
  const router = useRouter();
  const { cart } = useContext(CartContext)!;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchHit[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    fetchGraphQL<SearchProductsResult>(SEARCH_QUERY, { q: query })
      .then(data => {
        setResults(data.searchProducts.slice(0, 5));
      })
      .catch(() => {
        setResults([]);
      });
  }, [query]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query));
      setIsOpen(false);
    }
  };

  const isActivePage = (path: string) => {
    return router.pathname.indexOf(path) !== -1;
  };

  const truncatedQuery = query.substr(0, 30);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Kramp
        </Link>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={isActivePage('/') && router.pathname === '/' ? styles.activeLink : styles.navLink}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={isActivePage('/search') ? styles.activeLink : styles.navLink}
          >
            Products
          </Link>
          <Link
            href="/checkout"
            className={isActivePage('/checkout') ? styles.activeLink : styles.navLink}
          >
            Checkout
          </Link>
        </nav>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            value={query}
            placeholder="Search products..."
            className={styles.searchInput}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={e => e.stopPropagation()}
          />
          {truncatedQuery && query.length > 30 && (
            <span className={styles.truncatedHint}>Searching: {truncatedQuery}…</span>
          )}
          {isOpen && (
            <SearchDialog
              results={results}
              onSelect={(id: string) => {
                router.push(`/product/${id}`);
                setIsOpen(false);
                setQuery('');
              }}
            />
          )}
        </div>

        <CartIcon count={cart.isReady ? cart.totalItems : 0} />
      </div>
    </header>
  );
}
