import React,{useState} from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/shared/shadcn/components/ui/card';
import {Label} from '@/shared/shadcn/components/ui/label';
import {Input} from '@/shared/shadcn/components/ui/input';
import {Button} from '@/shared/shadcn/components/ui/button';
import {Loader2} from 'lucide-react';
import type {FieldErrors} from '@/features/auth/completeProfile/types.ts';
interface DaumPostcodeData {
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
    // 필요에 따라 더 추가 가능
}

interface Props {
    uuid: string,
    name: string,
    setName: (v: string) => void,
    nickname: string,
    setNickname: (v: string) => void,
    email: string,
    setEmail: (v: string) => void,
    phone: string,
    setPhone: (v: string) => void,
    address: string,
    setAddress: (v: string) => void,
    addressDetail: string,
    setAddressDetail: (v: string) => void,
    zipcode: string,
    setZipcode: (v: string) => void,
    bio: string,
    setBio: (v: string) => void,
    profileUrl: string,
    setProfileUrl: (v: string) => void,
    birthDate: string,
    setBirthDate: (v: string) => void,
    loading: boolean,
    errors: FieldErrors,
    setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
    handleSubmit: (e?: React.FormEvent) => Promise<void> | void,
    pageTitle?: string | undefined,
    pageDescription?: string | undefined,
    phoneCheckMsg?: string;
    file?:File;
    setFile?: (v:File) => void,
    handleFileSelect?: (v:string) => void,
    phoneAvailable?:boolean|null;

}

export default function CompleteProfileView({
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
                                                file, setFile,
                                                profileUrl,
                                                setProfileUrl,
                                                handleFileSelect,
                                                birthDate,
                                                setBirthDate,
                                                loading,
                                                errors,
                                                setErrors,
                                                handleSubmit,
                                                pageTitle,
                                                pageDescription,
                                            }: Props) {


    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'name':
                return !value.trim() ? '이름을 입력해주세요.' : '';
            case 'nickname':
                return !value.trim()
                    ? '닉네임을 입력해주세요.'
                    : value.length < 2 || value.length > 20
                        ? '닉네임은 2~20자여야 합니다.'
                        : '';
            case 'email':
                return value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
                    ? '유효한 이메일 형식이 아닙니다.'
                    : '';
            case 'phone':
                return value && /^\d{2,3}-\d{3,4}-\d{4}$/.test(value.replace(/-/g, ''))
                    ? '유효한 전화번호를 입력해주세요.'
                    : '';
            case 'zipcode':
                return value && !/^\d{5}$/.test(value) ? '우편번호는 5자리 숫자여야 합니다.' : '';
            case 'birthDate':
                return value && isNaN(Date.parse(value)) ? '유효한 생년월일을 입력해주세요.' : '';
            default:
                return '';
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <Card className="w-full max-w-lg shadow-xl rounded-lg border">
                <CardHeader>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>{pageDescription}</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        {/* 이름 */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onBlur={() =>
                                    setErrors(prev => ({...prev, name: validateField('name', name)}))
                                }
                                required
                            />
                            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* 닉네임 */}
                        <div className="grid gap-2">
                            <Label htmlFor="nickname">닉네임</Label>
                            <Input
                                id="nickname"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                onBlur={() =>
                                    setErrors(prev => ({...prev, nickname: validateField('nickname', nickname)}))
                                }
                            />
                            {errors.nickname && <p className="text-sm text-red-600">{errors.nickname}</p>}
                        </div>

                        {/* 이메일 */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onBlur={() =>
                                    setErrors(prev => ({...prev, email: validateField('email', email)}))
                                }
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* 전화번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                onBlur={() =>
                                    setErrors(prev => ({...prev, phone: validateField('phone', phone)}))
                                }
                            />
                            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        {/* 주소 */}
                        <div className="grid gap-2">
                            <Label htmlFor="address">주소</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="address"
                                    value={address}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        new window.daum.Postcode({
                                            oncomplete: function (data:DaumPostcodeData) {
                                                setAddress(data.roadAddress || data.jibunAddress);
                                                setZipcode(data.zonecode);
                                            },
                                        }).open();
                                    }}
                                >
                                    주소 검색
                                </Button>
                            </div>
                        </div>

                        {/* 상세 주소 */}
                        <div className="grid gap-2">
                            <Label htmlFor="addressDetail">상세 주소</Label>
                            <Input
                                id="addressDetail"
                                value={addressDetail}
                                onChange={e => setAddressDetail(e.target.value)}
                                placeholder="상세 주소를 입력해주세요"
                            />
                        </div>

                        {/* 우편번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="zipcode">우편번호</Label>
                            <Input
                                id="zipcode"
                                value={zipcode}
                                readOnly
                                className="w-32"
                            />
                        </div>

                        {/* 소개 */}
                        <div className="grid gap-2">
                            <Label htmlFor="bio">소개</Label>
                            <Input id="bio" value={bio} onChange={e => setBio(e.target.value)}/>
                        </div>

                        {/* 프로필 이미지 URL */}
                        <div className="grid gap-2">
                            <Label htmlFor="profileUrl">프로필 이미지</Label>

                            {/* 숨김 input */}
                            <input
                                id="profileUrl"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            {/* 버튼 + 이미지 나란히 */}
                            <div className="flex items-center gap-4">
                                {/* 업로드 버튼 */}
                                <Button
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById("profileUrl")?.click()
                                    }}
                                >
                                    이미지 업로드
                                </Button>

                                {/* 이미지 미리보기 */}
                                {file ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                ) : profileUrl ? (
                                    <img
                                        src={profileUrl}
                                        alt="preview"
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        선택된 이미지 없음
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* 생년월일 */}
                        <div className="grid gap-2">
                            <Label htmlFor="birthDate">생년월일</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={e => setBirthDate(e.target.value)}
                                onBlur={() =>
                                    setErrors(prev => ({...prev, birthDate: validateField('birthDate', birthDate)}))
                                }
                            />
                            {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full "
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline"/> : '정보 저장'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
