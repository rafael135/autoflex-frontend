import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});