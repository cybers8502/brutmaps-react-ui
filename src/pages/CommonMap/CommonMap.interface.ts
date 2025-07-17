export interface PopupInterface {
  coordinates: [number, number];
  properties: {
    id: number;
    slug: string;
    title: string;
    address: string;
    year: number;
    images: string[];
  };
}

export interface ViewportInterface {
  latitude: number;
  longitude: number;
  zoom: number;
}
