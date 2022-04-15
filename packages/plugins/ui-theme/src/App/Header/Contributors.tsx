import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Link from '@mui/material/Link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import contributors from './generated_contributors_list.json';

const List = styled.div<{ theme?: Theme }>(({ theme }) => ({
  // marginLeft: theme?.spacing(1),
  // marginRight: theme?.spacing(1),
  // float: 'left',
}));

const generateImage = (id) => `https://avatars3.githubusercontent.com/u/${id}?s=120&v=4`;

const Contributors: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Link href={`https://verdaccio.org/contributors`} rel="noreferrer" target="_blank">
        <AvatarGroup max={18} spacing={15} total={400}>
          {contributors?.map(({ username, id }) => {
            return (
              <List key={username}>
                <Avatar alt={username} src={generateImage(id)} />
              </List>
            );
          })}
        </AvatarGroup>
      </Link>
    </>
  );
};

export default Contributors;
