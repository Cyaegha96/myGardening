package com.ggirick.gardening_back.mappers.dashboard;

import com.ggirick.gardening_back.dto.dashboard.DashboardPostDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DashboardMapper {
    List<DashboardPostDTO> getRecentPosts(
            @Param("uid") String uid,
            @Param("limit") int limit
    );
}