import React from 'react';

import List from 'verdaccio-ui/components/List';
import ListItem from 'verdaccio-ui/components/ListItem';

import { DistTags } from '../../../../../types/packageMeta';

import { Spacer, ListItemText } from './styles';

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
