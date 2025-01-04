import Translate from '@docusaurus/Translate';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import { makeStyles, withStyles } from '@mui/styles';
import Layout from '@theme/Layout';
import React from 'react';

import DockerPullChart from './Chart/DockerPullChart';
import DockerTotalPull from './Chart/DockerTotalPull';
import NpmjsVersionsChart from './Chart/NpmjsVersionsChart';
import VersionDownloadsChart from './Chart/VersionDownloadsChart';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B5E40',
    },
    secondary: {
      main: '#808a79',
    },
  },
});

const useStyles = makeStyles(({ theme }: { theme: any }) => ({
  '@global': {},
}));

const Downloads: React.FC<{}> = (): React.ReactElement => {
  const classes = useStyles();
  return (
    <>
      <Layout title="Downloads" description="Verdaccio Downloads">
        <ThemeProvider theme={theme}>
          <div style={{ display: 'flex', width: '80%', flexFlow: 'wrap', margin: '1rem auto' }}>
            <header>
              <h1>
                <Translate>Download Metrics</Translate>
              </h1>
            </header>
          </div>

          <div style={{ display: 'flex', width: '80%', flexFlow: 'wrap', margin: '1rem auto' }}>
            <div style={{ width: '80%', margin: '0 auto' }}>
              <VersionDownloadsChart />
            </div>

            <div style={{ width: '80%', margin: '0 auto' }}>
              <DockerPullChart />
            </div>

            <div style={{ width: '80%', margin: '0 auto' }}>
              <DockerTotalPull />
            </div>
            <div style={{ width: '80%', margin: '0 auto' }}>
              <NpmjsVersionsChart />
            </div>
          </div>
        </ThemeProvider>
      </Layout>
    </>
  );
};

export default Downloads;
