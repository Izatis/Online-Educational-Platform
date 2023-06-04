import React, { FC, useEffect, useRef, useState } from "react";
import s from "./Statistics.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import {
  useGettingStatisticsCourseCountQuery,
  useGettingStatisticsUserCountQuery,
  useGettingStatisticsUserTodayCountQuery,
  useGettingStatisticsReviewCountQuery,
} from "@/redux/reducers/statistics";
import { useAppSelector } from "@/hooks/redux";

const Statistics: FC = () => {
  const [token, setToken] = useState("");
  
  useEffect(() => {
    const parsedToken = JSON.parse(localStorage.getItem("token") as string);
    setToken(parsedToken);
  }, []);
  
  const { data: courseCount } = useGettingStatisticsCourseCountQuery({token});
  const { data: userCount } = useGettingStatisticsUserCountQuery({token});
  const { data: userTodayCount } =
    useGettingStatisticsUserTodayCountQuery({token});
  const { data: reviewCount } = useGettingStatisticsReviewCountQuery({token});

  const ref = useRef<HTMLTableSectionElement>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const { innerHeight, pageYOffset } = window;
      if (
        ref.current &&
        ref.current.offsetTop <= innerHeight + pageYOffset - -40
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
      const duration = 1000;
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
              <span className={s.__num} data-target={courseCount}></span>
              <p>Практических курсов</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item}>
              <span className={s.__num} data-target={userCount}></span>
              <p>Пользователей</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item}>
              <span className={s.__num} data-target={userTodayCount}></span>
              <p>Зарегистрированных сегодня</p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={s.statistics__item} id="categories">
              <span className={s.__num} data-target={reviewCount}></span>
              <p>Отзывов</p>
            </div>
          </SwiperSlide>
        </Swiper>
      )}
    </section>
  );
};

export default Statistics;
