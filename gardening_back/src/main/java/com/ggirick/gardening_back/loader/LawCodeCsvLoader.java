package com.ggirick.gardening_back.loader;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Component
public class LawCodeCsvLoader {

    @Getter
    private final List<Location> provinces = new ArrayList<>();
    private final Map<String, List<Location>> districtsByProvince = new HashMap<>();
    private final Map<String, List<Location>> neighborhoodsByDistrict = new HashMap<>();

    private static final Map<String, String> PROVINCE_NAME_MAP = Map.ofEntries(
            Map.entry("서울특별시", "서울"),
            Map.entry("부산광역시", "부산"),
            Map.entry("대구광역시", "대구"),
            Map.entry("인천광역시", "인천"),
            Map.entry("광주광역시", "광주"),
            Map.entry("대전광역시", "대전"),
            Map.entry("울산광역시", "울산"),
            Map.entry("경기도", "경기"),
            Map.entry("충청북도", "충북"),
            Map.entry("충청남도", "충남"),
            Map.entry("전라남도", "전남"),
            Map.entry("경상북도", "경북"),
            Map.entry("경상남도", "경남")
    );

    @PostConstruct
    public void load() throws IOException {
        ClassPathResource csvPath = new ClassPathResource("data/koreanAddressData.csv");

        try (BufferedReader br = Files.newBufferedReader(csvPath.getFile().toPath())) {
            String line;
            br.readLine(); // header skip

            while ((line = br.readLine()) != null) {
                // 안전하게 split (빈 칸도 유지되도록)
                String[] arr = line.split(",", -1);

                String code = arr[0].trim();
                String provinceNameRaw = arr[1].trim();
                String districtNameRaw = arr[2].trim();
                String districtName = normalizeDistrictName(districtNameRaw);
                String neighborhoodName = arr[3].trim();
                String deleteDate = arr[7].trim(); // 삭제일자 컬럼

                // 삭제된 법정동은 제외
                if (!deleteDate.isEmpty()) {
                    continue;
                }

                // 시도명 축약 변환
                String provinceName = PROVINCE_NAME_MAP.getOrDefault(provinceNameRaw, provinceNameRaw);

                Location loc;

                // 1) 시도
                if (!provinceName.isEmpty() && districtName.isEmpty()) {
                    loc = new Location(code, provinceName);
                    if (containsByName(provinces, loc.getName())) {
                        provinces.add(loc);
                    }
                }

                // 2) 시군구
                else if (!districtName.isEmpty() && neighborhoodName.isEmpty()) {
                    districtsByProvince.computeIfAbsent(provinceName, k -> new ArrayList<>());
                    List<Location> targetList = districtsByProvince.get(provinceName);

                    loc = new Location(code, districtName);

                    if (containsByName(targetList, loc.getName())) {
                        targetList.add(loc);
                    }
                }

                // 3) 읍면동
                else if (!neighborhoodName.isEmpty()) {
                    String key = provinceName + "|" + districtName;
                    neighborhoodsByDistrict.computeIfAbsent(key, k -> new ArrayList<>());
                    List<Location> targetList = neighborhoodsByDistrict.get(key);

                    loc = new Location(code, neighborhoodName);

                    if (containsByName(targetList, loc.getName())) {
                        targetList.add(loc);
                    }
                }
            }

            // 1) 시/도 정렬
            provinces.sort(Comparator.comparing(Location::getName));

            // 2) 시/군/구 정렬
            for (List<Location> list : districtsByProvince.values()) {
                list.sort(Comparator.comparing(Location::getName));
            }

            // 3) 읍/면/동 정렬
            for (List<Location> list : neighborhoodsByDistrict.values()) {
                list.sort(Comparator.comparing(Location::getName));
            }
        }
    }

    private String normalizeDistrictName(String districtName) {
        if (districtName == null || districtName.isEmpty()) {
            return districtName;
        }

        // "고양시덕양구", "성남시분당구", "용인시수지구" 등 처리
        // "시"가 포함되어 있고 끝이 "구"로 끝나는 경우 분리
        if (districtName.contains("시") && districtName.endsWith("구")) {
            int idx = districtName.indexOf("시");
            if (idx != -1) {
                return districtName.substring(0, idx + 1); // "고양시", "성남시"
            }
        }

        // 나머지는 그대로
        return districtName;
    }

    private boolean containsByName(List<Location> list, String name) {
        return list.stream().noneMatch(l -> l.getName().equals(name));
    }

    public List<Location> getDistricts(String provinceName) {
        return districtsByProvince.getOrDefault(provinceName, List.of());
    }

    public List<Location> getNeighborhoods(String provinceName, String districtName) {
        String key = provinceName + "|" + districtName;
        return neighborhoodsByDistrict.getOrDefault(key, List.of());
    }

    @Getter
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class Location {
        private String code;
        private String name;
    }

    @Getter
    @AllArgsConstructor
    public static class ProvinceTree {
        private String code;
        private String name;
        private List<DistrictTree> districts;
    }

    @Getter
    @AllArgsConstructor
    public static class DistrictTree {
        private String code;
        private String name;
        private List<Location> neighborhoods;
    }
}
