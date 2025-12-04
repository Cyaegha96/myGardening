package com.ggirick.gardening_back.controllers.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumDTO;
import com.ggirick.gardening_back.dto.terrarium.TerrariumLayerDTO;
import com.ggirick.gardening_back.services.terrarium.TerrariumLayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/layer")
@RequiredArgsConstructor
public class TerrariumLayerController {
    private final TerrariumLayerService tlServ;

    @PostMapping
    public ResponseEntity<Void> saveLayer(@RequestBody TerrariumLayerDTO terrariumLayerDTO) {
        tlServ.saveLayer(terrariumLayerDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{terrariumId}")
    public ResponseEntity<List<TerrariumLayerDTO>> getLayers(@PathVariable int terrariumId) {
        return ResponseEntity.ok(tlServ.getLayers(terrariumId));
    }
}
