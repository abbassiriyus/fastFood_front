"use client";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import ProductCard from './components/ProductCard';
import IdList from './components/IdList'; // Yangi komponent
import styles from './page.module.css';
import Footer from './components/Footer';

const products = [
  {
    id: 1,
    name: 'Pizza Margherita',
    description: 'Delicious pizza with fresh tomatoes and mozzarella.',
    price: 10,
    image: 'https://www.freeiconspng.com/uploads/restaurant-food-dish-png-10.png',
    category: 'Pitsa',
  },
  {
    id: 2,
    name: 'Sushi Rolls',
    description: 'Fresh sushi rolls with tuna and avocado.',
    price: 15,
    image: 'https://www.freeiconspng.com/uploads/restaurant-food-dish-png-10.png',
    category: 'Gazaklar',
  },
  {
    id: 3,
    name: 'Burger Deluxe',
    description: 'Juicy beef burger with cheese and lettuce.',
    price: 8,
    image: 'https://www.freeiconspng.com/uploads/restaurant-food-dish-png-10.png',
    category: 'Gazaklar',
  },
  {
    id: 4,
    name: 'Pasta Alfredo',
    description: 'Creamy pasta with Alfredo sauce and chicken.',
    price: 12,
    image: 'https://www.freeiconspng.com/uploads/restaurant-food-dish-png-10.png',
    category: 'Kombo',
  },
];

export default function Home() {
  const { name } = useParams();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("Ko'rinayotgan id:", entry.target.id);
                for (let i = 0; i < document.querySelectorAll('#link_a span').length; i++) {
                  document.querySelectorAll('#link_a span')[i].style="background:#f4f4f4"
                }
                document.querySelector(`#link${entry.target.id}`).style="background:green"

            }
        });
    });

    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => observer.observe(element));

    return () => {
        elements.forEach(element => observer.unobserve(element));
    };
}, []);

  return (
    <div style={{ maxWidth: '600px' }} className={styles.container}>
      <Navbar />
      <Carousel />
      <div id='link_a' className={styles.BottomNavigation_categoriesWrapper}>
        <a className={styles.BottomNavigation_link} >
          <span id={"link"+"title-kombo"} className={styles.BottomNavigation_name}>Kombo</span>
        </a>
        <a className={styles.BottomNavigation_link}>
          <span className={styles.BottomNavigation_name} id={"link"+"title-pitsa"}>Pitsa</span>
        </a>
        <a className={styles.BottomNavigation_link}>
          <span className={styles.BottomNavigation_name} id={"link"+"title-gazaklar"}>Gazaklar</span>
        </a>
        <a className={styles.BottomNavigation_link} id="/category/ichimliklar">
          <span className={styles.BottomNavigation_name}>Ichimliklar</span>
        </a>
        <a className={styles.BottomNavigation_link} id="/category/salatlar">
          <span className={styles.BottomNavigation_name}>Salatlar</span>
        </a>
        <a className={styles.BottomNavigation_link} id="/category/desertlar">
          <span className={styles.BottomNavigation_name}>Desertlar</span>
        </a>
        <a className={styles.BottomNavigation_link} id="/category/souslar">
          <span className={styles.BottomNavigation_name}>Souslar</span>
        </a>
      </div>

      <h2 id="title-kombo" className={`${styles.ProductTitle}`}>Kombo</h2>
      <div style={{ width: '100%' }} className={styles.productList}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h2 id="title-pitsa" className={`${styles.ProductTitle}`}>Pitsa</h2>
      <div style={{ width: '100%' }} className={styles.productList}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <h2 id="title-gazaklar" className={`${styles.ProductTitle}`}>Gazaklar</h2>
      <div style={{ width: '100%' }} className={styles.productList}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
     
      <Footer />
    </div>
  );
}