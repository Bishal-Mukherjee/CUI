import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, Box, Typography, FormHelperText, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Carousel from '../preview/Carousel/Carousel';
import Products from '../preview/Products/Products';
import Form from '../preview/Form/Form';
import Content from '../preview/Content/Content';
import SliderContent from '../preview/SliderContent/SliderContent';
import Footer from '../preview/Footer/Footer';

const LiveSection = () => {
  const [mainObj] = useOutletContext();

  const brandname = 'WhatsApp';

  return (
    <>
      <Helmet>
        <title> {brandname} </title>
      </Helmet>

      <Container maxWidth={'xl'}>
        {Object.keys(mainObj).length ? (
          <>
            {mainObj.carousel ? <Carousel carousel={mainObj.carousel} /> : null}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} md={6}>
                {mainObj.products ? <Products addedproducts={mainObj.products} /> : null}
              </Grid>
              <Grid item xs={12} md={6}>
                {mainObj.form ? <Form form={mainObj.form} /> : null}
              </Grid>
            </Grid>
            {mainObj.content ? <Content content={mainObj.content} /> : null}
            {mainObj.slidercontent ? <SliderContent slidercontent={mainObj.slidercontent} /> : null}
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Typography>Preview unavailable!</Typography>
            <FormHelperText>Add content to view</FormHelperText>
          </Box>
        )}
      </Container>

      {mainObj.footer ? <Footer footer={mainObj.footer} navDetails={mainObj.navbar} /> : null}
    </>
  );
};

export default LiveSection;
