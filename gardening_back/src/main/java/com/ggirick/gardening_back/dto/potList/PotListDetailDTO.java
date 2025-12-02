package com.ggirick.gardening_back.dto.potList;

import com.ggirick.gardening_back.enums.potList.PotListStatus;
import com.ggirick.gardening_back.enums.potList.PotListType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PotListDetailDTO {
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
    @Schema(description = "글 상태(거래 전, 거래 완료)")
    PotListStatus status;
    @Schema(description = "가격")
    Integer price;
    @Schema(description = "거래 장소")
    String location;
    @Schema(description = "썸네일 url")
    String thumbnail;
    @Schema(description = "조회수")
    int view_count;
    @Schema(description = "작성일")
    Timestamp createdAt;
    @Schema(description = "수정일")
    Timestamp updatedAt;
    @Schema(description = "끌어올리기 한 날짜")
    Timestamp bumpedAt;

    @Schema(description = "작성자 이름")
    String writerName;
    @Schema(description = "북마크(찜) 수")
    String bookmarkCount;
    @Schema(description = "활성된 채팅 수")
    String chatroomCount;
}
