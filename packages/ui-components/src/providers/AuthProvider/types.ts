export type LoginError = {
  type: string;
  description: string;
};

export type LoginBody = {
  username: string | null;
  token: string | null;
};

// export type LoginBody = {
//   error?: LoginError;
// } & LoginResponse;
