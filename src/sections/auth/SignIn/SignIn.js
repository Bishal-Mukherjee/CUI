import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useFormik } from 'formik';
import * as yup from 'yup';

import { Icon } from '@iconify/react';
import { useObjContext } from '../../../context/context';
import AlertMessage from '../../../custom/AlertMessage';
import { auth, storeactions, firestore } from '../../../firebase/firebase';

// ----------------------------------------------------------------------

export default function SignIn({ setAuthNavigation }) {
  const { user } = useObjContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });
  const [showLoader, setShowLoader] = useState(false);

  const SignInSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
      .required('Please enter email'),
    password: yup
      .string()
      .matches(/^.{6,}$/, 'Password must be of six characters')
      .required('Please enter password'),
  });

  const formik = useFormik({
    validationSchema: SignInSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async () => {
      setShowLoader(true);
      try {
        const { getAuth, signInWithEmailAndPassword } = auth;
        const { email, password } = formik.values;
        const authInstance = getAuth();
        const userCredential = await signInWithEmailAndPassword(authInstance, email, password);

        if (userCredential.user) {
          const { doc, getDoc, collection } = storeactions;
          const docRef = doc(collection(firestore, 'users'), email);
          const existingDoc = await getDoc(docRef);

          if (existingDoc.exists()) {
            const documentData = existingDoc.data();
            localStorage.setItem('platformname', documentData.platformname);
          }

          navigate('/index');
        }
      } catch (err) {
        console.log(err.message);
        setShowLoader(false);
        setMessage({
          type: 'error',
          text: 'Failed to login',
        });
      }
    },
  });

  useEffect(() => {
    if (user) navigate('/index');
  }, []);

  return (
    <>
      <Stack spacing={3} sx={{ marginTop: 10 }}>
        {message.type ? <AlertMessage message={message} setMessage={setMessage} /> : null}

        <Typography sx={{ fontSize: 35 }}>Sign in</Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
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
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Stack direction={'row'} alignItems={'center'}>
              <Checkbox name="remember" label="Remember me" />
              <Typography>Remember me?</Typography>
            </Stack>

            <Link variant="subtitle2" underline="hover">
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={showLoader}>
            Sign In
          </LoadingButton>
        </form>
        <Typography sx={{ display: 'flex' }}>
          Not registered?&nbsp;{' '}
          <Typography
            onClick={() => setAuthNavigation(1)}
            sx={{ textDecoration: 'underline', color: '#0077b6', cursor: 'pointer' }}
          >
            {' '}
            Sign up
          </Typography>
        </Typography>
      </Stack>
    </>
  );
}
