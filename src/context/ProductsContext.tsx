import {createContext, useContext, useState} from 'react';
import type {Product} from '@brutmaps/api';

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

export const ProductsProvider = ({children}) => {
  const [products, setProducts] = useState<Product[] | undefined>([]);

  return <ProductsContext.Provider value={{products, setProducts}}>{children}</ProductsContext.Provider>;
};
