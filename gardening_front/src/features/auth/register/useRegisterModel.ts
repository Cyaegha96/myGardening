import { useState, useEffect } from "react";
import {
    register,
    existIdCheck,
    existPhoneCheck,
    existEmailCheck,
    sendEmailCode,
    verifyEmailCode,
    saveTokens,
} from "@/entities/auth/api";
import { useAuthStore, type AuthState } from "@/entities/auth/useAuthStore";
import { toInternationalPhone } from "@/shared/utils/phoneConfig";

const emailRegex = /^(?!.*\.\.)(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;

const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;
const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{4,20}$/;
const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

export default function useRegisterModel() {
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const [emailCheckMsg, setEmailCheckMsg] = useState("");

    const [emailCode, setEmailCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailCodeMsg, setEmailCodeMsg] = useState("");

    const [id, setId] = useState("");
    const [idValid, setIdValid] = useState(false);
    const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
    const [idCheckMsg, setIdCheckMsg] = useState("");

    const [phone, setPhone] = useState("");
    const [phoneValid, setPhoneValid] = useState(false);
    const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
    const [phoneCheckMsg, setPhoneCheckMsg] = useState("");

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordMatchMsg, setPasswordMatchMsg] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const setTokens = useAuthStore((s: AuthState) => s.setTokens);

    useEffect(() => {

        setEmailVerified(false);

        if (!email) {
            setEmailValid(false);
            setEmailAvailable(null);
            setEmailCheckMsg("");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailValid(false);
            setEmailAvailable(false);
            setEmailCheckMsg("올바른 이메일 형식이 아닙니다.");
            return;
        }

        setEmailValid(true);
        setEmailCheckMsg("");

        const t = setTimeout(async () => {
            try {
                const res = await existEmailCheck(email);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setEmailAvailable(false);
                    setEmailCheckMsg("이미 존재하는 이메일입니다.");
                } else {
                    setEmailAvailable(true);
                    setEmailCheckMsg("사용 가능한 이메일입니다.");
                }
            } catch {
                setEmailAvailable(null);
                setEmailCheckMsg("이메일 검증 중 오류");
            }
        }, 500);

        return () => clearTimeout(t);
    }, [email]);

    const requestEmailCode = async () => {
        if ( !emailAvailable) {
            setEmailCodeMsg("이메일을 먼저 올바르게 입력해주세요.");
            return;
        }

        try {
            const res = await sendEmailCode(email);
            if (res?.code) {
                setEmailCodeMsg("인증번호가 발송되었습니다.");
            } else {
                setEmailCodeMsg("인증번호 발송 실패");
            }
        } catch {
            setEmailCodeMsg("인증번호 요청 중 오류");
        }
    };

    /* --------------------------
       3) 이메일 인증코드 검증
    -------------------------- */
    const verifyCode = async () => {
        if (!emailCode) {
            setEmailCodeMsg("인증번호를 입력해주세요.");
            return;
        }

        try {
            const ok = await verifyEmailCode(email, emailCode);
            if (ok?.verified) {
                setEmailVerified(true);
                setEmailCodeMsg("이메일 인증 완료!");
            } else {
                setEmailVerified(false);
                setEmailCodeMsg("인증번호가 올바르지 않습니다.");
            }
        } catch {
            setEmailCodeMsg("인증 실패");
        }
    };


    useEffect(() => {
        if (!id) {
            setIdValid(false);
            setIdAvailable(null);
            setIdCheckMsg("");
            return;
        }

        if (!idRegex.test(id)) {
            setIdValid(false);
            setIdAvailable(false);
            setIdCheckMsg("아이디는 영문+숫자 4~20자입니다.");
            return;
        }

        setIdValid(true);
        setIdCheckMsg("");

        const t = setTimeout(async () => {
            try {
                const res = await existIdCheck(id);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setIdAvailable(false);
                    setIdCheckMsg("이미 존재하는 아이디입니다.");
                } else {
                    setIdAvailable(true);
                    setIdCheckMsg("사용 가능한 아이디입니다.");
                }
            } catch {
                setIdAvailable(null);
                setIdCheckMsg("아이디 검증 중 오류");
            }
        }, 500);

        return () => clearTimeout(t);
    }, [id]);

    useEffect(() => {
        if (!phone) {
            setPhoneValid(false);
            setPhoneAvailable(null);
            setPhoneCheckMsg("");
            return;
        }

        if (!phoneRegex.test(phone)) {
            setPhoneValid(false);
            setPhoneAvailable(false);
            setPhoneCheckMsg("전화번호 형식이 올바르지 않습니다.");
            return;
        }

        setPhoneValid(true);
        setPhoneCheckMsg("");

        const t = setTimeout(async () => {
            try {
                const dbphone = toInternationalPhone(phone);
                const res = await existPhoneCheck(dbphone);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setPhoneAvailable(false);
                    setPhoneCheckMsg("이미 존재하는 번호입니다.");
                } else {
                    setPhoneAvailable(true);
                    setPhoneCheckMsg("사용 가능한 번호입니다.");
                }
            } catch {
                setPhoneAvailable(null);
                setPhoneCheckMsg("전화번호 확인 중 오류");
            }
        }, 500);

        return () => clearTimeout(t);
    }, [phone]);

    useEffect(() => {
        if (!password) {
            setPasswordMatchMsg("");
            return;
        }

        if (!passwordRegex.test(password)) {
            setPasswordMatchMsg("비밀번호는 문자+숫자+특수문자 4~20자입니다.");
            return;
        }

        if (!passwordConfirm) {
            setPasswordMatchMsg("");
            return;
        }

        if (password !== passwordConfirm) {
            setPasswordMatchMsg("비밀번호가 일치하지 않습니다.");
        } else {
            setPasswordMatchMsg("비밀번호가 일치합니다.");
        }
    }, [password, passwordConfirm]);

    /* --------------------------
          전체 폼 유효성 검사
    -------------------------- */
    const isFormValid = () => {
        if (!emailValid || !emailAvailable || !emailVerified) return false;
        if (!idValid || !idAvailable) return false;
        if (!phoneValid || !phoneAvailable) return false;
        if (!passwordRegex.test(password)) return false;
        if (password !== passwordConfirm) return false;
        return true;
    };

    /* --------------------------
          회원가입 실행
    -------------------------- */
    const handleRegister = async () => {
        setError("");
        setSuccess("");

        if (!isFormValid()) {
            setError("입력값을 다시 확인해주세요.");
            return;
        }

        setLoading(true);

        try {
            const data = await register({
                email,
                id,
                pw: password,
                phone: toInternationalPhone(phone),
            });

            if (data?.accessToken && data?.refreshToken) {
                saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
                setTokens(data.accessToken, data.refreshToken);
            }

            setSuccess("회원가입 성공!");
            window.location.href = "/";
        } catch (err: any) {
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message;

            if (msg.includes("이미")) {
                setError("이미 존재하는 정보입니다.");
            } else setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail, emailCheckMsg, emailAvailable,
        emailCode, setEmailCode, emailCodeMsg, emailVerified,
        requestEmailCode, verifyCode,

        id, setId, idCheckMsg, idAvailable,
        phone, setPhone, phoneCheckMsg, phoneAvailable,
        password, setPassword,
        passwordConfirm, setPasswordConfirm, passwordMatchMsg,

        loading, error, success,
        handleRegister,
    };
}
