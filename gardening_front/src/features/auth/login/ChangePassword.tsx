import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/shadcn/components/ui/card";
import { Input } from "@/shared/shadcn/components/ui/input";
import { Label } from "@/shared/shadcn/components/ui/label";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axiosInterceptor from "@/shared/api/axiosInterceptor";

const PasswordResetApply: React.FC = () => {
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [infoMsg] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);
    const [isCounting] = useState(true);

    const [showPassword, setShowPassword] = useState(false); // 👈 하나로 제어!
    const resetToken = localStorage.getItem("resetToken");

    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{4,20}$/;
    React.useEffect(() => {
        // resetToken 있으면 그대로 사용
        if (resetToken) return;

        // 회원일 경우: 서버에서 자동 resetToken 발급받기
        (async () => {
            try {
                const res = await axiosInterceptor.post("/auth/password/reset/init");
                const newToken = res.data.resetToken;

                if (!newToken) {
                    alert("비밀번호 재설정을 위한 인증 정보를 가져올 수 없습니다.");
                    window.location.href = "/";
                    return;
                }

                localStorage.setItem("resetToken", newToken);
                window.location.reload(); // 토큰 셋팅 후 다시 렌더링
            } catch (err) {
                // 비회원이 접근한 경우
                alert("비밀번호 재설정을 위한 인증이 필요합니다.");
                window.location.href = "/";
            }
        })();
    }, []);
    React.useEffect(() => {
        if (!isCounting || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem("resetToken");
                    window.location.href = "/auth/login/temp";
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isCounting, timeLeft]);


    // 비밀번호 유효성 메시지
    const passwordError =
        password.length > 0 && !passwordRegex.test(password)
            ? "영문 + 숫자 + 특수문자 포함 4~20자로 입력해주세요."
            : "";

    // 비밀번호 확인 메시지
    const passwordCheckError =
        passwordCheck.length > 0 && password !== passwordCheck
            ? "비밀번호가 일치하지 않습니다."
            : "";

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // 전송 전 최종 검사
        if (passwordError || passwordCheckError) {
            setErrorMsg("입력한 정보를 다시 확인해주세요.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            await axiosInterceptor.post("/auth/password/reset/apply", {
                resetToken,
                newPassword: password,
            });

            alert("비밀번호가 변경되었습니다.");

            window.location.href = "";
            localStorage.removeItem("resetToken");
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "비밀번호 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="max-w-md w-full p-4">
                <CardHeader>
                    <CardTitle className="text-xl">새 비밀번호 설정</CardTitle>
                </CardHeader>

                <CardContent>
                    {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
                    {infoMsg && <p className="text-green-600 text-sm mb-2">{infoMsg}</p>}

                    <form onSubmit={handleChangePassword} className="space-y-6">

                        {/* 비밀번호 입력 */}
                        <div className="space-y-1">
                            <Label>새 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {/* 토글 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {passwordError && (
                                <p className="text-red-500 text-xs">{passwordError}</p>
                            )}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="space-y-1">
                            <Label>새 비밀번호 확인</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={passwordCheck}
                                    onChange={(e) => setPasswordCheck(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {passwordCheckError && (
                                <p className="text-red-500 text-xs">{passwordCheckError}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "비밀번호 변경"}
                        </Button>
                    </form>

                    {isCounting && (
                        <p className="text-sm text-blue-600 font-semibold text-center mt-4">
                            만료 시간: {String(Math.floor(timeLeft / 60)).padStart(2, "0")} :
                            {String(timeLeft % 60).padStart(2, "0")}
                        </p>
                    )}
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-red-600">
                        새 비밀번호 설정은 인증 후 5분 안에 완료해야 합니다.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PasswordResetApply;
