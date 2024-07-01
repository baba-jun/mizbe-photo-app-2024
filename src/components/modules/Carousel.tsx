// Carousel.tsx
import React from 'react';
import Slider from 'react-slick';

interface CarouselProps {
  tateImages: string[];
  yokoImages: string[];
  squareImages: string[];
  rate: number;
  onImageSelect: (image: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({ tateImages: tateImg, yokoImages: yokoImg, squareImages: squareImg, rate: aspectRate, onImageSelect }) => {
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

  let setImages: string[];

  switch(aspectRate){
    case 1.5:
      setImages = tateImg;
      break;

    case 1.0:
      setImages = squareImg;
      break;

    case 0.67:
      setImages = yokoImg;
      break
    default:
      setImages = tateImg;
  }

  return (
    <div style={{width: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {setImages.map((image, index) => (
          <div key={index} onClick={() => onImageSelect(image)}>
            <img src={image} alt={`carousel-${index}`} style={{margin: '0 auto', width: '75%', border: '2px solid white' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};



export default Carousel;
