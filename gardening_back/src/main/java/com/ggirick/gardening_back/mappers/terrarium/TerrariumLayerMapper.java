package com.ggirick.gardening_back.mappers.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumLayerDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TerrariumLayerMapper {
        void insertLayer(TerrariumLayerDTO terrariumLayerDTO);
        List<TerrariumLayerDTO> getLayers(@Param("terrariumId")int terrariumId);

}
