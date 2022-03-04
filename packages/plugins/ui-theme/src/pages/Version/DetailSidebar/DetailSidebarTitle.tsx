import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModuleType } from 'types/packageMeta';
import Heading from 'verdaccio-ui/components/Heading';
import { CommonJS, ES6Modules, TypeScript } from 'verdaccio-ui/components/Icons';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

interface Props {
  packageName: string;
  description?: string;
  version: string;
  isLatest: boolean;
  hasTypes?: boolean;
  moduleType: ModuleType | void;
}

const ModuleJS: React.FC<{ module: ModuleType | void }> = ({ module }) => {
  if (module === 'commonjs') {
    return <CommonJS />;
  } else if (module === 'module') {
    return <ES6Modules />;
  } else {
    return null;
  }
};

const DetailSidebarTitle: React.FC<Props> = ({
  description,
  packageName,
  version,
  isLatest,
  hasTypes,
  moduleType,
}) => {
  const { t } = useTranslation();
  return (
    <Box className={'detail-info'} display="flex" flexDirection="column" marginBottom="8px">
      <StyledHeading>
        <TitleWrapper>
          <>
            {packageName}
            {hasTypes && <TypeScript />}
            <ModuleJS module={moduleType} />
          </>
        </TitleWrapper>
      </StyledHeading>
      {description && <div>{description}</div>}
      <StyledBoxVersion>
        {isLatest
          ? t('sidebar.detail.latest-version', { version })
          : t('sidebar.detail.version', { version })}
      </StyledBoxVersion>
    </Box>
  );
};

export default DetailSidebarTitle;

const TitleWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const StyledHeading = styled(Heading)({
  fontSize: '1rem',
  fontWeight: 700,
});

const StyledBoxVersion = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.text.secondary,
}));
