/* eslint-disable verdaccio/jsx-no-style */

/* eslint-disable react/jsx-max-depth */

/* eslint-disable react/jsx-pascal-case */
import { Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

const title = 'Support people affected by the war in Ukraine';

const links = [
  {
    href: 'https://www.youtube.com/watch?v=LeG09zu_p_g',
    text: 'Ask Ukrainian open-source developers about war — Twitter Space',
  },
  {
    href: 'https://snyk.io/blog/celebrating-amazing-open-source-innovation-ukraine/',
    text: 'Snyk blog - Learn more about Open Source developers in Ukraine',
  },
  {
    href: 'https://www.savethechildren.org/us/where-we-work/ukraine/',
    text: 'Donate to save children in Ukraine',
  },
  {
    href: 'https://www.ifrc.org/',
    text: 'Donate to the International Red Cross',
  },
  {
    href: 'https://www.hrw.org/news/2022/03/10/ukraine-russian-air-dropped-bombs-hit-residential-area/',
    text: 'Read reports from Human Rights Watch',
  },
  {
    href: 'https://europeanbloodalliance.eu/',
    text: 'Donate blood in Europe',
  },
];

const Support = () => {
  const linkElements = links.map((link) => (
    <li key={link.text}>
      <Link href={link.href} target="_blank">
        <Typography>{link.text}</Typography>
      </Link>
    </li>
  ));

  return (
    <>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Typography component="h2" variant="h6">
            {title}
          </Typography>
        </Grid>
        <Grid item={true} lg={12} xs={12}>
          <span style={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
            <Typography>
              {`Hi, this is a message that I've composed to call your attention to ask 
                for humanitarian support for more than 44 million Ukrainians that are having 
                a hard time suffering for a horrible and unjustified war. It would be great if you
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
    </>
  );
};

export default Support;
