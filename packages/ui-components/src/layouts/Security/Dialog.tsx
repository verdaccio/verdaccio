import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const LayoutContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: '500px',
  margin: '0 auto',
});

const MainContent = styled(Box)({
  flex: 1,
  marginTop: '100px',
});

interface SecurityLayoutProps {
  children: React.ReactNode;
}

const SecurityLayout: React.FC<SecurityLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default SecurityLayout;
