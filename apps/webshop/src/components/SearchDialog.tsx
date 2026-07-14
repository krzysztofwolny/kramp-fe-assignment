import { ProductSearchHit } from '../types';
import styles from './SearchDialog.module.css';

interface SearchDialogProps {
  results: ProductSearchHit[];
  onSelect: (id: string) => void;
  activeIndex: number;
  listboxId: string;
}

export function SearchDialog({
  results,
  onSelect,
  activeIndex,
  listboxId,
}: SearchDialogProps) {
  if (!results.length) return null;

  return (
    <ul
      id={listboxId}
      role="listbox"
      className={styles.dialog}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.preventDefault()}
    >
      {results.map((result, index) => (
        <li key={result.id} role="presentation">
          <button
            type="button"
            id={`search-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className={`${styles.item} ${index === activeIndex ? styles.itemActive : ''}`}
            onClick={() => onSelect(result.id)}
          >
            <span className={styles.itemName}>{result.name}</span>
            <span className={styles.itemPrice}>€{result.price.toFixed(2)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
