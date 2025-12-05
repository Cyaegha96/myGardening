package com.ggirick.gardening_back.mappers.popularPlants;

import com.ggirick.gardening_back.dto.popularPlants.PopularPlantDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PopularPlantsMapper {
    List<PopularPlantDTO> getPopularPlants();
}
