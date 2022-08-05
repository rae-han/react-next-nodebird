import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { END } from 'redux-saga'
import axios from 'axios';

import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import wrapper from "../store/configureStore";

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(state => state.post); // 취향이지만 최적화가 달라질 수 있다.

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   })
  // }, []);

  useEffect(() => {
    function onScroll() {
      console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      const scrollY = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      if(scrollY + clientHeight + 300 >= scrollHeight) {
        // console.log(hasMorePosts, !loadPostsLoading);
        // console.log(hasMorePosts && !loadPostsLoading);
        if(hasMorePosts && !loadPostsLoading) {
          // const lastId = mainPosts[mainPosts.length-1].id;
          // mainPosts 갯수가 0이면 에러가 난다.
          const lastId = mainPosts[mainPosts.length-1]?.id;

          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasMorePosts, loadPostsLoading, mainPosts])

  useEffect(() => {
    if(retweetError) {
      alert(retweetError)
    }
  }, [retweetError])

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map(post => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  // axios.defaults.headers.Cookie = cookie;
  // 이 부분이 서버 쪽으로 쿠키를 전달해주는 코드이다.
  // 서버사이드 랜더링할때 쿠키가 전달된다.
  // 이 부분은 서버쪽에서 실행되는 코드이므로 쿠키를 공유한다.
  // 이 문제를 막으려면?
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie) { // 서버 일대랑 쿠키가 있을때 라는 뜻.
    axios.defaults.headers.Cookie = cookie;
  }
  // 서버 일때랑 쿠키가 있을때 쿠키를 넣어주고 그런게 아니면 지워준단 뜻.


  // 이 부분이 home보다 먼저 실행된다.
  // context 안에 store가 들어있다.
  // console.log('context', context)

  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  })
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST
  })
  context.store.dispatch(END) // // 이건 사용 방법이 그냥 이렇다.
  await context.store.sagaTask.toPromise(); // 이건 사용 방법이 그냥 이렇다.
  // sagaTask는 store에 등록해둔 sagaTask이다.
});
// 단순히 이렇게 한다고해서 되는건 아니다
// 이때 나오는게 하이드레이트
// 근데 처음 적용할 때 me post가 안들어 가 있고.
// index 안에 index, user, post가 있다.
// index: { index, user, post } => { index, user, post }
// 그럼 먼가 구조가 잘못 됐다는 듯.
// => reducer/index.js

// 유저 정보가 정확하게 동작하지 않는 이유?
// credential, cors 문제
// credential 문제 때문에 쿠키가 정확하게 동작이 안된다.
// getServerSideProps는 서버가 아니라 프론트에서 실행된다.
// 저 윗부분들이 브라우저와 프론트 서버가 동시에 실행되는 부분이라면
// getServerSIdeProps같은 경우에는 프론트 서버에서만 실행되는 부분이다.
// 프론트와 백엔드가 도메인(포트)가 다르기 때문에
// 근데 아까 설정 해줬는데?
// 백엔드는 분명 설정을 했기 때문에 프론트에서 문제가 생긴게 아닐까?
// 원래는 쿠키를 브라우저가 직접 담아서 보내주는
// axios 요청 보낼때 헤더에 따로 설정 안해도 브라우저가 알아서 보내줬다.
// 서버사이드 랜더링의 주체는 프론트 서버고 브라우저에서 보내는 것이 아니라 프론트 서버에서 보낸다.
// 브라우저는 개입 조차 못한다.
// 왜냐면 getServerSideProps는 프론트 서버에서 실행되는 것이기 때문에.
// 서버에서 서버로 요청을 보내면 쿠키는 자동으로 보내주는 것이 아니다.
// 3:06

export default Home;
