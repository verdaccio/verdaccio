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

export default storage;
