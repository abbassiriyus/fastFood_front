"use client";
import Link from 'next/link';
import { FaShoppingCart, FaClipboardCheck, FaPhone } from 'react-icons/fa'; // Telefon ikonasini qo'shish
import styles from "../styles/Navbar.module.css";
import { useCart } from './CartContext';
import img from "../image/logo.jpg"
import Image from 'next/image';
const Navbar = () => {
  const { cartCount,fastfood_1 } = useCart();

  return (<>
    <nav className={styles.navbar}>
      <div className={styles.navbar__container}>
        {/* <Image src={img}/> */}
        <Link href="/" className={styles.navbar__logo}>menu<span>go</span></Link>
        
      </div>
    </nav><div className={styles.navbar__items}>
          <Link href="/cart" className={styles.navbar__item}>
            <FaShoppingCart className={styles.navbar__icon} />
            <span className={styles.navbar__notification}>{cartCount}</span>
          </Link>
          <Link href="/orders" className={styles.navbar__item}>
            <FaClipboardCheck className={styles.navbar__icon} />
          </Link>
        </div></>
  );
};

export default Navbar;