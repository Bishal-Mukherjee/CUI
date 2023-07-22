import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// components
import { Grid, Link, Button, Stack, Menu, MenuItem, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { firestore, storeactions } from '../../../firebase/firebase';

import './Navbar.css';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  //   backgroundColor: '#C4CDD5',
  height: 80,

  //   padding: theme.spacing(5, 5, 0),
  //   [theme.breakpoints.up('sm')]: {
  //     padding: theme.spacing(5, 5, 0),
  //   },
}));

const StyledLinks = styled(Link)(({ theme }) => ({
  fontFamily: 'Wix Madefor Display',
  color: 'black',
  fontSize: 15,
  textDecoration: 'none',
  cursor: 'pointer',
}));

// ----------------------------------------------------------------------

const RenderLinks = ({ link, sublinks }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <StyledLinks onClick={handleClick}>
        {link}
        <Icon icon={open ? 'fe:arrow-up' : 'fe:arrow-down'} style={{ position: 'absolute', marginTop: '-0.4rem' }} />
      </StyledLinks>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {sublinks.map((item, index) => (
          <MenuItem key={index}>
            <StyledLinks href={item.link}>{item.label}</StyledLinks>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default function Navbar({ mainObj }) {
  const navigate = useNavigate();
  return (
    <>
      {mainObj ? (
        <>
          {mainObj.navbar ? (
            <StyledHeader sx={{ backgroundColor: mainObj.theme || '#C4CDD5' }}>
              <Grid container sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
                <Grid item xs={6} md={6} sx={{ display: 'flex', alignItems: 'center', pl: 5 }}>
                  {mainObj.navbar.brandlogo ? (
                    <Box sx={{ cursor: 'pointer' }}>
                      <img
                        alt="brandlogo"
                        src={mainObj.navbar.brandlogo}
                        style={{ width: 60, height: 60, borderRadius: '50%' }}
                      />
                    </Box>
                  ) : null}
                </Grid>

                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{ display: { lg: 'flex' }, justifyContent: 'flex-end', alignItems: 'center' }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={'flex-end'}
                    spacing={{
                      xs: 0.5,
                      sm: 5,
                    }}
                    sx={{ pr: 5 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={{
                        xs: 0.5,
                        sm: 5,
                      }}
                      sx={{ display: { lg: 'block', md: 'block', xs: 'none' } }}
                    >
                      {mainObj.navbar.menuitems ? (
                        <>
                          {Object.keys(mainObj.navbar.menuitems).map((l, index) => (
                            <>
                              {Array.isArray(mainObj.navbar.menuitems[l]) ? (
                                <RenderLinks link={l} sublinks={mainObj.navbar.menuitems[l]} />
                              ) : (
                                <StyledLinks href={mainObj.navbar.menuitems[l]} key={index}>
                                  {l}
                                </StyledLinks>
                              )}
                            </>
                          ))}
                        </>
                      ) : null}
                    </Stack>

                    {mainObj.navbar.button.label ? (
                      <Button ml="auto" variant="outlined" onClick={() => navigate(mainObj.navbar.button.link)}>
                        {mainObj.navbar.button.label}
                      </Button>
                    ) : null}
                  </Stack>
                </Grid>
              </Grid>
            </StyledHeader>
          ) : null}
        </>
      ) : null}
    </>
  );
}
