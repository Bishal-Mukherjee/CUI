/* eslint-disable no-irregular-whitespace */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Paper } from '@mui/material';

// hooks
import { useNavigate, useLocation } from 'react-router-dom';
import { useObjContext } from '../../context/context';
import useResponsive from '../../hooks/useResponsive';

// sections
import SignIn from './SignIn/SignIn';
import SingnUp from './SignUp/SignUp';

import LandingLogo from '../../assets/svg/landinglogo.svg';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    backgroundColor: 'white',
    height: '100%',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '80%',
  minHeight: '100vh',
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: '#343a40',
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundColor: 'white',
}));

// ----------------------------------------------------------------------

export default function AuthWrapper() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useObjContext();

  const [authNavigation, setAuthNavigation] = useState(0);

  const AUTH_SECTION_OBJ = {
    0: <SignIn setAuthNavigation={setAuthNavigation} />,
    1: <SingnUp setAuthNavigation={setAuthNavigation} />,
  };

  //   useEffect(() => {
  //     if (user) {
  //       navigate('/index');
  //     }
  //   }, [user, location]);

  return (
    <>
      <Helmet>
        <title> Login | CustomizedUI </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <>
            <StyledSection>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Paper sx={{ borderRadius: '50%', height: '180px', width: '180px' }}>
                  <img src={LandingLogo} alt="login" style={{ marginTop: 25 }} />
                </Paper>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '0.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <Typography fontFamily="Poppins" fontWeight={600} color="white" style={{ fontSize: '2.5rem' }}>
                    CustomizedUI
                  </Typography>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <div>
                  <Typography
                    sx={{ textAlign: 'center', width: '30rem' }}
                    fontFamily="Poppins"
                    fontWeight={500}
                    color="white"
                  >
                    Create, customize and deploy your own brand <br /> in minutes
                  </Typography>
                </div>
              </div>
            </StyledSection>
          </>
        )}

        <Container sx={{ backgroundColor: 'white' }} maxWidth="sm">
          <StyledContent>{AUTH_SECTION_OBJ[authNavigation]}</StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
