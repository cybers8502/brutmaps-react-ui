const apiRoutes = {
  blogPost: '/wp-json/v1/blog/posts',
  objectsPost: '/wp-json/v1/map/sights',
  architectsList: '/wp-json/v1/architects',
  architectByID: '/wp-json/v1/architects',
  popularArchitects: '/wp-json/v1/architects/popular',
  architectsSearch: '/wp-json/v1/architects/search',
  architectsStyles: '/wp-json/v1/taxonomies',
  shopProductsList: '/wp-json/v1/shop/products',
  instagramGalleryList: '/wp-json/v1/sights-images',
  userAvailableCountries: '/wp-json/v1/profile/user-countries',
  resetPassword: '/wp-json/v1/auth/reset-password',
  lostPassword: '/wp-json/v1/auth/lost-password',
  changePassword: '/wp-json/v1/auth/change-password',
  userProfile: '/wp-json/v1/profile/user-profile',
  editProfile: '/wp-json/v1/profile/edit-profile',
  userFavorites: '/wp-json/v1/user/favorites',
  userToggleFavorites: '/wp-json/v1/user/favorites/toggle',
};

export default apiRoutes;
