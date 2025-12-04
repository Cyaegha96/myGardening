package com.ggirick.gardening_back.mappers.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TerrariumMapper {

    int insertTerrarium(TerrariumDTO tDTO);
    TerrariumDTO getTerrariumById(int id);
    List<TerrariumDTO> getAllTerrariums();

    void deleteLayersByTerrariumId(int id);
    void deleteImagesByTerrariumId(int id);
    void deleteTerrarium(int id);
}
