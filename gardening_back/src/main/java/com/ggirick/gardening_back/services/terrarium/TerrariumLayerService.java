package com.ggirick.gardening_back.services.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumLayerDTO;
import com.ggirick.gardening_back.mappers.terrarium.TerrariumLayerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TerrariumLayerService {
    private final TerrariumLayerMapper terrariumLayerMapper;

    public void saveLayer(TerrariumLayerDTO terrariumLayerDTO) {
       terrariumLayerMapper.insertLayer(terrariumLayerDTO);
    }

    public List<TerrariumLayerDTO> getLayers(int  terrariumId) {
       return terrariumLayerMapper.getLayers(terrariumId);
    }
}
