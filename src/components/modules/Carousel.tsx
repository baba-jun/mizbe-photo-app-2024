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
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{width: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} onClick={() => onImageSelect(image)}>
            <img src={image} alt={`carousel-${index}`} style={{margin: '0 auto', width: '75%', border: '2px solid white' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};



export default Carousel;
