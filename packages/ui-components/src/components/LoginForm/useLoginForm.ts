import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../providers/AuthProvider';
import type { LoginFormValues } from '../../utils/schemas';
import { loginSchema } from '../../utils/schemas';

type Options = {
  onSuccess?: () => void;
};

export function useLoginForm({ onSuccess }: Options = {}) {
  const { handleLogin } = useAuth();

  const form = useForm<LoginFormValues>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  const { setError } = form;

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      try {
        await handleLogin?.(data);
        onSuccess?.();
      } catch {
        setError('root', {
          type: 'server',
          // TODO: add translation key
          message: 'Invalid username or password',
        });
      }
    },
    [handleLogin, setError, onSuccess]
  );

  return {
    ...form,
    onSubmit,
  };
}
