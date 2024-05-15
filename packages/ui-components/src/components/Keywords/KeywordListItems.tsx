import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import React from 'react';

const KeywordListItems: React.FC<{ keywords: undefined | string | string[] }> = ({ keywords }) => {
  if (!keywords) return null;

  const keywordList =
    typeof keywords === 'string' ? keywords.replace(',', ' ').split(' ') : keywords;

  return (
    <ListItem sx={{ px: 0, mt: 0, flexWrap: 'wrap' }}>
      {keywordList.sort().map((keyword, index) => (
        <Chip key={index} label={keyword} sx={{ mt: 1, mr: 1 }} />
      ))}
    </ListItem>
  );
};

export default KeywordListItems;
