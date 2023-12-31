import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  Tooltip,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  CircularProgress,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { nanoid } from 'nanoid';
import { StyledTextField } from '../../../../custom/TextField';
import { StyledButton } from '../../../../custom/Button';
import { useObjContext } from '../../../../context/context';
import { firestore, storeactions } from '../../../../firebase/firebase';
import { getExistingData } from '../../../../services/platform';

import ActiveFacebook from '../../../../assets/svg/activeSocialIcons/facebook.svg';
import ActiveInstagram from '../../../../assets/svg/activeSocialIcons/instagram.svg';
import ActiveLinkedin from '../../../../assets/svg/activeSocialIcons/linkedin.svg';
import ActiveTwitter from '../../../../assets/svg/activeSocialIcons/twitter.svg';
import ActiveYoutube from '../../../../assets/svg/activeSocialIcons/youtube.svg';

import InactiveFacebook from '../../../../assets/svg/inactiveSocialIcons/facebook.svg';
import InactiveInstagram from '../../../../assets/svg/inactiveSocialIcons/instagram.svg';
import InactiveLinkedin from '../../../../assets/svg/inactiveSocialIcons/linkedin.svg';
import InactiveTwitter from '../../../../assets/svg/inactiveSocialIcons/twitter.svg';
import InactiveYoutube from '../../../../assets/svg/inactiveSocialIcons/youtube.svg';

