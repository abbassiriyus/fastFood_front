'use client'
import { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import styles from '../styles/cart.module.css';
import Footer from '../components/Footer';
import Navbar from '@/components/Navbar';
import { useCart } from '../components/CartContext';
import axios from 'axios';
import url from '@/host/host';


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
    axios.get(`${url}/categories`).then(res => {
      
      for (let i = 0; i < cartItems.length; i++) {
        for (let j = 0; j < res.data.length; j++) {
          if (cartItems[i].category_id == res.data[j].id) {
            cartItems[i].fastfood_id = res.data[j].fastfood_id
          }
        }
      }

      var data = new FormData()
      var formData = new FormData()
      data.append("status", 0)
      data.append("user_id", 0)
      data.append('number_stol',localStorage.getItem("stol"))


      axios.post(`${url}/zakaz`, data).then(res => {
        console.log(res.data);
        cartItems.forEach((item) => {
            item.zakaz_id = res.data.id;
            item.product_id = item.id;
            item.count = item.quantity;
            formData.append('products[]', JSON.stringify(item));
        });
    
        // Agar faqat bitta mahsulot bo'lsa, formData ga qo'shiladi
        if (cartItems.length === 1) {
            const singleItem = cartItems[0];
            singleItem.zakaz_id = res.data.id;
            singleItem.product_id = singleItem.id;
            singleItem.count = singleItem.quantity;
            formData.append('products[]', JSON.stringify(singleItem));
        }
    
        axios.post(`${url}/zakaz_products`, formData).then(res1 => {
            var myshop = [];
            if (localStorage.getItem("myshop")) {
                myshop = JSON.parse(localStorage.getItem("myshop"));
            }
            myshop.push(res.data.id);
            localStorage.setItem("myshop", JSON.stringify(myshop));
            setCart([]);
            alert("Buyurtmani yubordik");
            window.location = '/orders';
        }).catch(err => {
            console.error(err);
        });
    });

    }).catch(err => {

    })




    // Bu yerda buyurtma berish lojiqasi qo'shilishi mumkin
    // alert("Buyurtma berildi!");
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
          <h3>Total: {getTotalPrice() } so'm</h3>
        </div>
        <button onClick={handleOrder} className={styles.cart__orderButton}>
          Buyurtma berish
        </button>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Cart;