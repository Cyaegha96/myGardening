package com.ggirick.gardening_back.services.potList;

import com.ggirick.gardening_back.dto.potList.PotListImageDTO;
import com.ggirick.gardening_back.dto.potList.PotListInsertDTO;
import com.ggirick.gardening_back.dto.potList.PotListPatchDTO;
import com.ggirick.gardening_back.dto.potList.PotListTagMappingDTO;
import com.ggirick.gardening_back.services.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PotListProcessService {
    private final FileService fileService;
    private final PotListService potListService;
    private final PotListImageService potListImageService;
    private final PotListTagMappingService potListTagMappingService;

    // 분양글 작성에 따른 흐름
    @Transactional
    public void insertPotProcess(List<MultipartFile> images, PotListInsertDTO insertInfo) throws Exception {
        int potListSeq = potListService.getPotListSeqNextVal();

        // 분양글 등록
        insertInfo.setId(potListSeq);
        potListService.insertPot(insertInfo);

        if (images != null) {
            List<String> imagesInfo = insertImagesAndGetThumbnail(potListSeq, images);
            PotListPatchDTO patchInfo = PotListPatchDTO.builder().id(insertInfo.getId()).build();

            patchInfo.setThumbnail(insertImages(potListSeq, imagesInfo, insertInfo.getThumbnailIndex()));
            potListService.updatePotById(potListSeq, patchInfo, false, false);
        }

        for (int tag : insertInfo.getTags()) {
            potListTagMappingService.insertTag(potListSeq, tag);
        }
    }

    // 분양글 수정에 따른 흐름
    @Transactional
    public void updatePotProcess(int id, List<MultipartFile> images, List<Integer> deleteImageIdList, PotListPatchDTO patchInfo) throws Exception {
        // 기존 이미지 중, 삭제된 이미지 제거
        if(deleteImageIdList != null && !deleteImageIdList.isEmpty()) {
            for (Integer deleteImageId : deleteImageIdList) {
                if (deleteImageId != null) {
                    fileService.deleteFile(potListImageService.getImageById(deleteImageId));
                    potListImageService.deleteImageById(deleteImageId);
                }
            }
        }

        if (images != null) {
            List<String> imagesInfo = insertImagesAndGetThumbnail(id, images);

            patchInfo.setThumbnail(insertImages(id, imagesInfo, patchInfo.getThumbnailIndex()));
        }
        potListService.updatePotById(id, patchInfo, false, false);

        // 태그 매핑 최신화
        List<PotListTagMappingDTO> existingTagIdList = potListTagMappingService.getTagByPotListingId(id);

        List<Integer> existingTagIds = existingTagIdList.stream()
                .map(PotListTagMappingDTO::getPlantTagId)
                .toList();

        List<PotListTagMappingDTO> tagsToDelete = existingTagIdList.stream()
                .filter(existingId -> !patchInfo.getTags().contains(existingId.getId()))
                .toList();

        for (PotListTagMappingDTO tag : tagsToDelete) {
            potListTagMappingService.deleteTagById(tag.getId());
        }

        List<Integer> tagsToAdd = patchInfo.getTags().stream()
                .filter(newId -> !existingTagIds.contains(newId))
                .toList();

        for (int tagId : tagsToAdd) {
            potListTagMappingService.insertTag(id, tagId);
        }
    }

    // 이미지 등록 및 공개 url목록 가져오기
    public List<String> insertImagesAndGetThumbnail(int id, List<MultipartFile> images) throws Exception {
        List<String> urlList = new ArrayList<>();

        for (MultipartFile image : images) {
            Map<String, String> fileInfo = fileService.uploadFile(image, "potList/" + id + "/");
            urlList.add(fileInfo.get("url"));
        }

        return urlList;
    }

    // 이미지 db등록 및 썸네일 url 가져오기
    public String insertImages(int id, List<String> urlList, int thumbnailIndex) {
        for (String url : urlList) {
            potListImageService.insertImage(id, url);
        }

        List<PotListImageDTO> imageList = potListImageService.getImagesByPotListingId(id);
        return imageList.get(thumbnailIndex).getUrl();
    }

    // 분양글 삭제에 따른 흐름
    @Transactional
    public void deletePotProcess(int id) {
        // gcp storage에 분양글 이미지 파일 삭제
        fileService.deleteFolder("potList/" + id + "/");

        // 분양글 삭제(DB 이미지는 종속 삭제)
        potListService.deletePotById(id);
    }
}
