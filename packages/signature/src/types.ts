export interface AESPayload {
  user: string;
  password: string;
  tokenKey?: string;
}

export type BasicPayload = AESPayload | void;
