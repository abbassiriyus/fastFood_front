"use client"
import React, { useState, useEffect } from 'react';
import styles from '../styles/index.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import url from '@/host/host';
import axios from 'axios';
import { useRouter } from 'next/router';
import FastFoodLoader from '@/components/FastFoodLoader';
import { useCart } from "../components/CartContext"

const FoodCard = () => {
  var router=useRouter()
 var {stol}=router.query
 var [loading,setLoading]=useState(true)
  const [viewCount, setViewCount] = useState(0);
const [foodLogos,setFoodLogos]=useState([])
 useEffect(() => {
   
    const interval = setInterval(() => {
      setViewCount(prevCount => prevCount + 1);
    }, 1000);
axios.get(`${url}/users`).then(res => {
    const data = res.data
        .filter(item => item.type === 2)
        .map(item => ({
            ...item,
            _sortOrder: item.orders + Math.random() * 0.01 // 0.00 - 0.01 oralig‘ida random qo‘shiladi
        }))
        .sort((a, b) => a._sortOrder - b._sortOrder); // faqat _sortOrder bo‘yicha tartiblaydi
setLoading(false)
    setFoodLogos(data);
}).catch(err=>{
  console.log(err);
  
})
    return () => clearInterval(interval);
      }, []);
useEffect(()=>{

if(stol){  
  localStorage.setItem("stol",stol)
}
},[stol])
  return (<>
{loading?(<FastFoodLoader/>):(
    <div style={{maxWidth:'600px',margin:'auto'}}>
      <Navbar />
      <div className={styles.cardContainer}>
        {/* <h2 className={styles.title}>Barcha taomlarimiz</h2> */}
        <div className={styles.logoContainer}>
          {foodLogos.map(logo => (
            <div onClick={()=>{window.location=`/food/?fastfood=${logo.id}`}} style={{ cursor: "pointer" }} key={logo.id} className={styles.logoCard}>
              <img src={logo.image} alt={logo.username} className={styles.logoImage} />
              <div className={styles.overlay}>
                <h3 className={styles.logoName}>{logo.username}</h3>
              </div>
              <div className={styles.logoFooter}>
                <h3 className={styles.footerText}>{logo.username}</h3>
              </div>
            </div>
          ))}
        </div>
              </div>
      {/* <Footer /> */}
    </div>)}</>
  );
};

export default FoodCard;