package com.ggirick.gardening_back.mappers.user;

import com.ggirick.gardening_back.dto.auth.UserInfoDTO;
import com.ggirick.gardening_back.dto.user.FollowRequestDTO;
import com.ggirick.gardening_back.dto.user.UserFollowDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserFollowMapper {
    UserFollowDTO findRelation(@Param("followerUid") String followerUid,
                               @Param("followingUid") String followingUid);

    int insertFollow(FollowRequestDTO request);

    int activateFollow(FollowRequestDTO request);

    int deactivateFollow(FollowRequestDTO request);

    List<UserInfoDTO> getFollowers(String userUid);

    List<UserInfoDTO> getFollowings(String userUid);
}
