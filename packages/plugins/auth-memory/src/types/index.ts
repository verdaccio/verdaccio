export interface UserMemory {
  name: string;
  password: string;
}

export interface Users {
  [key: string]: UserMemory;
}

export interface VerdaccioMemoryConfig {
  max_users?: number;
  users: Users;
}
