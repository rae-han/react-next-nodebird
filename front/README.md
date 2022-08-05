
npm i redux
npm i react-redux
npm i next-redux-wrapper

#

react 에서 태그 안에 style 속성을 이용해서 스타일 객체를 정의하면 안좋다.
왜냐면 자바스크립트에서는 {} === {} 는 false  이고
버추얼 돔으로 검사하면 인라인 스타일 부분에 있는 객체가 다르다고 판단하고 리렌더링 해버린다.
이럴때 사용하는게 styled component, @emotion/styled 와 같은 라이브러리.
but 집찰할 정도의 성능 향상은 아니다.

useCallback 은 함수를 캐싱, useMemo 는 값을 캐싱
즉 useMemo 로도 캐싱 가능하다.

함수형 컴포넌트에서 리렌더링 할때 함수 안 부분이 처음부터 끝까지 다시 실행되는것은 맞다.
useCallback, useMemo 같은 것은 캐싱이니 두번째 인자인 배열 안의 값이 바뀌지 않는 이상 같은 것으로 쳐주는데
return 안에서 바뀐 부분이 있다면 리턴 전체를 다시 그리는 것이 아니라 그 안에서도 바뀐 부분만 다시 그린다.

리액트에서 한번은 화면에 그려주고
리랜더링 됐을때 이전 컴포넌트와 지금 컴포넌트의 버추얼 돔을 비교하고 버추얼 돔에서 바뀐 부분을 리액트에 알려주고
그 부분만 다시 그린다.

### <a href="https://github/rae-han" target="_blank" rel="noreferrer noopener" ></a>

#

리랜더링이 된다고해서 무조건 성능에 문제가 되는게 아니다.
그냥 컴포넌트 자체(함수) 내부가 실행되는게 리렌더링인데 return 안의 값이 바뀌어야 실제로 화면을 다시 그린다.
리렌더링을 하면 화면을 다시 그리지 않지만 함수 자체를 실행된다.

크림 웹스토어
react developer tools
redux devTools
MobX Developer Tools

개발자 모드에서
컴포넌트 메뉴가 생긴다. 그 안에 들어가면 개발자가 만든 그대로의 컴포넌트가 보인다.
세팅가서 하이라이트 덥데이트 웬 컴포넌트~ 하면 리렌더링 되는게 보인다.

http://www.xgif.cc/gif/severallankyblackfish/

#

hook 은 컴포넌트 안에 뎁스가 1일때만 사용 가능한데 유일한 예외가 커스텀 훅을 만들때이다.

#

리덕스 몹엑스 가볍다면 컨텍스트API 그래프큐엘

리덕스 에러 날 일 없음. 간단해서.
코드량이 많아진다.

몹엑스는 코드는 줄지만 실수 했을때 트랙킹이 어렵다.

컨텍스트API vs 나머지
컨텍스트API는 비동기를 제대로 지원 안한다.
비동기 3단계
데이터 보내줘 요청, 성공, 실패

#

리덕스의 원리
리듀스에서 이름을 따왔다.

데이터 중앙 저장소가 있다고 치자
{
  name: 'raehan',
  age: 30,
  password: 'password',
  posts: [],
} - 중앙 저장소

데이터를 삽입, 수정, 삭제 해야하는데 데이터를 바꾸려면 액션을 통해서 한다.
{
  type: 'CHANGE_NAME',
  data: 'hanrae',
}

이 액션을 디스패치 하면 중앙 저장소가 바뀐다.
dispatch(action_object);

이렇게 바꾸면 중앙 저장소 데이터를 쓰는 모든 뷰가 데이터를 바꾼다.

----
여기서 생략된게 리듀서 라는 개념
액션을 디스패치한다고해서 자바스크립트에서 알아서 네임을 raehan 에서 hanrae로 바꾸는 것이 아니다.
자바스크립트에서는 이해를 못한다.
그래서 개발자가 일일히 어떻게 바꿔야 하는지 적어줘야한다 리듀서에서.

switch(action.type) {
  case 'CHANGE_NAME':
    return {
      ...state,
      name: action.data,
    }
  (...)
}

결국 리듀서에 적어준 대로 바뀐다.
단점이 데이터 하나 처리할때도 저장소에 추가하고 여러가지 액션과 리듀서가 필요하다.
특히 스위치문이 엄청 길어진다.
장점이 액션 하나하나가 리덕스에 기록이 돼서 버그 잡기가 편하다.
그리고 히스토리가 쭈르륵 있으면 거꾸로 거슬러 올라갈수 있다.(시간 여행, 타임머신)

