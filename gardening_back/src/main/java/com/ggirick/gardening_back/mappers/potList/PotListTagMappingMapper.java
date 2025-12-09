package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListImageDTO;
import com.ggirick.gardening_back.dto.potList.PotListTagMappingDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PotListTagMappingMapper {
    void insertTag(@Param("id") int potListingId, @Param("tagId") int plantTagId);

    List<PotListTagMappingDTO> getTagByPotListingId(@Param("potListingId") int potListingId);

    void deleteTagById(@Param("id") int id);
}
