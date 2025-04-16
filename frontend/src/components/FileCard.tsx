import React from "react";
import { deleteFile, downloadFile } from "../api/files";
import { toast } from "react-toastify";

type FileProps = {
  file: {
    id: string;
    display_name: string;
    comment: string;
    file_size: number;
    upload_time: string;
    last_downloaded: string | null;
    shared_link?: string;
  };
  onDelete?: () => void;
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

const FileCard: React.FC<FileProps> = ({ file, onDelete }) => {
  const previewFile = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/files/${id}/view/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      toast.error("Ошибка предпросмотра файла");
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Ссылка скопирована в буфер обмена");
    } catch (err) {
      console.error("Ошибка копирования:", err);
      toast.error("Не удалось скопировать ссылку");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Удалить файл?")) {
      await deleteFile(id);
      toast.success("Файл удалён");
      if (onDelete) onDelete(); // ← вот тут он вызывается, если передан
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <strong>{file.display_name}</strong> <br />
      Комментарий: {file.comment || "—"} <br />
      Размер: {formatSize(file.file_size)} <br />
      Загружен: {formatDate(file.upload_time)} <br />
      Последнее скачивание: {formatDate(file.last_downloaded)} <br />

      {file.shared_link && (
        <div className="copy-link-block" style={{ marginTop: "10px" }}>
          <strong style={{ fontSize: "16px", color: "#88ACBC" }}>
            Публичная ссылка:
          </strong>{" "}
          <button
            className="copy-btn"
            onClick={() =>
              copyToClipboard(
                `${window.location.origin}/api/files/access/${file.shared_link}/`
              )
            }
          >
            Скопировать ссылку
          </button>
        </div>
      )}

      <div className="file-actions" style={{ marginTop: "15px" }}>
        <button
          style={{ marginRight: "10px" }}
          onClick={() => downloadFile(file.id, file.display_name)}
        >
          Скачать
        </button>
        <button
          style={{ marginRight: "10px" }}
          onClick={() => previewFile(file.id, file.display_name)}
        >
          Предпросмотр
        </button>
        <button onClick={() => handleDelete(file.id)}>Удалить</button>
      </div>
    </div>
  );
};

export default FileCard;
