import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    console.log('epty ', storedCart);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? {...item, quantity: item.quantity + 1} : item,
        );
      } else {
        return [...prevCart, {...product, quantity: 1}];
      }
    });

    setTimeout(() => {
      navigate('/order');
    }, 0);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return {cart, addToCart, removeFromCart, clearCart};
};

export default useCart;
