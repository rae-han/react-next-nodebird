import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { addPost, ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from "../reducers/post";
import useInput from "../hooks/useInput";
import {backUrl} from "../config/config";

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostDone } = useSelector(state => state.post);
  // const [text, setText] = useState('');
  const [text, onChangeText, setText] = useInput('');
  const imageInput = useRef();

  // const onChangeText = useCallback(e => setText(e.target.value), []);

  const onSubmit = useCallback(() => {
    if(!text || !text.trim()) {
      return alert('게시글을 작성하세요.')
    }

    // dispatch(addPost(text));
    const formData = new FormData();

    imagePaths.forEach((imagePath) => { // image가 없기 때문에 그냥 json으로 보내도 된다.
      formData.append('image', imagePath)
    });
    formData.append('content', text);

    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    })
  }, [text])

  useEffect(() => {
    if(addPostDone) {
      setText('');
    }
  }, [addPostDone])

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files); // forEach가 없다. 유사 배열?
    const imageFormData = new FormData(); // 무조건 멀티파터 형식으로 보내야 multer가 처리한다.
    // 배열의 forEach를 빌려쓴다.
    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    })

    console.log(imageFormData)

    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    })
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    })
  }, [])


  return (
    <Form 
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea 
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages}/>
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} style={{ width: '200px'}} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  )
}

export default PostForm;