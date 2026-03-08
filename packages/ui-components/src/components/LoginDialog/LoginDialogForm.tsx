import type { FC } from 'react';
import React from 'react';

import LoginForm from '../LoginForm/Login';
import { useLoginForm } from '../LoginForm/useLoginForm';

const LoginDialogForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    onSubmit,
  } = useLoginForm();
  return (
    <LoginForm
      errors={errors}
      handleSubmit={handleSubmit}
      isValid={isValid}
      onSubmit={onSubmit}
      register={register}
    />
  );
};

export default LoginDialogForm;
