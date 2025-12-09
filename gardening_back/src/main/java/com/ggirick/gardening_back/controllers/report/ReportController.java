package com.ggirick.gardening_back.controllers.report;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.report.ReportResponse;
import com.ggirick.gardening_back.dto.report.ReportUpdateRequest;
import com.ggirick.gardening_back.entity.report.Report;
import com.ggirick.gardening_back.dto.report.ReportCreateRequest;
import com.ggirick.gardening_back.services.report.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ReportResponse createReport(
            @RequestBody ReportCreateRequest request,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
       return reportService.createReport(request, userInfo.getUid());

    }

    @GetMapping("/{id}")
    public ReportResponse getReport(@PathVariable Long id){
        return reportService.get(id);
    }

    @GetMapping
    public List<ReportResponse> getReports(){
        return reportService.getAll();
    }

    @PutMapping("/{id}")
    public ReportResponse updateReport(
            @PathVariable Long id, @RequestBody ReportUpdateRequest request){
        return reportService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id){
        reportService.delete(id);
    }
}