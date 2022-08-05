import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from "react-redux";

import useInput from "../hooks/useInput";
import { ADD_COMMENT_REQUEST } from '../reducers/post';

function CommentForm({ post }) {
  const dispatch = useDispatch(); // 이거 없앴을 때 에러 잡아주는지 확인.
  const { addCommentDone, addCommentLoading } = useSelector(({ post }) => post)
  const [commentText, onChangeCommentText, setCommentText] = useInput('');
  const id = useSelector(state => state.user.me?.id)

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  useEffect(() => {
    if(addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  return (
    <Form onFinish={onSubmitComment} style={{ position: 'relative', margin: '0' }}>
      <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4}></Input.TextArea>
      <Button
        type="primary" htmlType="submit" style={{ zIndex: 1, position: 'absolute', right: 0, bottom: -40 }}
        loading={addCommentLoading}
        // onClick={onSubmitComment}
      >삐약</Button>
    </Form>
  );
}

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
}

export default CommentForm;