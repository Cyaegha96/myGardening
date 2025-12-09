package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListReportInsertDTO;
import com.ggirick.gardening_back.mappers.potList.PotListReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PotListReportService {
    private final PotListReportMapper potListReportMapper;

    // 신고 하기
    public void reportPotById(int id, PotListReportInsertDTO reportInfo) {
        reportInfo.setPotListingId(id);
        potListReportMapper.reportPotById(reportInfo);
    }
}
