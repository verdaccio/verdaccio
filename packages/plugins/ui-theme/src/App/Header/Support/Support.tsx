/* eslint-disable verdaccio/jsx-no-style */

/* eslint-disable react/jsx-max-depth */

/* eslint-disable react/jsx-pascal-case */
import styled from '@emotion/styled';
import { Dialog, Link, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FlagsIcon from 'country-flag-icons/react/3x2';
import React from 'react';

import flag from './uk.jpg';

const style = {
  p: 4,
};

const Flags = styled('span')<{ theme?: Theme }>(() => ({
  width: '25px',
}));

const title = 'Support people affected by the war in Ukraine';

const links = [
  {
    href: 'https://twitter.com/denysdovhan/status/1501486563842211843',
    text: 'Listen at Twitter OSS developers about the kjkjwar',
  },
  {
    href: 'https://snyk.io/blog/celebrating-amazing-open-source-innovation-ukraine/',
    text: 'Learn more about Open Source developers in Ukraine',
  },
  {
    href: 'https://www.savethechildren.org/us/where-we-work/ukraine/',
    text: 'Donate to Save the Children',
  },
  {
    href: 'https://www.ifrc.org/',
    text: 'Donate to the International Red Cross',
  },
  {
    href: 'https://www.hrw.org/news/2022/03/10/ukraine-russian-air-dropped-bombs-hit-residential-area/',
    text: 'Read Reports from Human Rights Watch',
  },
  {
    href: 'https://europeanbloodalliance.eu/',
    text: 'Donate blood in Europe',
  },
];

const Support = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const linkElements = links.map((link) => (
    <li key={link.text}>
      <Link href={link.href} target="_blank">
        <Typography>{link.text}</Typography>
      </Link>
    </li>
  ));

  return (
    <>
      <Tooltip title={title}>
        <IconButton color="inherit" onClick={handleOpen} size="large">
          <Flags>
            <FlagsIcon.UA />
          </Flags>
        </IconButton>
      </Tooltip>
      <Dialog
        aria-describedby="modal-modal-description"
        aria-labelledby="modal-modal-title"
        maxWidth="md"
        onClose={handleClose}
        open={open}
      >
        <Box sx={style}>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={12}>
              <Typography component="h2" variant="h6">
                {title}
              </Typography>
              <Divider />
            </Grid>
            <Grid item={true} lg={4} xs={12}>
              <img alt={title} height="150" src={flag} />
            </Grid>
            <Grid item={true} lg={8} xs={12}>
              <span style={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                <Typography>
                  {`Hi, this is a message that I've composed to call your attention to ask 
                for humanitarian support for more than 44 million Ukrainians that are having 
                a  hard time suffering for a horrible and unjustified war. It would be great if you
                decide today to make a difference and help others. You could help by donating 
                to very well-known humanitarian organizations, helping in your local 
                area with food, clothes, donate blood, toys for kids, or your own time. Any help is very welcome.`}
                </Typography>
              </span>
              <ul style={{ padding: '10px 0' }}>{linkElements}</ul>
              <div>
                <Typography variant="div">{`Spread the voice, make the difference today.`}</Typography>
              </div>
              <div style={{ padding: '10px 0', fontWeight: 600 }}>
                <Typography variant="div">{`Att: Verdaccio Lead Mantainer, Juan P.`}</Typography>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

export { Support };
