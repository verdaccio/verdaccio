import styled from '@emotion/styled';
import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import FabMUI from '@mui/material/Fab';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Theme } from '../../Theme';
import Person from '../Person';
import { DeveloperType } from './DeveloperType';
import Title from './Title';
import getUniqueDeveloperValues from './get-unique-developer-values';

export const Fab = styled(FabMUI)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme.palette.primary.main,
  color: props.theme.palette.white,
}));

interface Props {
  type: DeveloperType;
  visibleMax?: number;
  packageMeta: any;
}

const StyledBox = styled(Box)({
  '> *': {
    marginRight: 5,
  },
});

export const VISIBLE_MAX = 6;

const Developers: React.FC<Props> = ({ type, visibleMax = VISIBLE_MAX, packageMeta }) => {
  const developers = useMemo(
    () => getUniqueDeveloperValues(packageMeta?.latest[type]),
    [packageMeta, type]
  );

  const [visibleDevelopersMax, setVisibleDevelopersMax] = useState(visibleMax);
  const [visibleDevelopers, setVisibleDevelopers] = useState(developers);

  useEffect(() => {
    if (!developers.length) {
      return;
    }
    // eslint-disable-next-line
    setVisibleDevelopers(developers.slice(0, visibleDevelopersMax));
  }, [developers, visibleDevelopersMax]);

  const handleSetVisibleDevelopersMax = useCallback(() => {
    setVisibleDevelopersMax(visibleDevelopersMax + VISIBLE_MAX);
  }, [visibleDevelopersMax]);

  if (!visibleDevelopers || !developers.length) {
    return null;
  }

  const { name: packageName, version } = packageMeta.latest;

  return (
    <>
      <Title type={type} />
      <StyledBox display="flex" flexWrap="wrap" margin="10px 0 10px 0">
        {visibleDevelopers.map((visibleDeveloper, index) => {
          return (
            <Person
              key={index}
              packageName={packageName}
              person={visibleDeveloper}
              version={version}
            />
          );
        })}
        {visibleDevelopersMax < developers.length && (
          <Fab data-testid={'fab-add'} onClick={handleSetVisibleDevelopersMax} size="small">
            <Add />
          </Fab>
        )}
      </StyledBox>
    </>
  );
};

export default Developers;
