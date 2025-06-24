"use client";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaShoppingCart, FaClipboardCheck, FaArrowLeft } from 'react-icons/fa';
import styles from "../styles/Navbar.module.css";
import { useCart } from './CartContext';

const Navbar = () => {
  const router = useRouter();
  const { cartCount } = useCart();

  const isNotHome = router.pathname !== "/";

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbar__container}>
          <Link href="/" className={styles.navbar__logo}>
            menu<span>go</span>
          </Link>
        </div>
      </nav>

      <div className={styles.navbar__items}>
        <Link href="/cart" className={styles.navbar__item}>
          <FaShoppingCart className={styles.navbar__icon} />
          <span className={styles.navbar__notification}>{cartCount}</span>
        </Link>
        <Link href="/orders" className={styles.navbar__item}>
          <FaClipboardCheck className={styles.navbar__icon} />
        </Link>
      </div>

      {/* Ekranning pastki o'ng burchagida ortga qaytish tugmasi */}
      {isNotHome && (
        <button className={styles.backFloatingButton} onClick={() => router.back()}>
          <FaArrowLeft />
        </button>
      )}
    </>
  );
};

export default Navbar;
