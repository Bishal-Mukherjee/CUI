import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Grid, Paper, Tab, Tabs, Typography, Box, Tooltip, IconButton } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import { Icon } from '@iconify/react';

import { useObjContext } from '../../../../context/context';

import Versions from '../../@versions/Versions';

import Navbar from '../Navbar/AdNavbar';
import Carousel from '../Carousel/AdCarousel';
import Product from '../Product/AdProduct';
import Article from '../Article/AdArticle';
import CustomizableForm from '../Form/CustomizableForm';
import Content from '../Content/AdContent';
import SliderContent from '../SliderContent/AdSliderContent';
import Footer from '../Footer/AdFooter';

import { StyledButton } from '../../../../custom/Button';
import ThemeWidget from '../Theme/ThemeWidget';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  //   paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function AdminPanel() {
  const navigate = useNavigate();
  const { editingObj, setEditingObj } = useObjContext();

  const [selectedTab, setSelectedTab] = useState('navbar');

  const tabs = [
    { name: 'Navbar', slug: 'navbar' },
    { name: 'Carousel', slug: 'carousel' },
    { name: 'Product', slug: 'product' },
    { name: 'Article', slug: 'article' },
    { name: 'Form', slug: 'form' },
    { name: 'Content', slug: 'content' },
    { name: 'Slider Content', slug: 'slider-content' },
    { name: 'Footer', slug: 'footer' },
  ];

  const NAVIGATION_TAB = {
    navbar: <Navbar />,
    carousel: <Carousel />,
    product: <Product />,
    article: <Article />,
    form: <CustomizableForm />,
    content: <Content />,
    'slider-content': <SliderContent />,
    footer: <Footer />,
  };

  const handleTabChange = (_, newValue) => {
    try {
      const url = window.location.href;
      if (url.includes('#')) {
        const newUrl = `${url.substring(0, url.indexOf('#'))}#${newValue}`;
        window.location.replace(newUrl);
      } else {
        const newUrl = `${url}#${newValue}`;
        window.location.replace(newUrl);
      }
    } catch (err) {
      console.log(err);
    }
    setSelectedTab(newValue);
  };

  const handleRedirect = () => {
    try {
      const url = window.location.href;
      if (url.includes('#')) {
        const loc = url.split('#')[1];
        setSelectedTab(loc);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreviewAction = () => {
    try {
      const isConfirmed = window.confirm('Did you save the current changes?');
      if (isConfirmed) {
        const { brandname, version } = editingObj;
        window.open(`/preview/${brandname}/${version}`, '_blank');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleRedirect();
  }, [window.location.href]);

  return (
    <StyledRoot>
      <Helmet>
        <title> Admin </title>
      </Helmet>
      <Main>
        {editingObj.version ? (
          <>
            <Box my={2} display={'flex'} alignItems={'center'}>
              <IconButton onClick={() => setEditingObj({})}>
                <Icon icon={'material-symbols:arrow-back-ios-new-rounded'} />
              </IconButton>
              <Typography textAlign={'center'} fontFamily={'Wix MadeFor Display'} fontSize={20} p={1}>
                {editingObj.brandname} | {editingObj.version}
              </Typography>
            </Box>

            <Grid container component={Paper} sx={{ mb: 2, border: 'solid 1px #6c757d', alignItems: 'center' }}>
              <Tabs
                sx={{ display: 'flex', p: 1 }}
                value={selectedTab}
                onChange={(_, newValue) => handleTabChange(_, newValue)}
              >
                {tabs.map((t, index) => (
                  <Tab
                    key={index}
                    value={t.slug}
                    label={<Typography fontFamily={'Wix MadeFor Display'}>{t.name}</Typography>}
                    disableRipple
                  />
                ))}
              </Tabs>

              <Box sx={{ ml: 'auto', mr: 1 }}>
                <Tooltip title={'Preview'}>
                  <StyledButton sx={{ height: '5vh' }} onClick={() => handlePreviewAction()}>
                    <Icon icon={'mdi:visibility'} style={{ marginRight: 0.5 }} width={20} />
                  </StyledButton>
                </Tooltip>
              </Box>
            </Grid>

            <>{NAVIGATION_TAB[selectedTab]}</>

            <ThemeWidget />
          </>
        ) : (
          <Versions />
        )}
      </Main>
    </StyledRoot>
  );
}
