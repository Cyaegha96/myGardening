import {useCallback, useEffect, useState} from 'react';
import { useAuthStore, type AuthState } from '@/entities/auth/useAuthStore';

import { getStoredTokens, clearTokens, logout as apiLogout ,getUserInfo } from '@/entities/auth/api';

export default function useDashboardModel() {
  const accessToken = useAuthStore((s:AuthState) => s.accessToken);
  const refreshToken = useAuthStore((s:AuthState) => s.refreshToken);
  const setTokens = useAuthStore((s:AuthState) => s.setTokens);
  const storeLogout = useAuthStore((s:AuthState) => s.logout);
    const [userInfo, setUserInfo] = useState<{ nickname?: string; profileUrl?: string,roles?:string[]; }>({});
  useEffect(() => {
    const { access, refresh } = getStoredTokens();
    if (access && refresh && !accessToken) {
      setTokens(access, refresh);
    }
  }, [accessToken, setTokens]);
    useEffect(() => {
        if (!accessToken) return;

        (async () => {
            try {
                const data = await getUserInfo();
                setUserInfo(data);
            } catch (e) {
                console.error('정보 불러오기 실패', e);
            }
        })();
    }, [accessToken]);
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout(refreshToken || undefined, accessToken||undefined);
    } catch (e) {
      alert("로그아웃 실패(?)");
        console.log(e);
    }
    clearTokens();
    storeLogout();
    window.location.href = '/';
  }, [refreshToken,accessToken, storeLogout]);

  return {
    accessToken,
    refreshToken,
    handleLogout,

      userInfo,
  } as const;
}
