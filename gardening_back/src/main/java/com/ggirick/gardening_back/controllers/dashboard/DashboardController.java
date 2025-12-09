package com.ggirick.gardening_back.controllers.dashboard;

import com.ggirick.gardening_back.dto.auth.UserTokenDTO;
import com.ggirick.gardening_back.dto.board.BoardResponseDTO;
import com.ggirick.gardening_back.dto.dashboard.DashboardPostDTO;
import com.ggirick.gardening_back.services.board.BoardService;
import com.ggirick.gardening_back.services.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dbServ;
    private final BoardService boardServ;


    @GetMapping("/{uid}/recent")
    public ResponseEntity<List<DashboardPostDTO>> getRecentPosts(
            @PathVariable String uid,
            @RequestParam(defaultValue = "3") int limit
    ) {
        return ResponseEntity.ok(dbServ.getRecentPosts(uid, limit));
    }

}
