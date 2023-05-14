import React, { FunctionComponent, createContext, useContext, useMemo, useState } from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';

type PersistenceSettingsProps = {
  isGlobal?: boolean;
};

const defaultValues: PersistenceSettingsProps = {
  isGlobal: false,
};

const PersistenceSettingContext = createContext<any>(defaultValues);

const PersistenceSettingProvider: FunctionComponent<{ children: React.ReactElement<any> }> = ({
  children,
}) => {
  // get the initial state from the local storage
  const [settings, setSettings] = useLocalStorage(`settings-ui-verdaccio`, { isGlobal: false });
  const [localSettings, setLocalSettings] = useState<PersistenceSettingsProps>(settings);

  const updateSettings = (newSettings: React.SetStateAction<PersistenceSettingsProps>) => {
    setLocalSettings(newSettings);
    setSettings(newSettings);
  };

  const value = useMemo(
    () => ({
      localSettings,
      updateSettings,
    }),
    [localSettings, updateSettings]
  );

  return (
    <PersistenceSettingContext.Provider value={value}>
      {children}
    </PersistenceSettingContext.Provider>
  );
};

export default PersistenceSettingProvider;

export const useSettings = () => useContext(PersistenceSettingContext);
