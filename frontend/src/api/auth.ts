import axios from "./axiosConfig";

interface RegisterData {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export const login = async (username: string, password: string) => {
  const res = await axios.post("/api/auth/login/", { username, password });
  const { token, is_admin } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("is_admin", is_admin);
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;

  return res.data;
};

export const register = async (data: RegisterData) => {
  return axios.post("/api/auth/register/", data);
};
