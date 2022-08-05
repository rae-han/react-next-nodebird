import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react'
import { CloseOutlined } from "@ant-design/icons";

import { GlobalStyle, Overlay, Header, CloseButton, ImageWrapper, Indicator, SlickWrapper } from './styled'

// ` 는 자바스크립트 문법
// func() 도 함수 호출이지만 func``도 함수 호출이다.
// styled.div 가 함수이다.
// 그렇다고 일반 함수와 완전히 동일하게 호출하진 않는다.
// 태그드 템플릿 리터럴 - 백틱이 템플릿 리터럴

function ImagesZoom({ images, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  return ( // 아래에서 
    <Overlay> 
      <Global styles={GlobalStyle} />
      <Header>
        <h1>상세 이미지</h1>
        <CloseButton onClick={onClose}>X</CloseButton>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToScroll={1}
          >
            {images.map(img => (
              <ImageWrapper key={img.src}>
                <img src={`http://localhost:3080/${img.src}`} alt={img.src} />
              </ImageWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} {' '}
              / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
}

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired
}

export default ImagesZoom;