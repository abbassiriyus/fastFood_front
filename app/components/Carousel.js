"use client";
import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
  "https://img.pikbest.com/backgrounds/20210824/delicious-fast-food-social-media-banner-design_6081896.jpg!w700wp",
  "https://avatars.mds.yandex.net/i?id=15c221c35d2f98ac0abac4d8f27daa71-5235619-images-thumbs&n=13",
  "https://avatars.mds.yandex.net/i?id=15c221c35d2f98ac0abac4d8f27daa71-5235619-images-thumbs&n=13",
  "https://avatars.mds.yandex.net/i?id=15c221c35d2f98ac0abac4d8f27daa71-5235619-images-thumbs&n=13",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000); // har 2 sekundda slayd almashadi
    return () => clearInterval(interval); // komponent o‘chirilsa, interval ham to‘xtaydi
  }, [currentIndex]); // har o‘zgarishda yangilanadi

  return (
    <div className="carousel">
      <button className="carousel__button prev" onClick={prevSlide}>
        ‹
      </button>
      <div className="carousel__item">
        <img
          src={images[currentIndex]}
          alt={`Ad ${currentIndex + 1}`}
          className="carousel__image"
        />
      </div>
      <button className="carousel__button next" onClick={nextSlide}>
        ›
      </button>
    </div>
  );
};

export default Carousel;
