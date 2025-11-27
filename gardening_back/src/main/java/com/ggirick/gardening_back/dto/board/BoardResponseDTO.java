package com.ggirick.gardening_back.dto.board;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(
        name = "BoardResponseDTO",
        requiredProperties = { "id", "title", "contents",
                "writerUid", "writerNickname", "createdAt",
                "updatedAt", "isNotification" }
)
public class BoardResponseDTO {
    // 목록 + 상세 공통
    @Schema(description = "글 번호", example = "1")
    private int id;
    @Schema(description = "글 제목", example = "몬스테라 질문")
    private String title;
    @Schema(description = "글 내용", example = "질문있습니다.")
    private String contents;
    @Schema(description = "대표 이미지", example = "https://.../thumbnail.jpg.")
    private String thumbnail;

    // 유저 정보
    @Schema(description = "작성자 아이디", example = "user001")
    private String writerUid;
    @Schema(description = "작성자 닉네임", example = "몬린이")
    private String writerNickname;
    @Schema(description = "작성자 프로필", example = "https://.../profile.jpg")
    private String writerProfileImage;
    @Schema(description = "작성자 자기소개", example = "식물덕후입니다.")
    private String writerBio;

    // counts
    @Schema(description = "팔로워 수", example = "120")
    private int followerCount;
    @Schema(description = "팔로잉 수", example = "45")
    private int followingCount;

    @Schema(description = "조회수", example = "111")
    private int viewCount;
    @Schema(description = "추천수", example = "222")
    private int likeCount;
    @Schema(description = "댓글수", example = "33")
    private int commentCount;

    // 작성, 수정 일자
    @Schema(description = "작성일자", example = "yyyy-mm-dd HH-MM-SS")
    private Timestamp createdAt;
    @Schema(description = "수정일자", example = "yyyy-mm-dd HH-MM-SS")
    private Timestamp updatedAt;

    // 기타
    @Schema(description = "공지여부", example = "Y/N")
    private String isNotification;
    @Schema(description = "올린 이미지", example = "이미지")
    private List<BoardFileDTO> files;
    @Schema(description = "게시글 태그 목록", example = "몬스테라/실내용")
    private List<String> tags;

    @Schema(description = "팔로우 여부", example = "true/false")
    private boolean isFollowed;
    @Schema(description = "좋아요 여부", example = "true/false")
    private boolean isLiked;
    @Schema(description = "북마크 여부", example = "true/false")
    private boolean isBookmarked;

}

