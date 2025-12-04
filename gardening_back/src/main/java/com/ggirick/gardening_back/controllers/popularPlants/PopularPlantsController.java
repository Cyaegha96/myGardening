package com.ggirick.gardening_back.controllers.popularPlants;

import com.ggirick.gardening_back.dto.popularPlants.PopularPlantDTO;
import com.ggirick.gardening_back.services.popularPlants.PopularPlantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/popular")
@RequiredArgsConstructor
public class PopularPlantsController {
    private final PopularPlantsService ppServ;

    @GetMapping
    public List<PopularPlantDTO> getPopularPlants() {
        return ppServ.getPopularPlants();
    }
}
