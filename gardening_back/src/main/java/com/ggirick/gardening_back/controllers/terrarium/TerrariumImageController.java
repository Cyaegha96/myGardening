package com.ggirick.gardening_back.controllers.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumImageDTO;
import com.ggirick.gardening_back.services.terrarium.TerrariumImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/terrariumImage")
@RequiredArgsConstructor
public class TerrariumImageController {
    private final TerrariumImageService iServ;

    @PostMapping
    public ResponseEntity<Void> saveImage(@RequestBody TerrariumImageDTO image) {
        iServ.saveImage(image);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{terrariumId}")
    public ResponseEntity<List<TerrariumImageDTO>> getImages(@PathVariable int terrariumId) {
        return ResponseEntity.ok(iServ.getImages(terrariumId));
    }
}
