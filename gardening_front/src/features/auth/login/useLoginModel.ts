import { useState, useEffect, type FormEvent } from 'react';
import { login, saveTokens, getStoredTokens } from '@/entities/auth/api';
import type { ErrorResponse } from '@/entities/auth/types';
import { useAuthStore,type AuthState } from '@/entities/auth/useAuthStore';

type Platform = 'kakao' | 'google' | 'naver';
//아이피 주소 등록
const API_BASE_URL:string = import.meta.env.VITE_API_BASE_URL;

export default function useLoginModel() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isLoggedIn = useAuthStore((s:AuthState) => s.isLoggedIn);
  const setTokens = useAuthStore((s:AuthState) => s.setTokens);

  useEffect(() => {
    const { access, refresh } = getStoredTokens();
    if (access && refresh) {
      setTokens(access, refresh);
    }
  }, [setTokens]);

  const handleSocialLogin = (platform: Platform) => {
    if (platform === 'kakao') {
        //현재 특정 아이피에서 로그인 지원하는건 카카오밖에 없음...
      window.location.href = `${API_BASE_URL}/oauth2/authorization/` + platform;
    } else {
      window.location.href = 'http://localhost:8081/oauth2/authorization/' + platform;
    }
  };

  const handleLogin = async (e?: FormEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ id, password });

      saveTokens(data);
      setTokens(data.accessToken, data.refreshToken);

      setId('');
      setPassword('');

      window.location.href = '/auth/dashboard';
    } catch (err) {
        console.log(err);
        const errMsg = err.response.data.message ?? '로그인 실패! 서버 응답을 확인하세요.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoggedIn,
    id,
    setId,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    handleSocialLogin,
  } as const;
}
