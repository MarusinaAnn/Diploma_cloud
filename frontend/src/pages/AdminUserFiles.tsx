import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFiles } from "../api/files";
import { getUsers } from "../api/admin";
import { downloadFile } from "../api/files";
import FileCard from "../components/FileCard";

type FileType = {
  id: string;
  display_name: string;
  comment: string;
  file_size: number;
  upload_time: string;
  last_downloaded: string | null;
  shared_link?: string;
};

type UserType = {
  id: number;
  username: string;
  email: string;
};

const formatSize = (size: number): string => {
  if (size > 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + " МБ";
  if (size > 1024) return (size / 1024).toFixed(2) + " КБ";
  return size + " Б";
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const previewFile = async (fileId: string, fileName: string) => {
  try {
    const response = await fetch(`/api/files/${fileId}/view/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка предпросмотра");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  } catch (error) {
    console.error("Ошибка предпросмотра файла:", error);
    alert("Не удалось открыть файл для предпросмотра");
  }
};


const AdminUserFiles = () => {
  const { userId } = useParams<{ userId: string }>();
  const [files, setFiles] = useState<FileType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const [fileData, users] = await Promise.all([
            getFiles(userId),
            getUsers(),
          ]);

          setFiles(fileData);
          const matchedUser = users.find((u: any) => u.id.toString() === userId);
          if (matchedUser) {
            setUser({ id: matchedUser.id, username: matchedUser.username, email: matchedUser.email });
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>
        Файлы пользователя:{" "}
        {user ? (
          <>
            <strong>{user.username}</strong>{" "}
            <span style={{ color: "#666" }}>({user.email})</span>
          </>
        ) : (
          `ID ${userId}`
        )}
      </h2>

      {files.length === 0 ? (
        <p>Нет файлов.</p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "8px",
              }}
            >
              {file.display_name}
            </p>
            <p>
              <strong>Комментарий:</strong> {file.comment || "—"}
            </p>
            <p>
              <strong>Размер:</strong> {formatSize(file.file_size)}
            </p>
            <p>
              <strong>Загружен:</strong> {formatDate(file.upload_time)}
            </p>
            <p>
              <strong>Последнее скачивание:</strong>{" "}
              {formatDate(file.last_downloaded)}
            </p>
            <button
              className="download-btn"
              onClick={() => downloadFile(file.id, file.display_name)}
            >
              Скачать
            </button>
            {file.id && (
              <button
                className="preview-btn"
                onClick={() => previewFile(file.id, file.display_name)}
              >
                Предпросмотр
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminUserFiles;
