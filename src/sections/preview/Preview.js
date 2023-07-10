import React from 'react';
import { useOutletContext } from 'react-router-dom';
// @mui
import { Container, Box, Typography, FormHelperText, Grid } from '@mui/material';
// helmet
import { Helmet } from 'react-helmet-async';
// components
import Carousel from './Carousel/Carousel';
import Products from './Products/Products';
import Form from './Form/Form';
import Content from './Content/Content';
import SliderContent from './SliderContent/SliderContent';
import Footer from './Footer/Footer';

const PreviewSection = () => {
  const [mainObj, version] = useOutletContext();
  return (
    <>
      <Helmet>
        <title> Preview | {version} </title>
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
            {mainObj['slider-content'] ? <SliderContent slidercontent={mainObj['slider-content']} /> : null}
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

export default PreviewSection;
