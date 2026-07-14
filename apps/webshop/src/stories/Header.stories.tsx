import { storiesOf } from '@storybook/react';
import { Header } from '../components/Header/Header';
import { withCart, withRouter } from './decorators';

storiesOf('Header', module)
  .addDecorator(withRouter)
  .addDecorator(withCart())
  .add('default', () => <Header />)
  .add('with cart items', () => <Header />, {
    decorators: [withCart({ totalItems: 3, isReady: true })],
  });
