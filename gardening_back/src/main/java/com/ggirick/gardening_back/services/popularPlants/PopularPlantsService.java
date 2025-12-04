package com.ggirick.gardening_back.services.popularPlants;

import com.ggirick.gardening_back.dto.popularPlants.PopularPlantDTO;
import com.ggirick.gardening_back.mappers.popularPlants.PopularPlantsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PopularPlantsService {
    private final PopularPlantsMapper popularPlantsMapper;

    public List<PopularPlantDTO> getPopularPlants() {
        return popularPlantsMapper.getPopularPlants();
    }
}
