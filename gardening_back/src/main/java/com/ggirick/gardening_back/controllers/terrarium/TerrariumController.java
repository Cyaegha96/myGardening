package com.ggirick.gardening_back.controllers.terrarium;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.terrarium.TerrariumDTO;
import com.ggirick.gardening_back.services.terrarium.TerrariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/terrarium")
@RequiredArgsConstructor
public class TerrariumController {
    private final TerrariumService tServ;

    @PostMapping
    public ResponseEntity<TerrariumDTO> createTerrarium(@RequestBody TerrariumDTO terrariumDTO, @AuthenticationPrincipal UserTokenDTO userTokenDTO) {
        System.out.println("테라리움 타이틀!!!!== " + terrariumDTO.getTitle());
        terrariumDTO.setUserId(userTokenDTO.getUid());
        int id = tServ.createTerrarium(terrariumDTO);
        terrariumDTO.setId(id);
        return ResponseEntity.ok().body(terrariumDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TerrariumDTO> getTerrarium(@PathVariable int id) {
        return ResponseEntity.ok(tServ.getTerrariumById(id));
    }

    @GetMapping("/terrariums")
    public ResponseEntity<List<TerrariumDTO>> getAllTerrariums(
            @RequestParam(required = false) Integer id
    ) {
        List<TerrariumDTO> terrariums = tServ.getAllTerrariums(id);

        if (id != null) {
            List<TerrariumDTO> filtered = terrariums.stream()
                    .filter(t -> t.getId() == id)
                    .toList();

            return ResponseEntity.ok(filtered);
        }

        return ResponseEntity.ok(terrariums);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTerrarium(@PathVariable int id) {
        tServ.deleteTerrarium(id);
        return ResponseEntity.noContent().build();
    }
}
