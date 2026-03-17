import type React from 'react';

export type LoginError = {
  type: string;
  description: string;
};

export type LoginBody = {
  username: string | null;
  token: string | null;
};

export interface AuthContextProps<TBody> {
  handleLogin: (body: TBody) => Promise<void>;
  setUserState: React.Dispatch<React.SetStateAction<LoginBody>>;
  logOutUser: () => void;
  userState: LoginBody;
}
