import React, {useState, useCallback, useEffect} from 'react';
import Head from 'next/head';
import Router from "next/router";
import styled from '@emotion/styled';
import axios from "axios";
import wrapper from "../../store/configureStore";
import { Form, Input, Checkbox, Button } from 'antd';

import useInput from '../../hooks/useInput'
import AppLayout from '../../components/AppLayout';
import { SIGN_UP_REQUEST } from "../../reducers/user";
import { useDispatch, useSelector } from "react-redux";


const ErrorMessage = styled.div`
  color: red;
`;

function Signup() {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(({ user }) => ({
    signUpLoading: user.signUpLoading,
    signUpDone: user.signUpDone,
    signUpError: user.signUpError,
    me: user.me,
  }))

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState(false)
  const [termError, setTermError] = useState(true)

  const onChangePasswordCheck = useCallback(e => {
    const value = e.target.value;
    setPasswordCheck(value);
    setPasswordError(value !== password);
  }, [password]);

  const onChangeTerm = useCallback(e => {
    setTerm(e.target.checked);
    setTermError(false);
  }, [])

  const onSubmit = useCallback(() => {
    if(password !== passwordCheck) {
      return setPasswordError(true);
    }

    if(!term) {
      return setTermError(true);
    }

    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email, password, nickname
      }
    })
  }, [password, passwordCheck, term])

  useEffect(() => {
    if (signUpDone) {
      console.log(1)
      Router.push('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if(signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  useEffect(() => { // loginDone으로 해도 된다.
    if(me && me.id) {
      console.log(2)
      Router.replace('/')
    }
  }, [me && me.id])

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 확인</label>
          <br />
          <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
        {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
          { termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage> }
        </div>
        <div style={{ margin: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
      </Form>
    </AppLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();
});

export default Signup;