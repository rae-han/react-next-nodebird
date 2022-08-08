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
위 두개를 합친게
git commit -am "create: prepare for aws"

git push origin main

# 소스코드 git 에 올린 이유
aws에 소스 코드를 보낼건데 aws에서 제공하는 툴로 ftp처럼 보낼수도 있고
깃을 통해서 소스코드 레포지토리를 통해서 다운을
보통은 후자로 하는 경우가 많다.

aws ec2로 돌아와서 인스턴스를 선택하고 연결을 누른다.

ssh 클라이언트 탭에 맨 아래 명령어를 복사한다.
키가 있는 곳(prepare 폴더(front, back의 상위 폴더))에서 명령어를 입력하고 yes를 입력한다.
그럼 우분투가 뜬다.

거기서 git clone 깃주소 를 한다.

# unutu에 노드 설치해야 한다.
ssh -i "react-nodebird.pem" ubuntu@ec2-3-37-86-6.ap-northeast-2.compute.amazonaws.com

리눅스 명령어
// 위에 3개는 혹시 모를 에러를 대비하기 위해 마지막 두개는 필수.
sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash --
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash --
sudo apt-get install -y nodejs

그 후 front 폴더 가서 npm i

# back 은 서버를 따로 띄워야해서 따로 해준다.
// front 와 주소가 미묘하게 다르다 
ssh -i "react-nodebird.pem" ubuntu@ec2-3-39-23-26.ap-northeast-2.compute.amazonaws.com

똑같이 해준다.
git clone https://github.com/rae-han/react-next-nodebird
sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash --
sudo apt-get install -y nodejs

그리고 back폴더에서 npm i

#
ec2에 IPv4 퍼블릭 IP가 만든 서버의 주소다
처음에 ec2에서 ssh https http 허용을 해줬는데 ssh허용을 해줬기에 위 작업을 할수 있는 것이다.

#
다시 프론트로 가서 npm run build 를 해준다.

ci/cd 귀찮다 젠킨스

스케일링 할때 명령어 다 적기 귀찮다 => 도커

# 서버에 mysql 설치
sudo apt-get install -y mysql-server - 8q버전

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'fogkswjd';

sudo su = root 계정으로 전환

mysql_secure_installation // 반드시 이거 하기 전에 sudo su

위에서 적은 비밀번호 입력하고
y
0 (실제는 2?)

mysql -uroot -p
비밀번호 설정한대로 됐는지 확인

나중에 비밀번호 한 번 더 바꿔줘야 한다.

#

package.json에
"start": "node app.js" 추가한다.
그 후 다시 서버에서 npm start 해준다.

sqlMessage: "Access denied for user 'root'@'localhost' (using password: YES)",

.env 가 안올라갔기 때문에 만들어줘야 한다.
vim .env
a나 i를 누르면 글자 입력 가능
a누르면 아래가 insert로 바뀐다.

다 입력하고 esc누르고
:wq ( 저장 후 종료 )

cat .env 로 파일 확인

root에서( sudo mysql_secure_installation 를 실행한 이후 해야할 것들 )
mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'fogkswjd';

npx sequelize db:create

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'fogkswjd';
FLUSH PRIVILEGES;

# back
app.js 포트번호 3065로는 외부에서 접근이 안된다
80은 허용돼 있으니까 80으로 바꿔주자.

# pm2
foreground process
터미널 끄면 같이 꺼짐
background process
터미널 꺼도 안 꺼짐

sudo node app $ <- 달러 붙이면 백그라운드 실행 가능

npm i pm2
"start": "sudo node app.js",
"start": "pm2 start app.js",

sudo npm start // 80번 포트라 sudo 붙여야한다.

pm2 monit 하면 pm2가 안깔려 있어서 안된다.

npx pm2 monit

npx pm2 kill 
// 다 끄기 아까 sudo 안붙여 줫다면 다시 켜야한다
// 왜냐면 80번 포트는 우분투로 접근 못하고 루트로만 해야한다

sudo npm start && npx pm2 monit // 안된다?

sudo npx pm2 kill
sudo npm start // npm i -g pm2
pm2 start app.js -f
sudo pm2 start app.js -f

pm2 명령어
logs 
logs --error
kill 종료
start 파일.js
reload all 전체 재 실행
list

sudo NODE_ENV=production pm2 start next -- start -p 80











