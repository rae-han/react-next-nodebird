import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Avatar, Button } from 'antd';

import { logoutRequestAction } from '../reducers/user'
import Link from "next/link";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector(({user}) => ({
    me: user.me,
    logOutLoading: user.logOutLoading
  }))
  const onLogout = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a>짹짹<br />{me.Posts.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로잉<br />{me.Followings.length}</a></Link></div>,
        <div key="followings"><Link href="/profile"><a>팔로워<br />{me.Followers.length}</a></Link></div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogout} loading={logOutLoading} >로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
