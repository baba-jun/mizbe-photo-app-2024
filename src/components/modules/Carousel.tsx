// Carousel.tsx
import React from 'react';
import Slider from 'react-slick';

interface CarouselProps {
  images: string[];
  onImageSelect: (image: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({ images, onImageSelect }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{ margin: '0 auto', width: '80%' }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} onClick={() => onImageSelect(image)}>
            <img src={image} alt={`carousel-${index}`} style={{ width: '100%' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
