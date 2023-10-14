import React, {
  FunctionComponent,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import useLocalStorage from '../../hooks/useLocalStorage';

type PersistenceSettingsProps = {
  isGlobal?: boolean;
  yarnModern: boolean;
};

const defaultValues: PersistenceSettingsProps = {
  isGlobal: false,
  yarnModern: false,
};

const PersistenceSettingContext = createContext<any>(defaultValues);

const PersistenceSettingProvider: FunctionComponent<{ children: React.ReactElement<any> }> = ({
  children,
}) => {
  // get the initial state from the local storage
  const [settings, setSettings] = useLocalStorage(`settings-ui-verdaccio`, {});

  const [localSettings, setLocalSettings] = useState<PersistenceSettingsProps>(
    settings ? settings : {}
  );

  const updateSettings = useCallback(
    (newSettings: React.SetStateAction<PersistenceSettingsProps>) => {
      setLocalSettings(newSettings);
      setSettings(newSettings);
    },
    [setSettings]
  );

  const value = useMemo(
    () => ({
      localSettings: localSettings ? localSettings : {},
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
