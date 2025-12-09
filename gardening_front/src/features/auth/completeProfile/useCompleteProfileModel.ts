import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    completeProfile,
    sendEmailCode,
    verifyEmailCode,
    getUserInfo, checkEmailExceptSelf, checkPhoneExceptSelf,
} from "@/entities/auth/api";

import type { FieldErrors } from "@/features/auth/completeProfile/types.ts";
import { AxiosError } from "axios";
import { toInternationalPhone, toLocalPhone } from "@/shared/utils/phoneConfig.ts";
import { useUserInfoStore } from "@/widgets/header/useUserInfoStore.jsx.ts";
import axiosInterceptor from "@/shared/api/axiosInterceptor.ts";

export default function useCompleteProfileModel() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const uuid = searchParams.get("uid") || "";

    /* --------------------------------
       기본 프로필 필드
    -------------------------------- */
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [bio, setBio] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const [errors, setErrors] = useState<FieldErrors>({});

    const [originalEmail, setOriginalEmail] = useState("");
    const [originalPhone, setOriginalPhone] = useState("");

    /* --------------------------------
       파일 업로드
    -------------------------------- */
    const [file, setFile] = useState<File | null>(null);

    /* --------------------------------
       이메일 검증 상태
    -------------------------------- */

    const [emailValid, setEmailValid] = useState(false);
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const [emailCheckMsg, setEmailCheckMsg] = useState("");

    const [emailCode, setEmailCode] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailCodeMsg, setEmailCodeMsg] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* --------------------------------
       전화번호 검증 상태
    -------------------------------- */
    const [phoneValid, setPhoneValid] = useState(false);
    const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
    const [phoneCheckMsg, setPhoneCheckMsg] = useState("");

    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

    const [loading, setLoading] = useState(false);

    /* --------------------------------
       ▶ 최초 유저 정보 불러오기
    -------------------------------- */
    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getUserInfo();

                setName(data.name || "");
                setNickname(data.nickname || "");
                setEmail(data.email || "");
                setPhone(toLocalPhone(data.phone) || "");
                setAddress(data.address || "");
                setAddressDetail(data.addressDetail || "");
                setZipcode(data.zipcode || "");
                setBio(data.bio || "");
                setProfileUrl(data.profileUrl || "");
                setBirthDate(data.birthDate || "");

                setOriginalEmail(data.email || "");
                setOriginalPhone(toLocalPhone(data.phone) || "");

            } catch (err) {
                console.error("회원 정보 불러오기 실패", err);
            }
        }

        fetchUser();
    }, []);

    /* --------------------------------
       ▶ 이메일 검증(useEffect)
    -------------------------------- */
    useEffect(() => {

        if (email === originalEmail) {
            setEmailVerified(true);
            setEmailAvailable(true);
            setEmailCheckMsg("기존 이메일입니다.");
            return;
        }
        setEmailVerified(false); // 이메일만 바꿔도 인증 초기화

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
                const res = await  checkEmailExceptSelf(email);
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
                setEmailCheckMsg("이메일 검증 중 오류가 발생했습니다.");
            }
        }, 600);

        return () => clearTimeout(t);
    }, [email]);

    /* --------------------------------
       ▶ 이메일 인증코드 요청
    -------------------------------- */
    const requestEmailCode = async () => {
        if (!emailValid || !emailAvailable) {
            setEmailCodeMsg("이메일을 올바르게 입력해주세요.");
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
            setEmailCodeMsg("인증번호 요청 중 오류 발생");
        }
    };

    /* --------------------------------
       ▶ 이메일 인증코드 검증
    -------------------------------- */
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
            setEmailCodeMsg("이메일 인증 실패");
        }
    };

    /* --------------------------------
       ▶ 전화번호 실시간 체크(useEffect)
    -------------------------------- */
    useEffect(() => {

        if (phone === originalPhone) {
            setPhoneValid(true);
            setPhoneAvailable(true);
            setPhoneCheckMsg("기존 전화번호입니다.");
            return;
        }
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
                const res = await checkPhoneExceptSelf(dbphone);
                const msg = res?.message;

                if (msg.includes("이미")) {
                    setPhoneAvailable(false);
                    setPhoneCheckMsg("이미 존재하는 핸드폰 번호입니다.");
                } else {
                    setPhoneAvailable(true);
                    setPhoneCheckMsg("사용 가능한 번호입니다.");
                }
            } catch {
                setPhoneAvailable(null);
                setPhoneCheckMsg("핸드폰 번호 검사 중 오류 발생");
            }
        }, 600);

        return () => clearTimeout(t);
    }, [phone]);

    /* --------------------------------
       값 검증
    -------------------------------- */
    const validateField = (field: string, value: string) => {
        switch (field) {
            case "name":
                if (!value.trim()) return "이름을 입력해주세요.";
                return "";
            case "nickname":
                if (!value.trim()) return "닉네임을 입력해주세요.";
                if (value.length < 6 || value.length > 20)
                    return "닉네임은 6~20자여야 합니다.";
                return "";
            case "email":
                if (!emailVerified) return "이메일 인증을 완료해주세요.";
                return "";
            case "phone":
                if (!phoneValid || !phoneAvailable)
                    return "전화번호를 다시 확인해주세요.";
                return "";
            case "zipcode":
                if (value && !/^\d{5}$/.test(value))
                    return "우편번호는 5자리 숫자입니다.";
                return "";
            case "birthDate":
                if (value && isNaN(Date.parse(value)))
                    return "유효한 생년월일을 입력해주세요.";
                return "";
            default:
                return "";
        }
    };

    /* --------------------------------
       파일 선택
    -------------------------------- */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    };

    /* --------------------------------
       프로필 이미지 업로드
    -------------------------------- */
    const uploadProfileImage = async () => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "mygardening/uploads/");

        try {
            const res = await axiosInterceptor.post("/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data.url;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    /* --------------------------------
       프로필 제출
    -------------------------------- */
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const newErrors = {
            name: validateField("name", name),
            nickname: validateField("nickname", nickname),
            email: validateField("email", email),
            phone: validateField("phone", phone),
            zipcode: validateField("zipcode", zipcode),
            birthDate: validateField("birthDate", birthDate),
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(Boolean)) return;

        setLoading(true);

        try {
            let uploadedUrl = profileUrl;

            if (file) {
                uploadedUrl = await uploadProfileImage();
                setProfileUrl(uploadedUrl);
            }

            await completeProfile({
                name,
                nickname,
                email,
                phone: toInternationalPhone(phone),
                address,
                addressDetail,
                zipcode,
                bio,
                profileUrl: uploadedUrl,
                birthDate,
            });

            useUserInfoStore
                .getState()
                .setUserInfo({ nickname, profileUrl: uploadedUrl });

            navigate("/auth/dashboard");
        } catch (err) {
            const axiosError = err as AxiosError;
            console.error(axiosError);
            alert("프로필 저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
        uuid,

        name,
        setName,

        nickname,
        setNickname,

        email,
        setEmail,
        emailCheckMsg,
        emailAvailable,
        emailCode,
        setEmailCode,
        emailVerified,
        emailCodeMsg,
        requestEmailCode,
        verifyCode,

        phone,
        setPhone,
        phoneCheckMsg,
        phoneAvailable,

        address,
        setAddress,
        addressDetail,
        setAddressDetail,
        zipcode,
        setZipcode,
        bio,
        setBio,
        profileUrl,
        setProfileUrl,
        birthDate,
        setBirthDate,

        errors,
        setErrors,
        loading,

        file,
        setFile,
        handleFileSelect,

        handleSubmit,
    } as const;
}
