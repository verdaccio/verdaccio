import React from 'react';
import { Link } from 'gatsby';
import { Tweet } from 'react-twitter-widgets';
import 'fontsource-roboto';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '../components/Layout';
import Seo from '../components/Seo';
import CopyToClipBoard from "../components/CopyToClipBoard";

const Tweets = ['1001297542779424768', '1002609907370250241', '951427300070916096', '1002153128140136448', '1169571193550192641', '1168280372800557063'];

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const IndexPage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Seo />
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography  component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Verdaccio
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            A lightweight open source private npm proxy registry
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Link title="getting-started" to="/docs/en/what-is-verdaccio.html">
                  <Button variant="contained" color="primary">
                      Get Started
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <a href="https://github.com/verdaccio" target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined" color="primary">
                      GitHub
                  </Button>
                </a>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  <Link title="Documents" to="/docs/en/contribute.html">
                    Contribute
                  </Link>
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2} justify="center">
              <CopyToClipBoard text="npm i -g verdaccio" />
            </Grid>
          </div>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {Tweets.map((tweetId) => (
            <Card key={tweetId} variant="outlined" className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Tweet
                  tweetId={tweetId}
                  options={{
                    height: '300',
                    // theme: 'dark',
                    conversation: 'none',
                    cards: 'hidden',
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default IndexPage;
