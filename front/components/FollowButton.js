import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'

import { Button } from "antd";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector(({ user }) => ({
    ...user
  }));
  const isFollowing = me?.Followings.find((f) => f.id === post.User.id)

  const onClickButton = useCallback(() => {
    
    dispatch({
      type: isFollowing ? UNFOLLOW_REQUEST : FOLLOW_REQUEST,
      data: post.User.id
    })
  }, [isFollowing])

  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button 
      loading={followLoading || unfollowLoading}
      onClick={onClickButton}
    >
      { isFollowing ? 'Unfollow' : 'Follow' }
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
}

export default FollowButton;
