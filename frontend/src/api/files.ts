import axios from "./axiosConfig";

export const getFiles = async (userId?: string) => {
  const url = userId ? `/api/files/user/${userId}/` : "/api/files/";
  const res = await axios.get(url);
  return res.data;
};



export const deleteFile = async (id: string) => {
  return axios.delete(`/api/files/${id}/`);
};

export const uploadFile = async (file: File, comment: string) => {
  const formData = new FormData();
  formData.append("file_data", file);
  formData.append("description", comment);
  return axios.post("/api/files/", formData);
};

export const downloadFile = async (id: string, fileNameFromList?: string) => {
  const response = await axios.get(`api/files/${id}/download/`, {
    responseType: "blob",
  });

  const contentType = response.headers["content-type"];
  const blob = new Blob([response.data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  const finalFileName = fileNameFromList || "downloaded_file";

  link.href = url;
  link.setAttribute("download", finalFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



