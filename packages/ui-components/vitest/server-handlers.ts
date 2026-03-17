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
  mockReadme('storybook'),
  mockReadme('got'),
  mockSidebar('jquery'),
  mockResetPassword(),
  mockCliLogin(),
  mockAddUser(),
  mockTarball(),
  mockReadme('jquery'),
  // Error presets
  mockSidebar('JSONStream', null, 401),
  mockSidebar('kleur', null, 404),
];
