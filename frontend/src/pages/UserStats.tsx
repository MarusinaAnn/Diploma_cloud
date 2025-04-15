import React, { useEffect, useState } from "react";
import { getUserStats, getUsers } from "../api/admin";
import { useNavigate } from "react-router-dom";
import "./UserStats.css";

type UserStat = {
  user_id: number;
  username: string;
  email: string;
  file_count: number;
  total_size: number;
};

const UserStats = () => {
  const [stats, setStats] = useState<UserStat[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, stats] = await Promise.all([getUsers(), getUserStats()]);

        const enriched = users.map((user: any) => {
          const stat = stats.find((s: any) => s.user_id === user.id);
          return {
            user_id: user.id,
            username: user.username,
            email: user.email,
            file_count: stat?.file_count || 0,
            total_size: stat?.total_size || 0,
          };
        });

        setStats(enriched);
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      }
    };

    fetchData();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Б";
    const sizes = ["Б", "КБ", "МБ", "ГБ", "ТБ"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalFiles = stats.reduce((acc, user) => acc + user.file_count, 0);
  const totalStorage = stats.reduce((acc, user) => acc + user.total_size, 0);

  return (
    <div className="stats-container">
      <h2>Статистика по пользователям</h2>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Имя (email)</th>
            <th>Количество файлов</th>
            <th>Общий размер</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((user) => (
            <tr key={user.user_id}>
              <td>
                {user.username}
                <br />
                <small style={{ color: "#666" }}>{user.email}</small>
              </td>
              <td>{user.file_count}</td>
              <td>{formatBytes(user.total_size)}</td>
              <td>
                <button onClick={() => navigate(`/admin/files/${user.user_id}`)}>
                  Файлы
                </button>
              </td>
            </tr>
          ))}
          <tr className="summary-row">
            <td><strong>Итого:</strong></td>
            <td><strong>{totalFiles}</strong></td>
            <td><strong>{formatBytes(totalStorage)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserStats;
