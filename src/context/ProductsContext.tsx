import type {Product} from '@brutmaps/api';
import {createContext, type PropsWithChildren, useContext, useState} from 'react';

const ProductsContext = createContext<{
  products: Product[] | undefined;
  setProducts: (products: Product[]) => void;
} | null>(null);

export const useProductsContext = () => {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }

  return context;
};

export const ProductsProvider = ({children}: PropsWithChildren) => {
  const [products, setProducts] = useState<Product[] | undefined>([]);

  return <ProductsContext.Provider value={{products, setProducts}}>{children}</ProductsContext.Provider>;
};
