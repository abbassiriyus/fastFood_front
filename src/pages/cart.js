'use client'
import { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import styles from '../styles/cart.module.css';
import Footer from '../components/Footer';
import Navbar from '@/components/Navbar';
import { useCart } from '../components/CartContext';

const Cart = () => {
  const { cart, setCart } = useCart();
  const [cartItems, setCartItems] = useState([]);

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCart(updatedCart);
    setCartItems(updatedCart);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleOrder = () => {
    // Buyurtma berish jarayonini boshlash
    if (cartItems.length === 0) {
      alert("Savatchangiz bo'sh!");
      return;
    }
    // Bu yerda buyurtma berish lojiqasi qo'shilishi mumkin
    alert("Buyurtma berildi!");
  };

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Navbar />
      <div className={styles.cart}>
        <h2 className={styles.cart__title}>Your Cart</h2>
        <div className={styles.cart__items}>
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>
        <div className={styles.cart__total}>
          <h3>Total: ${getTotalPrice()}</h3>
        </div>
        <button onClick={handleOrder} className={styles.cart__orderButton}>
          Buyurtma berish
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;