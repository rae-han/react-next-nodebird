import React, {useCallback, useMemo} from 'react';
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router, { useRouter } from "next/router";
import styled from '@emotion/styled'
import { Menu, Input, Row, Col } from 'antd'
import useInput from "../hooks/useInput";

import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

const SearchInput = styled(Input.Search)`
  /* vertical-align: 'middle'; */
`;

function AppLayout({ children }) {
  const router = useRouter();
  // const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const { me } = useSelector((state) => state.user)
  const SearchInputStyle = useMemo(() => ({ verticalAlign: 'middle' }), [])

  const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput])

  return (
    <div>
      <Menu 
        mode="horizontal"
        // selectedKeys={[router.pathname]}
        items={[
          { label: <Link href="/"><a>노드버드</a></Link>, key: '/' },
          { label: <Link href="/profile"><a>프로필</a></Link>, key: '/profile' },
          { label: <Link href="/test"><a>test</a></Link> },
          {
            label: <SearchInput
              enterButton
              style={SearchInputStyle}
              value={searchInput}
              onChange={onChangeSearchInput}
              onSearch={onSearch}
            />, 
            key: '/search' 
          },
          { label: <Link href="/user/signup"><a>signup</a></Link> },
          { label: <Link href="/about"><a>about</a></Link> },
        ]}
      >
        {/* <Menu.Item key="index">
          <Link href="/"><a>home</a></Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile"><a>profile</a></Link>
        </Menu.Item>
        <Menu.Item key="user-username">
          <Link href="/user/user"><a>user</a></Link>
        </Menu.Item>
        <Menu.Item key="search-input">
          <SearchInput enterButton style={SearchInputStyle} />
        </Menu.Item>
        <Menu.Item key="user-signup">
          <Link href="/user/signup"><a>signup</a></Link>
        </Menu.Item> */}
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href="https://github.com/rae-han" target="_blank" rel="noreferrer noopener"> Raehan&apos;s Github page</a>
        </Col>
      </Row>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout;