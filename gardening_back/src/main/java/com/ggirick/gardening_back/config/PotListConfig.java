package com.ggirick.gardening_back.config;

public class PotListConfig {
    // 끌어올리기 간격
    public static final long BUMP_LIMIT_SECONDS = 3600 * 3;

    // 최대 이미지 개수
    public static final long MAX_IMAGES_COUNT = 10;

    // 최대 이미지 용량(10mb)
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    // 상세보기 작성자 다른 글 최대 갯수
    public static final long MAX_AUTHOR_OTHER_POSTS = 8;
}
