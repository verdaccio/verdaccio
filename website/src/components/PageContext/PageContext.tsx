import React, { useContext, FunctionComponent, useState } from 'react';

type PageContextProviderProps = {
  language: string;
  idTitleMap: any;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Function;
  sideBarConfiguration: any;
  currentPage: string | null;
};

const defaultContextProps = {
  language: 'en',
  isDrawerOpen: false,
  idTitleMap: {},
  setIsDrawerOpen: () => {},
  sideBarConfiguration: {},
  currentPage: null,
};

const PageContext = React.createContext<PageContextProviderProps>(defaultContextProps);

type Props = {
  language: string;
  idTitleMap: any;
  currentPage: string;
  sideBarConfiguration: any;
};

const PageContextProvider: FunctionComponent<Props> = ({
  children,
  language,
  idTitleMap,
  sideBarConfiguration,
  currentPage,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <PageContext.Provider
      value={{
        language,
        idTitleMap,
        sideBarConfiguration,
        currentPage,
        isDrawerOpen,
        setIsDrawerOpen,
      }}>
      {children}
    </PageContext.Provider>
  );
};

const usePageContext = () => useContext(PageContext);

export { PageContextProvider, usePageContext };
