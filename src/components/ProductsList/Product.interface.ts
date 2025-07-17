export default interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  categories: Category[];
  image: Image;
  images: Image[];
  stripe: string;
  // downloads: Download[];
  // on_sale: boolean;
  // purchasable: boolean;
  // virtual: boolean;
  // downloadable: boolean;
}

interface Download {
  id: string;
  name: string;
  file: string;
}

interface Category {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  src: string;
  name: string;
}
