import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa'; // Ikonka import qilish
import './Navbar.css';

const Navbar = ( ) => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link href="/" className="navbar__logo">MenuGo</Link>
        <div className="navbar__items">
          <Link href="/cart" className="navbar__item">
            <FaShoppingCart className="navbar__icon" />
              <span className="navbar__item-count">0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;