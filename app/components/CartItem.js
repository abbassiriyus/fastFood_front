"use client"
import { useState } from 'react';
import './CartItem.css';

const CartItem = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    item.quantity += 1;
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      item.quantity -= 1;
    }
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__image" />
      <div className="cart-item__details">
        <h4 className="cart-item__title">{item.name}</h4>
        <p className="cart-item__price">${item.price}</p>
        <div className="cart-item__quantity">
          <button onClick={handleDecrement} className="cart-item__button">-</button>
          <span className="cart-item__count">{quantity}</span>
          <button onClick={handleIncrement} className="cart-item__button">+</button>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className="cart-item__remove">
        Remove
      </button>
    </div>
  );
};

export default CartItem;
