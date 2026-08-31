// Structural shape PostContent/BlogGallery actually render — satisfied by
// both the still-REST sight gallery (ImageItem, snake_case fields) and the
// GraphQL blog gallery (BrutImage, camelCase fields), so neither has to be
// converted into the other.
export interface GalleryImage {
  id: number | string;
  url: string;
  alt: string;
  title: string;
  author?: {
    figcaption: string;
    link: string;
  };
}
