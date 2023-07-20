import React, { useEffect, useState, useCallback } from 'react';
import {
  Select,
  MenuItem,
  Box,
  Paper,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Alert,
  Tooltip,
  CircularProgress,
  Button,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react';
import { nanoid } from 'nanoid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase/firebase';
import { useObjContext } from '../../../../context/context';
import { StyledTextField } from '../../../../custom/TextField';
import { StyledButton } from '../../../../custom/Button';
import { getExistingData } from '../../../../services/platform';

const ImageOnlyTiles = ({ image, link }) => (
  <Paper>
    <Box component={Paper} elevation={5} sx={{ borderRadius: 1, height: 320, p: 1 }}>
      <Tooltip title={link}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ height: 250, width: 400 }}>
            <img alt={link} src={image} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
          </Box>
        </Box>
      </Tooltip>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Button color={'error'} sx={{ mt: 1 }}>
          {' '}
          Remove{' '}
        </Button>
      </Box>
    </Box>
  </Paper>
);

const TextOnlyTiles = ({ content, link }) => (
  <Paper sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 300 }}>
      <Typography sx={{ fontFamily: 'Wix Madefor Display' }}>{content}</Typography>
      {link ? (
        <Box sx={{ mt: 1 }}>
          <Typography component={'a'} href={link} target="_blank">
            {link}
          </Typography>
        </Box>
      ) : null}
    </Box>
    <Button color={'error'} sx={{ mt: 2 }}>
      {' '}
      Remove{' '}
    </Button>
  </Paper>
);

