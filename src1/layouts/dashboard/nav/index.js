import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, FormHelperText, Stack, Button, Divider } from '@mui/material';
// mock
import { Icon } from '@iconify/react';
// hooks
import { useObjContext } from '../../../context/context';
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { StyledNavItem } from '../../../components/nav-section/styles';
//
import navConfig from './config';
import { auth } from '../../../firebase/firebase';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  backgroundColor: '#f5f3f4',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useObjContext();

  const isDesktop = useResponsive('up', 'lg');
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = () => {
    try {
      const { getAuth, signOut } = auth;
      const authInstance = getAuth();

      signOut(authInstance)
        .then(() => {
          // Sign-out successful.
          // localStorage.clear();
          console.log('Signed out!');
          navigate('/');
        })
        .catch((error) => {
          // An error happened.
          console.log('Error! While signing out');
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
        backgroundColor: '#343a40',
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex', height: 100 }}>{/* <Logo /> */}</Box>

      <Box sx={{ mb: 5, mx: 1, height: 60 }}>
        <Link underline="none">
          <StyledAccount>
            <Box
              sx={{
                bgcolor: '#d3d3d3',
                borderRadius: '50%',
                width: 45,
                height: 45,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon icon={'ph:user'} size={30} color={'black'} />
            </Box>

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'black' }}>
                {user.name || 'User'}
              </Typography>

              <FormHelperText variant="body2" sx={{ color: '#2b2d42' }}>
                {user.designation}
              </FormHelperText>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ mt: 'auto', visibility: showMenu ? 'visible' : 'hidden' }}>
        <Box
          sx={{
            // backgroundColor: 'white',
            borderRadius: 1,
            m: 1,
            p: 0.5,
          }}
        >
          <Stack bgcolor={'#212529'} sx={{ borderRadius: 1 }} spacing={1}>
            <Box
              sx={{
                height: 50,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#6c757d',
                },
              }}
              onClick={() => handleSignOut()}
            >
              <Typography sx={{ ml: 1.5 }} fontFamily={'Wix Madefor Display'} fontWeight={600}>
                Yes
              </Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                height: 50,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#6c757d',
                },
              }}
              onClick={() => setShowMenu(false)}
            >
              <Typography sx={{ ml: 1.5 }} fontFamily={'Wix Madefor Display'} fontWeight={600}>
                No
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ height: 50, bgcolor: 'white', m: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
        <Icon icon={showMenu ? 'ep:arrow-up-bold' : 'solar:logout-outline'} width={20} style={{ marginLeft: 5 }} />
        <StyledNavItem sx={{ ml: 1 }} onClick={() => setShowMenu((s) => !s)} disableRipple disableFocusRipple>
          Logout
        </StyledNavItem>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
