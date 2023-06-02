import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { default as FundButton } from '.';

const meta: Meta<typeof FundButton> = {
  title: 'Components/Sidebar/FundButton',
  component: FundButton,
};

export default meta;
type Story = StoryObj<typeof FundButton>;

export const Primary: Story = {
  name: 'Default',
  render: () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <FundButton
            packageMeta={{
              latest: {
                funding: {
                  url: 'https://opencollective.com/verdaccio',
                },
              },
            }}
          />
        </Stack>
      </Box>
    );
  },
};

export const Bad: Story = {
  name: 'Bad Link (empty)',
  render: () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <FundButton
            packageMeta={{
              latest: {
                funding: {
                  url: 'bad_link',
                },
              },
            }}
          />
        </Stack>
      </Box>
    );
  },
};
