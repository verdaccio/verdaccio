import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';

import { DistTags } from '../../../../../types/packageMeta';
import { ListItemText, Spacer } from './styles';

interface Props {
  tags: DistTags;
}

const VersionsTagList: React.FC<Props> = ({ tags }) => (
  <List dense={true}>
    {Object.keys(tags)
      .reverse()
      .map((tag) => (
        <ListItem className="version-item" key={tag}>
          <ListItemText>{tag}</ListItemText>
          <Spacer />
          <ListItemText>{tags[tag]}</ListItemText>
        </ListItem>
      ))}
  </List>
);

export default VersionsTagList;
