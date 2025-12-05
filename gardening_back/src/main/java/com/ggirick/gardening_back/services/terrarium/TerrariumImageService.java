package com.ggirick.gardening_back.services.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumImageDTO;
import com.ggirick.gardening_back.mappers.terrarium.ImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TerrariumImageService {

    private final ImageMapper imageMapper;

    public void saveImage(TerrariumImageDTO image) {
        imageMapper.insertTerrariumImage(image);
    }

    public List<TerrariumImageDTO> getImages(int terrariumId) {
        return imageMapper.getImagesByTerrariumId(terrariumId);
    }
}
