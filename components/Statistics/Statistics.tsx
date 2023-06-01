import React, { FC, useEffect, useRef, useState } from "react";
import s from "./Statistics.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const Statistics: FC = () => {
  const ref = useRef<HTMLTableSectionElement>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const { innerHeight, pageYOffset } = window;
      if (
        ref.current &&
        ref.current.offsetTop <= innerHeight + pageYOffset - 50
      ) {
        setInView(true);
      } else {
        setInView(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  const animateNumbers = () => {
    const numElements = document.querySelectorAll(`.${s.__num}`);
    numElements.forEach((numElement: any) => {
      const targetValue = parseInt(numElement.dataset.target || "0", 10);
      const duration = 2000;
      const startTime = Date.now();

      const animateValue = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(targetValue * progress);

        numElement.textContent = String(value);

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };

      requestAnimationFrame(animateValue);
    });
  };

  useEffect(() => {
    if (inView) {
      animateNumbers();
    }
  }, [inView]);

  return (
    <section className={s.statistics} ref={ref}>
      {inView && (
        <Swiper
          speed={1200}
          autoplay={{
            delay: 4500,
          }}
          pagination={{
            clickable: true,
          }}
          keyboard={{
            enabled: true,
          }}
          loop={true}
          grabCursor={true}
          modules={[Pagination]}
          breakpoints={{
            425: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1440: {
              slidesPerView: 4,
            },
          }}
          className={s.statisticsSlider}
        >
          <SwiperSlide>
            <div className={s.statistics__item}>
              <span className={s.__num} data-target="100"></span>
              <p>Практических курсов</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item}>
              <span className={s.__num} data-target="150"></span>
              <p>Пользователей</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item}>
              <span className={s.__num} data-target="120"></span>
              <p>Зарегистрированных сегодня</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item} id="categories">
              <span className={s.__num} data-target="110"></span>
              <p>Отзывов</p>
            </div>
          </SwiperSlide>
        </Swiper>
      )}
    </section>
  );
};

export default Statistics;
