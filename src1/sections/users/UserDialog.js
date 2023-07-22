import React, { forwardRef, useEffect, useState } from 'react';
import { Autocomplete, Button, Dialog, DialogTitle, Slide, Stack, TextField, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { LoadingButton } from '@mui/lab';
import AlertMessage from '../../custom/AlertMessage';
import { storeactions, firestore, auth } from '../../firebase/firebase';
import { useObjContext } from '../../context/context';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const UserDialog = ({ open, setOpen, existingBrands }) => {
  const { user } = useObjContext();
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required('Please enter name'),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
      .required('Please enter email'),
    brandname: yup.string().required('Please assign brand to user'),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      email: '',
      brandname: '',
    },
    onSubmit: async () => {
      try {
        setShowLoader(true);
        const { doc, setDoc, getDoc, collection } = storeactions;
        const docRef = doc(collection(firestore, 'users'), user.email);
        const existingDoc = await getDoc(docRef);

        if (existingDoc.exists()) {
          const documentData = existingDoc.data();

          if (documentData.users[formik.values.brandname]) {
            const newUserRef = doc(collection(firestore, 'users'), formik.values.email);
            await setDoc(newUserRef, {
              ...formik.values,
              designation: 'User',
              platformname: user.platformname,
            });

            const existingBrandUsers = documentData.users[formik.values.brandname];
            existingBrandUsers.push({
              ...formik.values,
              designation: 'User',
              platformname: user.platformname,
              addedOn: new Date().toISOString(),
            });
            const existingUsers = { ...documentData.users, [formik.values.brandname]: existingBrandUsers };
            const updatedDoc = {
              ...documentData,
              users: existingUsers,
            };
            await setDoc(docRef, updatedDoc);
            setShowLoader(false);
          } else {
            const newUserRef = doc(collection(firestore, 'users'), formik.values.email);
            await setDoc(newUserRef, {
              ...formik.values,
              designation: 'User',
              platformname: user.platformname,
            });

            const newBrandUsers = [
              {
                ...formik.values,
                designation: 'User',
                platformname: user.platformname,
                addedOn: new Date().toISOString(),
              },
            ];
            const existingUsers = { ...documentData.users, [formik.values.brandname]: newBrandUsers };

            const updatedDoc = {
              ...documentData,
              users: existingUsers,
            };
            await setDoc(docRef, updatedDoc);
            setShowLoader(false);
          }
          setMessage({
            type: 'success',
            text: 'User added successfully',
          });
        }
      } catch (err) {
        console.log(err);
        setMessage({
          type: 'error',
          text: 'Faild to add user',
        });
        setShowLoader(false);
      }
    },
  });

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted maxWidth={'sm'} fullWidth>
      <DialogTitle>{'Add user'}</DialogTitle>
      <Box sx={{ m: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack justifyContent={'center'} alignItems={'center'} direction={'column'} spacing={2}>
            {message.type ? (
              <Box sx={{ width: '100%', mb: 1 }}>
                <AlertMessage message={message} setMessage={setMessage} />{' '}
              </Box>
            ) : null}

            <TextField
              label={'Enter user name'}
              name={'name'}
              value={formik.values.name}
              onChange={formik.handleChange}
              sx={{ width: '100%' }}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.errors.name && formik.errors.name}
            />
            <TextField
              label={'Enter user email'}
              name={'email'}
              value={formik.values.email}
              onChange={formik.handleChange}
              sx={{ width: '100%' }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.errors.email && formik.errors.email}
            />

            <Autocomplete
              disablePortal
              value={formik.values.brandname}
              onChange={(event, newValue) => {
                formik.setValues({
                  ...formik.values,
                  brandname: newValue.label,
                });
              }}
              onInputChange={(event, newInputValue) => {
                formik.setValues({
                  ...formik.values,
                  brandname: newInputValue.label,
                });
              }}
              options={existingBrands}
              sx={{ width: '100%' }}
              ListboxProps={{ style: { maxHeight: 185 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose brand"
                  error={formik.touched.brandname && Boolean(formik.errors.brandname)}
                  helperText={formik.errors.brandname && formik.errors.brandname}
                />
              )}
            />
          </Stack>

          <Stack spacing={2} sx={{ mt: 5 }} direction={'row'}>
            <LoadingButton type="submit" variant={'contained'} loading={showLoader}>
              Submit
            </LoadingButton>
            <Button
              onClick={() => {
                formik.handleReset();
                setOpen(false);
              }}
              color={'error'}
              variant={'contained'}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default UserDialog;
