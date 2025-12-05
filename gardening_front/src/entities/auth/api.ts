import axiosInterceptor from "@/shared/api/axiosInterceptor.ts";
import type { LoginResponse } from "./types";

const API_BASE_URL = '/auth';

export async function login(credentials: { id: string; password: string; }): Promise<LoginResponse> {
  const res = await axiosInterceptor.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
  return res.data;
}

export async function register(payload: { id: string; pw: string; phone?: string; }) {
  const res = await axiosInterceptor.post(`${API_BASE_URL}/signup`, payload);
  return res.data;
}

export function saveTokens(tokens: LoginResponse) {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
}

export function getStoredTokens() {
  const access = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  return { access, refresh };
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function logout(refreshToken?: string, accessToken?:string) {
 console.log("로그아웃 호출");

  if (!refreshToken || !accessToken) return;
  try {
    await axiosInterceptor.post(`${API_BASE_URL}/logout`, { refreshToken, accessToken });
  } catch (err) {
    // ignore server errors here; client will clear local session anyway
    console.warn('logout api failed', err);
  }
}

export async function inactivate(refreshToken?: string, accessToken?: string) {
    const res = await axiosInterceptor.post(
        "/auth/inactivate",
        {
            refreshToken,
            accessToken,
        },
        {
            headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            },
        }
    );

    return res.data;
}

export async function completeProfile(payload: Record<string, any>) {
  const res = await axiosInterceptor.post(`${API_BASE_URL}/complete-profile`, payload);
  return res.data;
}


export async function getUserInfo() {
    const res = await axiosInterceptor.get('/auth/info');
    return res.data;
}

export async function existIdCheck(id: string) {
    const res = await axiosInterceptor.get('/auth/existIdCheck', {
        params: { id }
    });
    console.log(res.data);
    return res.data;
}

export async function existPhoneCheck(phone: string) {
    const res = await axiosInterceptor.get('/auth/existPhoneCheck', {
        params: { phone }
    });
    console.log(res.data);
    return res.data;
}
