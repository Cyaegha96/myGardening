package com.ggirick.gardening_back.services.terrarium;

import com.ggirick.gardening_back.dto.terrarium.TerrariumDTO;
import com.ggirick.gardening_back.mappers.terrarium.TerrariumMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TerrariumService {
    private final TerrariumMapper terrariumMapper;

    public int createTerrarium(TerrariumDTO terrariumDTO){
        terrariumMapper.insertTerrarium(terrariumDTO);
        return terrariumDTO.getId();
    }
    public TerrariumDTO getTerrariumById(int id){
        return terrariumMapper.getTerrariumById(id);
    }

    public List<TerrariumDTO> getAllTerrariums(){
        return terrariumMapper.getAllTerrariums();
    }

    @Transactional
    public void deleteTerrarium(int id){
        // 레이어 삭제
        terrariumMapper.deleteLayersByTerrariumId(id);

        // 이미지 삭제
        terrariumMapper.deleteImagesByTerrariumId(id);

        // 테라리움 삭제
        terrariumMapper.deleteTerrarium(id);
    }
}
