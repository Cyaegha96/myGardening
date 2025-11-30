import {type PlantDetail, useSearchPlantStore} from '@/entities/searchPlant/searchPlantStore.ts';
import { type DragEvent, useRef } from 'react';
import axiosInterceptor from "@/shared/api/axiosInterceptor.ts";

export const useSearchPlantModel = () => {
    const {
        files, filePreview, analysisResult, isUploading,addToHistory,
        setFiles, setFilePreview, setAnalysisResult, setIsUploading, reset
    } = useSearchPlantStore();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const file = fileList[0];
        setFiles([file]);

        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
                setFilePreview(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleRemoveFile = () => {
        reset();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleMyPlantClick = async () =>{
        alert("아직 내 식물 추가는 만들어지지 않았습니다!")
    }


    const handleUploadClick = async () => {
        if (!files || files.length === 0) {
            alert('업로드할 파일을 선택해주세요.');
            return;
        }

        // 허용 확장자 리스트
        const allowedExtensions = ['png', 'jpg', 'jpeg','jfif'];

        const fileName = files[0].name.toLowerCase();
        const fileExtension = fileName.split('.').pop();

        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            alert(`허용되지 않는 파일 형식입니다. (${allowedExtensions.join(', ')})만 업로드 가능합니다.`);
            return;
        }


        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('organ', 'flower');

            const response = await axiosInterceptor.post('/plant/identifyByMultipartFiles', formData);
            console.log(response)

            if (response.data.statusCode === 404) {
                alert('해당 식물 정보를 찾을 수 없습니다.');
            } else if (response.status >= 200 && response.status < 300) {
                const result: PlantDetail = response.data;
                console.log(result);
                setAnalysisResult(result);

                addToHistory({
                    plant: result,
                    file: files[0],
                    filePreview: filePreview,
                });
            } else {
                alert(`서버 오류: ${response.status}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`업로드 및 식물 분석 실패: ${error?.response?.data?.message || error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        files,
        filePreview,
        analysisResult,
        isUploading,
        fileInputRef,
        handleFiles,
        handleDrop,
        handleRemoveFile,
        handleUploadClick,
        handleMyPlantClick
    };
};
