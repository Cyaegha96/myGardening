package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListImageDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PotListImageMapper {
    List<PotListImageDTO> getImagesByPotListingId(int id);

    void insertImage(@Param("id") int id, @Param("url") String url);

    void deleteImageById(int id);

    String getImageById(int id);
}