const SliderContent = () => {
  const [sliderContentTiles, setSliderContentTiles] = useState([]);

  const { user, editingObj, saveChangesToCloud } = useObjContext();

  const [tilesType, setTilesType] = useState('text'); // text / image
  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');

  const formik = useFormik({
    initialValues: {
      titleContent: '',
      titleLink: '',
    },
    onSubmit: () => {
      if (tilesType === 'text') {
        setSliderContentTiles((prevstate) => [
          ...prevstate,
          { id: nanoid(), content: formik.values.titleContent, link: formik.values.titleLink },
        ]);
        formik.handleReset();
      } else if (acceptedFiles.length > 0) {
        setSliderContentTiles((prevstate) => [
          ...prevstate,
          { id: nanoid(), image: uploadedFileUrl, link: formik.values.titleLink },
        ]);
        formik.handleReset();
        acceptedFiles.length = 0;
        setUploadedFileUrl('');
      } else {
        setShowAlert(true);
      }
    },
  });

  const handleTileTypeChange = (e) => {
    try {
      if (sliderContentTiles.length > 0) {
        const confirmChange = window.confirm('Added tiles will be deleted. Are you sure?');
        if (confirmChange) {
          setTilesType(e.target.value);
          setSliderContentTiles([]);
        }
      } else {
        setTilesType(e.target.value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: useCallback((acceptedFiles) => {
      try {
        if (acceptedFiles.length > 0) {
          setShowLoader(true);

          const file = acceptedFiles[0];
          const id = nanoid();

          const pltf = localStorage.getItem('platformname');

          const storageRef = ref(storage, `/${pltf}/slider-content/${id}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              console.log('file uploading..');
            },
            (err) => {
              setShowLoader(false);
              console.log(err);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setUploadedFileUrl(url);
              });
              setShowLoader(false);
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    }, []),
  });

  const handleModifyMainObj = () => {
    try {
      setShowUploadLoader(true);
      saveChangesToCloud({
        slidercontent: {
          sectionTitle,
          contentType: tilesType,
          tiles: sliderContentTiles,
        },
      });
      setShowUploadLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'slidercontent' });
      if (existingData.tiles) {
        setTilesType(existingData.contentType);
        setSectionTitle(existingData.sectionTitle);
        setSliderContentTiles(existingData.tiles);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetExistingData();
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  return (
    <Box sx={{ padding: 5 }} component={Paper}>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ width: '50%' }}>
          <Box sx={{ width: '100%' }}>
            <TextField
              label="Section Title"
              name="sectionTitle"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              sx={{ width: '100%' }}
            />
            <FormHelperText>This title will appear on the top of the section</FormHelperText>
          </Box>
          <Select
            value={tilesType}
            onChange={(e) => {
              handleTileTypeChange(e);
            }}
            sx={{
              width: 'inherit',
              '.MuiSelect-select': {
                fontFamily: 'Wix MadeFor Display',
              },
              mt: 2,
            }}
          >
            {[
              { name: 'Text Only', value: 'text' },
              { name: 'Image Only', value: 'image' },
            ].map((op, index) => (
              <MenuItem sx={{ fontFamily: 'Wix MadeFor Display' }} key={index} value={op.value}>
                {op.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
          <Icon icon={'pajamas:issue-type-incident'} />
          {tilesType === 'text' ? (
            <FormHelperText sx={{ ml: 1 }}>Content tiles will contain only text</FormHelperText>
          ) : (
            <FormHelperText sx={{ ml: 1 }}>Content tiles will contain only image</FormHelperText>
          )}
        </Box>
      </Box>

      <Box>
        {tilesType === 'text' ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={12}>
              <form onSubmit={formik.handleSubmit}>
                <Box>
                  <StyledTextField
                    label={'Add content for tile'}
                    name="titleContent"
                    value={formik.values.titleContent}
                    onChange={formik.handleChange}
                    style={{ width: '100%' }}
                    required
                    multiline
                    rows={5}
                  />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <StyledTextField
                    name="titleLink"
                    value={formik.values.titleLink}
                    onChange={formik.handleChange}
                    sx={{
                      width: '100%',
                      '.MuiInputLabel-root': {
                        fontFamily: 'Wix MadeFor Display',
                      },
                      '.MuiInputBase-input': {
                        fontFamily: 'Wix MadeFor Display',
                      },
                    }}
                    helperText={'Add link to the content (optional)'}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <StyledButton type="submit">Add tile</StyledButton>
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                {sliderContentTiles.map((c, index) => (
                  <Grid item xs={4} md={4} key={index}>
                    <TextOnlyTiles {...c} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={12}>
              <form onSubmit={formik.handleSubmit}>
                <Box
                  sx={{
                    bgcolor: '#F4F6F8',
                    px: 5,
                    mt: 0.5,
                    height: 220,
                    width: '100%',
                    borderRadius: 2,
                    borderStyle: 'dotted',
                    borderColor: isDragActive ? '#007B55' : '#919EAB',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    {...getRootProps({ className: 'dropzone' })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <Typography>Drop</Typography>
                    ) : (
                      <>
                        {uploadedFileUrl ? (
                          <Box sx={{ display: 'flex' }}>
                            <Icon icon={'tabler:file-filled'} width={20} /> <Typography>File Uploaded</Typography>
                          </Box>
                        ) : (
                          <Box>
                            <>
                              {showLoader ? (
                                <>
                                  <CircularProgress size={15} sx={{ color: 'black' }} />
                                </>
                              ) : (
                                <>
                                  <Typography>Drag 'n' drop or image for content</Typography>
                                </>
                              )}
                            </>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                  <StyledTextField
                    name="titleLink"
                    value={formik.values.titleLink}
                    onChange={formik.handleChange}
                    sx={{
                      width: '100%',
                      '.MuiInputLabel-root': {
                        fontFamily: 'Wix MadeFor Display',
                      },
                      '.MuiInputBase-input': {
                        fontFamily: 'Wix MadeFor Display',
                      },
                    }}
                    helperText={'Add link to the content (optional)'}
                  />
                </Box>

                {showAlert ? (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="error"> Please add image for the tile </Alert>
                  </Box>
                ) : null}

                <Box sx={{ mt: 2 }}>
                  <StyledButton type="submit">Add tile</StyledButton>
                </Box>
              </form>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                {sliderContentTiles.map((c, index) => (
                  <Grid item xs={4} md={3} key={index}>
                    <ImageOnlyTiles {...c} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 40 }} variant={'contained'} onClick={() => handleModifyMainObj()}>
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

export default SliderContent;
