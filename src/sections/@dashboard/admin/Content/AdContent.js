import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  FormHelperText,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { remove } from 'lodash';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { StyledTextField } from '../../../../custom/TextField';
import { StyledButton } from '../../../../custom/Button';
import { useObjContext } from '../../../../context/context';
import { storage } from '../../../../firebase/firebase';
import ContentSvg from '../../../../assets/svg/content.svg';
import { getExistingData } from '../../../../services/platform';

const ContentCard = ({ title, description, link, image, handleRemoveContent }) => (
  <Card>
    <CardMedia sx={{ height: 180 }} image={image || ContentSvg} title="green iguana" />
    <Tooltip title={link}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>

        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary sx={{ ml: -2 }} expandIcon={<Icon icon={'ep:arrow-down-bold'} />}>
            Description
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ ml: -2 }}>{description}</Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Tooltip>

    <CardActions>
      <Button color={'error'} size="small" onClick={() => handleRemoveContent()}>
        Remove
      </Button>
    </CardActions>
  </Card>
);

const Content = () => {
  const [contentTiles, setContentTiles] = useState([]);

  const validationSchema = yup.object({
    name: yup.string().required('*required'),
    description: yup.string().required('*required'),
  });

  const { user, editingObj, saveChangesToCloud } = useObjContext();
  const [sectionTitle, setSectionTitle] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [showUploadLoader, setShowUploadLoader] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      link: '',
      description: '',
    },
    onSubmit: () => {
      handleAddProduct();
    },
  });

  const handleAddProduct = () => {
    try {
      if (acceptedFiles.length > 0) {
        setContentTiles((prevstate) => [
          ...prevstate,
          {
            id: nanoid(),
            name: formik.values.name,
            description: formik.values.description,
            link: formik.values.link,
            image: uploadedFileUrl,
          },
        ]);
        formik.handleReset();
        acceptedFiles.length = 0;
      } else {
        setShowAlert(true);
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

          const platformname = localStorage.getItem('platformname');
          const storageRef = ref(storage, `${platformname}/content/${id}`);
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

  const handleRemoveContent = (contentid) => {
    try {
      remove(contentTiles, (p) => p.id === contentid);
      setContentTiles([...contentTiles]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleModifyMainObj = () => {
    try {
      setShowUploadLoader(true);
      saveChangesToCloud({
        content: {
          sectionTitle,
          tiles: contentTiles,
        },
      });
      setShowUploadLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'content' });
      if (existingData.tiles) setContentTiles(existingData.tiles);
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
      <Box sx={{ width: '50%' }}>
        <StyledTextField
          label="Section Title"
          name="sectionTitle"
          vale={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <FormHelperText>This title will appear on the top of the content section</FormHelperText>
      </Box>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                  {acceptedFiles.length > 0 ? (
                    <Box sx={{ display: 'flex' }}>
                      <Icon icon={'tabler:file-filled'} width={20} />{' '}
                      <Typography>{acceptedFiles.length} files</Typography>
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
                            <Typography>Drag 'n' drop or select image for the content slide</Typography>
                          </>
                        )}
                      </>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 1.5 }}>
              <StyledTextField
                label={'Title'}
                name="name"
                value={formik.values.name}
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
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.errors.name && formik.errors.name}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <StyledTextField
                label="Add content"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                style={{ width: '100%' }}
                required
                multiline
                rows={4}
              />
            </Box>

            <Box sx={{ mt: 1.5, display: 'flex' }}>
              <StyledTextField
                name="link"
                value={formik.values.link}
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
                <Alert severity="error"> Please add image for content </Alert>
              </Box>
            ) : null}
            <Box sx={{ mt: 3 }}>
              <StyledButton type="submit">Add</StyledButton>
            </Box>
          </form>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid sx={{ mt: 2 }} container spacing={1}>
            {contentTiles.map((p, index) => (
              <Grid item xs={6} md={3} key={index}>
                <ContentCard
                  title={p.name}
                  description={p.description}
                  link={p.link}
                  handleRemoveContent={() => handleRemoveContent(p.id)}
                  image={p.image}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 45 }} variant={'contained'} onClick={() => handleModifyMainObj()}>
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

export default Content;
