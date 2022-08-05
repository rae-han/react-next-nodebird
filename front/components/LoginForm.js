import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from '@emotion/styled';

import useInput from "../hooks/useInput";
import { loginRequestAction } from '../reducers/user'

const ButtonWrapper = styled.div`
  /* margin-top: 10px; */
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector(({ user }) => ({
    logInLoading: user.logInLoading,
    logInError: user.logInError,
  }))
  const [email, onChangeEmail] = useInput('qwer@qwer.qwer');
  const [password, onChangePassword] = useInput('qwer');

  const ButtonWrapperStyle = useMemo(() => ({ marginTop: 10 }), []);

  const onSubmitForm = useCallback(() => {
    console.log({
      email, password,
    });
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  useEffect(() => {
    if(logInError) {
      alert(logInError)
    }
  }, [logInError])

  return (
    <FormWrapper onFinish={onSubmitForm} style={{ padding: '10px' }}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>
      <ButtonWrapper style={ButtonWrapperStyle}>
        <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;