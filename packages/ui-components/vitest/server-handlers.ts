import {
  mockAddUser,
  mockCliLogin,
  mockHomePackages,
  mockLogin,
  mockReadme,
  mockResetPassword,
  mockSearch,
  mockSidebar,
  mockTarball,
} from './msw-utils';

export const handlers = [
  mockHomePackages(),
  mockSearch(),
  mockLogin(),
  mockSidebar('storybook'),
  mockSidebar('got'),
  mockSidebar('glob'),
  mockSidebar('jquery'),
  mockSidebar('verdaccio'),
  mockReadme('storybook'),
  mockReadme('got'),
  mockReadme('glob'),
  mockReadme('jquery'),
  mockReadme('verdaccio'),
  mockResetPassword(),
  mockCliLogin(),
  mockAddUser(),
  mockTarball(),
  // Error presets
  mockSidebar('JSONStream', null, 401),
  mockSidebar('kleur', null, 404),
];
