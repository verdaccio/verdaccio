import styled from '@emotion/styled';
import Add from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FabMUI from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { DetailContext } from '../..';
import DevelopersTitle from './DevelopersTitle';
import getUniqueDeveloperValues from './get-unique-developer-values';

export enum DeveloperType {
  CONTRIBUTORS = 'contributors',
  MAINTAINERS = 'maintainers',
}

export const Fab = styled(FabMUI)<{ theme?: Theme }>((props) => ({
  backgroundColor: props.theme?.palette.primary.main,
  color: props.theme?.palette.white,
}));

interface Props {
  type: DeveloperType;
  visibleMax?: number;
}

const StyledBox = styled(Box)({
  '> *': {
    margin: 5,
  },
});

export const VISIBLE_MAX = 6;

const Developers: React.FC<Props> = ({ type, visibleMax = VISIBLE_MAX }) => {
  const detailContext = useContext(DetailContext);
  const { t } = useTranslation();

  if (!detailContext) {
    throw Error(t('app-context-not-correct-used'));
  }

  const developers = useMemo(
    () => getUniqueDeveloperValues(detailContext.packageMeta?.latest[type]),
    [detailContext.packageMeta, type]
  );

  const [visibleDevelopersMax, setVisibleDevelopersMax] = useState(visibleMax);
  const [visibleDevelopers, setVisibleDevelopers] = useState(developers);

  useEffect(() => {
    if (!developers.length) {
      return;
    }
    setVisibleDevelopers(developers.slice(0, visibleDevelopersMax));
  }, [developers, visibleDevelopersMax]);

  const handleSetVisibleDevelopersMax = useCallback(() => {
    setVisibleDevelopersMax(visibleDevelopersMax + VISIBLE_MAX);
  }, [visibleDevelopersMax]);

  if (!visibleDevelopers || !developers.length) {
    return null;
  }

  return (
    <>
      <DevelopersTitle type={type} />
      <StyledBox display="flex" flexWrap="wrap" margin="10px 0 10px 0">
        {visibleDevelopers.map((visibleDeveloper) => {
          return (
            <Tooltip key={visibleDeveloper.email} title={visibleDeveloper.name}>
              <Avatar alt={visibleDeveloper.name} src={visibleDeveloper.avatar} />
            </Tooltip>
          );
        })}
        {visibleDevelopersMax < developers.length && (
          <Fab onClick={handleSetVisibleDevelopersMax} size="small">
            <Add />
          </Fab>
        )}
      </StyledBox>
    </>
  );
};

export default Developers;
