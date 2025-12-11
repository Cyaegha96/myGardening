package com.ggirick.gardening_back.mappers.plant;

import com.ggirick.gardening_back.dto.plant.PlantInfoDTO;
import com.ggirick.gardening_back.dto.plant.PlantInfoRequestFileDTO;
import com.ggirick.gardening_back.dto.plant.PlantSearchRequestFileDTO;
import com.ggirick.gardening_back.dto.plant.PlantSearchRequestLogDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PlantMapper {

    PlantInfoDTO getPlantInfo(@Param("scientificName") String scientificName);
     void insertPlantInfo(PlantInfoDTO plantInfoDTO);
    void insertPlantInfoRequestFile(PlantInfoRequestFileDTO plantInfoRequestFileDTO);
    void insertPlantSearchRequestFile(PlantSearchRequestFileDTO plantSearchRequestFileDTO);
    long insertPlantSearchRequestLog(PlantSearchRequestLogDTO plantSearchRequestLogDTO);
    List<PlantInfoDTO> getAllPlantInfo();
    void updatePlantSampleImage(@Param("scientificName")String scientificName, @Param("sampleImageUrl")String sampleImageUrl);
    List<PlantInfoDTO> getAllPlantInfoScientificName();
    List<String> randomSearchRequestFile();

    List<PlantInfoDTO> findPlants(int offset, int limit, String sortField, String sortOrder, Map<String, Object> filters);

    int countPlants(Map<String, Object> filters);

    // 부분 검색 지원
    List<PlantInfoDTO> findPlantsByKeyword(String keyword);
}
