import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { SWRConfig } from 'swr';

import { StyleBaseline, ThemeProvider } from '../../Theme';
import { AppConfigurationProvider, ManifestsProvider, SearchProvider } from '../../providers';
import Footer from '../Footer';
import Header from '../Header';
import Home from './Home';
import { registryPackages } from './__stories__/storyFixtures';
import { packagePageHandlers, packagePageRoutes } from './__stories__/storyRoutes';

type Scenario = 'empty' | 'single' | 'several';
type LogoChoice = 'verdaccio' | 'monogram' | 'image';

type ThemingArgs = {
  title: string;
  primaryColor: string;
  darkMode: boolean;
  logo: LogoChoice;
  scenario: Scenario;
  showFooter: boolean;
  footer: string;
  poweredBy: string;
};

const SCENARIOS: Record<Scenario, unknown[]> = {
  empty: [],
  single: registryPackages.slice(0, 1),
  several: registryPackages,
};

/** A white rounded-square SVG with the title initials in the primary colour. */
function monogramLogo(title: string, color: string): string {
  const initials =
    title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('') || 'V';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#fff"/><text x="20" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="${color}" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const logoFor = (choice: LogoChoice, title: string, color: string): string | undefined => {
  if (choice === 'monogram') {
    return monogramLogo(title, color);
  }
  return choice === 'image' ? '/dark-logo.png' : undefined;
};

// read by the msw handler, so the scenario control changes the list without new handlers
let activeScenario: Scenario = 'several';

const ThemedHomePage: React.FC<ThemingArgs> = ({
  title,
  primaryColor,
  darkMode,
  logo,
  showFooter,
  footer,
  poweredBy,
}) => {
  const logoSrc = logoFor(logo, title, primaryColor);
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <AppConfigurationProvider
        overrideConfig={{
          base: 'http://localhost:4873/',
          title,
          primaryColor,
          darkMode,
          // the theme follows darkMode only while the header switch is hidden
          showThemeSwitch: false,
          logo: logoSrc,
          logoDark: logoSrc,
          login: true,
          showFooter,
          footer,
          // an empty control keeps the default; "false" hides it
          poweredBy: poweredBy === 'false' ? false : poweredBy,
        }}
      >
        <ThemeProvider>
          <StyleBaseline />
          <MemoryRouter initialEntries={['/']}>
            <SearchProvider>
              <ManifestsProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header />
                  <div style={{ flex: 1 }}>
                    <Routes>
                      <Route element={<Home />} path="/" />
                      {packagePageRoutes}
                    </Routes>
                  </div>
                  {showFooter && <Footer />}
                </div>
              </ManifestsProvider>
            </SearchProvider>
          </MemoryRouter>
        </ThemeProvider>
      </AppConfigurationProvider>
    </SWRConfig>
  );
};

const meta: Meta<ThemingArgs> = {
  title: 'Sections/Home/Theming',
  argTypes: {
    title: { control: 'text' },
    primaryColor: { control: 'color' },
    darkMode: { control: 'boolean' },
    logo: { control: 'inline-radio', options: ['verdaccio', 'monogram', 'image'] },
    scenario: { control: 'inline-radio', options: ['empty', 'single', 'several'] },
    showFooter: { control: 'boolean' },
    footer: { control: 'text', description: 'web.footer (markdown)' },
    poweredBy: { control: 'text', description: 'web.poweredBy (markdown, or false)' },
  },
  args: {
    title: 'Verdaccio',
    primaryColor: '#4b5e40',
    darkMode: false,
    logo: 'verdaccio',
    scenario: 'several',
    showFooter: true,
    footer: '',
    poweredBy: '',
  },
  // a key per scenario remounts the page so the list is fetched again
  render: (args) => {
    activeScenario = args.scenario;
    return <ThemedHomePage key={`${args.scenario}-${args.darkMode}`} {...args} />;
  },
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        http.get('https://my.company.example/-/verdaccio/data/packages', async () => {
          await delay(200);
          return HttpResponse.json(SCENARIOS[activeScenario]);
        }),
        ...packagePageHandlers,
      ],
    },
  },
};

export default meta;
type Story = StoryObj<ThemingArgs>;

export const Playground: Story = {
  name: 'Playground (use the controls)',
};

export const Indigo: Story = {
  name: 'Indigo with monogram logo',
  args: {
    scenario: 'several',
    title: 'Platform Registry',
    primaryColor: '#3949ab',
    logo: 'monogram',
  },
};

export const Crimson: Story = {
  name: 'Crimson, empty registry',
  args: { scenario: 'empty', title: 'Release Registry', primaryColor: '#c62828', logo: 'monogram' },
};

export const Teal: Story = {
  name: 'Teal, single package',
  args: { scenario: 'single', primaryColor: '#00796b' },
};

export const Dark: Story = {
  name: 'Dark mode',
  args: { scenario: 'several', darkMode: true },
};

export const DarkEmpty: Story = {
  name: 'Dark mode, empty registry',
  args: { scenario: 'empty', darkMode: true, primaryColor: '#6a1b9a', logo: 'monogram' },
};

export const ImageLogo: Story = {
  name: 'Custom image logo',
  args: { scenario: 'several', logo: 'image', primaryColor: '#263238' },
};

export const CustomFooter: Story = {
  name: 'Custom footer with image and links',
  args: {
    scenario: 'several',
    primaryColor: '#3949ab',
    logo: 'monogram',
    title: 'Platform Registry',
    footer:
      '![Verdaccio](/dark-logo.png) Platform Registry · [Registry guide](https://verdaccio.org/docs/cli-registry)',
    poweredBy: 'Run by the platform team · [Contact](https://verdaccio.org/docs/what-is-verdaccio)',
  },
};
