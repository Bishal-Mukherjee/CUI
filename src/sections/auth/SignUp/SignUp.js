import { useState } from 'react';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography, Box, Checkbox, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Icon } from '@iconify/react';
import { ref, uploadBytesResumable } from 'firebase/storage';
import AlertMessage from '../../../custom/AlertMessage';
import { auth, storeactions, firestore, storage } from '../../../firebase/firebase';

// ----------------------------------------------------------------------

export default function SingnUp({ setAuthNavigation }) {
  const SignUpSchema = yup.object().shape({
    name: yup.string(),
    platformname: yup.string(),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
      .required('Please enter email'),
    password: yup
      .string()
      .matches(/^.{6,}$/, 'Password must be of six characters')
      .required('Please enter password'),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  const formik = useFormik({
    validationSchema: SignUpSchema,
    initialValues: {
      platformname: '',
      email: '',
      password: '',
      isAdmin: false,
    },
    onSubmit: async () => {
      setShowLoader(true);
      try {
        const { email, password, platformname, isAdmin } = formik.values;
        const { getAuth, createUserWithEmailAndPassword } = auth;
        const { doc, getDoc, setDoc, collection } = storeactions;

        if (isAdmin) {
          const docRef = doc(collection(firestore, 'platforms'), platformname);
          const existingDoc = await getDoc(docRef);

          if (existingDoc.exists()) {
            // show error message and prevent signup
            // as platform with that name already exists
            setMessage({
              type: 'error',
              text: 'Failed! As platform with that name already exists',
            });
          } else {
            const authInstance = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(authInstance, email, password);
            if (userCredentials.user) {
              // creating users doc related to platformanme and user email

              const docRef = doc(collection(firestore, 'users'), email);
              await setDoc(docRef, { email, platformname, designation: 'Admin', users: {} });

              // creating storage folder with Platformanme and empty file
              const storageRef = ref(storage, `/${platformname}/meta.txt`);
              const uploadTask = uploadBytesResumable(storageRef, {});

              uploadTask.on(
                'state_changed',
                () => {},
                (err) => {
                  console.log(err);
                }
              );

              setShowLoader(false);
              setMessage({
                type: 'success',
                text: 'Registration successful! Please login',
              });
            }
          }
        } else {
          const authInstance = getAuth();
          const userCredentials = await createUserWithEmailAndPassword(authInstance, email, password);
          if (userCredentials.user) {
            setShowLoader(false);
            setMessage({
              type: 'success',
              text: 'Registration successful! Please login',
            });
          }
        }
      } catch (err) {
        console.log(err);
        setMessage({
          type: 'error',
          text: 'Failed to register',
        });
        setShowLoader(false);
      }
    },
  });

  return (
    <>
      <Stack spacing={3} sx={{ marginTop: 10 }}>
        {message.type ? <AlertMessage message={message} setMessage={setMessage} /> : null}

        <Typography sx={{ fontSize: 35 }}>Sign up</Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="User name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required={formik.values.name}
            />

            <TextField
              label="Email address"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Icon icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={formik.values.isAdmin}
                onClick={() => {
                  formik.setValues({ ...formik.values, isAdmin: !formik.values.isAdmin });
                }}
                icon={<Icon icon={'ic:round-radio-button-unchecked'} width={20} />}
                checkedIcon={<Icon icon={'solar:check-circle-bold-duotone'} width={20} />}
              />
              <FormHelperText sx={{ fontSize: 15 }}> Register as admin? </FormHelperText>
            </Box>

            {formik.values.isAdmin ? (
              <TextField
                label="Platform name"
                name="platformname"
                value={formik.values.platformname}
                onChange={formik.handleChange}
                required={formik.values.platformname}
              />
            ) : null}

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={showLoader}>
              Sign Up
            </LoadingButton>
          </Stack>
        </form>

        <Typography sx={{ cursor: 'pointer', display: 'flex' }}>
          Already registered?&nbsp;{' '}
          <Typography
            onClick={() => setAuthNavigation(0)}
            sx={{ textDecoration: 'underline', color: '#0077b6', cursor: 'pointer' }}
          >
            {' '}
            Sign in
          </Typography>
        </Typography>
      </Stack>
    </>
  );
}
