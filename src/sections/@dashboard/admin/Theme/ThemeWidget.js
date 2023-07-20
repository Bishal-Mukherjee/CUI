import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import ThemeDrawer from './ThemeDrawer';

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(25),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.7 },
}));

export default function ThemeWidget() {
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  return (
    <StyledRoot>
      <Box onClick={() => setShowThemeDrawer(true)}>
        <Tooltip title={'Customize Theme'}>
          <Icon icon="mdi:paint-outline" width={24} height={24} style={{ color: '#ff006e' }} />
        </Tooltip>
      </Box>

      {showThemeDrawer ? <ThemeDrawer open={showThemeDrawer} setOpen={setShowThemeDrawer} /> : null}
    </StyledRoot>
  );
}
