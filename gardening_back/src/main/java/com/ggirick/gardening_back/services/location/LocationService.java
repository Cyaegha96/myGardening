package com.ggirick.gardening_back.services.location;

import com.ggirick.gardening_back.dto.location.DistrictDTO;
import com.ggirick.gardening_back.dto.location.NeighborhoodDTO;
import com.ggirick.gardening_back.dto.location.ProvinceDTO;
import com.ggirick.gardening_back.loader.LawCodeCsvLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LawCodeCsvLoader loader;

    public List<ProvinceDTO> getAllLocations() {

        List<ProvinceDTO> provinceDTOList = new ArrayList<>();

        for (LawCodeCsvLoader.Location prov : loader.getProvinces()) {

            ProvinceDTO provinceDTO = new ProvinceDTO();
            provinceDTO.setCode(prov.getCode());
            provinceDTO.setName(prov.getName());

            List<LawCodeCsvLoader.Location> districtList = loader.getDistricts(prov.getName());
            List<DistrictDTO> districtDTOs = new ArrayList<>();

            for (LawCodeCsvLoader.Location dist : districtList) {

                DistrictDTO districtDTO = new DistrictDTO();
                districtDTO.setCode(dist.getCode());
                districtDTO.setName(dist.getName());

                List<LawCodeCsvLoader.Location> neighborhoods =
                        loader.getNeighborhoods(prov.getName(), dist.getName());

                List<NeighborhoodDTO> neighborhoodDTOs = new ArrayList<>();

                for (LawCodeCsvLoader.Location nb : neighborhoods) {
                    NeighborhoodDTO nd = new NeighborhoodDTO();
                    nd.setCode(nb.getCode());
                    nd.setName(nb.getName());
                    neighborhoodDTOs.add(nd);
                }

                districtDTO.setNeighborhoods(neighborhoodDTOs);
                districtDTOs.add(districtDTO);
            }

            provinceDTO.setDistricts(districtDTOs);
            provinceDTOList.add(provinceDTO);
        }

        return provinceDTOList;
    }
}
