import { useRouter } from "next/router";
import wrapper from "../../store/configureStore";
import axios from "axios";
import {LOAD_POST_REQUEST} from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import {useSelector} from "react-redux";
import { END } from 'redux-saga';
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => (state.post));

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      {/*
        title = 탭
        description = 게시글 설명
        og - 카톡, 페북 공유했을때 미리보기 뜨는 것
        og:title
        og:description 설명
        og:image 이미지
        og:url 링크 눌렸을때 가는 주소
      */}
      </Head>
      {singlePost && <PostCard post={singlePost}></PostCard>}
    </AppLayout>
  )
}

// get serverside? static? props
// 대부분 서버사이드를 쓰면 된다.
// 특수한 경우에만 스태틱 프롭스를 쓴다.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie) {
    axios.defaults.headers.Cokkie = cookie;
  }
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id, // get*props에서는 context 안에 params, query 정보가 들어있다.
  })
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Post;