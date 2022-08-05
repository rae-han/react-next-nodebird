import { all, fork, delay, take, takeLatest, takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

function* addTodo(action) {
  try {
    yield delay(1000);
    yield put({
      type: 'ADD_TODO_SUCCESS',
      todo: action.todo, 
    })
  } catch (err) {
    yield put({
      type: 'ADD_TODO_FAILURE',
      data: err.response.data
    })
  }
}

function* watchAddTodo() {
  yield takeLatest('todo/ADD_TODO', addTodo)
}

export default function* todoSaga() {
  yield all([
    fork(watchAddTodo)
  ])
}