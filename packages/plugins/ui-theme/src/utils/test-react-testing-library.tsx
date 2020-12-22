import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import ThemeProvider from 'verdaccio-ui/design-tokens/ThemeProvider';

import i18nConfig from '../../i18n/config';

const customRender = (node: React.ReactElement, ...options: any) => {
  return render(
    <ThemeProvider>
      <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
    </ThemeProvider>,
    ...options
  );
};

export * from '@testing-library/react';
export { customRender as render };
