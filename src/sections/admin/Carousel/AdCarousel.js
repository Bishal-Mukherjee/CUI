import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Typography, Box, Tooltip, Alert, CircularProgress, Button, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import { remove } from 'lodash';
import { nanoid } from 'nanoid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { StyledTextField } from '../../../custom/TextField';
import { StyledButton } from '../../../custom/Button';
import { storage } from '../../../firebase/firebase';
import { useObjContext } from '../../../context/context';
import { getExistingData } from '../../../services/platform';

const Carousel = () => {
  const [addedFiles, setAddedFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(false);

  const { user, editingObj, saveChangesToCloud } = useObjContext();

  const formik = useFormik({
    initialValues: {
      link: '',
    },
    onSubmit: () => {
      console.log(formik.values);
    },
  });

  const handleFileAdd = () => {
    try {
      if (acceptedFiles.length > 0) {
        setAddedFiles((prevstate) => [
          ...prevstate,
          { id: nanoid(), image: uploadedFileUrl, link: formik.values.link },
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
    onDrop: useCallback((acceptedFiles) => {
      try {
        if (acceptedFiles.length > 0) {
          setShowLoader(true);

          const file = acceptedFiles[0];
          const id = nanoid();

          const platformname = localStorage.getItem('platformname');
          const storageRef = ref(storage, `/${platformname}/carousel/${id}`);
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

  const handleFileRemove = (file) => {
    try {
      remove(addedFiles, (n) => n.id === file.id);
      setAddedFiles([...addedFiles]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (addedFiles.length > 0) {
        setShowUploadLoader(true);
        saveChangesToCloud({
          carousel: {
            slides: addedFiles,
          },
        });
        setShowUploadLoader(false);
      } else {
        console.log('No content added!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'carousel' });
      if (existingData.slides) setAddedFiles(existingData.slides);
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
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              bgcolor: '#F4F6F8',
              px: 5,
              mt: 0.5,
              height: 220,
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
                    <>
                      {showLoader ? (
                        <>
                          <CircularProgress size={15} sx={{ color: 'black' }} />
                        </>
                      ) : (
                        <>
                          <Typography>Drag 'n' drop or select image for slide</Typography>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ width: '100%', mt: 2 }}>
            <form onSubmit={formik.handleSubmit}>
              <StyledTextField
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                sx={{ width: '100%' }}
                helperText={'Add link for the image (optional)'}
              />
              {showAlert ? (
                <Box sx={{ mt: 2, width: '100%' }}>
                  <Alert severity="error"> Please add image for carousel </Alert>
                </Box>
              ) : null}
              <Box sx={{ mt: 3 }}>
                <StyledButton onClick={() => handleFileAdd()}>Add</StyledButton>
              </Box>
            </form>
          </Box>
        </Grid>

        <Grid item xs={12} md={12} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {addedFiles.map((file, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box component={Paper} elevation={5} sx={{ borderRadius: 1, minWidth: 350, height: 320, p: 1 }}>
                  <Tooltip title={file.link}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box sx={{ height: 250, width: 350 }}>
                        <img alt={index} src={file.image} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                      </Box>
                    </Box>
                  </Tooltip>
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Button color={'error'} onClick={() => handleFileRemove(file)}>
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 40 }} variant={'contained'} onClick={() => handleSaveChanges()}>
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

export default Carousel;
