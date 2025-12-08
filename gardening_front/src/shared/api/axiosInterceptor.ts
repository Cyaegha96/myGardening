import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

//아이피 주소 등록
const API_BASE_URL:string = import.meta.env.VITE_API_BASE_URL;

//=====================================================
//  JWT 디코드 함수 (exp 읽기용)
//=====================================================
function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}



export const axiosInterceptor: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const LOGIN_HREF:string = "/auth/login";

//  무한 루프 방지용
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

//=====================================================
// 1) AccessToken 만료 1분 남았는지 체크 + 자동 Refresh
//=====================================================
async function tryRefreshBeforeExpire() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) return;

  const decoded = decodeJwt(accessToken);
  if (!decoded || !decoded.exp) return;

  const now = Math.floor(Date.now() / 1000);
  const expireAt = decoded.exp;

  const remaining = expireAt - now;

  // 만료 60초(1분) 이하이면 미리 Refresh
  if (remaining <= 60 && !isRefreshing) {
    isRefreshing = true;
    console.log("자동 재발급 요청")

    try {
      const res = await axiosInterceptor.post(
        `${API_BASE_URL}/auth/refresh?token=${refreshToken}`
      );

      const { accessToken: newAT, refreshToken: newRT } = res.data;

      localStorage.setItem("accessToken", newAT);
      localStorage.setItem("refreshToken", newRT);

      console.log("🔄 AccessToken 만료 1분 전 → 자동 재발급 완료");

    } catch (err) {
      console.error("자동 재발급 실패 → 로그인 필요");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

    } finally {
      isRefreshing = false;
    }
  }
}

//=====================================================
// 2) 요청 인터셉터 — 요청 전에 매번 체크
//=====================================================
axiosInterceptor.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    await tryRefreshBeforeExpire(); // 🔥 만료 1분 전이면 바로 재발급 실행

    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

//=====================================================
// 3) 응답 인터셉터 — 401이면 refreshToken으로 재발급
//=====================================================
axiosInterceptor.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = LOGIN_HREF;
        return;
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInterceptor(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh?token=${refreshToken}`
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        onRefreshed(accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axiosInterceptor(originalRequest);

      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = LOGIN_HREF;
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInterceptor;
