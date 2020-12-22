import { createContext } from 'react';

export interface AppProps {
  user?: User;
  scope: string;
}

export interface User {
  username: string;
}

export interface AppContextProps extends AppProps {
  setUser: (user?: User) => void;
}

const AppContext = createContext<undefined | AppContextProps>(undefined);

export default AppContext;
