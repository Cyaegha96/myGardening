package com.ggirick.gardening_back.dto.report;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantInfoRequestUpdateRequest {

    @NotBlank(message = "학명은 필수입니다.")
    private String scientificName;

    @NotBlank(message = "변경사항은 필수입니다.")
    private String changes;

    private String reviewerUid;

    private String reviewNote;

}