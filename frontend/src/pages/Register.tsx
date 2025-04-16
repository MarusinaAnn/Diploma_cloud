import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.warning("Введите корректный email (например, user@example.com)");
      return;
    }

    try {
      await axios.post(`api/auth/register/`, {
        username,
        full_name: fullName,
        email,
        password,
      });

      toast.success("Регистрация прошла успешно! 🎉");
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.username?.[0]) {
        toast.error(`Логин: ${err.response.data.username[0]}`);
      } else if (err.response?.data?.email?.[0]) {
        toast.error(`Email: ${err.response.data.email[0]}`);
      } else {
        toast.error("Ошибка при регистрации");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <label>Логин</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Полное имя</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