const RenderColumns = ({ header, links, selectedHeader, setSelectedHeader, handleRemoveHeader }) => (
  <Box sx={{ m: 1 }}>
    <Box
      sx={{
        width: 300,
        bgcolor: '#C8FACD',
        p: 1.5,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
      }}
    >
      <Typography variant="button">{header}</Typography>

      <Stack direction={'row'}>
        <Tooltip title="Remove header">
          <IconButton onClick={() => handleRemoveHeader()}>
            <Icon icon={'system-uicons:close'} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add link under header">
          <IconButton
            onClick={() => {
              if (selectedHeader === header) {
                setSelectedHeader('');
              } else setSelectedHeader(header);
            }}
            sx={
              header === selectedHeader
                ? {
                    bgcolor: '#006d77',
                    color: '#ffffff',
                    ':hover': {
                      bgcolor: '#006d77',
                      color: '#ffffff',
                    },
                  }
                : {}
            }
          >
            <Icon icon={'ei:plus'} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>

    {links ? (
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
        <Box>
          {links.map((l, i) => (
            <Box key={i}>
              <Tooltip title={l.url} key={i}>
                <Box
                  sx={{
                    width: 230,
                    bgcolor: '#C8FACD',
                    height: 60,
                    pl: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography variant="subtitle2">{l.label}</Typography>
                  <IconButton>
                    <Icon icon={'icon-park-twotone:close-one'} />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </Box>
    ) : null}
  </Box>
);

const Footer = () => {
  const validationSchema = yup.object({
    linkLabel: yup.string().required('*required'),
    linkUrl: yup.string().required('*required'),
  });

  const { user, editingObj, saveChangesToCloud } = useObjContext();
  const [headers, setHeaders] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [platforms, setPlatforms] = useState({});
  const [contents, setContents] = useState({});
  const [contactDetails, setContactDetails] = useState({
    email: '',
    phonenumber: '',
    tagline: '',
    showCard: false,
  });
  const [showUploadLoader, setShowUploadLoader] = useState(false);

  const platformIcons = {
    Facebook: {
      active: ActiveFacebook,
      inactive: InactiveFacebook,
      placeholder: 'Add Facebook profile link',
    },
    Instagram: {
      active: ActiveInstagram,
      inactive: InactiveInstagram,
      placeholder: 'Add Instagram profile link',
    },
    LinkedIn: {
      active: ActiveLinkedin,
      inactive: InactiveLinkedin,
      placeholder: 'Add LinkedIn profile link',
    },
    Twitter: {
      active: ActiveTwitter,
      inactive: InactiveTwitter,
      placeholder: 'Add Twitter profile link',
    },
    YouTube: {
      active: ActiveYoutube,
      inactive: InactiveYoutube,
      placeholder: 'Add Youtube profile link',
    },
  };

  const formik = useFormik({
    initialValues: {
      headerName: '',
    },
  });

  const formikLink = useFormik({
    validationSchema,
    initialValues: {
      linkLabel: '',
      linkUrl: '',
    },
    onSubmit: () => {
      const { linkLabel, linkUrl } = formikLink.values;
      if (contents[selectedHeader]) {
        const temp = contents[selectedHeader];
        temp.push({ id: nanoid(), label: linkLabel, url: linkUrl });
        setContents({ ...contents, [selectedHeader]: temp });
      } else {
        const temp = [{ id: nanoid(), label: linkLabel, url: linkUrl }];
        setContents({ ...contents, [selectedHeader]: temp });
      }
      formikLink.handleReset();
    },
  });

  const formikSocial = useFormik({
    initialValues: {
      socialLink: '',
    },
    onSubmit: () => {
      try {
        setPlatforms({ ...platforms, [selectedPlatform]: formikSocial.values.socialLink });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleSaveChanges = async () => {
    try {
      setShowUploadLoader(true);
      const platformname = localStorage.getItem('platformname');
      const { doc, getDoc, collection } = storeactions;

      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        const documentData = existingDoc.data();

        const { brandname, version } = editingObj;
        const { navbar } = documentData[brandname][version].template;

        saveChangesToCloud({
          footer: {
            platform: {
              name: platformname,
              logo: navbar.brandlogo,
            },
            headers: contents,
            socialLinks: platforms,
            contact: contactDetails,
          },
        });
      }

      setShowUploadLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddHeader = () => {
    try {
      if (headers.length < 3) {
        setHeaders((prevstate) => [...prevstate, { id: nanoid(), header: formik.values.headerName }]);
        setContents({ ...contents, [formik.values.headerName]: [] });
        setSelectedHeader('');
        formik.handleReset();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveHeader = (tempHeader) => {
    try {
      delete contents[tempHeader];
      setContents({ ...contents });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePlatformSelection = (tempPlatform) => {
    try {
      if (selectedPlatform === tempPlatform) {
        setSelectedPlatform('');
      } else {
        setSelectedPlatform(tempPlatform);
        if (platforms[tempPlatform]) {
          formikSocial.setValues({ ...formikSocial.values, socialLink: platforms[tempPlatform] });
        } else {
          formikSocial.setValues({ ...formikSocial.values, socialLink: '' });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleContactSubmit = (e) => {
    try {
      e.preventDefault();
      setContactDetails({
        ...contactDetails,
        showCard: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'footer' });
      if (existingData.headers) setContents(existingData.headers);
      if (existingData.socialLinks) setPlatforms(existingData.socialLinks);
      if (existingData.contact) setContactDetails(existingData.contact);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetExistingData();
  }, [user]);

  return (
    <Box sx={{ padding: 2 }} component={Paper}>
      <Grid container spacing={4} direction={'column'}>
        <Grid item md={7} xs={12}>
          <StyledTextField
            label={'Add header'}
            name="headerName"
            value={formik.values.headerName}
            onChange={formik.handleChange}
            disabled={headers.length > 3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddHeader} disabled={formik.values.headerName.length <= 0}>
                    <Icon icon={'icons8:plus'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: '95%' }}
          />

          <Box sx={{ mt: 1 }}>
            <FormHelperText>
              <Icon icon={'arcticons:letter-lowercase-circle-i'} style={{ color: 'black' }} /> Max. three headers can be
              added
            </FormHelperText>
          </Box>

          {selectedHeader ? (
            <Grid container sx={{ mt: 5, p: 1 }}>
              <Grid item xs={12}>
                <form onSubmit={formikLink.handleSubmit}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box>
                      <StyledTextField
                        label={'Add link label'}
                        name="linkLabel"
                        value={formikLink.values.linkLabel}
                        onChange={formikLink.handleChange}
                        error={formikLink.touched.linkLabel && Boolean(formikLink.errors.linkLabel)}
                        sx={{ width: 350 }}
                      />
                    </Box>
                    <Box sx={{ ml: 1 }}>
                      <StyledTextField
                        label={'Add url'}
                        name="linkUrl"
                        value={formikLink.values.linkUrl}
                        onChange={formikLink.handleChange}
                        error={formikLink.touched.linkUrl && Boolean(formikLink.errors.linkUrl)}
                        sx={{ width: 350 }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      mt: 1,
                    }}
                  >
                    <Box sx={{ ml: 1 }}>
                      <FormHelperText>
                        <Icon icon={'arcticons:letter-lowercase-circle-i'} style={{ color: 'black' }} /> Add links under
                        <b> {selectedHeader}</b>
                      </FormHelperText>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <StyledButton type="submit" variant="contained">
                      Add
                    </StyledButton>
                  </Box>
                </form>
              </Grid>
            </Grid>
          ) : null}

          {Object.keys(contents) ? (
            <Box sx={{ mt: 2, display: 'flex' }}>
              {Object.keys(contents).map((header, index) => (
                <div key={index}>
                  <RenderColumns
                    header={header}
                    links={contents[header]}
                    selectedHeader={selectedHeader}
                    setSelectedHeader={setSelectedHeader}
                    handleRemoveHeader={() => handleRemoveHeader(header)}
                    color={index === 0 ? 'red' : 'yellow'}
                  />
                </div>
              ))}
            </Box>
          ) : null}
        </Grid>

        <Grid item md={5} xs={12} sx={{ m: 1 }}>
          <Stack direction={'column'} spacing={2}>
            <Typography alignItems={'center'} fontSize={25}>
              {' '}
              Add Social Platform{' '}
            </Typography>

            <Stack spacing={3}>
              <Stack direction={'row'} spacing={3}>
                {Object.keys(platformIcons).map((i, index) => (
                  <Stack direction={'column'} alignItems={'center'} key={index}>
                    <IconButton onClick={() => handlePlatformSelection(i)}>
                      <img
                        alt={i}
                        src={selectedPlatform === i ? platformIcons[i].active : platformIcons[i].inactive}
                        style={{ height: 25, width: 25 }}
                      />
                    </IconButton>
                    {platforms[i] ? <Typography color={'#6c757d'}> ● </Typography> : null}
                  </Stack>
                ))}
              </Stack>

              <Stack direction={'column'}>
                <form onSubmit={formikSocial.handleSubmit}>
                  <TextField
                    placeholder={selectedPlatform === '' ? '' : platformIcons[selectedPlatform].placeholder}
                    name="socialLink"
                    value={formikSocial.values.socialLink}
                    onChange={formikSocial.handleChange}
                    sx={{ width: 350 }}
                  />
                  <br />

                  <StyledButton type="submit" sx={{ mt: 3 }}>
                    Add platform
                  </StyledButton>
                </form>

                <form onSubmit={(e) => handleContactSubmit(e)}>
                  <Stack direction={'column'} spacing={2} sx={{ mt: 2 }}>
                    <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        label={'Contact Number'}
                        name="phonenumber"
                        value={contactDetails.phonenumber}
                        onChange={(e) => setContactDetails({ ...contactDetails, phonenumber: e.target.value })}
                        sx={{ width: 350 }}
                      />

                      <TextField
                        label={'Contact Email'}
                        name="email"
                        value={contactDetails.email}
                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                        sx={{ width: 350 }}
                      />
                    </Stack>
                    <TextField
                      label={'Tag line'}
                      name="tagline"
                      value={contactDetails.tagline}
                      onChange={(e) => setContactDetails({ ...contactDetails, tagline: e.target.value })}
                      sx={{ width: 350, mt: 2 }}
                      multiline
                      rows={3}
                    />
                  </Stack>

                  <Stack direction={'row'} spacing={2} sx={{ mt: 1 }}>
                    <Button type="submit">Save</Button>
                    <Button
                      onClick={() => {
                        setContactDetails({
                          email: '',
                          phonenumber: '',
                          tagline: '',
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </Stack>
                </form>
              </Stack>

              {contactDetails.showCard ? (
                <>
                  <Card sx={{ width: 350, height: 250 }}>
                    <Typography variant="subtitle1" sx={{ p: 1 }}>
                      Contact Details
                    </Typography>
                    <CardContent>
                      <Stack direction={'column'} spacing={2}>
                        {contactDetails.email ? (
                          <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <Icon icon={'ic:baseline-mail'} width={20} />{' '}
                            <Typography>{contactDetails.email}</Typography>
                          </Stack>
                        ) : null}

                        {contactDetails.phonenumber ? (
                          <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <Icon icon={'mingcute:phone-fill'} width={20} />{' '}
                            <Typography>{contactDetails.phonenumber}</Typography>
                          </Stack>
                        ) : null}

                        <Typography>{contactDetails.tagline}</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 3 }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 45 }} onClick={() => handleSaveChanges()}>
            {showUploadLoader ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <Icon icon={'ion:cloud-upload'} width={20} />
            )}
          </StyledButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Footer;
