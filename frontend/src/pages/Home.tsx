import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; 

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, setIsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      backgroundColor: "#fff",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px", color: "#6BA4B8" }}>
        <span role="img" aria-label="cloud">☁️</span> Добро пожаловать в <strong>My Cloud</strong>
      </h1>
      <p style={{ fontSize: "18px", color: "#444", marginBottom: "30px" }}>
        Управляй своими файлами, где бы ты ни был.
      </p>

      {isAuthenticated ? (
        <button onClick={handleLogout} style={{
          backgroundColor: "#f87171",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}>
          🚪 Выйти
        </button>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Link to="/login" style={{ fontSize: "18px", color: "#6BA4B8", textDecoration: "none" }}>
            🔐 Войти
          </Link>
          <Link to="/register" style={{ fontSize: "18px", color: "#6BA4B8", textDecoration: "none" }}>
            📝 Регистрация
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
