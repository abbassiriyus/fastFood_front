"use client"
import React, { useState, useEffect } from 'react';
import styles from '../styles/index.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const foodLogos = [
  {
    id: 1,
    name: 'Burger King',
    img: 'https://officieldelafranchise.fr/wp-content/uploads/2024/12/Shutterstock_1108805654.jpg',
    description: 'Burger King - Fast food zanjiri, asosan burgerlar va fransuz kartoshkalari bilan tanilgan.',
  },
  {
    id: 2,
    name: 'McDonald\'s',
    img: 'https://images.rtl.fr/~c/770v513/rtl/www/1285682-l-enseigne-des-fast-foods-mcdonald-s.jpg',
    description: 'McDonald\'s - O\'zining qizil va sariq ranglari bilan mashhur bo\'lgan fast food brendi.',
  },
  {
    id: 3,
    name: 'KFC',
    img: 'https://static.kfc.fr/images/items/lg/Tenders_5.jpg?v=LnQv63',
    description: 'KFC - Qovurilgan tovuq va boshqa taomlar bilan tanilgan fast food zanjiri.',
  },
  {
    id: 4,
    name: 'Pizza Hut',
    img: 'https://tb-static.uber.com/prod/image-proc/processed_images/400e7cd49f483bdc18638d27bc45e233/c9252e6c6cd289c588c3381bc77b1dfc.jpeg',
    description: 'Pizza Hut - Pitsa va boshqa italyan taomlarini taklif etuvchi mashhur brend.',
  }
];

const FoodCard = () => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prevCount => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{maxWidth:'600px',margin:'auto'}}>
      <Navbar />
      <div className={styles.cardContainer}>
        <h2 className={styles.title}>Barcha taomlarimiz</h2>
        <div className={styles.logoContainer}>
          {foodLogos.map(logo => (
            <div onClick={()=>{window.location="/food"}} style={{ cursor: "pointer" }} key={logo.id} className={styles.logoCard}>
              <img src={logo.img} alt={logo.name} className={styles.logoImage} />
              <div className={styles.overlay}>
                <h3 className={styles.logoName}>{logo.name}</h3>
                <p className={styles.viewCount}>Ko'rish: {viewCount}</p>
                <p className={styles.description}>{logo.description}</p>
              </div>
              <div className={styles.logoFooter}>
                <h3 className={styles.footerText}>{logo.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FoodCard;