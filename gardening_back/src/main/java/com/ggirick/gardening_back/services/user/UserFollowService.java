package com.ggirick.gardening_back.services.user;

import com.ggirick.gardening_back.dto.auth.UserInfoDTO;
import com.ggirick.gardening_back.dto.user.FollowRequestDTO;
import com.ggirick.gardening_back.dto.user.UserFollowDTO;
import com.ggirick.gardening_back.mappers.user.UserFollowMapper;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserFollowService {
    private final UserFollowMapper userFollowMapper;

    @Transactional
    public void follow(FollowRequestDTO request) {
        UserFollowDTO existing = userFollowMapper.findRelation(
                request.getFollowerUid(),
                request.getFollowingUid()
        );

        if (existing == null) {
            // 신규 팔로우
            userFollowMapper.insertFollow(request);
        } else {
            // 재활성화
            userFollowMapper.activateFollow(request);
        }
    }
    @Transactional
    public void unfollow(FollowRequestDTO request) {
        userFollowMapper.deactivateFollow(request);
    }

    public List<UserInfoDTO> getFollowers(String userUid) {
        return userFollowMapper.getFollowers(userUid);
    }

    public List<UserInfoDTO> getFollowings(String userUid) {
        return userFollowMapper.getFollowings(userUid);
    }
}
