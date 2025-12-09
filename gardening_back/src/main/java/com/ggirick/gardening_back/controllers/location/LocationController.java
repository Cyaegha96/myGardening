package com.ggirick.gardening_back.controllers.location;

import com.ggirick.gardening_back.dto.location.ProvinceDTO;
import com.ggirick.gardening_back.services.location.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/all")
    public ResponseEntity<List<ProvinceDTO>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
}
