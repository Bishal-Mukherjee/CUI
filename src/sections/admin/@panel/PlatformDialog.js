import React, { useState } from 'react';
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';

export default function PlatformDialog({ open, handleAddPlatformName }) {
  const [showLoader, setShowLoader] = useState(false);
  const validationSchema = yup.object({
    platformName: yup.string().required('*required'),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      platformName: '',
    },
    onSubmit: () => {
      setShowLoader(true);
      handleAddPlatformName(formik.values.platformName);
    },
  });

  return (
    <div>
      <Dialog open={open} maxWidth={'md'} fullWidth>
        <DialogTitle>Register</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText>Register the name for your platform.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="platformName"
              value={formik.values.platformName}
              onChange={formik.handleChange}
              label="Platform name"
              fullWidth
              variant="standard"
              error={formik.touched.platformName && Boolean(formik.errors.platformName)}
              helperText={formik.errors.platformName && formik.errors.platformName}
            />
          </DialogContent>
          <DialogActions>
            {showLoader ? (
              <Box m={1} display={'flex'} justifyContent={'center'} width={50}>
                <CircularProgress size={25} />
              </Box>
            ) : (
              <Button type="submit">Register</Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
