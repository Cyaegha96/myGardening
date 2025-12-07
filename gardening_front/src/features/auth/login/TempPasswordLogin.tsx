import { useState, useEffect } from "react";
import {
    Card, CardHeader, CardTitle, CardContent, CardFooter
} from "@/shared/shadcn/components/ui/card";
import { Input } from "@/shared/shadcn/components/ui/input";
import { Label } from "@/shared/shadcn/components/ui/label";
import { Button } from "@/shared/shadcn/components/ui/button";
import { Loader2 } from "lucide-react";
import axiosInterceptor from "@/shared/api/axiosInterceptor";
import {existEmailCheck, existIdCheck} from "@/entities/auth/api.ts";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;

const PasswordResetVerify: React.FC = () => {
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [timeLeft, setTimeLeft] = useState(0);
    const [isCounting, setIsCounting] = useState(false);


    // validations
    const [idValid, setIdValid] = useState(false);
    const [idExists, setIdExists] = useState<boolean | null>(null);
    const [idMsg, setIdMsg] = useState("");

    const [emailValid, setEmailValid] = useState(false);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);
    const [emailMsg, setEmailMsg] = useState("");

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [infoMsg, setInfoMsg] = useState("");

    /* -----------------------------------
         ID 자동 검증 (회원가입 모델 동일)
    ----------------------------------- */
    useEffect(() => {
        if (!id) {
            setIdValid(false);
            setIdExists(null);
            setIdMsg("");
            return;
        }

        if (!idRegex.test(id)) {
            setIdValid(false);
            setIdExists(false);
            setIdMsg("아이디는 영문+숫자 4~20자입니다.");
            return;
        }

        setIdValid(true);
        setIdMsg("");

        const t = setTimeout(async () => {
            try {
                const res =await existIdCheck(id);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setIdExists(true);

                } else {
                    setIdExists(false);
                    setIdMsg("존재하지 않는 아이디입니다.");
                }
            } catch {
                setIdExists(null);
                setIdMsg("아이디 확인 중 오류");
            }
        }, 500);

        return () => clearTimeout(t);
    }, [id]);

    /* -----------------------------------
         Email 자동 검증
    ----------------------------------- */
    useEffect(() => {
        if (!email) {
            setEmailValid(false);
            setEmailExists(null);
            setEmailMsg("");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailValid(false);
            setEmailExists(false);
            setEmailMsg("올바른 이메일 형식이 아닙니다.");
            return;
        }

        setEmailValid(true);
        setEmailMsg("");

        const t = setTimeout(async () => {
            try {
                const res = await existEmailCheck(email);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setEmailExists(true);

                } else {
                    setEmailExists(false);
                    setEmailMsg("존재하지 않는 이메일입니다.");
                }
            } catch {
                setEmailExists(null);
                setEmailMsg("이메일 확인 중 오류");
            }
        }, 500);

        return () => clearTimeout(t);
    }, [email]);
    useEffect(() => {
        if (!isCounting || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isCounting, timeLeft]);


    // OTP 발급
    const handleRequestOtp = async () => {
        setErrorMsg("");
        setInfoMsg("");

        if (!idValid || !idExists) {
            setErrorMsg("올바른 아이디를 입력해주세요.");
            return;
        }
        if (!emailValid || !emailExists) {
            setErrorMsg("올바른 이메일을 입력해주세요.");
            return;
        }

        setSending(true);

        try {
            const res = await axiosInterceptor.post("/auth/password/temp", { id, email });
            setInfoMsg(res.data.message || "임시 OTP가 이메일로 전송되었습니다.");

            // 카운트다운 시작
            setTimeLeft(180);    // 3분
            setIsCounting(true);

        } catch (err: any) {
            console.log(err)
            setErrorMsg(err.response?.data?.message || "OTP 발급에 실패했습니다.");
        } finally {
            setSending(false);
        }
    };

    // OTP 인증
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setInfoMsg("");

        try {
            const res = await axiosInterceptor.post("/auth/password/reset/verify", {
                id,
                email,
                otp,
            });

            const { resetToken } = res.data;
            localStorage.setItem("resetToken", resetToken);

            window.location.href = "/auth/password/new";
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "OTP가 잘못되었습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="max-w-md w-full p-4">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">비밀번호 재설정</CardTitle>
                </CardHeader>

                <CardContent>
                    {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
                    {infoMsg && <p className="text-green-600 text-sm mb-2">{infoMsg}</p>}

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <Label>아이디</Label>
                            <Input value={id} onChange={(e) => setId(e.target.value)} required />
                            {idMsg && (
                                <p className={`text-sm ${idExists ? "text-green-600" : "text-red-500"}`}>
                                    {idMsg}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>이메일</Label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            {emailMsg && (
                                <p className={`text-sm ${emailExists ? "text-green-600" : "text-red-500"}`}>
                                    {emailMsg}
                                </p>
                            )}
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleRequestOtp}
                            disabled={sending || !idValid || !idExists || !emailValid || !emailExists}
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "OTP 발급"}
                        </Button>

                        <div>
                            <Label>OTP 코드</Label>
                            <Input
                                type="password"
                                value={otp}
                                placeholder="3분 내 발급된 코드를 입력하세요"
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "OTP 인증"}
                        </Button>
                    </form>
                    {isCounting && (
                        <p className="text-sm text-blue-600 font-semibold text-center mb-2">
                            OTP 만료 시간: {String(Math.floor(timeLeft / 60)).padStart(2, "0")} :
                            {String(timeLeft % 60).padStart(2, "0")}
                        </p>
                    )}
                </CardContent>

                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        ※ OTP는 3분 후 만료됩니다.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PasswordResetVerify;
