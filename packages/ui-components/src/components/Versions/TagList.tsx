import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';

import { DistTags, Time } from '../../types/packageMeta';
import Link from '../Link';
import { ListItemText, Spacer } from './styles';

interface Props {
  tags: DistTags;
  packageName: string;
  time: Time;
}

const VersionsTagList: React.FC<Props> = ({ tags, packageName, time }) => (
  <List dense={true}>
    {Object.keys(tags)
      .sort((a, b) => {
        return time[tags[a]] < time[tags[b]] ? 1 : time[tags[a]] > time[tags[b]] ? -1 : 0;
      })
      .map((tag) => (
        <ListItem className="version-item" data-testid={`tag-${tag}`} key={tag} sx={{ pr: 0 }}>
          <Link to={`/-/web/detail/${packageName}/v/${tags[tag]}`} variant="outline">
            <ListItemText>{tag}</ListItemText>
          </Link>
          <Spacer />
          <ListItemText>{tags[tag]}</ListItemText>
        </ListItem>
      ))}
  </List>
);

export default VersionsTagList;
