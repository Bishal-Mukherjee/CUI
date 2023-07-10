import React, { useEffect, useState } from 'react';
// import { styled } from '@mui/material/styles';
import { Box, Typography, Drawer, CircularProgress } from '@mui/material';
// import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function ThemeDrawer({ open, setOpen }) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 3000);
  }, []);

  return (
    <Box>
      <Drawer anchor={'right'} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 320, height: '100%' }}>
          {showLoader ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress sx={{ color: 'black' }} />
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: '100%' }}>
              <Typography>Theme Drawer</Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
