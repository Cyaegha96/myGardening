package com.ggirick.gardening_back.controllers.plant;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.plant.PlantInfoDTO;
import com.ggirick.gardening_back.services.file.FileService;
import com.ggirick.gardening_back.services.plant.PlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/plant")
public class PlantInfoController {

    @Autowired
    private PlantService plantService;


    @Operation(summary = "사진을 기반으로 식물을 추출합니다. 사진->식물 학명에는 Pl@ntNet Api가, 학명->식물 정보에는 Gemini가 사용됩니다. 학명이 이미 검색된 이력이 있는 경우라면 Gemini 에게 요청하지 않고 DB에서 뽑아옵니다.",
            description = "결과에 따라 다른 ResponseEntity를 반환한다. 식물이 인식된다면 식물 학명을 포함한 식물 정보를 PlantInfo 형태가 반환된다. ")
    @PostMapping("/identifyByImageUrls")
    public ResponseEntity<?> identifyPlantByPlantNet(@AuthenticationPrincipal UserTokenDTO userTokenDTO,
            @RequestBody(description = "@RequestBody를 위한 요청 데이터",
                                                     required = true,
                                                     content = @Content(
                                                                 mediaType = "application/json"
                    )) Map<String, Object> requestBody) {

        try {
            @SuppressWarnings("unchecked")
            List<String> imageUrls = (List<String>) requestBody.get("imageUrls");
            String organ = (String) requestBody.getOrDefault("organ", "flower");

            if (imageUrls == null || imageUrls.isEmpty()) {
                return new ResponseEntity<>("Image URLs must be provided.", HttpStatus.BAD_REQUEST);
            }

            // ⭐ 수정된 메서드 호출 (String 반환)
            Optional<?> geminiResultOpt = plantService.getPlantDetailFromImage(imageUrls.getFirst(), organ);

            // 3. 결과에 따른 ResponseEntity 반환
            if (geminiResultOpt.isPresent()) {
                // Gemini가 생성한 텍스트를 응답 본문에 담아 반환


                return ResponseEntity.ok(geminiResultOpt.get());
            } else {
                // 식별 실패 시, 서비스 내에서 이미 메시지를 Optional.of()로 감싸서 반환했을 가능성이 높음.
                // 여기서는 최종적으로 결과가 없을 경우 404를 반환하도록 처리
                return new ResponseEntity<>("식물 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("예상치 못한 서버 오류가 발생했습니다: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "사진을 기반으로 식물을 추출합니다. 파일 업로드를 사용합니다.",
            description = "결과에 따라 다른 ResponseEntity를 반환한다. 식물이 인식된다면 식물 학명을 포함한 식물 정보를 PlantInfo 형태가 반환된다. ")
    @PostMapping("/identifyByMultipartFiles") //
    public ResponseEntity<?> identifyPlantByPlantNetByFile(
            @AuthenticationPrincipal UserTokenDTO userTokenDTO,

            @RequestPart(value = "file", required = true) MultipartFile file,
            @RequestParam(value = "organ", defaultValue = "flower") String organ) {

        try {
            if (file == null || file.isEmpty()) {
                return new ResponseEntity<>("Image files must be provided.", HttpStatus.BAD_REQUEST);
            }


            Optional<?> result = plantService.getPlantDetailFromImage(file, organ, userTokenDTO.getUid());

            if (result.isPresent()) {
                Object body = result.get();
                if (body instanceof Map map && map.containsKey("statusCode")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
                }
                return ResponseEntity.ok(body);

            }else{
                return ResponseEntity.badRequest().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("예상치 못한 서버 오류가 발생했습니다: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/info/all")
    public  List<PlantInfoDTO> getAllPlantInfo() {
        return plantService.getAllPlantInfo();
    }

    @GetMapping("/info/scientific-name")
    public  List<PlantInfoDTO> getAllPlantInfoScientificName() {
        return plantService.getAllPlantInfoScientificName();
    }

//            @GetMapping("/tags")
//            public List<Integer> getAllPlantTags()  {
//
//                List<Integer> result=null;
//                try{
//                    result=  plantService.getPlantTagIds("Dionaea muscipula J.Ellis.","파리지옥");
//                }catch (Exception e){
//                    e.printStackTrace();
//                }
//
//                return result;
//            }

    @GetMapping("/test")
    public PlantInfoDTO getPlantInfoTest() throws Exception {
        return plantService.getPlantInfoFromGemini("Dionaea muscipula J.Ellis.");
    }

    @GetMapping("/home/list")
    public List<String> randomSearchRequestFile(){
        return plantService.randomSearchRequestFile();
    }
}
