package com.ggirick.gardening_back.dto.potList;

import com.ggirick.gardening_back.enums.potList.PotListType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListInsertDTO {
    @Schema(description = "시퀀스")
    int id;
    @Schema(description = "제목")
    String title;
    @Schema(description = "내용")
    String description;
    @Schema(description = "작성자")
    String writerUid;
    @Schema(description = "글 종류(팝니다, 삽니다)")
    PotListType type;
    @Schema(description = "가격")
    Integer price;
    @Schema(description = "거래 장소")
    String location;
    @Schema(description = "썸네일 url")
    String thumbnail;

    @Schema(description = "등록하는 이미지 중, 썸네일로 사용할 index")
    int thumbnailIndex;
    @Schema(description = "설정 태그 목록")
    List<Integer> tags;
}
