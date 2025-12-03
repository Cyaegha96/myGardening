package com.ggirick.gardening_back.services.myPlant;

import com.ggirick.gardening_back.dto.myPlant.MyPlantDTO;
import com.ggirick.gardening_back.dto.myPlant.MyPlantResponseDTO;
import com.ggirick.gardening_back.mappers.myPlant.MyPlantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.HtmlUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPlantService {
    private final MyPlantMapper myPlantMapper;
    private final MyPlantImageService myPlantImageService;

    // 새로운 식물 등록
    @Transactional
    public void insert(MyPlantDTO dto, MultipartFile file, String loginUid) throws Exception {

        // 스크립트/HTML 공격 방지: 제목/내용 이스케이프
        dto.setNickname(HtmlUtils.htmlEscape(dto.getNickname()));
        dto.setMemo(HtmlUtils.htmlEscape(dto.getMemo()));

        // my_plant 테이블에 입력 후 user_plant_id 받기
        myPlantMapper.insert(dto);
        int userPlantId = dto.getUserPlantId();

        // 이미지 파일이 있는 경우에만 업로드 처리
        if (file != null && !file.isEmpty()) {
            // 이미지 DB에 등록
            myPlantImageService.insert(file, userPlantId, loginUid);
        }

        // 다이어리에 첫 일지로 등록

    }

    // 식물 정보 수정
    public void update(MyPlantDTO dto) {
        myPlantMapper.update(dto);
    }

    // 등록한 식물 정보 삭제
    @Transactional
    public void delete(int userPlantId) {
        // 1. 식물 삭제 - fk cascade 설정으로 my_plant_image 테이블 내용도 자동 삭제됨.
        myPlantMapper.delete(userPlantId);

        // 2. gcp 삭제
        myPlantImageService.deleteImage(userPlantId);
    }

    // 목록 조회 - 이미지 1장
    public List<MyPlantResponseDTO> getListByUserUid(String userUid) {
        return myPlantMapper.getListByUserUid(userUid);
    }

    // 단건 기본정보 조회 (상세 용)
    public MyPlantResponseDTO getByPlantId(int userPlantId) {
        return myPlantMapper.getByPlantId(userPlantId);
    }
}
