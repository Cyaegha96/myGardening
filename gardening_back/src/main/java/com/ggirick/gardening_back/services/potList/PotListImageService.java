package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListImageDTO;
import com.ggirick.gardening_back.mappers.potList.PotListImageMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.ggirick.gardening_back.config.PotListConfig.MAX_FILE_SIZE;
import static com.ggirick.gardening_back.config.PotListConfig.MAX_IMAGES_COUNT;

@Service
@RequiredArgsConstructor
public class PotListImageService {
    private final PotListImageMapper potListImageMapper;

    // 분양글에 따른 이미지 목록 조회
    public List<PotListImageDTO> getImagesByPotListingId(int id) {
        return potListImageMapper.getImagesByPotListingId(id);
    }

    // id에 따른 이미지 url 조회
    public String getImageById(int id) {
        return potListImageMapper.getImageById(id);
    }

    // 이미지 url 등록
    public void insertImage(int id, String url) {
        potListImageMapper.insertImage(id, url);
    }

    // 이미지 삭제
    public void deleteImageById(int id) {
        potListImageMapper.deleteImageById(id);
    }

    // 이미지 조건 검증
    public boolean validateImagesInfo(List<MultipartFile> images) {
        if(images == null) {
            return true;
        }
        if(images.size() > MAX_IMAGES_COUNT) {
            // 최대 이미지 개수를 초과한 경우
            return false;
        }
        for( MultipartFile image : images) {
            if(image.getSize() > MAX_FILE_SIZE) {
                // 이미지 최대 용량을 초과한 경우
                return false;
            }
        }
        return true;
    }
}
