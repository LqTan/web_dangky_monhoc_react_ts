import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";
import PaymentResult from "../pages/paymentConfirmation/PaymentResult";
import NewsDetail from "../pages/homePage/news/NewsDetail";
import LandingPage from "../pages/landingPage/LandingPage";
import RegisterClassForm from "../pages/registerClassForm/RegisterClassForm";
import VNPayReturn from "../pages/paymentConfirmation/VNPayReturn";
import ExamSchedulesList from "../pages/studentInfo/examSchedule/ExamScheduleList";
import ExamPaymentReturn from "../pages/paymentConfirmation/ExamPaymentReturn";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Đợi cho đến khi kiểm tra auth xong
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Cho phép truy cập payment-result mà không cần auth
  if (location.pathname === '/payment-result') {
    return <>{children}</>;
  }
  
  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // if (isAuthenticated) {
  //   return <Navigate to="/home-page" />;
  // }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
        <Route path="/student-info" element={<ProtectedRoute><MainLayout><StudentInfo /></MainLayout></ProtectedRoute>} />
        <Route path="/register-course" element={<ProtectedRoute><MainLayout><RegisterCourse /></MainLayout></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><MainLayout><CourseDetail /></MainLayout></ProtectedRoute>} />
        <Route path="/payment-confirmation" element={<ProtectedRoute><MainLayout><PaymentConfirmation /></MainLayout></ProtectedRoute>} />
        <Route path="/all-courses" element={<ProtectedRoute><MainLayout><AllCourses /></MainLayout></ProtectedRoute>} />
        <Route path="/payment-result" element={<ProtectedRoute><MainLayout><PaymentResult /></MainLayout></ProtectedRoute>} />
        <Route path="/news/:tid" element={<ProtectedRoute><MainLayout><NewsDetail /></MainLayout></ProtectedRoute>} />
        <Route path="/home-page" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/register-class/:classId" element={<ProtectedRoute><MainLayout><RegisterClassForm /></MainLayout></ProtectedRoute>} />
        <Route path="/payment/vnpay-return" element={<ProtectedRoute><MainLayout><VNPayReturn /></MainLayout></ProtectedRoute>} />
        <Route path="/exam-schedules" element={<ProtectedRoute><MainLayout><ExamSchedulesList /></MainLayout></ProtectedRoute>} />
        <Route path="/payment/exam-vnpay-return" element={<ProtectedRoute><MainLayout><ExamPaymentReturn /></MainLayout></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
