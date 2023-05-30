import React, { useEffect, useState } from "react";
import s from "./coursesList.module.scss";

import axios from "axios";
import { useRouter } from "next/router";
import { courses, ICourses } from "../../constants/courses";
import { categories } from "@/constants/categories";

import MyButton from "@/components/MUI/Buttons/MyButton/MyButton";
import MySelect from "@/components/MUI/MySelect/MySelect";
import CourseItem from "@/components/CourseItem/CourseItem";

export default function () {
  // Состояние - для карточек
  const [coursesData, setCoursesData] = useState<ICourses[]>(courses);

  // Состояние - для объекта из массива categories
  const [category, setCategory] = useState<any>({});

  const { query }: { query: any } = useRouter();

  // Получает объект из массива categories
  useEffect(() => {
    if (!!query.id) {
      const category = categories.find(
        ({ id }: { id: number }) => id === +query.id
      );
      setCategory(category);
    }
  }, []);

  useEffect(() => {
    // Отправляем get запрос для карточек
    const getCourses = async () => {
      // Достаем токен пользователя
      const token = localStorage.getItem("token") ?? "";
      const parsedToken = token !== "" ? (JSON.parse(token) as string) : "";

      const BASE_URL =
        "https://spring-boot-online-platform.herokuapp.com/course";
      try {
        const { data } = await axios.get(BASE_URL, {
          headers: { Authorization: `Bearer ${parsedToken}` },
        });

        setCoursesData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCourses();
  }, []);
  return (
    <section className={s.courses}>
      <h2 className={s.pageTitle}>Все курсы по теме "{category.name}"</h2>

      <header className={s.courses__header}>
        <div className={s.filtered}>
          <MyButton className={s.filtered__button}>Фильтировать</MyButton>

          <MySelect
            className={s.filtered__select}
            defaultValue="Filtered"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
          />
        </div>

        <span className={s.result}>{coursesData.length} результата</span>
      </header>

      <ul className={s.courses__list}>
        {coursesData.map((course) => (
          <CourseItem course={course} key={course.id} />
        ))}
      </ul>
    </section>
  );
}
