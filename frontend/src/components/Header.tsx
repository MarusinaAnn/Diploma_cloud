import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav>
      <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
          Главная
        </NavLink>

        {isAuthenticated && (
          <NavLink to="/storage" className={({ isActive }) => (isActive ? "active-link" : "")}>
            Мои файлы
          </NavLink>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Панель администратора
            </NavLink>
            <NavLink to="/admin/stats" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Статистика
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <button className="logout-btn" onClick={handleLogout}>
            Выход
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
