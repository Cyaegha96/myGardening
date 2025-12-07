
import { Button } from '@/shared/shadcn/components/ui/button';
import { MessageCircle } from 'lucide-react';
import NaverLogo from '@/widgets/auth/NaverLogo';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";

type Platform = 'kakao' | 'google' | 'naver';

interface Props {
  onSocialLogin: (platform: Platform) => void;
  loading?: boolean;
}

export default function SocialLoginButtons({ onSocialLogin, loading = false }: Props) {
  return (
      <TooltipProvider>
      <div className="relative w-full my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">또는</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => onSocialLogin('kakao')}
        disabled={loading}
        className="w-full h-10 bg-[#FEE500] hover:bg-[#FEE500]/90 text-gray-900 rounded-md transition duration-150 flex items-center justify-center font-bold shadow-md"
      >
        <MessageCircle className="mr-3 h-5 w-5 fill-gray-900" />
        카카오 로그인
      </Button>

      <Button
        type="button"
        onClick={() => onSocialLogin('google')}
        disabled={loading}
        className="w-full h-10 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md transition duration-150 flex items-center justify-center font-bold shadow-md"
      >
        <div className="mr-3 h-5 w-5">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="block h-full w-full"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        구글 로그인
      </Button>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        onClick={() => onSocialLogin('naver')}
                        disabled={loading}
                        className="w-full h-10 bg-[#03C75A] hover:bg-[#03C75A]/90 text-white rounded-md transition duration-150 flex items-center justify-center font-bold shadow-md"
                    >
                        <NaverLogo />
                        네이버 로그인
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                <p> 개발자 계정으로 전환되지 않은 상태이므로 네이버 로그인은 이용할 수 없습니다 </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
  );
}
