import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/shared/shadcn/components/ui/card';
import { Label } from '@/shared/shadcn/components/ui/label';
import { Input } from '@/shared/shadcn/components/ui/input';
import { Button } from '@/shared/shadcn/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import PhoneVerificationButton from '@/widgets/auth/PhoneVerificationButton';
import {cn} from "@/shared/shadcn/lib/utils.ts";

interface Props {
    id: string;
    setId: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    passwordConfirm: string;
    setPasswordConfirm: (v: string) => void;
    passwordMatchMsg:string;
    phoneCheckMsg: string;

    phoneAvailable:boolean|null;

    loading: boolean;
    error: string;
    success: string;
    handleRegister: (e?: React.FormEvent) => Promise<void> | void;
    idCheckMsg:string;
    idAvailable:boolean|null;
    handleIdBlur: () => void;
    handlePasswordBlur: () => void;
    handlePhoneBlur: () => void;
}

export default function RegisterFormView({
                                             id,
                                             setId,
                                             idCheckMsg,
                                             idAvailable,
                                             phone,
                                             setPhone,
                                             password,
                                             setPassword,
                                             passwordConfirm,
                                             setPasswordConfirm,
                                             passwordMatchMsg,
                                             phoneCheckMsg,

                                             phoneAvailable,

                                             loading,
                                             error,
                                             success,
                                             handleRegister,
                                             handleIdBlur,
                                             handlePasswordBlur,
                                             handlePhoneBlur,
                                         }: Props) {
    const [showPw, setShowPw] = React.useState(false);

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-sm shadow-xl rounded-lg border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                    <CardDescription>새 계정을 만들어 보세요</CardDescription>
                </CardHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}
                >
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                type="text"
                                value={id}
                                autoComplete="id"
                                onChange={(e) => setId(e.target.value)}
                                onBlur={handleIdBlur} // ✅ 여기 추가
                                required
                            />

                            {idCheckMsg && (
                                <p
                                    className={cn(
                                        'text-sm mt-1',
                                        idAvailable ? 'text-green-600' : 'text-red-600'
                                    )}
                                >
                                    {idCheckMsg}
                                </p>
                            )}
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={handlePasswordBlur}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                            <Input
                                id="passwordConfirm"
                                type={showPw ? 'text' : 'password'}
                                value={passwordConfirm}
                                autoComplete="new-password"
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                onBlur={handlePasswordBlur}
                                required
                            />
                            {passwordMatchMsg && (
                                <p className={cn(
                                    'text-sm mt-1',
                                    password === passwordConfirm ? 'text-green-600' : 'text-red-600'
                                )}>
                                    {passwordMatchMsg}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">전화번호</Label>
                            <div className="flex">
                                <Input id="phone"
                                       type="text"
                                       value={phone} onChange={(e) => setPhone(e.target.value)}
                                       required
                                       onBlur={handlePhoneBlur}/>
                                {/*  <PhoneVerificationButton onVerify={() => alert('인증 로직을 여기에 연결하세요')} /> */}
                            </div>
                            {phoneCheckMsg && (
                                <p
                                    className={cn(
                                        'text-sm mt-1',
                                        phoneAvailable ? 'text-green-600' : 'text-red-600'
                                    )}
                                >
                                    {phoneCheckMsg}
                                </p>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 border border-red-200 rounded-md">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 p-2 border border-green-200 rounded-md">
                                {success}
                            </p>
                        )}
                    </CardContent>

                    <CardFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full "
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '회원가입'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
