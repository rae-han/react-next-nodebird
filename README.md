# CSS 서버사이드 렌더링
스타일드컴포넌트 서버사이드 렌더링이 필요함(근데 emotion은 해주는데.. 오류가 안남 뭐지)
babelrc 에 관련 설정을 적어준다. 완전한 해결책은 아니다.
displayName 은 외계어 같은 클래스 네임을 컴포넌트 네임으로 바꿔주는 것 - 보기 편해진다.
그리고 이걸 위해선 babel-plugin-styled-component 도 설치해야한다.
```
// .babelrc
{
  "presets": ["next/babel"],
  "plugins": [
    ["babel-plugin-styled-component", {
      "ssr": true,
      "displayName": true
    }]
  ]
}
```
그 후에 _app.js 의 상위 페이지인 _document.js 에 아래 내용을 추가하면 된다.
```
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }


```
추가로 polyfill.io 에서 
default와 es 체크한 걸 스크립트로 넣어주면 바벨보다 좀 더 가볍고 좋다.
<script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019%2Ces2020%2Ces2021%2Ces2022" />
이건 body start 태그와 Main 컴포넌트 사이에 넣어주면 된다.

# get static path
는 다이나믹 라우팅일때 사용한다.
다이나믹라우팅일때 겟 스테틱 프롭스를 사용하면 무조건 같이 사용해야한다.
이때 다이나믹 페이지는 미리 뭘 만들어야할지 모른다.

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } }, 
    ],
    fallback: true,
  }
}
// id가 1, 2, 3인 post/1~3 을 미리 만들어주고 4번부턴 에러난다.
// 그렇다면 axios같이 비동기 이용하여 미리 만들어야 할 모든 페이지를 다 불러와서 paths값에 넣어준다.
// 사실 말도 안된다. 이렇게 할거면 그냥 getSSP 쓰자.
// 개인 블로그 같은 곳에서는 유용할지도/?
// ----
// fallback을 트루로하면 저기 적혀있지 않은게 있어도 에러가 안뜬다.
// 대신 서버사이드 렌더링이 안되는데 이걸 아래 코드로 클라이언트 랜더링을 할수 있게 잠깐 기다려주는 코드가 있다.
if (router.isFallback) {
  return <div>loading...</div>
}



```
export const getStaticProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  console.log('getState', context.store.getState().post.mainPosts);
  return { props: {} };
});

# date lib
moment에서 넘어가는 이유
date-fns - 불변성
dayjs - 데이터 용량

# npm run build in front
ci/cd
ㅂㅗ통 코드를 바꾸면 깃헙에 푸쉬를 하고 거기다 ci/cd 도구가 있는데 코드 테스트나 빌드 같은 것도 해준다.
중간에 에러 있으면 배포 실패했다고 알림을 보낸다.
ci/cd툴을 깃헙에 연결해두고 빌드 다 통과하면 중간에 아마존에 보내준다.
젠킨스, 트레디스ci, ?

# 파일 용량
빌드 했을때 페이지당 용량이 1메가 이하면 괜찮은데 넘어가면 코드 스플릿팅 적용 해야한다
리액트.레이지 서스펜스
람다는 서버사이드(겟 서버사이드)
검정 동그라이미는 스테틱 프롭스

# AWS 배포
- AWS는 99.99% 가동률을 보장

## 로그인
## console.aws.amazon.com
## 지역 - 서울

EC2 들어간다
인스턴스 시작 - 인스턴스 시작

애플리케이션 및 OS이미지에서 우분투 선택
인스턴스 유형에서 성능 선택
네트워크 설정 보완 그룹 생성
HTTP HTTPs 허용

새 키페어 생성
이름 적고 다운로드
잘 가지고 있어야한다.

인스턴스 시작만 있음 ㄱㄱ

이름 바꿔주소 인스턴스 상태 실행중 되면 

작업 누르고 기존 인스턴스를 기반으로 시작
난 없어서 작업 누르고 이미지 및 템플릿 누른 후 더 많은 뭐시기 함
그리고 이름 바꿔줌

# 깃헙
뉴 레포지토리
주소가 생긴다. - https://github.com/rae-han/react-next-nodebird
prepare 폴더에서 git init
git remote add origin https://github.com/rae-han/react-next-nodebird

git add .
git commit -m ""
git commit -am "create: prepare for aws"
