import { HYDRATE } from "next-redux-wrapper"
import { combineReducers } from "redux";
// combineReducers 는 리듀서 합쳐주는 메서드

import user from './user';
import post from './post';
// 3-3. 분리 한걸 일단 가지고 온다.
import todo from './todo';
import calc from './calc';

const initialState = {
  name: 'raehan',
  age: 30,
  password: '1111',
  user: {
    isLoggedIn: false,
    user: null,
    signUpDate: {},
    loginData: {},
  },
  post: {
    
  }
}

// const changeName = {
//   type: 'CHANGE_NAME',
//   name: 'hanrae' 
// }
// name이 바뀔때마다 모든 액션을 만들어 두는건 불가능하다(사용자가 name을 어떻게 바꿀지 모른다.)
const changName = name => {
  return {
    type: 'CHANGE_NAME',
    name
  }
}
// store.dispatch(changeName) => store.dispatch(changeName('newName'))

// 3-1. 리듀서 분리하기
// 3-1. 각각 user, post와 관련된 state와 action 생성 함수, reducer를 각각의 파일로 옮겨준다.
// export const loginAction = data => {
//   return {
//     type: 'LOG_IN',
//     data,
//   }
// }

// export const logoutAction = () => {
//   return {
//     type: 'LOG_OUT',
//   }
// }

// const rootReducer = (state = initialState, action) => {
//   switch(action.type) {
//     case HYDRATE:
//       console.log('HYDRATE', action);
//       return { ...state, ...action.payload }
//     case 'CHANGE_NAME':      
//       return {
//         ...state,
//         name: action.name
//       }
//     // case 'LOG_IN':
//     //   return {
//     //     ...state,
//     //     user: {
//     //       ...state.user,
//     //       isLoggedIn: true,
//     //     }
//     //   }
//     // case 'LOG_OUT':
//     //   return {
//     //     ...state,
//     //     user: {
//     //       ...state.user,
//     //       isLoggedIn: false,
//     //     }
//     //   }
//     default:
//       return state; // 리듀서 초기화할때 이 부분이 실행이 되는데 default값이 없으면 undefined가 뜨고 에러가난다.
//   }
// }
// (이전 상태와 액션)을 통해서 다음 상태를 만드는 함수
// reducer가 축소라는 뜻이 있는데 2가지를 받아서 1개를 만들기 때문이다.
// const rootReducer = combineReducers({
//   index: (state = {}, action) => { // HYDRATE를 위해서 index 리듀서를 하나 추가 서버사이드 랜더링을 위해서.
//     switch (action.type) {
//       case HYDRATE:
//         console.log('HYDRATE', action);
//         return { ...state, ...action.payload };
//       default:
//         return state;
//     }
//   },
//   user,
//   post,
//   todo,
//   calc,
// })
// user와 post의 initialState는 combineReducers가 알아서 합처서 넣어준다.

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      // console.log('HYDRATE', action);
      return action.payload;
    default:
      // 이게 const rootReducer = combineReducers({ post, user }) 와 같다.
      // 이렇게 해야 루트 리듀서의 상태를 전체를 다 덮어 씌울수 있다.
      const combinedReducer = combineReducers({
        user,
        post,
        todo,
        calc,
      }) // user, post를 합친 리듀서 함수가 생긴다.
      return combinedReducer(state, action)
  }
}
// 근데 이 까지하면 요청만 같이 보낼뿐이다.
// 우리는 Request 뿐 아니라 Success까지 끝난 페이지를 불러와야 한다.
// 그때 써야하는게 END인데 자세한건 다시 index page로

export default rootReducer;
