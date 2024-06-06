import Slider from "react-slick"
import { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useHttp } from "../../hooks/useHttps";
import { newsApiResponse } from "../../config/Api";

import './carousel.scss';

interface INewsData {
  guid: string,
  title: string,
  body: string,
}

const Carousel = () => {
  const { fetchData, data, loading, error } = useHttp<{ Data: INewsData[] }>(newsApiResponse);
  const [newsData, setNewsData] = useState<INewsData[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) {
      const transformData = data.Data.map((news) => {
        const obj = {
          guid: news.guid,
          title: news.title,
          body: news.body
        }
        return obj
      })
      setNewsData(transformData)
    }
  }, [data])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
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
          initialSlide: 2,
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
    !loading && !error &&

    <div className='slider-container'>
      <Slider {...settings}>
        {newsData.slice(0, 8).map((slide, index) => (
          <div key={index}>
            <a href={slide.guid} target="_blank" rel="noopener noreferrer">
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.body.length > 200 ? `${slide.body.slice(0, 200)}...` : slide.body}</p>
              </div>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
