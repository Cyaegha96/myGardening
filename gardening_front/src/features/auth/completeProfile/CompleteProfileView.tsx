import React from 'react';
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
import {Link} from "react-router-dom";

interface DaumPostcodeData {
    roadAddress: string;
    jibunAddress: string;
    zonecode: string;
}

interface Props {
    uuid: string,
    name: string,
    setName: (v: string) => void,
    nickname: string,
    setNickname: (v: string) => void,
    email: string,
    setEmail: (v: string) => void,

    // 이메일 검증용
    emailCheckMsg?: string;
    emailAvailable?: boolean | null;
    emailCode?: string;
    setEmailCode?: (v: string) => void;
    emailVerified?: boolean;
    emailCodeMsg?: string;
    requestEmailCode?: () => void;
    verifyCode?: () => void;

    phone: string,
    setPhone: (v: string) => void,

    // 전화번호 중복 검사 메시지
    phoneCheckMsg?: string;
    phoneAvailable?: boolean | null;

    address: string,
    setAddress: (v: string) => void,
    addressDetail: string,
    setAddressDetail: (v: string) => void,
    zipcode: string,
    setZipcode: (v: string) => void,
    bio: string,
    setBio: (v: string) => void,

    file?: File | null;
    setFile?: (f: File | null) => void;
    handleFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    profileUrl: string,
    setProfileUrl: (v: string) => void,
    birthDate: string,
    setBirthDate: (v: string) => void,
    loading: boolean,
    errors: FieldErrors,
    setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
    handleSubmit: (e?: React.FormEvent) => Promise<void> | void,
    pageTitle?: string,
    pageDescription?: string,
}


export default function CompleteProfileView({
                                                name, setName,
                                                nickname, setNickname,
                                                email, setEmail,
                                                emailCheckMsg,
                                                emailAvailable,
                                                emailCode,
                                                setEmailCode,
                                                emailVerified,
                                                emailCodeMsg,
                                                requestEmailCode,
                                                verifyCode,

                                                phone, setPhone,
                                                phoneCheckMsg,
                                                phoneAvailable,

                                                address, setAddress,
                                                addressDetail, setAddressDetail,
                                                zipcode, setZipcode,
                                                bio, setBio,

                                                file,
                                                profileUrl,
                                                handleFileSelect,

                                                birthDate, setBirthDate,
                                                loading,
                                                errors,
                                                setErrors,
                                                handleSubmit,
                                                pageTitle,
                                                pageDescription,
                                            }: Props) {


    return (
        <div className="w-full flex justify-center items-center min-h-screen p-4">
            <Card className="w-full shadow-xl rounded-lg border">
                <CardHeader>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>{pageDescription}</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>

                    <CardContent className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {/* 이름 */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onBlur={() => setErrors(p => ({...p, name: !name.trim() ? "이름을 입력해주세요." : ""}))}
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
                            />

                            {/* 이메일 메시지 */}
                            {emailCheckMsg && (
                                <p className={`text-sm ${
                                    emailAvailable ? "text-green-600" : "text-red-600"
                                }`}>
                                    {emailCheckMsg}
                                </p>
                            )}

                            {!emailVerified && emailAvailable && (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={requestEmailCode}
                                    >
                                        인증번호 요청
                                    </Button>
                                </div>
                            )}

                            {/* 인증 코드 입력 */}
                            {!emailVerified && emailAvailable && (
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        value={emailCode}
                                        placeholder="인증번호 입력"
                                        onChange={e => setEmailCode?.(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={verifyCode}>확인</Button>
                                </div>
                            )}

                            {emailCodeMsg && (
                                <p className={`text-sm ${emailVerified ? "text-green-600" : "text-red-600"}`}>
                                    {emailCodeMsg}
                                </p>
                            )}

                            {emailVerified && (
                                <p className="text-sm text-green-600">이메일 인증 완료</p>
                            )}
                        </div>

                        {/* 전화번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="phone">전화번호</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            {phoneCheckMsg && (
                                <p className={`text-sm ${
                                    phoneAvailable ? "text-green-600" : "text-red-600"
                                }`}>
                                    {phoneCheckMsg}
                                </p>
                            )}
                        </div>

                        {/* 주소 */}
                        <div className="grid gap-2">
                            <Label htmlFor="address">주소</Label>
                            <div className="flex gap-2">
                                <Input id="address" value={address} readOnly className="flex-1"/>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        new window.daum.Postcode({
                                            oncomplete: (data: DaumPostcodeData) => {
                                                setAddress(data.roadAddress || data.jibunAddress);
                                                setZipcode(data.zonecode);
                                            }
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
                                placeholder="상세 주소 입력"
                            />
                        </div>

                        {/* 우편번호 */}
                        <div className="grid gap-2">
                            <Label htmlFor="zipcode">우편번호</Label>
                            <Input id="zipcode" value={zipcode} readOnly className="w-32"/>
                        </div>

                        {/* 소개 */}
                        <div className="grid gap-2">
                            <Label htmlFor="bio">소개</Label>
                            <Input id="bio" value={bio} onChange={e => setBio(e.target.value)}/>
                        </div>

                        {/* 프로필 이미지 업로드 */}
                        <div className="grid gap-2">
                            <Label>프로필 이미지</Label>

                            <input
                                id="profileUrl"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <div className="flex items-center gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById("profileUrl")?.click();
                                    }}
                                >
                                    이미지 업로드
                                </Button>

                                {file ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                ) : profileUrl ? (
                                    <img
                                        src={profileUrl}
                                        className="w-20 h-20 rounded object-cover"
                                    />
                                ) : (
                                    <div className="text-sm text-gray-400">선택된 이미지 없음</div>
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
                            />
                            {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
                        </div>

                    </CardContent>

                    <CardFooter className="gap-2 mt-5 ">
                        <Link to="/auth/password/new"> <div className="grid gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                            >비밀번호 변경
                            </Button>
                        </div></Link>
                        <Button type="submit" disabled={loading} className="w-full ">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline"/> : "정보 저장"}
                        </Button>

                    </CardFooter>
                    {Object.values(errors).some(Boolean) && (
                        <div className="bg-red-50 border border-red-300 text-red-700 p-3 mt-5 rounded-md text-sm">
                            <p>입력되지 않은 항목이 있습니다. 아래 내용을 확인해주세요:</p>
                            <ul className="list-disc list-inside mt-1">
                                {Object.entries(errors).map(([key, value]) =>
                                    value ? <li key={key}>{value}</li> : null
                                )}
                            </ul>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
}
