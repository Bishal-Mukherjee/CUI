import { Box, Paper, Typography, Stack } from '@mui/material';
import React from 'react';

const Articles = ({ article }) => {
  const { content } = article;
  return (
    <>
      <Typography
        sx={{
          fontFamily: 'Wix Madefor Display',
          fontWeight: 900,
          fontSize: 40,
          color: '#03045e',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        {content.title}
      </Typography>

      <Box
        sx={{
          padding: 5,
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        component={Paper}
      >
        <Stack direction={'column'} spacing={3}>
          <Typography sx={{ fontSize: 15 }}>{content.text}</Typography>
        </Stack>
      </Box>
    </>
  );
};

export default Articles;
