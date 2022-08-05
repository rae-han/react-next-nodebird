import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import wrapper from '../store/configureStore';

import 'antd/dist/antd.css';

const CommonComponent = ({ Component }) => {

  return (
    <div>
      <Head>
        {/* head 태그는 body 태그 밖에 있는데, 그걸 수정하기 위한 컴포넌트 */}
        <meta charSet="utf-8"></meta>
        <title>내 프로필 | NordBird</title>
      </Head>
      <div>공통</div>
      <Component />
    </div>
  )
}

CommonComponent.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

// export default CommonComponent;
export default wrapper.withRedux(CommonComponent);
// 여기서 페이지들의 공통된 부분을 담당한다.
// 다른 파일들의 리턴이 Component에 들어가서 리턴된다.
