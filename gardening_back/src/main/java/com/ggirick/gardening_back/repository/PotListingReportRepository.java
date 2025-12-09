package com.ggirick.gardening_back.repository;

import com.ggirick.gardening_back.entity.report.PotListingReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PotListingReportRepository extends JpaRepository<PotListingReport, Long> {
}
