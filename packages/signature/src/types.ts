export interface AESPayload {
  user: string;
  password: string;
}

export type BasicPayload = AESPayload | void;
