package com.ggirick.gardening_back.services.plant;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ggirick.gardening_back.dto.plant.PlantInfoDTO;
import com.ggirick.gardening_back.dto.plant.PlantSearchRequestLogDTO;
import com.ggirick.gardening_back.mappers.plant.PlantMapper;
import com.ggirick.gardening_back.services.file.FileService;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class
PlantService {

    private final PlantMapper plantMapper;
    private static final String MODEL_NAME = "gemini-2.5-flash";

    private final ObjectMapper objectMapper;
    private final Client geminiClient;
    
    private final FileService fileService;

    public PlantInfoDTO getPlantInfo(String name) {

        return plantMapper.getPlantInfo(name);
    }

    @Value("${plantnet.api.key}") // 예시: application.properties에 plantnet.api.key=2b10hQU1Qz8dp82c7WCUuuMu
    private String API_KEY;
    private static final String BASE_URL = "https://my-api.plantnet.org/v2/identify/";
    private static final String PROJECT = "all";



    // OkHttpClient 인스턴스 (싱글톤으로 사용하는 것이 효율적)
    private final OkHttpClient httpClient = new OkHttpClient();

    /**
     * PlantNet API를 호출하여 식물의 bestMatch 이름을 가져옵니다.
     * @param sourcePath 식물 이미지 파일 경로
     * @param organ 식물 기관 (예: "flower")
     * @return bestMatch 이름이 담긴 Optional<String>
     */
    public Optional<String> identifyPlantName(String sourcePath, String organ) throws IOException {
        MediaType mediaType = MediaType.parse("image/jpeg");
        RequestBody imageRequestBody = null;
        String imageName = "uploaded_image.jpg";

        if (sourcePath.startsWith("http://") || sourcePath.startsWith("https://")) {
            // 1. 웹 URL 처리: OkHttp로 이미지 데이터를 다운로드합니다.
            Request imageDownloadRequest = new Request.Builder().url(sourcePath).get().build();

            try (Response imageResponse = httpClient.newCall(imageDownloadRequest).execute()) {
                if (!imageResponse.isSuccessful() || imageResponse.body() == null) {
                    System.err.println("이미지 다운로드 실패: " + imageResponse.code());
                    return Optional.empty();
                }
                // 다운로드된 이미지 데이터를 바이트 배열로 읽어 RequestBody 생성
                imageRequestBody = RequestBody.create(imageResponse.body().bytes(), mediaType);
                // URL에서 파일 이름 추출 시도 (복잡하므로 기본값 사용)
                imageName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);

            } catch (IOException e) {
                e.printStackTrace();
                throw new IOException("Failed to download image from URL: " + sourcePath, e);
            }

        } else {
            // 2. 로컬 파일 경로 처리
            File file = new File(sourcePath);
            if (!file.exists()) {
                return Optional.empty();
            }
            imageRequestBody = RequestBody.create(file, mediaType);
            imageName = file.getName();
        }

        if (imageRequestBody == null) {
            return Optional.empty();
        }

        // 3. OkHttp Request Body 구성 (Multipart)
        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("images", imageName, imageRequestBody) // 다운로드된 데이터 또는 로컬 파일 데이터 사용
                .addFormDataPart("organs", organ)
                .build();

        // 4. PlantNet API 호출 (기존 코드와 동일)
        String url = BASE_URL + PROJECT + "?api-key=" + API_KEY;
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        // 3. OkHttp 요청 실행 및 응답 처리
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseBody = response.body().string();
            System.out.println("API 응답: " + responseBody);

            // 4. JSON 파싱
            JsonNode root = objectMapper.readTree(responseBody);
            String bestMatch = root.path("bestMatch").asText();

            if (bestMatch == null || bestMatch.isEmpty()) {
                return Optional.empty(); // bestMatch가 없으면 빈 Optional 반환
            }

            return Optional.of(bestMatch);

        } catch (IOException e) {
            e.printStackTrace();
            throw e; // 호출한 곳에서 예외 처리
        }
    }

    /**
     * PlantNet API를 호출하여 식물의 bestMatch 이름을 가져옵니다.
     * @param imageFile 식물 이미지 파일 (MultipartFile)
     * @param organ 식물 기관 (예: "flower")
     * @return bestMatch 이름이 담긴 Optional<String>
     */
