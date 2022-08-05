# server, client 를 분리하는 이유 중 하나
스케일링을 할때 양쪽 요청이 비대칭일 수 있다
근데 한 묶음으로 늘리면 한쪽은 계속 놀게 될수 있다.
이때 분리하면 필요한 부분(ex. client)만 늘릴수 있다.
그리고 작은 컴퓨터 두대가 큰 컴퓨터 하나보다 싸다.

# 자주 쓰는 메소드
get 가져오다
post 생성하다
put 전체 수정 // 쓸일 적기 함
delete 제거
patch 부분 수정
option 찔러보기 (나 요청 보내도 돼?)
head 헤더만 가져오기 (헤더/바디)

# 시퀄라이즈
npm i sequelize sequelize-cli
npm i mysql2
npx sequelize init
init 해서 나온 config/config.json 파일 개발자 환경으로 설정

# mysql 시퀄라이즈 문서 다 적고 아래 에러 뜨면?
```
  code: 'ER_BAD_DB_ERROR',
    errno: 1049,
    sqlState: '42000',
    sqlMessage: "Unknown database 'react-nodebird'",
    sql: undefined
  },
  original: Error: Unknown database 'react-nodebird'
```

```
    npx sequelize db:create
```

# ERD 만들어두면 좋다.
젯브래인 데이터 그랩

# CORS 에러
CORS 에러는 브라우저에서 차단해서 생기는 것
하지만 개발자가 사용자의 브라우저를 건드는 것은 해킹이다.
서버에서 요청을 허용해주면 된다.
여러가지 방법이 있는데 아래 방법도 된다.
서버에서
```
    res.setHeader('Access-Control_Allow-Origin', '*');
```
또는 cors 라이브러리
또는 서버와 서버간 통신에는 CORS에러가 안난다.
브라우저에서 백앤드로 바로 요청을 하지 말고 브라우저에서 프론트 서버로 요청을 프론트에서 백 서버로 요청을 보내고 다시 차례대로 응답을 받는다.
그럼 포론트엔드 서버를 통해 요청/응답을 주고 받을수 있다.
이게 프록시이다.

# passport
passport는 온 갖 로그인(구글, 깃헙, 카카오, 네이버 등)전략을 하나로 그나마 쉽게 관리해준다.
passport-local은 이메일이나 사용자 아이디로 가입 할때 사용.

# 401
1. 허가되지 않은
2. 로그인 에러

# status
2xx 성공
3xx 리다이렉트 캐싱
4xx 클라이언트 에러
5xx 서버 에러

# cookie session passport
서버가 정보를 가지고 있고 클라이언트에서는 키 값 같은 것만 가지고 있는다.
passport.login 같은 곳에서 자동으로 키를 넣어준다?

근데 서버가 정보를 너무 많이 가지고 있으면 메모리를 먹기 때문에 아이디만 가지고 있는다.
즉 클라이언트 키 - 서버에서 클라이언트 키에 대한 키 - 그 키로 디비에서  정보를 가져온다.
나중에 세션 저장용 DB로 Redis같은 걸 쓴다.

req.login 이후 실행 되는 것이 passport.serializerUser

# 로그인 과정
1. 클라이언트에서 userLoginAPI를 통해서 데이터를 보내면
2. 서버의 route /user/login 에서 passport 전략을 실행하고
3. req.body에 있는 email, password 값이 전략을 정의한 대로 id, password로 들어가고
4. 전략이 실행되면서 email, password가 옳다면 done(null, user)가 되고
5. done 되는 순간 콜백이 실행되므로 passport.authenticate의 콜백 부분이 실행되고
6. err, info(각각 서버, 클라이언트의 에러)가 없다면 req.login(passport가 심어준 passport 로그인?)이 실행되고
7. passport 로그인 하면 passport.serializeUser가 실행되고 
8. 쿠키랑 유저 아이디만 서버에서 들고 있고(유저 전체 정보 x)
9. req.login안의 res.status(200).json(user)에 쿠키랑 사용자 정보를 프론트로 보내준다.
10. 브라우저 network탭에 login 요청 response headers를 보면 쿠키에 connect.sid가 있는데 그게 바로 유저의 정보를 가리키고 있는 쿠키이디ㅏ. 이걸 바탕으로 유저가 어떤 사람인지 판단한다.

추가로 passport.deserializerUser는 로그인이 성공하고나서 부터 
그 다음 요청부터 raehan으로 로그인 하면 특정 아이디(예를 들면 1번 아이디, serializer의 user.id)에 저장돼 있는데
connect.sid란 쿠키와 함께 다음 요청에 보내지는데
그때 그 요청(로그인 성공 후의 요청들)부터 deserializerUser가 매번 실행되면서
아이디로부터 사용자 정보를 디비를 통해서 복구를 한다.
그 다음 req.user 안에 넣어준다.
그렇다면 로그인 후에 만약 로그아웃을 한다고하면 로그인 후부터는 라우터 실행되기전 deserializerUser가 매번 실행되기 때문에
req.user에 정보가 들어가 있다.
사실 로그아웃 할때는 필요 없고 주로 글을 쓴다던가..
로그아웃은 req.logout()이나 req.session.destroy(); - 세션에 저장된 쿠키와 아이디 없애는 것

# sequilize
스퀄라이즈를 통해서 나오는 것은 정확히는 자바스크립트 객체로 클래스의 인스턴스라 내장 함수 같은게 있다.
이걸 json으로 바꿔주는게 true json 같은게 있긴 한데...

# passport
다른 passport들은 카카오나 페이스북 개발자 페이지 같은데 들어가면 있다.
로그인을 위한 앱을 만들고 세팅하면 된다.

# 자동 로그인
jwt같은걸 프론트에 영원히 보관하는 방법도 있고(보통 안전한 기기에서만 자동로그인을 하라 하기 때문)

### passport는 back이 노드여야만 한다 / oauth는? oauth2.0을 찾아보자.

localstorage로 자동 로그인 한다면 XSS 공격을 막아야한다.

# 로그인이 안된 이유
도메인이 다르면 cors 문제가 생기는 것처럼
도메인이 다르면 쿠키가 전달이 안된다. 근데 쿠키가 전달 돼야 백엔드 서버가 누가 요청 했는지 알수 있다.

방법은 여러가지
1. 프록시
2. cors 모듈 활용 -> credentials: true
    - 이건 프론트에서도 axios 모듈에 withCredentials: true 를 넣어줘야한다.

# 업로드 프로세스는 여러가지, 그 중
1. 폼 전송할 때 한번에 올려주는 방식
   - { content: '안녕', image: 0101010011001111.. }
   - 미리 보기 같은거 애매하다
   - 이미지 올리면 바로 업로드 되는 방식
   - 컨텐츠 업로드 후에야 리사ㅇ징, 머신 러닝을 돌릴수 있어서 처리시 시간이 걸린다.
2. 첫번째는 이미지만 선택해서 보낸다 { image: 010101... }
   - 파일 명을 리턴해준다.
   - 미리보기된다., 리사이징 이미지? 그리고 컨텐츠를 보내준다.

# 파일은 폴더나 어딘가 저장해두고 그 주소만 디비에 저장한다.
디비에 파일 자체를 저장하는 것이 아니다. 주소만 저장한다.
파일 자체를 넣으면 디비가 너무 무거워진다.
파일은 캐싱이 가능한데(cdn) 디비는 불가능하다. 속도 이점도 없다.
파일은 s3같은 클라우드에 올려서 캐싱을 적용하고 디비는 파일 주소만.





