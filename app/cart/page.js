'use client'
import { useState } from 'react';
import CartItem from '../components/CartItem';
import './cart.css';

const Cart = () => {
  const initialCartItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Delicious pizza with fresh tomatoes and mozzarella.',
      price: 10,
      quantity: 1,
      image: '/images/pizza1.jpg',
    },
    {
      id: 2,
      name: 'Sushi Rolls',
      description: 'Fresh sushi rolls with tuna and avocado.',
      price: 15,
      quantity: 2,
      image: '/images/sushi1.jpg',
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart">
      <h2 className="cart__title">Your Cart</h2>
      <div className="cart__items">
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </div>
      <div className="cart__total">
        <h3>Total: ${getTotalPrice()}</h3>
      </div>
    </div>
  );
};

export default Cart;
