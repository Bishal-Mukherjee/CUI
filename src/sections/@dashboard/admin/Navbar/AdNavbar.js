import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Checkbox,
  FormHelperText,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { remove } from 'lodash';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase/firebase';
import { useObjContext } from '../../../../context/context';
import { StyledTextField } from '../../../../custom/TextField';
import { StyledButton } from '../../../../custom/Button';
import { getExistingData } from '../../../../services/platform';

const trimText = (text) => {
  try {
    if (text) {
      if (text.length > 30) {
        return `${text.substring(0, 31)}...`;
      }
      return text;
    }
    return '';
  } catch (err) {
    console.log(err);
    return '';
  }
};

const NavItem = (props) => {
  const { item, handleRemoveItem } = props;
  return (
    <Box
      sx={{
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        borderWidth: 5,
        borderColor: 'black',
      }}
      component={Paper}
      elevation={8}
    >
      <Typography sx={{ p: 2, color: 'black' }}>{trimText(item)}</Typography>
      <IconButton onClick={() => handleRemoveItem()}>
        <Icon icon={'zondicons:close-solid'} color={'black'} />
      </IconButton>
    </Box>
  );
};

const NavItemMenu = (props) => {
  const { item, subItems, handleRemoveItem } = props;
  const [expanded, setExpanded] = useState(false);
  return (
    <Accordion
      sx={{
        borderRadius: 1,
        p: 0.5,
        cursor: 'pointer',
      }}
      component={Paper}
      elevation={8}
      expanded={expanded}
    >
      <Box sx={{ display: 'flex' }}>
        <AccordionSummary>
          <Typography sx={{ color: 'black' }}>{trimText(item)}</Typography>
        </AccordionSummary>

        <IconButton sx={{ ml: 'auto' }} onClick={() => setExpanded((s) => !s)}>
          <Icon icon={expanded ? 'mingcute:up-line' : 'mingcute:down-line'} style={{ color: 'black' }} />
        </IconButton>
        <IconButton onClick={() => handleRemoveItem()}>
          <Icon icon={'zondicons:close-solid'} color={'black'} />
        </IconButton>
      </Box>

      <AccordionDetails>
        {subItems.map((subItem, index) => (
          <Typography key={index}>{subItem.label}</Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const Navbar = () => {
  const validationSchema = yup.object({
    menuItemLabel: yup.string().required('*required'),
    menuItemLink: yup.string(),
  });

  const [menuItems, setMenuItems] = useState({});
  const [isMultipleLinks, setMultipleLinks] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const [navButton, setNavButton] = useState({
    label: '',
    link: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [subItem, setSubItem] = useState({
    subLinkLabel: '',
    subLinkUrl: '',
  });
  const [hasButton, setHasButton] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const { user, editingObj, saveChangesToCloud } = useObjContext();

  const formik = useFormik({
    validationSchema,
    initialValues: {
      menuItemLabel: '',
      menuItemLink: '',
      buttonLabel: '',
      buttonLink: '',
    },
    onSubmit: () => {
      try {
        if (formik.values.menuItemLink && !isMultipleLinks) {
          setMenuItems({ ...menuItems, ...{ [formik.values.menuItemLabel]: formik.values.menuItemLink } });
        }
        if (isMultipleLinks) {
          setMenuItems({ ...menuItems, ...{ [formik.values.menuItemLabel]: subItems } });
        }

        formik.handleReset();
        setSubItems([]);
        setMultipleLinks(false);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleRemoveItem = (itemlabel) => {
    try {
      delete menuItems[itemlabel];
      setMenuItems({ ...menuItems });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubItem = (operation, subLinkLabel) => {
    try {
      if (operation === 'add') {
        if (Object.values(subItem).length > 0) {
          setSubItems((prevstate) => [...prevstate, { label: subItem.subLinkLabel, link: subItem.subLinkUrl }]);
          setSubItem({ subLinkLabel: '', subLinkUrl: '' });
        }
      }

      if (operation === 'remove') {
        remove(subItems, (n) => n.label === subLinkLabel);
        setSubItems([...subItems]);
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

          const pltf = localStorage.getItem('platformname');

          const storageRef = ref(storage, `/${pltf}/brandLogo`);
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

  const handleButtonAdd = () => {
    try {
      setNavButton({
        label: formik.values.buttonLabel,
        link: formik.values.buttonLink,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (acceptedFiles.length > 0) {
        setShowUploadLoader(true);
        saveChangesToCloud({
          navbar: {
            brandlogo: uploadedFileUrl,
            menuitems: menuItems,
            button: navButton,
          },
        });
        setShowUploadLoader(false);
      } else {
        setShowAlert(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'navbar' });
      if (existingData.brandlogo) setUploadedFileUrl(existingData.brandlogo);
      if (existingData.menuitems) setMenuItems(existingData.menuitems);
      if (existingData.button) setNavButton(existingData.button);
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
      <Box
        sx={{
          bgcolor: '#F4F6F8',
          px: 5,
          mt: 2.5,
          height: 200,
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
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Stack direction={'column'} alignItems={'center'}>
                    <Icon icon={'tabler:file-filled'} width={25} />
                    <Typography textAlign={'center'}>File uploaded!</Typography>
                    <Typography textAlign={'center'}>Upload different file to replace</Typography>
                  </Stack>
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

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={12} md={12} width={'100%'}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container flexDirection={'column'} sx={{ width: '100%', py: 1 }}>
              <Grid item xs={12} md={12}>
                <StyledTextField
                  label={'Menu item label'}
                  name="menuItemLabel"
                  value={formik.values.menuItemLabel}
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
                  error={formik.touched.menuItemLabel && Boolean(formik.errors.menuItemLabel)}
                  helperText={formik.errors.menuItemLabel && formik.errors.menuItemLabel}
                />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    value={isMultipleLinks}
                    checked={isMultipleLinks}
                    onClick={() => setMultipleLinks((cs) => !cs)}
                  />
                  <FormHelperText>Will this item contain sublink?</FormHelperText>
                </Box>
              </Grid>

              <Grid item xs={12} md={12} display={'flex'}>
                {isMultipleLinks ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Box>
                      <StyledTextField
                        label="Sub link label"
                        name="subLinkLabel"
                        value={subItem.subLinkLabel}
                        onChange={(e) => setSubItem({ ...subItem, subLinkLabel: e.target.value })}
                        sx={{
                          width: '100%',
                          '.MuiInputLabel-root': {
                            fontFamily: 'Wix MadeFor Display',
                          },
                          '.MuiInputBase-input': {
                            fontFamily: 'Wix MadeFor Display',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <StyledTextField
                        label="Sub link hyperlink"
                        name="subLinkUrl"
                        value={subItem.subLinkUrl}
                        onChange={(e) => setSubItem({ ...subItem, subLinkUrl: e.target.value })}
                        sx={{
                          width: '100%',
                          '.MuiInputLabel-root': {
                            fontFamily: 'Wix MadeFor Display',
                          },
                          '.MuiInputBase-input': {
                            fontFamily: 'Wix MadeFor Display',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <StyledButton
                        sx={{ height: 40 }}
                        onClick={() => handleSubItem('add', formik.values.menuItemLink)}
                        variant={'contained'}
                      >
                        <Icon icon={'ei:plus'} width={25} />
                      </StyledButton>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <StyledTextField
                      label="Menu item hyperlink"
                      name="menuItemLink"
                      value={formik.values.menuItemLink}
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
                      required={!isMultipleLinks}
                    />
                  </>
                )}
              </Grid>

              <Grid item md={12} xs={12}>
                {subItems.map((si, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      bgcolor: '#C8FACD',
                      my: 2,
                      p: 2,
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography textAlign={'center'}>{trimText(si.label)}</Typography>
                    <Tooltip title={'Remove'}>
                      <IconButton onClick={() => handleSubItem('remove', si.label)}>
                        <Icon icon={'zondicons:close-solid'} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <StyledButton type="submit" sx={{ mt: 3 }}>
                    Add
                  </StyledButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {Object.keys(menuItems).length > 0 ? (
                    <FormHelperText
                      sx={{
                        fontFamily: 'Wix MadeFor Display',
                        color: Object.keys(menuItems).length === 5 ? 'red' : '',
                      }}
                    >
                      {Object.keys(menuItems).length}/5{' '}
                      <span style={{ marginLeft: 1 }}>
                        {Object.keys(menuItems).length === 5 ? 'Maximum five items can be added' : ''}
                      </span>
                    </FormHelperText>
                  ) : (
                    <Box sx={{ m: 1, display: 'flex', alignItems: 'center' }}>
                      <Icon icon={'pajamas:issue-type-incident'} />
                      <FormHelperText sx={{ ml: 1 }}>Menu items are to be shown in navigation bar</FormHelperText>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Grid>

        <Grid item xs={12} md={12} component={Paper}>
          {Object.keys(menuItems).length > 0 ? (
            <>
              <Grid container spacing={2} sx={{ width: '100%', p: 1.5 }}>
                {Object.keys(menuItems).map((item, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    {Array.isArray(menuItems[item]) ? (
                      <NavItemMenu
                        item={item}
                        subItems={menuItems[item]}
                        handleRemoveItem={() => handleRemoveItem(item)}
                      />
                    ) : (
                      <NavItem item={item} menuItems={menuItems} handleRemoveItem={() => handleRemoveItem(item)} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </>
          ) : null}
        </Grid>
      </Grid>

      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <Checkbox
            sx={{ ml: -0.5 }}
            checked={hasButton || Boolean(navButton.label)}
            onClick={() => setHasButton((c) => !c)}
          />
          <FormHelperText>Will navbar contain button?</FormHelperText>
        </Box>

        {hasButton ? (
          <>
            <StyledTextField
              name="buttonLabel"
              value={formik.values.buttonLabel}
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
              placeholder={'Add button to navbar'}
              helperText={'Optional'}
            />

            <StyledTextField
              name="buttonLink"
              value={formik.values.buttonLink}
              onChange={formik.handleChange}
              sx={{
                width: '100%',
                mt: 1,
                '.MuiInputLabel-root': {
                  fontFamily: 'Wix MadeFor Display',
                },
                '.MuiInputBase-input': {
                  fontFamily: 'Wix MadeFor Display',
                },
              }}
              placeholder={'Add link to button'}
            />

            <Box sx={{ mt: 2 }}>
              <StyledButton onClick={() => handleButtonAdd()}>Add button</StyledButton>
            </Box>
          </>
        ) : null}
      </Box>

      {navButton.label ? (
        <Box sx={{ mt: 2, display: 'flex' }}>
          <Button variant="outlined">{navButton.label}</Button>
          <IconButton sx={{ ml: 1 }} onClick={() => setNavButton({})}>
            <Icon icon={'ic:round-close'} />
          </IconButton>
        </Box>
      ) : null}

      {showAlert ? (
        <Box sx={{ mt: 2, width: '50%' }}>
          <Alert severity="error"> Please add brand logo </Alert>
        </Box>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 40 }} onClick={() => handleSaveChanges()}>
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

export default Navbar;
