import React from "react";
import { downloadFile } from "../api/files";

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

const FileCard: React.FC<FileProps> = ({ file }) => {
  const handleDownload = () => {
    if (file.shared_link) {
      window.open(`/api/files/access/${file.shared_link}/`, "_blank");
    } else {
      downloadFile(file.id, file.display_name);
    }
  };

  const handlePreview = () => {
    window.open(`/api/files/${file.id}/view/`, "_blank");
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
      <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "8px" }}>
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
      <button className="download-btn" onClick={handleDownload}>
        Скачать
      </button>
      <button className="preview-btn" onClick={handlePreview} style={{ marginLeft: "10px" }}>
        Предпросмотр
      </button>
      {file.shared_link && (
        <p style={{ marginTop: "8px" }}>
          <strong>Публичная ссылка:</strong>{" "}
          <a
            href={`/api/files/access/${file.shared_link}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть
          </a>
        </p>
      )}
    </div>
  );
};

export default FileCard;

