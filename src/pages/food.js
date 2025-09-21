"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import styles from "../styles/food.module.css";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import axios from "axios";
import { useCart } from "../components/CartContext";
import url from "@/host/host";
import FastFoodLoader from "@/components/FastFoodLoader"; // ✅ loading component

export default function Home() {
  const router = useRouter();

  const [category, setCategory] = useState([]);
  const { fastfood,stol } = router.query;
  const { setCart } = useCart();
  const [loading, setLoading] = useState(true); // ✅ loading state

  const getData = async () => {
    try {
      const categoryRes = await axios.get(`${url}/categories`);
      const productRes = await axios.get(`${url}/products`);

      let my_category = categoryRes.data
        .filter((item) => item.fastfood_id == fastfood)
        .sort((a, b) => a.orders - b.orders);

      for (let i = 0; i < my_category.length; i++) {
        my_category[i].product = productRes.data
          .filter((p) => p.category_id == my_category[i].id)
          .sort((a, b) => a.orders - b.orders);
      }

      setCategory(my_category);
    } catch (err) {
      console.error("Data loading error:", err);
    } finally {
      setLoading(false); // ✅ loading tugadi
    }
  };

useEffect(()=>{

if(stol){  
  localStorage.setItem("stol",stol)
}
},[stol])

  useEffect(() => {
    if (!router.isReady || !fastfood) return;

    getData();

    if (localStorage.getItem("shop")) {
      setCart(JSON.parse(localStorage.getItem("shop")));
    }

    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              !entry.target.id.includes("span") &&
              entry.target.id.includes("title") &&
              document.querySelector(`#link${entry.target.id}`)
            ) {
              document
                .querySelectorAll("#link_a span")
                .forEach((el) => (el.style = "background:#f4f4f4;color:black"));

              document.querySelector(
                `#link${entry.target.id}`
              ).style = "background:rgb(210 165 62);color:white";
            }
          }
        });
      });

      const elements = document.querySelectorAll("[id]");
      elements.forEach((element) => observer.observe(element));

      return () => {
        elements.forEach((element) => observer.unobserve(element));
      };
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router.isReady, fastfood]);

  // ✅ Loading ko‘rsatiladigan holat
  if (!router.isReady || loading || !fastfood || category.length === 0) {
    return (
      <div style={{ maxWidth: "600px" }} className={styles.container}>
        <Navbar />
        <FastFoodLoader />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px" }} className={styles.container}>
      <Navbar />
      <Carousel />

      <div id="link_a" className={styles.BottomNavigation_categoriesWrapper}>
        {category.map((item, key) =>
          item.product.length > 0 ? (
            <a
              key={key}
              className={styles.BottomNavigation_link}
              href={`#span_title-${item.id}`}
            >
              <span
                className={styles.BottomNavigation_name}
                id={`linktitle-${item.id}`}
              >
                {item.name}
              </span>
            </a>
          ) : null
        )}
      </div>

      {category.map((item, key) =>
        item.product.length > 0 ? (
          <div key={key}>
            <span
              style={{ position: "relative", top: "-170px" }}
              id={`span_title-${item.id}`}
            ></span>
            <h2 id={`title-${item.id}`} className={styles.ProductTitle}>
              {item.name}
            </h2>
            <div className={styles.productList}>
              {item.product.map((product1) => (
                <ProductCard key={product1.id} product={product1} />
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* <Footer /> */}
    </div>
  );
}
