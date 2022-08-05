import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>ZeroCho | NodeBird</title>
      </Head>
      {userInfo
        ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
              description="노드버드 매니아"
            />
          </Card>
        )
        : null}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  // getStaticProps와 getServersideProps의 차이는
  // 언제 접속해도 데이터가 바뀔일이 없으면 static을
  // 접속 상황에 따라 화면이 바껴야하면 serverside를 쓰면 된다.
  // 완전 정적인것만 써야하는줄 알았는데 변할 일이 적은 게시글 같은 것도 여기에 써도 된다고 한다.
  // 사실 근데 쓰기 힘들다.. 실시간 정보(상품 재고, 댓글, 글 수정)를 반영하지 못한다.
  console.log('getStaticProps');
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 8,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
