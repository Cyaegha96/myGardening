package com.ggirick.gardening_back.dto.terrarium;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TerrariumLayerDTO {
    private int id;
    private int terrariumId;
    private String layerType;
    private String oriName;
    private String sysName;
    private String url;
    private int x;
    private int y;
    private int width;
    private int height;
    private int rotation;
    private int zIndex;
    private Timestamp createdAt;
}
