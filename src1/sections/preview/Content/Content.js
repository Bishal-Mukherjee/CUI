import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Link,
  Paper,
  Container,
  Tooltip,
  CardHeader,
} from '@mui/material';

const ContentCard = ({ name, image, description, link }) => (
  <Card sx={{ borderRadius: 1 }} component={Paper} elevation={10}>
    <CardHeader sx={{ textAlign: 'center' }} title={name} />
    <CardMedia sx={{ margin: 1, height: 220, borderRadius: 1 }} image={image} title={name} />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Tooltip title={link}>
        <Link href={link}>
          <Button size="medium">Visit</Button>
        </Link>
      </Tooltip>
    </CardActions>
  </Card>
);

const Content = ({ content }) => {
  const { sectionTitle, tiles } = content;

  return (
    <Container maxWidth sx={{ mt: 10 }}>
      <Typography
        sx={{ fontFamily: 'Wix Madefor Display', fontWeight: 900, fontSize: 40, color: '#03045e', textAlign: 'center' }}
      >
        {sectionTitle || 'Content'}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 3, justifyContent: 'center' }}>
        {tiles.map((t, index) => (
          <Grid item xs={12} md={3} key={index}>
            <ContentCard {...t} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Content;
