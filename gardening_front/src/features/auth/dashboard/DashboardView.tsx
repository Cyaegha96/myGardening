
import {Card, CardHeader, CardContent, CardTitle, CardDescription} from '@/shared/shadcn/components/ui/card';
import { Button } from '@/shared/shadcn/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import TokenDisplay from '../../../widgets/auth/TokenDisplay';
import TokenTimer from './TokenTimer';


interface Props {
  accessToken?: string | null;
  refreshToken?: string | null;
  onLogout: () => void;
    onInActivate:()=>void;
    userInfo?: {
        roles?: string[];
        nickname?: string;
        profileUrl?: string;
    };
}

export default function DashboardView({ accessToken, refreshToken, onLogout,userInfo , onInActivate}: Props) {
  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-xl border-t-4 ">

        <CardHeader className="flex flex-row justify-between">
          <div className="flex items-center space-x-3">
            <Home className="h-6 w-6 " />
            <CardTitle className="text-xl font-extrabold ">대시보드</CardTitle>

          </div>
        
          <Button onClick={onLogout} className="bg-red-500 text-white">
            <LogOut className="mr-2 h-4 w-4" /> 로그아웃
          </Button>
            <Button onClick={ onInActivate} className="bg-red-500 text-white">
                <LogOut className="mr-2 h-4 w-4" /> 회원탈퇴
            </Button>
        </CardHeader>

        <CardContent className="space-y-4">

            {/* 프로필 */}
            {userInfo && (
                <div className="flex items-center space-x-4">
                    {userInfo.profileUrl && (
                        <img
                            src={userInfo.profileUrl}
                            className="w-12 h-12 rounded-full border"
                            alt="profile"
                        />
                    )}
                    <div className="text-lg font-bold">{userInfo.nickname ?? '닉네임 없음'}</div>
                    <div className="flex gap-2 mt-2">
                        {userInfo.roles?.map((role, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-sm rounded-full bg-blue-100 text-primary"
                            >
      {role}
    </span>
                        ))}
                    </div>

                </div>
            )}

          <TokenDisplay accessToken={accessToken} refreshToken={refreshToken} />

          <TokenTimer accessToken={accessToken ?? null} />
            <CardDescription>*임시로 만든 대시보드고 개발 도중 빼버려도 됨</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
