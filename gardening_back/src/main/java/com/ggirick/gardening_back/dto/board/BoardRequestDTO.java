package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardRequestDTO {
    @Schema(description = "글 번호", example = "1")
    private int id;

    @Schema(description = "글 제목", example = "title")
    private String title;

    @Schema(description = "글 내용", example = "contents")
    private String contents;

    @Schema(description = "공지 여부", example = "Y/N")
    private boolean isNotification;

    @Schema(description = "태그 목록", example = "관엽식물/난이도쉬움")
    private List<String> tags;

    @Schema(description = "수정시 이미지 ID 목록", example = "1,3,4")
    private List<Integer> keepFileIds; // 수정 시 유지할 이미지 ID 목록
}
