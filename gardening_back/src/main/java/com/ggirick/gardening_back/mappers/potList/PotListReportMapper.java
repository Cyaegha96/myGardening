package com.ggirick.gardening_back.mappers.potList;

import com.ggirick.gardening_back.dto.potList.PotListReportInsertDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PotListReportMapper {
    // 분양글 찜
    void reportPotById(PotListReportInsertDTO reportInfo);
}
