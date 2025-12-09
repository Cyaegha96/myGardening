package com.ggirick.gardening_back.repository;

import com.ggirick.gardening_back.entity.report.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

}
