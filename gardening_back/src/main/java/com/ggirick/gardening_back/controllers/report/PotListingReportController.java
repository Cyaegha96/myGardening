package com.ggirick.gardening_back.controllers.report;
import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.report.PotListingReportCreateRequest;
import com.ggirick.gardening_back.services.report.PotListingReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/pot-listing-report")
@RequiredArgsConstructor
public class PotListingReportController {

    private final PotListingReportService service;

    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestBody PotListingReportCreateRequest request,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        return ResponseEntity.ok(
                service.createReport(request, userInfo.getUid())
        );
    }


}