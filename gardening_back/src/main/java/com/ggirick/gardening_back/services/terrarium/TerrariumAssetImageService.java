package com.ggirick.gardening_back.services.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumAssetImageDTO;
import com.ggirick.gardening_back.mappers.terrarium.ImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TerrariumAssetImageService {
    private final ImageMapper imageMapper;

    public List<TerrariumAssetImageDTO> getAllAssets(String category){
        return imageMapper.getAllAssets(category);
    }
}