// ⭐ String sourcePath 대신 MultipartFile imageFile을 받도록 변경
    public PlantInfoDTO identifyPlantName(MultipartFile imageFile, String organ,String userUid) throws IOException {
        if (imageFile.isEmpty()) {
            return null;
        }

        // 1. MultipartFile에서 RequestBody 생성
        MediaType mediaType = MediaType.parse(imageFile.getContentType() != null ? imageFile.getContentType() : "image/jpeg");
        // ⭐ 파일의 바이트 배열을 직접 사용합니다.
        RequestBody imageRequestBody = RequestBody.create(imageFile.getBytes(), mediaType);
        String imageName = imageFile.getOriginalFilename() != null ? imageFile.getOriginalFilename() : "uploaded_image";

        // 2. OkHttp Request Body 구성 (Multipart)
        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                // ⭐ 파일의 바이트 배열로 생성한 RequestBody 사용
                .addFormDataPart("images", imageName, imageRequestBody)
                .addFormDataPart("organs", organ)
                .build();

        // 3. PlantNet API 호출 (기존 코드와 동일)
        String url = BASE_URL + PROJECT + "?api-key=" + API_KEY+"&include-related-images=true";
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();

        
        // 4. OkHttp 요청 실행 및 응답 처리
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                // 응답이 성공적이지 않을 경우 예외 발생

                return null;
            }

            String responseBody = response.body().string();
            System.out.println("API 응답: " + responseBody);

            // 5. JSON 파싱
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode bestMatchNode = root.path("bestMatch");


            // PlantNet API의 응답 구조에 따라 bestMatch가 없거나 null일 수 있습니다.
            if (bestMatchNode.isMissingNode() || bestMatchNode.isNull()) {
                return null; // bestMatch가 없으면 빈 Optional 반환
            }

            // 1. 최적 일치 학명 (Best Match) 추출
            String bestMatchName = root.path("bestMatch").asText();

            // 2. 관련 이미지 URL 추출 (첫 번째 결과, 첫 번째 이미지 기준)
            String imageUrl = null;

            JsonNode results = root.path("results");
            if (results.isArray() && results.size() > 0) {
                JsonNode firstResult = results.get(0); // 가장 확률 높은 첫 번째 결과
                JsonNode images = firstResult.path("images");

                if (images.isArray() && images.size() > 0) {
                    JsonNode firstImage = images.get(0); // 첫 번째 관련 이미지
                    JsonNode urlNode = firstImage.path("url"); // URL 객체

                    // 이미지 URL (중간 크기 'm'을 선호)
                    imageUrl = urlNode.path("m").asText();
                    if (imageUrl.isEmpty()) {
                        imageUrl = urlNode.path("s").asText(); // 'm'이 없으면 's' 사용
                    }
                }
            }

            // 추출된 정보 출력
            System.out.println("✅ 최적 일치 학명: " + bestMatchName);
            System.out.println("✅ 관련 이미지 URL: " + imageUrl);

            //검색 이력을 로그로 저장

            PlantSearchRequestLogDTO logDTO = PlantSearchRequestLogDTO.builder()
                    .apiResponse(responseBody)
                    .matchedScientificName(bestMatchName)
                    .userUid(userUid)
                    .build();

            plantMapper.insertPlantSearchRequestLog( logDTO);

            //해당 이미지 파일 비동기로 저장

            String uploadFolderPath = "plant/images/"; // GCS에 저장할 경로 지정
            fileService.uploadFileAsyncPlantInfoRequest(imageFile, uploadFolderPath, logDTO.getLogId() );


            if (bestMatchName.isEmpty()) {
                return null; // bestMatch가 비어있으면 빈 Optional 반환
            }
            

            return new PlantInfoDTO().builder().scientificName(bestMatchName).sampleImageUrl(imageUrl).build();

        } catch (IOException e) {
            e.printStackTrace();
            throw e; // 호출한 곳에서 예외 처리
        }
    }

    /**
     * 식별부터 DB 조회 대신 Gemini 호출까지의 전체 로직을 처리합니다.
     * @param imagePath 식물 이미지 파일 경로
     * @param organ 식물 기관
     * @return Gemini가 생성한 식물 상세 정보 (String)
     */
    public Optional<?> getPlantDetailFromImage(String imagePath, String organ) {
        try {
            // 1. PlantNet API 호출 및 bestMatch 학명 식별
            Optional<String> scientificNameOpt = identifyPlantName(imagePath, organ);

            if (scientificNameOpt.isEmpty()) {
                // 식별 실패 → Optional.empty() 반환
                return Optional.empty();
            }

            String scientificName = scientificNameOpt.get();

            // 2. DB 조회
            PlantInfoDTO dto = getPlantInfo(scientificName);
            if (dto != null) { return Optional.of(dto); } // DB에 있으면 DB 정보 반환

          

            // 3. Gemini에게 질문할 Prompt 구성
            String prompt = String.format(
                    "식물 학명 '%s'에 대한 상세 정보(특징, 생육 환경, 관리 방법)를 사용자가 이해하기 쉽게 한국어로 요약해 줘. https://worldofsucculents.com/,https://www.nature.go.kr/ 같이 신뢰성 있는 사이트를 참고해줘 ",
                    scientificName
            );

            // 4. Gemini API 호출
            //   String geminiResponse = generateTextFromTextInput(prompt);

            PlantInfoDTO plantInfoDTO = getPlantInfoFromGemini(prompt);
            plantMapper.insertPlantInfo(plantInfoDTO);
            // 5. Gemini 응답 반환
            return Optional.of(plantInfoDTO);

        } catch (IOException e) {
            System.err.println("API 호출 중 오류 발생: " + e.getMessage());
            return Optional.of("API 호출 중 서버 오류가 발생했습니다."); // API 호출 오류
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 식별부터 DB 조회 대신 Gemini 호출까지의 전체 로직을 처리합니다.
     * @param imageFile 식물 이미지 파일 (MultipartFile)
     * @param organ 식물 기관
     * @return Gemini가 생성한 식물 상세 정보 (PlantInfoDTO)를 감싼 Optional
     */
    public Optional<?> getPlantDetailFromImage(MultipartFile imageFile, String organ,String userUid) {
        try {
            // 1. PlantNet API 호출 및 bestMatch 학명 식별
            // ⭐ MultipartFile을 identifyPlantName으로 전달
            PlantInfoDTO plantInforesult = identifyPlantName(imageFile, organ,userUid);

            if (plantInforesult == null) {
                Map<String, Object> errorResponse = Map.of(
                        "statusCode", 404,
                        "message", "식별에 성공하지 못했습니다. 제대로 된 사진을 보내주세요."
                );
                return Optional.of(errorResponse);
            }


            String scientificName = plantInforesult.getScientificName();
            String imgUrl = plantInforesult.getSampleImageUrl();

            // 2. DB 조회
            PlantInfoDTO dto = getPlantInfo(scientificName);

            if (dto != null) {
                // DB에 있으면 DB 정보 반환
                dto.setSampleImageUrl(imgUrl);
                return Optional.of(dto);
            }

            // 3. Gemini에게 질문할 Prompt 구성
            String prompt = String.format(
                    "식물 학명 '%s'에 대한 상세 정보(특징, 생육 환경, 관리 방법)를 사용자가 이해하기 쉽게 한국어로 요약해 줘. https://worldofsucculents.com/,https://www.nature.go.kr/ 같이 신뢰성 있는 사이트를 참고해줘 ",
                    scientificName
            );

            // 4. Gemini API 호출 및 DB 저장
            PlantInfoDTO plantInfoDTO = getPlantInfoFromGemini(prompt);
            // ⭐ 학명을 DTO에 설정 (DB 저장 및 반환 시 사용)
            plantInfoDTO.setScientificName(scientificName);
            plantInfoDTO.setSampleImageUrl(imgUrl);
            plantMapper.insertPlantInfo(plantInfoDTO);

            // 5. Gemini 응답 (PlantInfoDTO) 반환
            return Optional.of(plantInfoDTO);

        } catch (IOException e) {
            System.err.println("API 호출 중 오류 발생: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "statusCode", 404,
                    "message", "API 호출 중 오류가 발생했습니다."
            );

            return Optional.of(errorResponse);
        } catch (Exception e) {
            // 기타 예상치 못한 오류
            System.err.println("예상치 못한 오류 발생: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                    "statusCode", 404,
                    "message", "API 호출 중 오류가 발생했습니다."
            );

            return Optional.of(errorResponse);
        }
    }

    public PlantInfoDTO getPlantInfoFromGemini(String scientificName) throws Exception {

        // (기존 generateTextFromTextInput 로직 유지)

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .candidateCount(1)
                        .responseJsonSchema(createPlantInfoSchemaMap())
                        .build();

        String prompt = String.format(
                "식물 학명 '%s'에 대한 상세 정보를 제공해. 응답은 오직 JSON 형식으로만 작성해야 하며, 요청된 모든 필드를 채워야 해.",
                scientificName // 입력받은 학명을 프롬프트에 사용
        );

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        MODEL_NAME,
                        prompt ,
                        config);

        String jsonText = response.text();

        // ⭐ 핵심: JSON 문자열을 PlantInfoDTO 객체로 매핑
        try {
            PlantInfoDTO dto = objectMapper.readValue(jsonText, PlantInfoDTO.class);
            return dto;

        } catch (IOException e) {
            // JSON 파싱 실패 시 처리 (Gemini가 스키마를 완벽히 지키지 못했을 때 발생 가능)
            System.err.println("JSON 파싱 오류: " + e.getMessage());
            throw new RuntimeException("Gemini 응답 JSON을 DTO로 변환 실패", e);
        }
    }


    public ImmutableMap<String, Object> createPlantInfoSchemaMap() {

        // 1. 모든 속성 (Properties) 정의
        // DTO의 필드명(camelCase)을 JSON 키로 사용합니다.
        ImmutableMap<String, Object> properties = ImmutableMap.<String, Object>builder()
                .put("scientificName", ImmutableMap.of("type", "string", "description", "식물의 학명입니다."))
                .put("commonName", ImmutableMap.of("type", "string", "description", "식물의 한국어 일반적인 이름입니다."))
                .put("family", ImmutableMap.of("type", "string", "description", "식물의 과(Family)입니다."))
                .put("genus", ImmutableMap.of("type", "string", "description", "식물의 속(Genus)입니다."))
                .put("origin", ImmutableMap.of("type", "string", "description", "식물의 원산지 또는 자생지입니다."))
                .put("environment", ImmutableMap.of("type", "string", "description", "식물의 최적 생육 환경에 대한 요약입니다. 200자 정도로 서술"))
                .put("light", ImmutableMap.of("type", "string", "description", "식물에게 필요한 빛의 정도입니다.200자 정도로 서술"))
                .put("temperatureHumidity", ImmutableMap.of("type", "string", "description", "적절한 온도 및 습도 정보입니다.200자 정도로 서술"))
                .put("watering", ImmutableMap.of("type", "string", "description", "물주기 방법 및 주기 요약입니다.200자 정도로 서술"))
                .put("soil", ImmutableMap.of("type", "string", "description", "선호하는 토양 종류 및 배합입니다.200자 정도로 서술"))
                .put("fertilizer", ImmutableMap.of("type", "string", "description", "비료주는 방법 및 시기입니다.200자 정도로 서술"))
                .put("potRepot", ImmutableMap.of("type", "string", "description", "화분 선택 및 분갈이(repot) 시기입니다.200자 정도로 서술"))
                .put("propagation", ImmutableMap.of("type", "string", "description", "식물 번식 방법입니다.200자 정도로 서술"))
                .put("pestsTips", ImmutableMap.of("type", "string", "description", "주요 해충 정보 및 방제 팁입니다.200자 정도로 서술"))
                .put("commonUses", ImmutableMap.of("type", "string", "description", "식물의 일반적인 용도입니다.200자 정도로 서술"))
                .put("culturalSignificance", ImmutableMap.of("type", "string", "description", "식물의 문화적 또는 역사적 의미입니다.200자 정도로 서술"))
                .put("description", ImmutableMap.of("type", "string", "description", "식물의 외형 및 특징에 대한 상세 설명입니다.200자 정도로 서술"))
                .build();

        // 2. 스키마 최상위 구조 정의
        ImmutableList<String> requiredFields = ImmutableList.of(
                "scientificName", "commonName", "family", "genus", "light", "watering"
        );

        return ImmutableMap.of(
                "type", "object",
                "properties", properties,
                // 필수 필드를 지정하여 Gemini가 반드시 이 항목들을 채우도록 유도합니다.
                "required", requiredFields
        );
    }

    /**
     * PlantNet API를 호출하여 식물의 bestMatch 이름을 가져옵니다. GCS에 저장 X
     * @param imageFile 식물 이미지 파일 (MultipartFile)
     * @param organ 식물 기관 (예: "flower")
     * @return bestMatch 이름이 담긴 Optional<String>
     */
    // ⭐ GCS 저장 없이 이미지 분석해서 내용만 가져옴.
    public Optional<String> identifyPlantImageOnly(MultipartFile imageFile, String organ,String userUid) throws IOException {
        if (imageFile.isEmpty()) {
            return Optional.empty();
        }

        // 1. MultipartFile에서 RequestBody 생성
        MediaType mediaType = MediaType.parse(imageFile.getContentType() != null ? imageFile.getContentType() : "image/jpeg");
        // ⭐ 파일의 바이트 배열을 직접 사용합니다.
        RequestBody imageRequestBody = RequestBody.create(imageFile.getBytes(), mediaType);
        String imageName = imageFile.getOriginalFilename() != null ? imageFile.getOriginalFilename() : "uploaded_image";

        // 2. OkHttp Request Body 구성 (Multipart)
        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                // ⭐ 파일의 바이트 배열로 생성한 RequestBody 사용
                .addFormDataPart("images", imageName, imageRequestBody)
                .addFormDataPart("organs", organ)
                .build();

        // 3. PlantNet API 호출 (기존 코드와 동일)
        String url = BASE_URL + PROJECT + "?api-key=" + API_KEY;
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody)
                .build();
        System.out.println("3");

        // 4. OkHttp 요청 실행 및 응답 처리
        try (Response response = httpClient.newCall(request).execute()) {

            System.out.println("응답 코드 = " + response.code());

            if (!response.isSuccessful()) {
                System.out.println("응답 실패 Body = " + response.body().string());
                return Optional.empty();
            }

            String responseBody = response.body().string();
            System.out.println("API 응답: " + responseBody);

            // 5. JSON 파싱
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode bestMatchNode = root.path("bestMatch");


            // PlantNet API의 응답 구조에 따라 bestMatch가 없거나 null일 수 있습니다.
            if (bestMatchNode.isMissingNode() || bestMatchNode.isNull()) {
                System.out.println(bestMatchNode);
                return Optional.empty(); // bestMatch가 없으면 빈 Optional 반환
            }

            String bestMatch = bestMatchNode.asText();
            System.out.println(bestMatch);

            if (bestMatch.isEmpty()) {
                System.out.println("bestMatch 비어있음" + bestMatch);
                return Optional.empty(); // bestMatch가 비어있으면 빈 Optional 반환
            }

            // 검색 이력을 로그로 저장
            PlantSearchRequestLogDTO logDTO = PlantSearchRequestLogDTO.builder()
                    .apiResponse(responseBody)
                    .matchedScientificName(bestMatch)
                    .userUid(userUid)
                    .build();
            System.out.println("ScientificName : " + bestMatch );
            plantMapper.insertPlantSearchRequestLog(logDTO);

            return Optional.of(bestMatch);

        } catch (IOException e) {
            e.printStackTrace();
            throw e; // 호출한 곳에서 예외 처리
        }
    }
}
