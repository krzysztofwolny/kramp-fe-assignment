import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SearchDialog } from '../components/SearchDialog/SearchDialog';
import { mockSearchResults } from '../test-fixtures/products';

storiesOf('SearchDialog', module)
  .add('with results', () => (
    <div style={{ position: 'relative', maxWidth: 400, margin: '24px auto' }}>
      <SearchDialog
        results={mockSearchResults}
        onSelect={action('product-selected')}
        activeIndex={0}
        listboxId="storybook-search-listbox"
      />
    </div>
  ))
  .add('with active option', () => (
    <div style={{ position: 'relative', maxWidth: 400, margin: '24px auto' }}>
      <SearchDialog
        results={mockSearchResults}
        onSelect={action('product-selected')}
        activeIndex={1}
        listboxId="storybook-search-listbox-active"
      />
    </div>
  ));
