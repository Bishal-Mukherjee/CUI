import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Tooltip,
  Alert,
  CircularProgress,
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
import { storage } from '../../../../firebase/firebase';
import { useObjContext } from '../../../../context/context';
import { getExistingData } from '../../../../services/platform';

const ProductCard = ({ name, description, link, image, handleRemoveProduct }) => (
  <Card>
    <CardMedia sx={{ height: 180 }} image={image} title={name} />
    <Tooltip title={link}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Tooltip>

    <CardActions>
      <Button color={'error'} size="small" onClick={() => handleRemoveProduct()}>
        Remove
      </Button>
    </CardActions>
  </Card>
);

const Product = () => {
  const [addedProducts, setAddedProducts] = useState([]);

  const validationSchema = yup.object({
    name: yup.string().required('*required'),
    description: yup.string().required('*required'),
  });

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

  const { user, editingObj, saveChangesToCloud } = useObjContext();
  const [showAlert, setShowAlert] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: useCallback((acceptedFiles) => {
      try {
        if (acceptedFiles.length > 0) {
          setShowLoader(true);

          const file = acceptedFiles[0];
          const id = nanoid();

          const platformname = localStorage.getItem('platformname');
          const storageRef = ref(storage, `${platformname}/products/${id}`);
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

  const handleAddProduct = () => {
    try {
      if (acceptedFiles.length > 0) {
        setAddedProducts((prevstate) => [
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
        setUploadedFileUrl('');
      } else {
        setShowAlert(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveProduct = (productid) => {
    try {
      remove(addedProducts, (p) => p.id === productid);
      setAddedProducts([...addedProducts]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveChanges = () => {
    try {
      setShowUploadLoader(true);
      saveChangesToCloud({
        products: {
          products: addedProducts,
        },
      });
      setShowUploadLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'products' });
      if (existingData.products) setAddedProducts(existingData.products);
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
                  {uploadedFileUrl.length > 0 ? (
                    <Box sx={{ display: 'flex' }}>
                      <Icon icon={'tabler:file-filled'} width={20} /> <Typography>File uploaded!</Typography>
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
                            <Typography>Drag 'n' drop or select image for brand logo</Typography>
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
                label={'Product Name'}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                sx={{
                  width: '100%',
                  '.MuiInputLabel-root': {
                    fontFamily: 'Wix MadeFor Display',
                  },
                  '.MuiInputBaseInput': {
                    fontFamily: 'Wix MadeFor Display',
                  },
                }}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.errors.name && formik.errors.name}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <StyledTextField
                multiline
                rows={5}
                label="Add product description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                style={{
                  width: '100%',
                  '.MuiInputLabel-root': {
                    fontFamily: 'Wix MadeFor Display',
                  },
                  '.MuiInputBaseInput': {
                    fontFamily: 'Wix MadeFor Display',
                  },
                }}
                required
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
                  '.MuiInputBaseInput': {
                    fontFamily: 'Wix MadeFor Display',
                  },
                }}
                helperText={'Add link to the product (optional)'}
              />
            </Box>
            {showAlert ? (
              <Box sx={{ mt: 2, width: '100%' }}>
                <Alert severity="error"> Please add image for product </Alert>
              </Box>
            ) : null}
            <Box sx={{ mt: 3 }}>
              <StyledButton type="submit">Add</StyledButton>
            </Box>
          </form>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={1} sx={{ mt: 1, mb: 1, justifyContent: 'flex-start' }}>
            {addedProducts.map((p, index) => (
              <Grid item xs={12} md={3} key={index}>
                <ProductCard
                  name={p.name}
                  description={p.description}
                  link={p.link}
                  image={p.image}
                  handleRemoveProduct={() => handleRemoveProduct(p.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default Product;
