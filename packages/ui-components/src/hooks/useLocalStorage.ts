import { useState } from 'react';

/**
* 
*  @example
    ```jsx
    const [isDarkModeStorage, setIsDarkMode] = useLocalStorage('darkMode', isDarkModeDefault);
   ```

   based on https://usehooks.com/useLocalStorage/
   @category Hooks
 */
const useLocalStorage = <V>(key: string, initialValue: V) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      // If error also return initialValue
      // eslint-disable-next-line no-console
      console.error('An error occurred getting a sessionStorage key', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: V) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('An error occurred writing to sessionStorage', error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
