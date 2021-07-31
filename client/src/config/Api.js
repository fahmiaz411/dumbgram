import axios from "axios";

export const API = axios.create({
  baseURL:
    "http://192.168.43.199:5001/api/v1/" || "http://localhost:5001/api/v1/",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