액션을 직접 만들어주는 이유는 기록에 남기기 위해서.
스위치에서 리턴을 저런식으로 하는 이유는 불변성을 위해서
{} === {} // false - 이렇게 해야 변화를 감지하고 변경 내역이 추적된다.
const a = {};
const b = a;
a === b // true

리덕스가 아닌 리액트 자체에서도 불변성이 중요하다.

const prev = { name: 'raehan' };
const next = { name: 'newName' };

1. 위에서 객체를 새로 만들어서 next 값을 선언했다면 prev로 쉽게 갈수 있다.
2. const next = prev; next.name = 'newName' 으로하면 prev 값도 의도치 않게 변경 된다.

전체 안적고 ...state 를 하는 이유는 타자도 길어지지만 메모리를 아끼기 위해서.
예를들면
{
  ...state,
  name: action.data,
}

를 하면 name 을 제외한 나머지는 참조 관계를 유지하면서 데이터를 가져오지만 
아예 객체를 처음부터 새로 만들면 똑같이 객체를 새로 만드는 것이지만 액션 하나마다 새로운 객체가 계속 생겨서 메모리를 많이 잡아먹는다.
{ a: 'b' } === { a: 'b' } 까지 굳이 false가 나올 필요는 없다.

개발모드일때는 메모리 정리가 안된다.
왜냐하면 히스토리를 모두 가지고 있기 때문에.
배포에서는 계속적으로 메모리 정리를 해준다.

객체에서 가장 겉의 껍데기가 다르면 서로 다른 데이터라 생각을 하기 때문에 안쪽 데이터들은 재사용을 해줘도 된다.

비구조화 할당(...data) 를 하면 새로 만들어지는 것이 아니다.

const store = createStore(rootReducer);
store 는 state와 reducer를 포함하는 개념

# redux middleware

npm i @redux-devtools/extension

hydrate가 생긴 이유
get initialProps가 거의 안생기고 get staticProps와 get server side props로 바껴서 서버사이드 랜더링이 기존과 달라졌다.

#

// ` 는 자바스크립트 문법
// func() 도 함수 호출이지만 func``도 함수 호출이다.
// styled.div 가 함수이다.
// 그렇다고 일반 함수와 완전히 동일하게 호출하진 않는다.
// 태그드 템플릿 리터럴 - 백틱이 템플릿 리터럴

#

transform 안에 position fixed를 사용하면 적용되지 않는 유명한 버그가 있다.

#

https://regexr.com

how to find hashtag with split

#

뭔가 반복을 할때 무조건 key를 붙여줘야 하는데 그때 Index 값을 사용하지 안흔ㄴ게 좋다.

# redux middleware
리덕스의 기능을 향상

thunk - 프로그래밍 용어
지연된 함수

1개의 액션에 디스패치를 여러번
1개의 비동기에 여러 동기 액션을 넣을수 있다.

# generator
무한의 이벤트 리스너 느낌? 무한을 표현 가능하다.

제너레이터와 이벤트 리스너와 비슷
이벤트 리스너가 특정 동작에 호출되는 것처럼
제너레이터는 ㅜext()를 했을때 함수가 호출된다.

#
로그인 폼에서 로그인 하면
로그인 리퀘스트 액션이 실행된다.
로그인 리퀘스트 액션은 왓치 로그인에 걸리고
로그인 함수가 실행된다.
그 와 동시에 리듀서에 로그인 리퀘스트가 실행된다.
리듀서와 사가의 리퀘스트가 동시에 실행된다고 생각하면 되는데 콘솔로그를 찍는다면 
로그인 실행되면 1초뒤에 로그인 석세스 되고
로그인 석세스 디스패취 되면 리듀서에서 해당 부분이 실행되고 미에 데이터가 들어가면서 이스 로그드인이 트루가되고
그럼 레이아웃이 로그인 폼에서 유저 프로필로 바뀐다.


# 새로운 eslint
```
npm i -D babel-eslint eslint-config-airbnb 
@babel/eslint-parser
eslint-plugin-import
eslint-plugin-react-hooks
eslint-plugin-jsx-a11y 
# 접근성
# 스프링 리더, 시각 장애인, 색맹을 위한.
```

# 불변성을 안지키려면 filter대신 splice를 사용하는 것이 맞다.



# 커스텀 웹팩을 쓰려면
next.config.js

# 파일 용량이랑 어떤 공통 분모가 있는지 알고 싶다?
npm i @next/bundle-analyzer

# front 환경 변수 설정
"build": "ANALYZE=true NODE_ENV=production next build"
하면 된다. 다만 윈도우에서 안되니...
npm i cross-env

# moment
moment locale tree shaking