package com.ggirick.gardening_back.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardPostDTO {
    private Long id;
    private String title;
    private String contents;
    private Integer viewCount;
    private Timestamp createdAt;
}
