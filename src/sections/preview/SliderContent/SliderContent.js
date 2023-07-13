import React, { useState } from 'react';
import { Container, Paper, Typography, Grid, Box, Button, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

const TextCard = ({ content, link }) => (
  <Paper sx={{ p: 5 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <Typography sx={{ fontFamily: 'Wix Madefor Display' }}>{content}</Typography>
      <Box>
        <Button variant="text" href={link} sx={{ mt: 2 }}>
          Visit
        </Button>
      </Box>
    </Box>
  </Paper>
);

const TextOnly = ({ textonlycontent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCardChange = (direction) => {
    try {
      switch (direction) {
        case 'forward':
          if (currentIndex + 2 <= textonlycontent.length - 1) {
            setCurrentIndex((c) => c + 2);
          } else {
            setCurrentIndex(0);
          }
          break;
        case 'backward':
          if (currentIndex - 2 >= 0) {
            setCurrentIndex((c) => c - 2);
          }
          break;
        default:
          console.log('Invalid direction key');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
        {textonlycontent[currentIndex] ? (
          <Grid item xs={12} md={6}>
            <TextCard {...textonlycontent[currentIndex]} index={currentIndex} />
          </Grid>
        ) : null}
        {textonlycontent[currentIndex + 1] ? (
          <Grid item xs={12} md={6}>
            <TextCard {...textonlycontent[currentIndex + 1]} index={currentIndex} />
          </Grid>
        ) : null}
      </Grid>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} sx={{ mt: 2 }}>
        <IconButton onClick={() => handleCardChange('backward')} disabled={currentIndex === 0}>
          <Icon icon={'ic:round-arrow-left'} width={35} />
        </IconButton>
        <IconButton onClick={() => handleCardChange('forward')}>
          <Icon icon={'ic:round-arrow-right'} width={35} />
        </IconButton>
      </Box>
    </Box>
  );
};

const SliderContent = ({ slidercontent }) => {
  const { sectionTitle, contentType } = slidercontent;

  return (
    <Container maxWidth={'lg'} sx={{ mt: 10 }}>
      <Typography
        sx={{ fontFamily: 'Wix Madefor Display', fontWeight: 900, fontSize: 40, color: '#03045e', textAlign: 'center' }}
      >
        {sectionTitle}
      </Typography>

      {contentType === 'text' ? <TextOnly textonlycontent={slidercontent.tiles} /> : null}
    </Container>
  );
};

export default SliderContent;
