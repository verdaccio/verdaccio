import Translate from '@docusaurus/Translate';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import { makeStyles, withStyles } from '@mui/styles';
import Layout from '@theme/Layout';
import React from 'react';

const generateImage = (id) => `https://avatars3.githubusercontent.com/u/${id}?s=120&v=4`;

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

const StyledBadge = withStyles(() => ({
  badge: {
    right: -3,
    top: 8,
    padding: '0 4px',
  },
}))(Badge);

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

type ContributorsProps = {
  data: any;
};

function convertItemTo(item) {
  const node = {
    url: item.login,
    userId: item.id,
    id: `key-${item.login}`,
    contributions: item.contributions,
    repositories: item.repositories,
  };

  return { node };
}

const Contributors: React.FC<ContributorsProps> = ({ data }): React.ReactElement => {
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { contributors, repositories } = data;

  const handleClickOpen = (item) => {
    setUser(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUser(null);
  };

  const handleKeyDown = (event, userItem) => {
    if (event.keyCode === 13) {
      handleClickOpen(userItem);
    }
  };

  return (
    <>
      <Layout
        title="Contributors"
        description="Verdaccio Contributors, thanks to the community Verdaccio keeps running"
      >
        <ThemeProvider theme={theme}>
          <div style={{ display: 'flex', width: '80%', flexFlow: 'wrap', margin: '1rem auto' }}>
            <header>
              <h1>
                <Translate>Contributors </Translate>
                <span>({contributors.length}) 🎉🎉🎉</span>
              </h1>
              <p>
                <Translate>
                  Thanks to everyone involved in maintaining and improving Verdaccio, this page is a
                  way to thank you for all the effort you have put on it.
                </Translate>
                <b style={{ marginLeft: '0.5rem' }}>
                  <Translate>Thanks</Translate>!!!
                </b>
              </p>
            </header>
          </div>

          <div style={{ display: 'flex', width: '80%', flexFlow: 'wrap', margin: '1rem auto' }}>
            {contributors.map((item, index) => {
              const userItem = convertItemTo(item);
              return (
                <div
                  title={userItem.node.url}
                  role="button"
                  tabIndex={index}
                  style={{ flex: 'auto', cursor: 'pointer', margin: '10px' }}
                  key={userItem.node.url}
                  onKeyDown={(event) => handleKeyDown(event, userItem)}
                  onClick={() => handleClickOpen(userItem)}
                >
                  <img
                    src={generateImage(userItem.node.userId)}
                    alt={userItem.node.url}
                    width="40px"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              );
            })}
          </div>
          {user && (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
              <DialogTitle id="simple-dialog-title">
                <Grid container={true} spacing={2}>
                  <Grid item lg={3} md={3} sm={3}>
                    <a
                      href={'https://github.com/' + user.node.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={generateImage(user.node.userId)}
                        alt={user.node.url}
                        className={classes.medium}
                        width="40px"
                        style={{ borderRadius: '10px' }}
                      />
                    </a>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6}>
                    <Typography variant="h6">{user.node.url}</Typography>
                  </Grid>
                  <Grid item lg={2} md={2} sm={2}>
                    <Chip
                      icon={<EmojiEventsIcon className={classes.emojiEvent} />}
                      label={user.node.contributions}
                      color="default"
                    />
                  </Grid>
                </Grid>
              </DialogTitle>

              <DialogContent>
                <div className={classes.root}>
                  <List component="nav" aria-label="main mailbox folders">
                    {user.node.repositories.map(({ name, contributions }) => {
                      const repo = repositories.find((repo) => repo.name === name);
                      if (!repo) {
                        return null;
                      }

                      console.log('-->', repo);

                      return (
                        <ListItemLink
                          className={repo.archived ? classes.archived : ''}
                          key={repo.name}
                          href={`${repo.html_url}/pulls?q=is%3Apr+author%3A${user.node.url}+is%3Aclosed`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ListItemIcon>
                            <Badge
                              badgeContent={contributions}
                              color="primary"
                              max={9999}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                            >
                              <MergeTypeIcon />
                            </Badge>
                          </ListItemIcon>
                          <Tooltip title={repo.archived ? 'archived' : ''}>
                            <ListItemText
                              primary={<Typography color="primary">{repo.name}</Typography>}
                              secondary={
                                <Typography color="secondary" variant="body2">
                                  {repo.description}
                                </Typography>
                              }
                            />
                          </Tooltip>
                          <ListItemSecondaryAction
                            className={repo.archived ? classes.archived : ''}
                          >
                            <a
                              href={'https://github.com/' + repo.full_name + '/stargazers'}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconButton edge="end" aria-label="delete">
                                <StyledBadge badgeContent={repo.staergezers} max={999}>
                                  <StarIcon className={classes.starColor} />
                                </StyledBadge>
                              </IconButton>
                            </a>
                          </ListItemSecondaryAction>
                        </ListItemLink>
                      );
                    })}
                  </List>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </ThemeProvider>
      </Layout>
    </>
  );
};

export default Contributors;
