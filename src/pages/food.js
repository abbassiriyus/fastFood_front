"use client";
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import styles from '../styles/food.module.css';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useCart } from '../components/CartContext';

import url from '@/host/host';


export default function Home() {
var router=useRouter()
var [category,setCategory]=useState([{product:[]}])
var {fastfood}=router.query
const { setCart } = useCart();

function getData() {
  axios.get(`${url}/categories`).then(res => {
    var my_category = res.data
      .filter(item => item.fastfood_id == fastfood)
      .sort((a, b) => a.orders - b.orders); // Category-larni sort qilindi

    axios.get(`${url}/products`).then(res1 => {
      for (let i = 0; i < my_category.length; i++) {
        my_category[i].product = [];

        for (let j = 0; j < res1.data.length; j++) {
          if (my_category[i].id == res1.data[j].category_id) {
            my_category[i].product.push(res1.data[j]);
          }
        }

        // Har bir category ichidagi product-larni orders bo'yicha sort qilamiz
        my_category[i].product.sort((a, b) => a.orders - b.orders);
      }

      setCategory(my_category);
    }).catch(err => {
      console.log(err);
    });

  }).catch(err => {
    console.log(err);
  });
}



  useEffect(() => {
    getData()
if(localStorage.getItem('shop')){
setCart(JSON.parse(localStorage.getItem('shop')))
}
    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
           if ( !((entry.target.id).includes("span")) && (entry.target.id).includes("title") && document.querySelector(`#link${entry.target.id}`)) {
             for (let i = 0; i < document.querySelectorAll('#link_a span').length; i++) {
              document.querySelectorAll('#link_a span')[i].style="background:#f4f4f4;color:black"
              
             }
             document.querySelector(`#link${entry.target.id}`).style="background:rgb(210 165 62);color:white"

           }
       
            }
        });
    }); 
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => observer.observe(element));
     return () => {
        elements.forEach(element => observer.unobserve(element));
    };
    }, 1000);
  
  
    
  
},[fastfood]);

  return (
    <div style={{ maxWidth: '600px' }} className={styles.container}>
      <Navbar />
      <Carousel />
      <div id='link_a' className={styles.BottomNavigation_categoriesWrapper}>
      {category.map((item,key)=>{
      if(item.product.length>0){
         return   <a key={key} className={styles.BottomNavigation_link} href={`#span_title-${item.id}`}>
          <span className={styles.BottomNavigation_name} id={"link"+`title-${item.id}`}>{item.name}</span>
        </a>
 
      }
    
      })}
      </div>

      {category.map((item,key)=>{
      if(item.product.length>0){
  return <><span key={key}  style={{position:'relative',top:'-170px'}}  id={`span_title-${item.id}`}></span>
      <h2 id={`title-${item.id}`}  className={`${styles.ProductTitle}`}>{item.name}</h2>
      <div style={{ width: '100%' }} className={styles.productList}>
        {item.product.map(product1 => (
          <ProductCard key={product1.id} product={product1} />
        ))}
      </div> </> 
      } 
      })}






     
      {/* <Footer /> */}
    </div>
  );
}