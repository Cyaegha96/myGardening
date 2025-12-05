import { useState, } from 'react';
import { register, existIdCheck ,existPhoneCheck } from '@/entities/auth/api';
import { saveTokens } from '@/entities/auth/api';
import { useAuthStore, type AuthState } from '@/entities/auth/useAuthStore';
import {toInternationalPhone} from "@/shared/utils/phoneConfig.ts";

export default function useRegisterModel() {
    const [id, setId] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [idCheckMsg, setIdCheckMsg] = useState('');
    const [idAvailable, setIdAvailable] = useState<boolean | null>(null); // null = 아직 모름
    const [phoneCheckMsg, setPhoneCheckMsg] = useState('');
    const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null); // null = 아직 모름

    const [passwordMatchMsg, setPasswordMatchMsg] = useState('');
    const setTokens = useAuthStore((s: AuthState) => s.setTokens);

    const idRegex= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{4,20}$/;
    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/

    const handleIdBlur = async () => {
        if (!id) {
            setIdCheckMsg('');
            setIdAvailable(null);
            return;
        }
        if (!idRegex.test(id)) {
            setIdCheckMsg('아이디는 영문과 숫자 혼합 4~20자로 입력해주세요.');
            setIdAvailable(false);
            return;
        }
        try {
            const res = await existIdCheck(id);
            const msg = res?.message;

            if (msg.includes('이미')) {
                setIdAvailable(false);
                setIdCheckMsg('이미 존재하는 아이디입니다.');
            } else {
                setIdAvailable(true);
                setIdCheckMsg('사용 가능한 아이디입니다.');
            }
        } catch (e) {
            setIdAvailable(null);
            setIdCheckMsg('아이디 검사 중 오류가 발생했습니다.');
        }
    };

    const handlePhoneBlur = async () => {
        if (!phone) {
            setPhoneCheckMsg('');
            setPhoneAvailable(null);
            return;
        }

        if (!phoneRegex.test(phone)) {
            setPhoneAvailable(false);
            setPhoneCheckMsg('전화번호는 하이픈 포함 10~11자리로 입력해주세요.');

            return ;
        }

        try {
            const dbphone = toInternationalPhone(phone);
            console.log(dbphone)
            const res = await existPhoneCheck(dbphone);
            const msg = res?.message;

            if (msg.includes('이미')) {
                setPhoneAvailable(false);
                setPhoneCheckMsg('이미 존재하는 핸드폰 번호입니다.');
            } else {
                setPhoneAvailable(true);
                setPhoneCheckMsg('사용 가능한 핸드폰 번호입니다.');
            }
        } catch (e) {
            setPhoneAvailable(null);
            setPhoneCheckMsg('핸드폰 번호 검사 중 오류가 발생했습니다.');
        }
    };

    const handlePasswordBlur = () => {
        // 비밀번호 유효성 검사


        if (!passwordRegex.test(password)) {
            setPasswordMatchMsg('비밀번호는 영문, 숫자, 특수문자를 모두 포함해 4~20자로 입력해주세요.');
            return;
        }

        if (!passwordConfirm) {
            setPasswordMatchMsg('');
            return;
        }

        if (password !== passwordConfirm) {
            setPasswordMatchMsg('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordMatchMsg('비밀번호가 일치합니다.');
        }
    };


    const validateForm = () => {
        if (!idAvailable) {
            setError('해당 아이디는 사용할 수 없습니다.');
            return false;
        }
        if (!phoneAvailable) {
            setError('해당 전화번호는 사용할 수 없습니다.');
            return false;
        }
        
        if (!idRegex.test(id)) {
            setError('아이디는 영문과 숫자 4~20자로 입력해주세요.');
            return false;
        }
        if (!passwordRegex.test(password)) {
            setError('비밀번호는 문자와 숫자 포함 8~20자로 입력해주세요.');
            return false;
        }
        if (password !== passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (!phoneRegex.test(phone)) {
            setError('전화번호는 하이픈 포함 10~11자리로 입력해주세요.');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setLoading(true);

        try {

            const data = await register({ id, pw: password, phone: toInternationalPhone(phone) });

            if (data?.accessToken && data?.refreshToken) {
                saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
                setTokens(data.accessToken, data.refreshToken);
            }

            setSuccess(data.message || '회원가입 성공!');
            setId('');
            setPassword('');
            setPhone('');
        } catch (err: any) {
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message;

            if (msg.includes('이미')) {
                setError('이미 존재하는 회원정보입니다.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
            window.location.href="/"
        }
    };

    return {
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
        setPhoneCheckMsg,
        phoneAvailable,
        setPhoneAvailable,
        loading,
        error,
        success,
        handleRegister,
        handleIdBlur,
        handlePasswordBlur,
        handlePhoneBlur,
    };
}
