package com.ggirick.gardening_back.dto.location;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProvinceDTO {
    private String code;
    private String name;
    private List<DistrictDTO> districts;
}

