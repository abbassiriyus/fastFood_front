"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import url from "@/host/host";

// Swiper importlari
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../styles/GlCarousel.module.css";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/glcarousel`);
        setImages(res.data);
      } catch (err) {
        console.error("Karusel rasmlarini yuklashda xato:", err);
        setError("Rasmlarni yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    fetchCarousel();
  }, []); // → endi fastfood parametri kerak emas

  if (loading) {
    return <div className={styles.loading}>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (images.length === 0) {
    return null; // yoki placeholder qo'yish mumkin
  }

  return (
    <div className={styles.carousel}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={images.length > 1} // faqat 1 ta bo'lsa loop o'chadi
        className={styles.swiper}
      >
        {images.map((item, idx) => (
          <SwiperSlide key={item.id || idx}>
            <img
              src={item.image}
              alt={`Banner ${idx + 1}`}
              className={styles.carousel__image}
              loading="lazy" // performans uchun
              onError={(e) => {
                e.target.src = "/images/fallback-banner.jpg"; // fallback rasm
                e.target.alt = "Rasm yuklanmadi";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;