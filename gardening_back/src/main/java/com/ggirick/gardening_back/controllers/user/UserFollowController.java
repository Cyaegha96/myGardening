package com.ggirick.gardening_back.controllers.user;

import com.ggirick.gardening_back.dto.auth.UserInfoDTO;
import com.ggirick.gardening_back.dto.user.FollowRequestDTO;
import com.ggirick.gardening_back.services.user.UserFollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/follow")
@RequiredArgsConstructor
public class UserFollowController {
    private final UserFollowService ufServ;

    @PostMapping
    public ResponseEntity<Void> follow(@RequestBody FollowRequestDTO request) {
        ufServ.follow(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> unfollow(@RequestBody FollowRequestDTO request) {
        ufServ.unfollow(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userUid}/followers")
    public ResponseEntity<List<UserInfoDTO>> getFollowers(@PathVariable String userUid) {
        return ResponseEntity.ok(ufServ.getFollowers(userUid));
    }

    @GetMapping("/{userUid}/followings")
    public ResponseEntity<List<UserInfoDTO>> getFollowings(@PathVariable String userUid) {
        return ResponseEntity.ok(ufServ.getFollowings(userUid));
    }
}
