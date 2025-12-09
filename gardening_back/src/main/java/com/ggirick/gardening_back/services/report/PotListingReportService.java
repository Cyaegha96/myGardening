package com.ggirick.gardening_back.services.report;

import com.ggirick.gardening_back.dto.report.PotListingReportCreateRequest;
import com.ggirick.gardening_back.entity.report.PotListingReport;
import com.ggirick.gardening_back.repository.PotListingReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PotListingReportService {
    private final PotListingReportRepository repository;

    public PotListingReport createReport(PotListingReportCreateRequest dto, String reporterUid) {
        PotListingReport report = PotListingReport.builder()
                .potListingId(dto.getPotListingId())
                .reason(dto.getReason())
                .reporterUid(reporterUid)
                .status("pending")
                .build();

        return repository.save(report);
    }
}
