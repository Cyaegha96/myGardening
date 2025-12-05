package com.ggirick.gardening_back.services.dashboard;

import com.ggirick.gardening_back.dto.dashboard.DashboardPostDTO;
import com.ggirick.gardening_back.mappers.dashboard.DashboardMapper;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final DashboardMapper dashboardMapper;

    public List<DashboardPostDTO> getRecentPosts(String uid, int limit) {
        return dashboardMapper.getRecentPosts(uid, limit);
    }
}
