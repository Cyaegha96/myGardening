package com.ggirick.gardening_back.services.report;

import com.ggirick.gardening_back.dto.report.PlantInfoRequestCreateRequest;
import com.ggirick.gardening_back.dto.report.PlantInfoRequestResponse;
import com.ggirick.gardening_back.dto.report.PlantInfoRequestUpdateRequest;
import com.ggirick.gardening_back.entity.report.PlantInfoRequest;

import com.ggirick.gardening_back.entity.report.PlantInfoRequestFile;
import com.ggirick.gardening_back.repository.PlantInfoRequestFileRepository;
import com.ggirick.gardening_back.repository.PlantInfoRequestRepository;
import com.ggirick.gardening_back.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PlantInfoRequestService {
    private final PlantInfoRequestRepository repository;
    private final PlantInfoRequestFileRepository fileRepo;
    private final FileUtil fileUtil;


    public PlantInfoRequestResponse toResponse(PlantInfoRequest entity) {
        return PlantInfoRequestResponse.builder()
                .id(entity.getId())
                .scientificName(entity.getScientificName())
                .changes(entity.getChanges())
                .reviewerUid(entity.getReviewerUid())
                .reviewNote(entity.getReviewNote())
                .build();
    }

    public void updateEntity(PlantInfoRequest entity, PlantInfoRequestUpdateRequest dto) {
        entity.setScientificName(dto.getScientificName());
        entity.setChanges(dto.getChanges());
        entity.setReviewerUid(dto.getReviewerUid());
        entity.setReviewNote(dto.getReviewNote());
    }

    public PlantInfoRequestResponse createRequest(PlantInfoRequestCreateRequest dto,
                                                  List<MultipartFile> files,
                                                  String userUid) throws Exception {
        PlantInfoRequest req = PlantInfoRequest.builder()
                .scientificName(dto.getScientificName())
                .changes(dto.getChanges())
                .userUid(userUid)
                .status("pending")
                .build();
        PlantInfoRequest entity =  repository.save(req);

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {

                Map<String, String> info =
                        fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(),
                                "plant-info-request/" + entity.getId() + "/",
                                file);

                PlantInfoRequestFile fileEntity = PlantInfoRequestFile.builder()
                        .request(entity)
                        .oriName(info.get("oriName"))
                        .sysName(info.get("sysName"))
                        .url(info.get("url"))
                        .requestUserUid(userUid)
                        .build();

                fileRepo.save(fileEntity);
            }
        }

        return this.toResponse(entity);
    }

    public PlantInfoRequestResponse get(Long id) {
        PlantInfoRequest entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 요청이 존재하지 않습니다."));

        return this.toResponse(entity);
    }

    public List<PlantInfoRequestResponse> getAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }
    public PlantInfoRequestResponse update(Long id, PlantInfoRequestUpdateRequest request) {
        PlantInfoRequest entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 요청이 존재하지 않습니다."));
        this.updateEntity(entity, request);
        return this.toResponse(entity);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("이미 삭제되었거나 존재하지 않는 ID입니다.");
        }
        repository.deleteById(id);
    }

}
