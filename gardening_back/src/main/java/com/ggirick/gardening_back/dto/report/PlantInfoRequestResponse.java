package com.ggirick.gardening_back.dto.report;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantInfoRequestResponse {
    private Long id;
    private String scientificName;
    private String changes;
    private String reviewerUid;
    private String reviewNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
