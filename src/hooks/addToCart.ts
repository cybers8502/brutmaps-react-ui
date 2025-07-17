const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch(`${window.location.origin}/wp-admin/admin-ajax.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'add_to_cart_book', // Название действия в WordPress
        id: productId, // ID товара
        count: quantity, // Количество
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Error adding to cart:', data.error);
    } else {
      console.log('Product added to cart successfully:', data);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export default addToCart;
