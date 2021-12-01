import Translate from '@docusaurus/Translate';
import { ListItemSecondaryAction, Tooltip } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { green, yellow } from '@material-ui/core/colors';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import StarIcon from '@material-ui/icons/Star';
import Layout from '@theme/Layout';
import React from 'react';

const generateImage = (id) => `https://avatars3.githubusercontent.com/u/${id}?s=120&v=4`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4B5E40',
    },
    secondary: {
      main: '#808a79',
    },
  },
});

const useStyles = makeStyles((theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    medium: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    starColor: {
      color: yellow[500],
    },
    archived: {
      opacity: `0.4`,
    },
    emojiEvent: {
      color: green[800],
    },
  })
);

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
  contributors: any;
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

const Contributors: React.FC<ContributorsProps> = ({ contributors }): React.ReactElement => {
  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

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
        description="Verdaccio Contributors, thanks to the community Verdaccio keeps running">
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
                  title= { userItem.node.url}
                  role="button"
                  tabIndex={index}
                  style={{ flex: 'auto', cursor: 'pointer', margin: '10px' }}
                  key={userItem.node.url}
                  onKeyDown={(event) => handleKeyDown(event, userItem)}
                  onClick={() => handleClickOpen(userItem)}>
                  <Avatar
                    src={generateImage(userItem.node.userId)}
                    alt={userItem.node.url}
                    className={classes.large}
                  />
                </div>
              );
            })}
          </div>
          {user && (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
              <DialogTitle id="simple-dialog-title">
                <Grid container justifyContent="center" alignItems="center" justify="center">
                  <Grid item lg={3}  md={3} sm={3}>
                    <a
                      href={'https://github.com/' + user.node.url}

                      target="_blank"
                      rel="noreferrer">
                      <Avatar
                        src={generateImage(user.node.userId)}
                        alt={user.node.url}
                        className={classes.medium}
                      />
                    </a>
                  </Grid>
                  <Grid lg={6} md={6} sm={6}>
                    <Typography variant="h6">{user.node.url}</Typography>
                  </Grid>
                  <Grid lg={2} md={2} sm={2}>
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
                    {user.node.repositories.map((repo) => {
                      return (
                        <ListItemLink
                          className={repo.archived ? classes.archived : ''}
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer">
                          <ListItemIcon>
                            <Badge
                              badgeContent={repo.contributions} 
                              color="green"
                              max={9999}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}>
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
                            className={repo.archived ? classes.archived : ''}>
                            <a
                              href={'https://github.com/' + repo.full_name + '/stargazers'}
                              target="_blank"
                              rel="noreferrer">
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
