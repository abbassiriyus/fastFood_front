"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import url from "@/host/host";

// Swiper importlari
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "../styles/Carousel.module.css";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { fastfood } = router.query;

  // Ma'lumotlarni yuklash
  useEffect(() => {
    if (fastfood) {
      axios.get(`${url}/carousel`).then((res) => {
        const filtered = res.data.filter(
          (item) => item.fastfood_id == fastfood
        );
        setImages(filtered);
      });
    }
  }, [fastfood]);

  if (images.length < 1) return null;

  return (
    <div className={styles.carousel}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        className={styles.swiper}
      >
        {images.map((item, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={item.image}
              alt={`Reklama ${idx + 1}`}
              className={styles.carousel__image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
