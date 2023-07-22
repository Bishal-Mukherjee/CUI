import React from 'react';
import {
  Box,
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
} from '@mui/material';

const trimText = (text) => {
  if (text) {
    if (text.length >= 50) {
      return `${text.substring(0, 51)} ...`;
    }
    return text;
  }
  return '';
};

const ProductCard = ({ name, image, description, link }) => (
  <Card sx={{ maxWidth: '100%', borderRadius: 1 }} component={Paper} elevation={10}>
    <CardMedia sx={{ height: 180 }} image={image} title={name} />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {trimText(description)}
      </Typography>
    </CardContent>
    <CardActions>
      <Link href={link} target="_blank">
        <Button size="small">View</Button>
      </Link>
    </CardActions>
  </Card>
);

const Products = ({ addedproducts }) => {
  const { products } = addedproducts;

  return (
    <Container maxWidth sx={{ mt: 5 }}>
      <Grid sx={{ mt: 1, justifyContent: 'center' }} container spacing={2}>
        {products ? (
          <>
            {products.map((product, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box>
                  <ProductCard {...product} />
                </Box>
              </Grid>
            ))}
          </>
        ) : null}
      </Grid>
    </Container>
  );
};

export default Products;
