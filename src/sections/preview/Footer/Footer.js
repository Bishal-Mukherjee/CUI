import React from 'react';
import { Box, Grid, Stack, Link, Typography } from '@mui/material';

import Facebook from '../../../assets/blackwhitesvg/facebook.svg';
import Instagram from '../../../assets/blackwhitesvg/instagram.svg';
import LinkedIn from '../../../assets/blackwhitesvg/linkedin.svg';
import Twitter from '../../../assets/blackwhitesvg/twitter.svg';
import YouTube from '../../../assets/blackwhitesvg/youtube.svg';

const platformiconsmap = {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
  YouTube,
};

const ColumnLinks = ({ header, links }) => (
  <>
    <Stack direction={'column'} spacing={2} alignItems={'flex-start'}>
      <Typography sx={{ my: 1, fontWeight: 700 }}>{header}</Typography>
      {links[header].map((link, index) => (
        <Link sx={{ textDecoration: 'none', color: 'black' }} href={link.url} key={index}>
          {link.label}
        </Link>
      ))}
    </Stack>
  </>
);

const Footer = ({ footer, navDetails }) => {
  const { brandlogo } = navDetails;

  return (
    <Box sx={{ width: '100%', backgroundColor: '#C4CDD5', marginTop: 10, padding: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} sx={{ m: 2 }}>
          <Stack direction={'column'} spacing={2.5}>
            <img
              src={brandlogo}
              alt="brandlogo"
              style={{ width: 120, height: 120, borderRadius: '50%', marginLeft: 5 }}
            />

            <Box sx={{ px: 3 }}>
              <Typography sx={{ fontFamily: 'Wix Madefor Display', fontSize: 25 }}>{footer.platformname}</Typography>
            </Box>

            <Box sx={{ px: 3 }}>
              <Typography sx={{ fontFamily: 'Wix Madefor Display', textAlign: 'justify' }}>
                {
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
                }
              </Typography>
            </Box>

            <Stack direction={'row'} spacing={5} sx={{ px: 3 }}>
              {Object.keys(footer.socialLinks).map((sociallink, index) => (
                <Link href={footer.socialLinks[sociallink]} key={index}>
                  <img alt={sociallink} src={platformiconsmap[sociallink]} style={{ height: 22, width: 22 }} />
                </Link>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} sx={{ m: 2 }}>
          <Stack direction={'row'} spacing={10} sx={{ justifyContent: 'flex-end' }}>
            {Object.keys(footer.headers).map((header, index) => (
              <Box key={index}>
                <ColumnLinks header={header} links={footer.headers} />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
