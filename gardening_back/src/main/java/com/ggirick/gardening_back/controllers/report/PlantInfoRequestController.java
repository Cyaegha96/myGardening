package com.ggirick.gardening_back.controllers.report;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.report.PlantInfoRequestCreateRequest;
import com.ggirick.gardening_back.dto.report.PlantInfoRequestResponse;
import com.ggirick.gardening_back.dto.report.PlantInfoRequestUpdateRequest;
import com.ggirick.gardening_back.services.report.PlantInfoRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Validated
@RestController
@RequestMapping("/plant-info-request")
@RequiredArgsConstructor
public class PlantInfoRequestController {

    private final PlantInfoRequestService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PlantInfoRequestResponse createRequest(
            @RequestPart("request") PlantInfoRequestCreateRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) throws Exception {
        return service.createRequest(request, files, userInfo.getUid());
    }

    @GetMapping("/{id}")
    public PlantInfoRequestResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping
    public List<PlantInfoRequestResponse> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public PlantInfoRequestResponse update(
            @PathVariable Long id,
            @RequestBody PlantInfoRequestUpdateRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}