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
  const [procent, setProcent] = useState(10); // default 10%
  const [loadingProcent, setLoadingProcent] = useState(true);

  // Protsentni yuklash
  useEffect(() => {
    const fetchProcent = async () => {
      try {
        const res = await axios.get(`${url}/protsent`);
        if (res.data && res.data.length > 0 && res.data[0].foiz !== undefined) {
          setProcent(Number(res.data[0].foiz));
        }
        // Agar ma'lumot bo'lmasa → default 10% qoladi
      } catch (err) {
        console.error("Protsentni yuklashda xato:", err);
        // xato bo'lsa ham default 10% ishlatiladi
      } finally {
        setLoadingProcent(false);
      }
    };

    fetchProcent();
  }, []);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

 const handleRemoveItem = async (id) => {
  try {
    // 1. O'chirilayotgan mahsulotni topamiz (stul raqami uchun)
    const itemToDelete = cartItems.find(item => item.id === id);
    
    if (!itemToDelete) {
      console.warn("O'chiriladigan mahsulot topilmadi");
      return;
    }

    // 2. Backendga ma'lumot yuboramiz
    const deleteData = {
      food_id: id,                    // o'chirilgan mahsulotning ID si
      stul: localStorage.getItem("stol") || null  // stol raqami localStorage dan
    };

    // Agar stol raqami bo'lmasa, ogohlantirish (ixtiyoriy)
    if (!deleteData.stul) {
      console.warn("Stol raqami topilmadi, history_delete ga stol bo'sh yoziladi");
    }

    await axios.post(`${url}/karzinkadelete`, deleteData);

    // 3. Muvaffaqiyatli bo'lsa, frontenddan o'chiramiz
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCart(updatedCart);
    setCartItems(updatedCart);

  } catch (error) {
    console.error("Mahsulotni o'chirish tarixiga yozishda xato:", error);
    
    // Fallback: agar API ishlamasa ham frontenddan o'chirishni davom ettirish
    // (lekin real loyihada bu qarorni qayta ko'rib chiqish kerak)
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCart(updatedCart);
    setCartItems(updatedCart);

    // Foydalanuvchiga xabar berish (ixtiyoriy)
    alert("Mahsulot savatdan o'chirildi, lekin o'chirish tarixi saqlanmadi");
  }
};

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const serviceFee = Math.round(subtotal * (procent / 100));
  const totalWithService = subtotal + serviceFee;

  const formatPrice = (num) => num.toLocaleString('uz-UZ');

  const sendTelegramNotification = async (text) => {
    const botToken = "7651476196:AAHMF3_pjcNiwDzJJvHGjRJM6nz7Gh40yDk";
    const chatId = "-4634503890";

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      });
    } catch (err) {
      console.error("Telegramga yuborishda xatolik:", err);
    }
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert("Savatchangiz bo'sh!");
      return;
    }

    axios.get(`${url}/categories`).then(res => {
      // fastfood_id ni qo'shish
      const updatedItems = cartItems.map(item => {
        const category = res.data.find(cat => cat.id === item.category_id);
        return {
          ...item,
          fastfood_id: category ? category.fastfood_id : null
        };
      });

      const data = new FormData();
      data.append("status", 0);
      data.append("user_id", 0);
      data.append('number_stol', localStorage.getItem("stol"));

      axios.post(`${url}/zakaz`, data).then(res => {
        const zakazId = res.data.id;

        const formData = new FormData();
        updatedItems.forEach(item => {
          formData.append('products[]', JSON.stringify({
            zakaz_id: zakazId,
            product_id: item.id,
            count: item.quantity,
            price: item.price,
            fastfood_id: item.fastfood_id
          }));
        });

        axios.post(`${url}/zakaz_products`, formData).then(() => {
          let myshop = localStorage.getItem("myshop") 
            ? JSON.parse(localStorage.getItem("myshop")) 
            : [];
          
          myshop.push(zakazId);
          localStorage.setItem("myshop", JSON.stringify(myshop));

          setCart([]);

          sendTelegramNotification(
            `🛎 <b>Yangi buyurtma!</b>\n` +
            `📦 Mahsulotlar soni: ${cartItems.length}\n` +
            `🪑 Stol raqami: ${localStorage.getItem("stol")}\n` +
            `💰 Jami summa: ${formatPrice(totalWithService)} so'm\n` +
            `   (shu jumladan ${procent}% affitsant haqi: ${formatPrice(serviceFee)} so'm)`
          );

          alert("Buyurtmani yubordik!");
          window.location.href = '/orders';
        });
      });
    }).catch(err => {
      console.error("Buyurtma yuborishda xato:", err);
      alert("Buyurtmani yuborishda xatolik yuz berdi");
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Navbar />
      <div className={styles.cart}>
        <h2 className={styles.cart__title}>Savatcha</h2>

        <div className={styles.cart__items}>
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>

        <div className={styles.cart__summary}>
          <div className={styles.summaryRow}>
            <span>Jami to'lov:</span>
            <span>{formatPrice(subtotal)} so'm</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Affitsant haqi ({procent}%):</span>
            <span>{formatPrice(serviceFee)} so'm</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Umumiy summa:</span>
            <strong>{formatPrice(totalWithService)} so'm</strong>
          </div>
        </div>

        <button 
          onClick={handleOrder} 
          className={styles.cart__orderButton}
          disabled={cartItems.length === 0}
        >
          Buyurtma berish • {formatPrice(totalWithService)} so'm
        </button>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Cart;