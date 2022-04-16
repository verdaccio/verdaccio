import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Link from '@mui/material/Link';
import React from 'react';

import contributors from './generated_contributors_list.json';

const generateImage = (id) => `https://avatars3.githubusercontent.com/u/${id}?s=120&v=4`;

const Contributors: React.FC = () => {
  return (
    <>
      <Link href={`https://verdaccio.org/contributors`} rel="noreferrer" target="_blank">
        <AvatarGroup max={18} spacing={15} total={400}>
          {contributors?.map(({ username, id }) => {
            return (
              <div key={username}>
                <Avatar alt={username} src={generateImage(id)} />
              </div>
            );
          })}
        </AvatarGroup>
      </Link>
    </>
  );
};

export default Contributors;
