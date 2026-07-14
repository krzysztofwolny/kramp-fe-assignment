import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SEARCH_PRODUCTS_QUERY } from '../graphql/queries';
import { ProductSearchHit, SearchProductsResult } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import { useCartContext } from '../hooks/useCartContext';
import { SearchDialog } from './SearchDialog';
import { CartIcon } from './cartIcon';
import { useDebounce } from '../hooks/useDebounce';
import styles from './Header.module.css';

const SEARCH_LISTBOX_ID = 'header-search-listbox';

export function Header() {
  const router = useRouter();
  const cart = useCartContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductSearchHit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    fetchGraphQL<SearchProductsResult>(SEARCH_PRODUCTS_QUERY, { q: debouncedQuery })
      .then(data => {
        setResults(data.searchProducts.slice(0, 5));
      })
      .catch(() => {
        setResults([]);
      });
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false);
      setActiveIndex(-1);
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const selectResult = (id: string) => {
    router.push(`/product/${id}`);
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!results.length) return;
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        selectResult(results[activeIndex].id);
        return;
      }

      if (query.trim()) {
        router.push('/search?q=' + encodeURIComponent(query));
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
  };

  const isActivePage = (path: string) => {
    return router.pathname.indexOf(path) !== -1;
  };

  const truncatedQuery = query.slice(0, 30);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Kramp
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
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

        <div
          className={styles.searchWrapper}
          onClick={e => e.stopPropagation()}
        >
          <input
            type="search"
            value={query}
            placeholder="Search products..."
            className={styles.searchInput}
            role="combobox"
            aria-label="Search products"
            aria-expanded={isOpen}
            aria-controls={SEARCH_LISTBOX_ID}
            aria-activedescendant={
              activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {truncatedQuery && query.length > 30 && (
            <span className={styles.truncatedHint}>Searching: {truncatedQuery}…</span>
          )}
          {isOpen && (
            <SearchDialog
              results={results}
              listboxId={SEARCH_LISTBOX_ID}
              activeIndex={activeIndex}
              onSelect={selectResult}
            />
          )}
        </div>

        <CartIcon count={cart.isReady ? cart.totalItems : 0} />
      </div>
    </header>
  );
}
