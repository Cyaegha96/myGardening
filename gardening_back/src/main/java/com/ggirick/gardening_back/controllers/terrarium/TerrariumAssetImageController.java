package com.ggirick.gardening_back.controllers.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumAssetImageDTO;
import com.ggirick.gardening_back.services.terrarium.TerrariumAssetImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assets")
public class TerrariumAssetImageController {
    private final TerrariumAssetImageService taiServ;

    @GetMapping
    public ResponseEntity<List<TerrariumAssetImageDTO>> getAllAssets(@RequestParam(required = false) String category){
        List<TerrariumAssetImageDTO> assets = taiServ.getAllAssets(category);
        return ResponseEntity.ok(assets);
    }
}
