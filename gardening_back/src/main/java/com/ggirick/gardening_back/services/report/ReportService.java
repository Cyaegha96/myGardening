package com.ggirick.gardening_back.services.report;

import com.ggirick.gardening_back.dto.report.ReportResponse;
import com.ggirick.gardening_back.dto.report.ReportUpdateRequest;
import com.ggirick.gardening_back.entity.report.Report;
import com.ggirick.gardening_back.dto.report.ReportCreateRequest;
import com.ggirick.gardening_back.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;

    public ReportResponse toResponse(Report entity) {
        return ReportResponse.builder()
                .id(entity.getId())
                .targetId(entity.getTargetId())
                .targetType(entity.getTargetType())
                .reporterUid(entity.getReporterUid())
                .status(entity.getStatus())
                .reason(entity.getReason())
                .build();
    }

    public ReportResponse createReport(ReportCreateRequest dto, String reporterUid) {
        Report report = Report.builder()
                .reason(dto.getReason())
                .targetId(dto.getTargetId())
                .targetType(dto.getTargetType())
                .reporterUid(reporterUid)
                .status("pending")
                .build();

        Report entity =  reportRepository.save(report);
        return toResponse(entity);
    }

    public ReportResponse get(Long id) {
        Report report =  reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 신고를 찾을 수 없습니다."));

       return toResponse(report);
    }

    public List<ReportResponse> getAll() {
        return reportRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ReportResponse update(Long id, ReportUpdateRequest dto) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 신고를 찾을 수 없습니다."));

        report.setStatus(dto.getStatus());

        if (dto.getReason() != null) {
            report.setReason(dto.getReason());
        }

        Report entity =  reportRepository.save(report);

        return toResponse(entity);
    }


    public void delete(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new RuntimeException("해당 신고를 찾을 수 없습니다.");
        }
        reportRepository.deleteById(id);
    }
}
