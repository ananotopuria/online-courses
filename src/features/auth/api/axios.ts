import axios from "axios";

const url = "https://api.redclass.redberryinternship.ge/api";

export const publicInstance = axios.create({
  baseURL: url,
  headers: {
    Accept: "application/json",
  },
});

export const privateInstance = axios.create({
  baseURL: url,
  headers: {
    Accept: "application/json",
  },
});

privateInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
