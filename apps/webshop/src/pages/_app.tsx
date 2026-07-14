import 'isomorphic-fetch';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CartContext } from '../contexts/CartContext';
import { useCart } from '../hooks/useCart';
import { Header } from '../components/Header';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const cart = useCart();

  return (
    <CartContext.Provider value={cart}>
      <Head>
        <title>Kramp Webshop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="app">
        <Component {...pageProps} />
      </main>
    </CartContext.Provider>
  );
}

export default CustomApp;
