"use client"
import Link from 'next/link';
import { FaShoppingCart, FaClipboardCheck } from 'react-icons/fa';
import styles from "../styles/Navbar.module.css";
import { useCart } from './CartContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { cartCount, setCart } = useCart();
  const [notificationCount, setNotificationCount] = useState(1);

  // LocalStorage'dan cartni olish
  useEffect(() => {
    const storedCart = localStorage.getItem('shop');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Buyurtma tayyor bo'lganda notification qo'shish
  const handleOrderReady = () => {
    setNotificationCount(prevCount => prevCount + 1);
    alert("Buyurtma tayyor!");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        <Link href="/" className={styles.navbar__logo}>MenuGo</Link>
        <div className={styles.navbar__items}>
          <Link href="/cart" className={styles.navbar__item}>
            <FaShoppingCart className={styles.navbar__icon} />
            <span className={styles.navbar__notification}>{cartCount}</span>
          </Link>
          <Link href="/orders" className={styles.navbar__item}>
            <FaClipboardCheck className={styles.navbar__icon} />
            {notificationCount > 0 && (
              <span className={styles.navbar__notification}>{notificationCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;