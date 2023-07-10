import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Tooltip,
  Badge,
  Box,
  Backdrop,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  styled,
  Stack,
  Container,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { remove } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useObjContext } from '../../../context/context';
import { storeactions, firestore } from '../../../firebase/firebase';
import AlertMessage from '../../../custom/AlertMessage';
import VersionSvg from '../../../assets/versionsvg.svg';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const CustomDialog = ({ open, setPurpose, purpose, selectedBrand }) => {
  const { user } = useObjContext();

  const generateValidationSchema = () => {
    if (purpose === 'brand') {
      return yup.object({
        brandname: yup.string().required('Please enter brand name'),
        versionname: yup.string().required('Please enter version name'),
      });
    }
    return yup.object({
      versionname: yup.string().required('Please enter version name'),
    });
  };

  const [showLoader, setShowLoader] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const formik = useFormik({
    validationSchema: generateValidationSchema(),
    initialValues:
      purpose === 'brand'
        ? {
            brandname: '',
            versionname: '',
          }
        : {
            versionname: '',
          },
    onSubmit: () => {
      if (purpose === 'brand') {
        handleAddBrand(formik.values.brandname, formik.values.versionname);
      } else {
        handleAddVersion(formik.values.versionname);
      }
    },
  });

  const handleAddBrand = async (brandname, versionname) => {
    try {
      setShowLoader(true);

      const { doc, setDoc, getDoc, collection } = storeactions;
      const { platformname } = user;

      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      const objCreation = {
        ...existingDoc.data(),
        [brandname]: {
          activeversion: '',
          versions: [{ name: versionname, createdBy: user.email, createdAt: new Date().toISOString() }],

          [versionname]: {
            template: {},
            createdBy: user.email,
            createdAt: new Date().toISOString(),
          },

          createdBy: user.email,
          createdAt: new Date().toISOString(),
        },
      };

      await setDoc(docRef, objCreation);

      setShowLoader(false);
      setMessage({
        type: 'success',
        text: 'Brand added successfully',
      });
    } catch (err) {
      console.log(err);
      setMessage({
        type: 'error',
        text: 'Failed to add brand',
      });
    }
  };

  const handleAddVersion = async (versionname) => {
    try {
      // for adding a version platform name, barnd name must exists
      setShowLoader(true);
      const { doc, getDoc, setDoc, collection } = storeactions;
      const platformname = localStorage.getItem('platformname');

      const docRef = doc(collection(firestore, 'platforms'), platformname);
      const existingDoc = await getDoc(docRef);

      if (existingDoc.exists()) {
        const documentData = existingDoc.data();
        const addedversions = documentData[selectedBrand].versions;
        addedversions.push({
          name: versionname,
          createdBy: user.email,
          createdAt: new Date().toISOString(),
        });

        const updatedDoc = {
          ...documentData,

          [selectedBrand]: {
            ...documentData[selectedBrand],

            versions: addedversions,

            [versionname]: {
              template: {},
              createdBy: user.email,
              createdAt: new Date().toISOString(),
            },
          },
        };

        await setDoc(docRef, updatedDoc);
      }

      setShowLoader(false);
      setMessage({
        type: 'success',
        text: 'Version added successfully',
      });
    } catch (err) {
      console.log(err);
      setMessage({
        type: 'error',
        text: 'Failed to add version',
      });
    }
  };

  return (
    <>
      <Dialog open={open} TransitionComponent={Transition} keepMounted maxWidth={'md'} fullWidth>
        {message.text ? (
          <Box sx={{ m: 2 }}>
            <AlertMessage message={message} setMessage={setMessage} />
          </Box>
        ) : null}
        <DialogTitle>{`Register a new ${purpose}`}</DialogTitle>

        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack direction={'column'} spacing={3} justifyContent={'flex-start'}>
              {purpose === 'brand' ? (
                <>
                  <TextField
                    name={'brandname'}
                    label="Enter brand name"
                    value={formik.values.brandname}
                    onChange={formik.handleChange}
                    variant="standard"
                    error={formik.touched.brandname && Boolean(formik.errors.brandname)}
                    helperText={formik.touched.brandname && formik.errors.brandname}
                  />
                  <TextField
                    name={'versionname'}
                    label="Enter version name"
                    value={formik.values.versionname}
                    onChange={formik.handleChange}
                    variant="standard"
                    error={formik.touched.versionname && Boolean(formik.errors.versionname)}
                    helperText={formik.touched.versionname && formik.errors.versionname}
                  />
                </>
              ) : (
                <>
                  <TextField
                    name={'versionname'}
                    label="Enter version name"
                    value={formik.values.versionname}
                    onChange={formik.handleChange}
                    variant="standard"
                    error={formik.touched.versionname && Boolean(formik.errors.versionname)}
                    helperText={formik.touched.versionname && formik.errors.versionname}
                  />
                </>
              )}

              <Stack direction={'row'} spacing={2}>
                <LoadingButton variant="contained" type="submit" loading={showLoader}>
                  Register
                </LoadingButton>
                <Button variant="contained" color={'error'} onClick={() => setPurpose('')}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PlatformVersionCard = ({
  name,
  createdBy,
  createdAt,
  isActive,
  selectedBrand,
  handleDeleteVersion,
  handleSetVersionActive,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { setEditingObj } = useObjContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditVersion = () => {
    try {
      setEditingObj({
        brandname: selectedBrand,
        version: name,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreview = () => {
    try {
      navigate(`/preview/${selectedBrand}/${name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card sx={{ width: 300, height: 380 }}>
      <CardHeader
        action={
          <IconButton aria-label="options" onClick={handleClick}>
            <Icon icon={'material-symbols:more-vert'} />
          </IconButton>
        }
        title={name}
        subheader={dayjs(createdAt).format('DD.MM.YYYY')}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleSetVersionActive} disabled={isActive}>
          Set as active
        </MenuItem>
        <MenuItem onClick={handleEditVersion}>Edit template</MenuItem>
        <MenuItem onClick={handleDeleteVersion} disabled={isActive}>
          Delete version
        </MenuItem>
      </Menu>
      <CardMedia component="img" height={150} sx={{ p: 1, mt: 1 }} image={VersionSvg} alt={name} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This version was added by <b>{createdBy}</b>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Stack direction={'row'} alignItems={'center'} width={'100%'}>
          <Tooltip title={'Preview'}>
            <IconButton aria-label="preview" onClick={() => handlePreview()}>
              <Icon icon={'material-symbols:visibility'} />
            </IconButton>
          </Tooltip>

          {isActive ? (
            <Tooltip title={'Active'}>
              <StyledBadge sx={{ ml: 'auto', mr: 1 }} overlap="circular" variant="dot" />
            </Tooltip>
          ) : null}
        </Stack>
      </CardActions>
    </Card>
  );
};

const Versions = () => {
  const { user } = useObjContext();

  const [purpose, setPurpose] = useState('');
  const [liveVersion, setLiveVersion] = useState('');
  const [versions, setVersions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [existingBrands, setExistingBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  const handleGetExistingBrands = async () => {
    try {
      setShowLoader(true);
      const { doc, getDoc, collection } = storeactions;
      const { platformname, designation } = user;

      if (designation === 'Admin') {
        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.data()) {
          const documentData = existingDoc.data();
          const tempBrands = Object.keys(documentData).map((k) => ({
            label: k,
          }));

          setExistingBrands(tempBrands);
          setSelectedBrand(tempBrands[0].label);
        }
      } else {
        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.data()) {
          setSelectedBrand(user.brandname);
        }
      }

      setShowLoader(false);
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const handleGetVersions = async () => {
    try {
      if (selectedBrand) {
        setShowLoader(true);
        const { doc, getDoc, collection } = storeactions;
        const { platformname } = user;

        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          const documentData = await existingDoc.data();
          const brandDoc = documentData[selectedBrand];

          const { activeversion } = brandDoc;
          setLiveVersion(activeversion);
          setVersions(brandDoc.versions);
        }

        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false);
    }
  };

  const handleSetVersionActive = async (tempversionname) => {
    try {
      const askConfirmation = window.confirm('Are you sure to set this version live?');

      if (askConfirmation) {
        setShowLoader(true);
        const { doc, getDoc, setDoc, collection } = storeactions;
        const { platformname } = user;
        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          const documentData = await existingDoc.data();
          const brandDoc = documentData[selectedBrand];

          const updatedBrandDoc = {
            ...brandDoc,
            activeversion: tempversionname,
          };

          const updatedDoc = {
            ...documentData,
            [selectedBrand]: updatedBrandDoc,
          };

          await setDoc(docRef, updatedDoc);
        }
        setLiveVersion(tempversionname);
        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLiveVersion((c) => c);
      setShowLoader(false);
    }
  };

  const handleDeleteVersion = async (tempversionname) => {
    try {
      const askConfirmation = window.confirm('Are you sure to delete this version?');

      if (askConfirmation) {
        setShowLoader(true);
        const { doc, getDoc, setDoc, collection } = storeactions;
        const { platformname } = user;
        const docRef = doc(collection(firestore, 'platforms'), platformname);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          const documentData = await existingDoc.data();
          const brandDoc = documentData[selectedBrand];
          const existingVersions = documentData[selectedBrand].versions;

          delete documentData[selectedBrand][tempversionname];

          remove(existingVersions, (v) => v.name === tempversionname);
          remove(versions, (v) => v.name === tempversionname);

          const updatedBrandDoc = {
            ...brandDoc,
            versions: existingVersions,
          };

          const updatedDoc = {
            ...documentData,
            [selectedBrand]: updatedBrandDoc,
          };

          await setDoc(docRef, updatedDoc);
        }

        setShowLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLiveVersion((c) => c);
      setShowLoader(false);
    }
  };

  const handleDialog = (temppurpose) => {
    try {
      setPurpose(temppurpose);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetExistingBrands();
  }, [user]);

  useEffect(() => {
    handleGetVersions();
  }, [selectedBrand]);

  return (
    <Container maxWidth={'xl'} sx={{ mt: 10 }}>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {user.designation === 'Admin' ? (
        <Box display={'flex'}>
          <Box>
            <Autocomplete
              disablePortal
              value={selectedBrand}
              onChange={(event, newValue) => {
                setSelectedBrand(newValue.label);
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.label) setSelectedBrand(newInputValue.label);
              }}
              options={existingBrands}
              sx={{ width: 350 }}
              ListboxProps={{ style: { maxHeight: 185 } }}
              renderInput={(params) => <TextField {...params} label="Choose brand" />}
            />
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Button variant="contained" sx={{ height: '7vh' }} onClick={() => handleDialog('brand')}>
              Register brand
            </Button>
          </Box>
        </Box>
      ) : null}

      <Grid container mt={3}>
        {versions.length > 0 ? (
          <>
            {versions.map((v, index) => (
              <Grid item xs={12} md={3} key={index}>
                <PlatformVersionCard
                  {...v}
                  isActive={liveVersion === v.name}
                  handleSetVersionActive={() => handleSetVersionActive(v.name)}
                  handleDeleteVersion={() => handleDeleteVersion(v.name)}
                  selectedBrand={selectedBrand}
                />
              </Grid>
            ))}
          </>
        ) : null}

        <Grid item xs={12} md={3}>
          <Box
            sx={{
              width: 300,
              height: 380,
              border: 'dotted 1px black',
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#dee2e6',
              },
            }}
            component={Card}
            onClick={() => handleDialog('version')}
          >
            <Stack direction={'column'} alignItems={'center'}>
              <Icon icon={'bi:plus'} width={30} />
              <Typography variant="subtitle1" color="text.secondary" textAlign={'center'}>
                Add new version under <br /> {selectedBrand}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {purpose ? (
        <CustomDialog open={Boolean(purpose)} setPurpose={setPurpose} purpose={purpose} selectedBrand={selectedBrand} />
      ) : null}
    </Container>
  );
};

export default Versions;
