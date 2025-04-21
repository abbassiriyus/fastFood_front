"use client";
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import styles from '../styles/food.module.css';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from '@/host/host';
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
var router=useRouter()
var [category,setCategory]=useState([{product:[]}])
var {fastfood}=router.query

function getData() {
  axios.get(`${url}/categories`).then(res=>{
    
    var my_category=res.data.filter(item=>item.fastfood_id==fastfood)
    
axios.get(`${url}/products`).then(res1=>{
for (let i = 0; i < my_category.length; i++) {
  my_category[i].product=[]
for (let j = 0; j < res1.data.length; j++) {
if(my_category[i].id==res1.data[j].category_id){
  my_category[i].product.push(res1.data[j])
}
}
}
setCategory(my_category)
}).catch(err=>{
  console.log(err);  
})
  }).catch(err=>{
    console.log(err);

  })
}


  useEffect(() => {
    getData()

    
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
},[fastfood]);

  return (
    <div style={{ maxWidth: '600px' }} className={styles.container}>
      <Navbar />
      <Carousel />
      <div id='link_a' className={styles.BottomNavigation_categoriesWrapper}>
      {category.map((item,key)=>{
      if(item.product.length>0){
         return   <a className={styles.BottomNavigation_link} href={`#span_title-${item.id}`}>
          <span className={styles.BottomNavigation_name} id={"link"+`title-${item.id}`}>{item.name}</span>
        </a>
 
      }
    
      })}
      </div>

      {category.map((item,key)=>{
      if(item.product.length>0){
  return <><span key={key}  style={{position:'relative',top:'-150px'}}  id={`span_title-${item.id}`}></span>
      <h2 id={`title-${item.id}`}  className={`${styles.ProductTitle}`}>{item.name}</h2>
      <div style={{ width: '100%' }} className={styles.productList}>
        {item.product.map(product1 => (
          <ProductCard key={product1.id} product={product1} />
        ))}
      </div> </> 
      } 
      })}






     
      <Footer />
    </div>
  );
}