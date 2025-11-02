import memoryStorage from 'localstorage-memory';

let storage: Storage;
try {
  localStorage.setItem('__TEST__', '');
  localStorage.removeItem('__TEST__');
  storage = localStorage;
} catch {
  // Fall back to memory storage if localStorage is not available
  storage = memoryStorage;
}

export function saveAuth(username: string, token: string): void {
  storage.setItem('username', username);
  storage.setItem('token', token);
}

export function clearAuth(): void {
  storage.removeItem('username');
  storage.removeItem('token');
}

export function getAuth(): { username: string | null; token: string | null } {
  return {
    username: storage.getItem('username'),
    token: storage.getItem('token'),
  };
}

export default storage;
