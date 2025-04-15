import axios from "./axiosConfig";


// admin.ts

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/auth/users/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

export const deleteUser = async (id: number) => {
  const token = localStorage.getItem("token");
  await axios.delete(`/api/auth/users/${id}/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const toggleAdmin = async (id: number) => {
  const token = localStorage.getItem("token");
  return axios.post(`/api/auth/users/${id}/toggle-admin/`, null, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
};

export const getUserFiles = async (userId: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`/api/files/?user_id=${userId}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

export const getUserStats = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/files/all-stats/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

