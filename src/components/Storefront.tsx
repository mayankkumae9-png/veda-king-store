import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { TrustBadges } from './TrustBadges';
import { ProductGrid } from './ProductGrid';
import { ProductDetails } from './ProductDetails';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { Footer } from './Footer';
import { HairGrowthProcess } from './HairGrowthProcess';
import { useAppContext } from '../AppContext';

export const Storefront = () => {
  const { selectedProduct, isCheckoutRoute, setIsCheckoutRoute } = useAppContext();

  if (isCheckoutRoute) {
    return <CheckoutModal onClose={() => setIsCheckoutRoute(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {selectedProduct ? (
          <>
            <ProductDetails />
            <HairGrowthProcess />
            <TrustBadges />
          </>
        ) : (
          <>
            <Hero />
            <ProductGrid />
            <HairGrowthProcess />
            <TrustBadges />
          </>
        )}
      </main>
      <Footer />
      <CartDrawer onCheckout={() => setIsCheckoutRoute(true)} />
    </div>
  );
};
