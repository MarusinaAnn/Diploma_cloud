import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Storage from "./pages/Storage";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./PrivateRoute";
import Header from "./components/Header";
import AdminUserFiles from "./pages/AdminUserFiles";
import UserStats from "./pages/UserStats";
import axios from "./api/axiosConfig";
import './App.css';

// Импорт react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Устанавливаем токен авторизации при старте
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
}




function App() {
  useEffect(() => {
    fetch("/api/auth/login/", {
      method: "GET",
      credentials: "include",
    });
  }, []);
  
  return (
    <>
      <Header />

      {/* Всплывающие уведомления */}
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/storage"
          element={
            <PrivateRoute>
              <Storage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/files/:userId"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminUserFiles />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <PrivateRoute adminOnly={true}>
              <UserStats />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
