import axios from 'axios';
import { delay, put, takeLatest, all, fork, call, throttle } from 'redux-saga/effects'

import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
} from '../reducers/post'
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function addPostAPI(data) {
  console.log(data)
  return axios.post('/post', data);
}
function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}&limit=10`)
}
function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`, data);
}
function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`, data);
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);

    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: error.response.data,
      // error: error,
    })
  }
}

function loadPostAPI(data) {
  return axios.get(`/post/${data}`);
}
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    console.log('###########################################')
    console.log(result.data)

    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: LOAD_POST_FAILURE,
      error: error.response.data,
      // error: error,
    })
  }
}
function* watchLoadPost() {
  yield throttle(4*1000, LOAD_POST_REQUEST, loadPost);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadComment);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        content: result.data,
      },
    })
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: ADD_POST_FAILURE,
      error: error.response.data,
    })
  }
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);

    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    })
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    })
  } catch (error) {
    console.log(error)
    yield put({
      type: REMOVE_POST_FAILURE,
      // error: error.response.data,
      error: error,
    })
  }
}

function* addComment(action) {
  console.log('add comment')
  try {
    const result = yield call(addCommentAPI, action.data);

    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: error.response.data,
    })
  }
}

function* likePost(action) {
  console.log('add comment')
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LIKE_POST_FAILURE,
      error: error.response.data,
    })
  }
}

function* unlikePost(action) {
  console.log('add comment')
  try {
    const result = yield call(unlikePostAPI, action.data);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: error.response.data,
    })
  }
}

function uploadImagesAPI(data) {
  return axios.post(`/post/images`, data); // form 데이터를 객체로 감싸면 json이 돼 버린다.
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);

    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: error.response.data,
    })
  }
}

// 리트윗
function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`, data); // form 데이터를 객체로 감싸면 json이 돼 버린다.
}
function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);

    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: RETWEET_FAILURE,
      error: error.response.data,
    })
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchLoadUserPosts() {
  yield throttle(4*1000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadComment);
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchLoadHashtagPosts() {
  yield throttle(4*1000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadComment);
}

function* watchLoadPosts() {
  yield throttle(4*1000, LOAD_POSTS_REQUEST, loadPosts);
  // yield takeLatest(LOAD_POSTS_REQUEST, loadComment);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchLoadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadPost),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchUploadImages),
    fork(watchRetweet)
  ])
}
