import 'fontsource-roboto';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import React from 'react';
import { Link } from 'gatsby';
import { Tweet } from 'react-twitter-widgets';

import VerdaccioBannerSVG from '../components/Image/VerdaccioBannerSVG';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import InstallSteps from '../components/InstallSteps';

const Tweets = [
  '1001297542779424768',
  '1002609907370250241',
  '951427300070916096',
  '1002153128140136448',
  '1169571193550192641',
  '1168280372800557063',
];

const IndexPage = () => (
  <Layout>
    <Seo />
    <Grid container justify="center" spacing={3}>
      <Grid item xs={12}>
        <VerdaccioBannerSVG width="800px" />
        <Typography component="h1" variant="h6">
          A lightweight open source private npm proxy registry
        </Typography>
        <Button variant="outlined" color="primary">
          <Link title="Documents" to="/docs/en/what-is-verdaccio.html">
            Get Started
          </Link>
        </Button>
        <Button variant="outlined">
          <a href="https://github.com/verdaccio" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </Button>
        <Button variant="outlined" color="primary">
          <Link title="Documents" to="/docs/en/contribute.html">
            Contribute
          </Link>
        </Button>
      </Grid>
      <Grid item>
        <InstallSteps />
      </Grid>
      <Grid item></Grid>

      <Grid item>
        {Tweets.map(tweetId => (
          <Card key={tweetId} variant="outlined">
            <CardContent>
              <Tweet
                tweetId={tweetId}
                options={{
                  height: '400',
                  // theme: 'dark',
                  conversation: 'none',
                  cards: 'hidden',
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  </Layout>
);

export default IndexPage;
