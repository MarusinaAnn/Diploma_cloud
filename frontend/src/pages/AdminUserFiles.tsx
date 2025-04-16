import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFiles } from "../api/files";
import { getUsers } from "../api/admin";
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

const AdminUserFiles: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [files, setFiles] = useState<FileType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        const [fileData, users] = await Promise.all([
          getFiles(userId),
          getUsers(),
        ]);

        setFiles(fileData);

        const matchedUser = users.find(
          (u: any) => u.id.toString() === userId
        );

        if (matchedUser) {
          setUser({
            id: matchedUser.id,
            username: matchedUser.username,
            email: matchedUser.email,
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
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
        files.map((file) => <FileCard key={file.id} file={file} />)
      )}
    </div>
  );
};

export default AdminUserFiles;
