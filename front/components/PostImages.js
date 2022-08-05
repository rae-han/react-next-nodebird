import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from "@ant-design/icons";

import ImagesZoom from "./ImagesZoom";

function PostImages({ images }) {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, [])

  if(images.length === 1) {
    return (
      <>
        <img role="presentation" src={`http://localhost:3080/${images[0].src}`} alt={images[0].src} onClick={onZoom}></img>
        {/* role presentation 을 사용하면 굳이 클릭할 필요가 없다는걸 알려줌 (시각장애인 분들에게 유용함) */}
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    )
  }
  if(images.length === 2) {
    return (
      <>
        <img role="presentation" style={{ display: 'inline-block', width: '50%' }} src={`http://localhost:3080/${images[0].src}`} alt={images[0].src} onClick={onZoom}></img>
        <img role="presentation" style={{ display: 'inline-block', width: '50%' }} src={`http://localhost:3080/${images[1].src}`} alt={images[1].src} onClick={onZoom}></img>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    )
  }

  return (
    <>
      <div>
        <img role="presentation" style={{ display: 'inline-block', width: '50%' }} src={`http://localhost:3080/${images[0].src}`} alt={images[0].src} onClick={onZoom} />
        <div
          role="presentation"
          style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
          onClick={onZoom}
        >
          <PlusOutlined></PlusOutlined>
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    </>
  );
}

PostImages.propTypes = {
  images: PropTypes.array.isRequired,
}

export default PostImages;