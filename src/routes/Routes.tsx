import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import HomePage from "../pages/homePage/HomePage";
import StudentInfo from "../pages/studentInfo/studentInfo/StudentInfo";
import RegisterCourse from "../pages/registerCourse/RegisterCourse";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CourseDetail from "../pages/courseDetail/CourseDetail";
import PaymentConfirmation from "../pages/paymentConfirmation/PaymentConfirmation";
import MainLayout from "../layout/MainLayout";
import AllCourses from "../pages/allCourses/AllCourses";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/student-info" element={<MainLayout><StudentInfo /></MainLayout>} />
        <Route path="/register-course" element={<MainLayout><RegisterCourse /></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
        <Route path="/payment-confirmation" element={<MainLayout><PaymentConfirmation /></MainLayout>} />
        <Route path="/all-courses" element={<MainLayout><AllCourses /></MainLayout>} />
    </Routes>
  );
};

export default AppRoutes;
