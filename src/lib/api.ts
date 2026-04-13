import { useAuthStore } from "@/store/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:3009",
  withCredentials: true,
});

export const paymentApi = axios.create({
  baseURL: "http://127.0.0.1:3009",
  headers: {
    Authorization: `Apikey hehehehdaeifewfee$**@@5@5%5`,
  },
})

// ===== REQUEST =====
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===== RESPONSE (DUY NHẤT 1 CÁI) =====
api.interceptors.response.use(
  (response) => response.data, // ✅ luôn unwrap data
  async (error) => {
    if (error.response?.status === 401) {
      const { refreshToken } = useAuthStore.getState();

      try {
        const res = await axios.post(
          "http://127.0.0.1:3009/auth/refresh-token",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        useAuthStore
          .getState()
          .setTokens(newAccessToken, refreshToken!);

        document.cookie = `accessToken=${newAccessToken}; path=/`;

        // 👉 retry request cũ
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);

      } catch {
        useAuthStore.getState().clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);