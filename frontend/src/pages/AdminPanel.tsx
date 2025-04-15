import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  toggleAdmin as toggleAdminStatus,
  getUserStats
} from "../api/admin";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  total_files?: number;
  total_size?: number;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const stats = await getUserStats();

      const enriched = data.map((user: User) => {
        const stat = stats.find((s: any) => s.user_id === user.id);
        return {
          ...user,
          total_files: stat?.file_count || 0,
          total_size: stat?.total_size || 0
        };
      });

      const sorted = enriched.sort((a: User, b: User) => {
        if (a.is_admin === b.is_admin) {
          return a.username.localeCompare(b.username);
        }
        return a.is_admin ? -1 : 1;
      });
      

      setUsers(sorted);
    } catch (error) {
      alert("Не удалось загрузить пользователей или статистику");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Удалить пользователя?")) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      alert("Ошибка при удалении пользователя");
    }
  };

  const toggleAdmin = async (id: number) => {
    try {
      await toggleAdminStatus(id);
      fetchUsers();
    } catch (error) {
      alert("Ошибка при смене прав администратора");
    }
  };

  return (
    <div className="admin-panel">
      <h2 style={{ fontSize: "28px", color: "#88ACBC" }}>
  👑 Панель администратора
</h2>
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          <h3>
            <strong>{user.username}</strong> ({user.email})
            {user.is_admin && (
              <span className="admin-badge"> — Администратор ✅</span>
            )}
          </h3>
          <p>
            📁 <strong>Файлов:</strong> {user.total_files} &nbsp;&nbsp;
            💾 <strong>Объём:</strong>{" "}
            {(user.total_size! / 1024 / 1024).toFixed(2)} МБ
          </p>
          <button onClick={() => navigate(`/admin/files/${user.id}`)}>
            Файлы
          </button>
          <button onClick={() => toggleAdmin(user.id)}>
            {user.is_admin ? "Сделать обычным" : "Сделать админом"}
          </button>
          <button onClick={() => handleDelete(user.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
