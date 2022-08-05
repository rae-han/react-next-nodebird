import axios from "axios";
import { all, fork, call, take , put, takeEvery, takeLatest, takeLeading, throttle, delay } from 'redux-saga';

function logInAPI(data, a, b) { // 이건 제너레이터가 아니다.
  return axios.post('/api/login')
}

function* logIn(action) { 
  // 보내주는 데이터는 여기서 받을 수 있다. 
  // action.type, action.data
  try {
    // yield put({
    //   type: 'LOG_IN_REQUEST'
    // })
    // const result = yield call(logInAPI, action.data, 'a', 'b');
    delay(1000);
    // yield logInAPI(action.data) 이렇게 생기지 않고
    // 아래 동작들은 굳이 yield를 안붙여줘도 된다.
    // 이펙트들 앞에 일드를 붙여주는 이유가 테스트가 편하다.
    // const l = logIn({ type: 'LOG_IN_REQURE', data: { id: 'raehan@mail.com}})
    // l.next(); // call 실행
    // l.next(); // put 실행 이런 식으로 테스트 하기가 편하다.
    
    yield put({ // dispatch 한다고 생각하면 된다.
      type: 'LOG_IN_SUCCESS',
      // data: result.data,
    })
  } catch (error) {
    yield put({
      type: 'LOG_IN_FAILURE',
      ata: error.response.data
    })
  } // 성공 결과는 result.data, 실패 결과는 err.resopnse.data 에 닮겨있다.
}

// 마무리 흐름 정리
// (비유적으로 이벤트 리스너)들을 만들어주고 등록을 해주고 위에 함수를 실행시켜서..
function* watchLogIn() {
  // yield take('LOG_IN', logIn); // LOG_IN이라는 액션이 실행될때까지 기다리겠다. 만약 실행되면 뒤에 있는 함수를 실행하겠다.
  yield takeEvery('LOG_IN_REQURE', logIn); // 액션이 너무 많으면 저 위에 logIn 함수 부분의 REQUEST를 여기로 가져와서 액션 하나를 없애준다.
  // redux의 단점중 하나가 액셔이 많다는 것이기 때문에 줄이면 좋다.
}

function* watchLogOut() {
  // yield take('LOG_OUT');
  // yield takeEvery('LOG_OUT');
  yield takeLatest('LOG_OUT');
  // yield throttle('LOG_OUT');
}

function* watchAddPost() {
  yield take('ADD_POST');
}
// watch 붙은 것들은 이베트 리스너 같은 역할을 한다.
// 근데 yield의 치명적인 단점이 yield take의 치명적인 단점이 1회용이다.
// 만약 로그인 했다가 로그아웃 하면 이벤트 리스너가 사ㅏㄹ져서 로그인을 못한다.
// 그래서 white(true) 로 yield take를 감싸우면 된다.
// 대신 쓰는게 takeEvery yield takeEvery가 whilte문을 대신다.
// take는 동기 takeEvery는 비동기로 동작한다는 차이가 있다.
// takeLatest 는 실수로 두번 들어왔을때 앞에 실수로 누른건 무시되고 마지막 것만 알아서 실행시켜준다.
// 첫번째 것만 실행 시켜줄땐 takeLeading 하지만 takeLatest가 더 많이 쓰인다.
// takeLatest 는 요청이 이미 완료 됐다면 그냥 완료된 채로 다음걸 실행 되고 동시에 로딩 중인 경우만(pending 상태일때) 앞에꺼가 취소되는 것이다.
// takeLatest 는 프론트에서만 인지하고 있는 것이다. 응답만 취소하는 것이다 요청까지 취소하는 것이 아니다. 
// 이때 사용 하는 것이 throttle
// 하지만 주로 takeLatest를 사용하고 중복된건 서버에서 막아주는게 좋다.

// 스크롤 같은게 throttle, 검색할때 자동완성 같은게 debounce
// 쓰로틀링: 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
// 디바운싱: 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것

export default function* rootSaga() {
  yield all([ // all은 배열을 받는데 안에 있는 것들을 하번에 실행해준다.
    fork(watchLogIn), // fork는 함수를 실행한단 뜻. // call도 함수를 실행하는 것. // all은 그런 것들을 동시에 해준다.
    // fork는 비동기 call은 동기로 작동한다. fork로 요청하면 요청 보내버리고 블록킹 하지 않고(논블록킹)바로 다음 코드가 실행된다.
    fork(watchLogOut),
    fork(watchAddPost),
  ])
}