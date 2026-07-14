import { storiesOf } from '@storybook/react';
import { CartIcon } from '../components/CartIcon/CartIcon';

storiesOf('CartIcon', module)
  .add('empty cart', () => <CartIcon count={0} />)
  .add('single item', () => <CartIcon count={1} />)
  .add('multiple items', () => <CartIcon count={12} />);
