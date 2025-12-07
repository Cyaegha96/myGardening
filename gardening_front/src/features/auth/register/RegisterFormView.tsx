import React from 'react';
import {
    Card, CardHeader, CardContent, CardTitle,
    CardDescription, CardFooter
} from "@/shared/shadcn/components/ui/card";
import { Label } from "@/shared/shadcn/components/ui/label";
import { Input } from "@/shared/shadcn/components/ui/input";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/shadcn/lib/utils";

interface Props {
    id: string;
    setId: (v: string) => void;
    idCheckMsg: string;
    idAvailable: boolean | null;

    phone: string;
    setPhone: (v: string) => void;
    phoneCheckMsg: string;
    phoneAvailable: boolean | null;

    email: string;
    setEmail: (v: string) => void;
    emailCheckMsg: string;
    emailAvailable: boolean | null;
    emailValid: boolean;

    emailCode: string;
    setEmailCode: (v: string) => void;
    emailCodeMsg: string;
    emailVerified: boolean;
    requestEmailCode: () => void;
    verifyCode: () => void;

    password: string;
    setPassword: (v: string) => void;
    passwordConfirm: string;
    setPasswordConfirm: (v: string) => void;
    passwordMatchMsg: string;

    loading: boolean;
    error: string;
    success: string;
    handleRegister: () => Promise<void> | void;
}

export default function RegisterFormView(props: Props) {
    const {
        id, setId, idCheckMsg, idAvailable,
        phone, setPhone, phoneCheckMsg, phoneAvailable,
        email, setEmail, emailCheckMsg, emailAvailable,
        emailCode, setEmailCode, emailCodeMsg, emailVerified,
        requestEmailCode, verifyCode,
        password, setPassword,
        passwordConfirm, setPasswordConfirm, passwordMatchMsg,
        loading, error, success,
        handleRegister
    } = props;

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
                    <CardContent className="grid gap-5">

                        {/* 아이디 */}
                        <div className="grid gap-2">
                            <Label htmlFor="id">아이디</Label>
                            <Input
                                id="id"
                                type="text"
                                value={id}
                                autoComplete="username"
                                onChange={(e) => setId(e.target.value)}
                                required
                            />

                            {idCheckMsg && (
                                <p
                                    className={cn(
                                        "text-sm mt-1",
                                        idAvailable ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {idCheckMsg}
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPw ? "text" : "password"}
                                    value={password}
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="grid gap-2">
                            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                            <Input
                                id="passwordConfirm"
                                type={showPw ? "text" : "password"}
                                value={passwordConfirm}
                                autoComplete="new-password"
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />

                            {passwordMatchMsg && (
                                <p
                                    className={cn(
                                        "text-sm mt-1",
                                        password === passwordConfirm
                                            ? "text-green-600"
                                            : "text-red-600"
                                    )}
                                >
                                    {passwordMatchMsg}
                                </p>
                            )}
                        </div>

                        {/* 전화번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                                id="phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />

                            {phoneCheckMsg && (
                                <p
                                    className={cn(
                                        "text-sm mt-1",
                                        phoneAvailable ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {phoneCheckMsg}
                                </p>
                            )}
                        </div>

                        {/* 이메일 */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {emailCheckMsg && (
                                <p className={cn(
                                    "text-sm mt-1",
                                    emailAvailable ? "text-green-600" : "text-red-600"
                                )}>
                                    {emailCheckMsg}
                                </p>
                            )}

                            {/* 인증 요청 버튼 */}
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={ !emailAvailable}
                                onClick={requestEmailCode}
                                className="mt-1"
                            >
                                인증번호 보내기
                            </Button>
                        </div>

                        {/* 인증번호 입력 */}
                        <div className="grid gap-2">
                            <Label htmlFor="emailCode">인증번호</Label>

                            <div className="flex gap-2">
                                <Input
                                    id="emailCode"
                                    type="text"
                                    value={emailCode}
                                    onChange={(e) => setEmailCode(e.target.value)}
                                    required
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!emailCode}
                                    onClick={verifyCode}
                                >
                                    확인
                                </Button>
                            </div>

                            {emailCodeMsg && (
                                <p className={cn(
                                    "text-sm mt-1",
                                    emailVerified ? "text-green-600" : "text-red-600"
                                )}>
                                    {emailCodeMsg}
                                </p>
                            )}
                        </div>

                        {/* 에러 / 성공 */}
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
                        <Button type="submit"  disabled={loading  } className="w-full">
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "회원가입"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
