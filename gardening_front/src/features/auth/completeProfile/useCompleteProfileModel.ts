import {useEffect, useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {completeProfile, existPhoneCheck, getUserInfo} from '@/entities/auth/api';
import type { FieldErrors} from '@/features/auth/completeProfile/types.ts';
import { AxiosError } from 'axios';
import {toInternationalPhone, toLocalPhone} from "@/shared/utils/phoneConfig.ts";
import {useUserInfoStore} from "@/widgets/header/useUserInfoStore.jsx.ts";
import axiosInterceptor from "@/shared/api/axiosInterceptor.ts";
export default function useCompleteProfileModel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get('uid') || '';

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [bio, setBio] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [birthDate, setBirthDate] = useState('');
    const [phoneCheckMsg, setPhoneCheckMsg] = useState('');
    const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null); // null = 아직 모름
    const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});


    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getUserInfo();
                // DB에서 가져온 정보를 상태에 세팅
                setName(data.name || '');
                setNickname(data.nickname || '');
                setEmail(data.email || '');
                setPhone(toLocalPhone(data.phone) || '');
                setAddress(data.address || '');
                setAddressDetail(data.addressDetail || '');
                setZipcode(data.zipcode || '');
                setBio(data.bio || '');
                setProfileUrl(data.profileUrl || '');
                setBirthDate(data.birthDate || '');
            } catch (err) {
                console.error('회원 정보 불러오기 실패', err);
            }
        }

        fetchUser();
    }, [setName, setNickname, setEmail, setPhone, setAddress, setAddressDetail, setZipcode, setBio, setProfileUrl, setBirthDate]);

    const handlePhoneBlur = async () => {
        if (!phone) {
            setPhoneCheckMsg('');
            setPhoneAvailable(null);
            return;
        }

        if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
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



    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return '이름을 입력해주세요.';
                return '';
            case 'nickname':
                if (!value.trim()) return '닉네임을 입력해주세요.';
                if (value.length < 6 || value.length > 20) return '닉네임은 6~20자여야 합니다.';
                return '';
            case 'email':
                if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
                    return '유효한 이메일 형식이 아닙니다.';
                return '';
            case 'phone':
                if (value && !/^\d{10,11}$/.test(value.replace(/-/g, '')))
                    return '유효한 전화번호를 입력해주세요.';
                return '';
            case 'zipcode':
                if (value && !/^\d{5}$/.test(value)) return '우편번호는 5자리 숫자여야 합니다.';
                return '';
            case 'birthDate':
                if (value && isNaN(Date.parse(value))) return '유효한 생년월일을 입력해주세요.';
                return '';
            default:
                return '';
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    };

    const uploadProfileImage = async () => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "mygardening/uploads/");

        try {
            const res = await axiosInterceptor.post(
                `/file/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return res.data.url;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        // 전체 필드 검사
        const newErrors: typeof errors = {
            name: validateField('name', name),
            nickname: validateField('nickname', nickname),
            email: validateField('email', email),
            phone: validateField('phone', phone),
            zipcode: validateField('zipcode', zipcode),
            birthDate: validateField('birthDate', birthDate),
        };

        setErrors(newErrors);

        // 하나라도 에러 있으면 제출 중단
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
                phone:toInternationalPhone(phone),
                address,
                addressDetail,
                zipcode,
                bio,
                profileUrl:uploadedUrl,
                birthDate,
            });

            useUserInfoStore.getState().setUserInfo({nickname:nickname, profileUrl: uploadedUrl });
            navigate('/auth/dashboard');
        } catch (err: unknown) {
            const axiosError = err as AxiosError;

            console.error(axiosError);
            alert('프로필 저장 중 오류가 발생했습니다.');
        }
        finally {
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
    phone,
    setPhone,
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
    loading,
      errors,
      setErrors,
      phoneCheckMsg,
      phoneAvailable,
      file, setFile,
      handleFileSelect,
    handleSubmit,
      handlePhoneBlur,
  } as const;
}
