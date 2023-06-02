import React, { useEffect } from "react";
import s from "./userCourses.module.scss";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAllUserCourses } from "@/redux/reducers/user.slice";

import MyButton from "@/components/UI/Buttons/MyButton/MyButton";
import CourseItem from "@/components/CourseItem/CourseItem";
import Loading from "@/components/Loading/Loading";

const UserCourse = () => {
  const dispatch = useAppDispatch();
  const { user, userCourses } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    // Достаем токен пользователя
    const parsedToken = JSON.parse(localStorage.getItem("token") as string);
    const userId = user.id;

    dispatch(getAllUserCourses({ userId, parsedToken }));
  }, []);

  return (
    <section className={s.userCourses}>
      <div className={s.addingCourse}>
        <p>У вас нету курсов</p>
        <Link href="/addingCourse/addingCourse">
          <MyButton
            background="#7329c2"
            hoverBackground="#03d665"
            type="primary"
          >
            Нажмите чтобы создать
          </MyButton>
        </Link>
      </div>

      <ul className={s.userCourses__list}>
        {userCourses.map((course) => {
          return <CourseItem course={course} />;
        })}
      </ul>
    </section>
  );
};

export default UserCourse;