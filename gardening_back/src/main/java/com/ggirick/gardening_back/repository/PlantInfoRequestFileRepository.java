package com.ggirick.gardening_back.repository;

import com.ggirick.gardening_back.entity.report.PlantInfoRequestFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantInfoRequestFileRepository extends JpaRepository<PlantInfoRequestFile, Long> {
    List<PlantInfoRequestFile> findByRequestId(Long requestId);
}