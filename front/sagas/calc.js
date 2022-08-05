import { all, delay, fork, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { ADD_NUMBER_REQUEST, ADD_NUMBER_SUCCESS, ADD_NUMBER_FAILURE } from '../reducers/calc';

function* addNumber(action) {
  console.log(action)
  try {
    yield delay(1000);
    yield put({
      type: ADD_NUMBER_SUCCESS,
    })
  } catch (err) {
    yield put({
      type: ADD_NUMBER_FAILURE
    })
  }
}

function* watchAddNumber() {
  yield takeEvery(ADD_NUMBER_REQUEST, addNumber)
}

export default function* calcSaga() {
  yield all([
    fork(watchAddNumber)
  ])
}