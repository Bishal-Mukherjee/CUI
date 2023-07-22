import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, Stack, TextField, CircularProgress, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { useObjContext } from '../../../../context/context';
import AlertMessage from '../../../../custom/AlertMessage';
import { StyledButton } from '../../../../custom/Button';
import { getExistingData } from '../../../../services/platform';

const AdArticles = () => {
  const { user, editingObj, saveChangesToCloud } = useObjContext();
  const [articles, setArticles] = useState([]);
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  const [addedArticle, setAddedArticle] = useState({});

  const validationSchema = yup.object({
    title: yup.string().required('*required'),
    text: yup.string().required('*required'),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: {
      title: '',
      text: '',
    },
    onSubmit: () => {
      try {
        setAddedArticle({ ...formik.values });
        formik.handleReset();
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleRemoveArticle = () => {
    try {
      setAddedArticle({
        title: '',
        text: '',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (Object.values(addedArticle).length === 2) {
        setShowUploadLoader(true);
        saveChangesToCloud({
          article: {
            content: addedArticle,
          },
        });
        setShowUploadLoader(false);
      } else {
        setMessage({
          text: 'Please add article',
          type: 'error',
        });
      }
    } catch (err) {
      console.log(err);
      setShowUploadLoader(false);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'article' });
      if (existingData.content) setAddedArticle(existingData.content);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetExistingData();
  }, [user]);

  return (
    <Box sx={{ padding: 5 }} component={Paper}>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label={'Add article title'}
            name={'title'}
            value={formik.values.title}
            onChange={formik.handleChange}
            sx={{ width: '100%' }}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.errors.title && formik.errors.title}
          />

          <TextField
            label={'Add article content'}
            name={'text'}
            value={formik.values.text}
            onChange={formik.handleChange}
            sx={{ width: '100%' }}
            multiline
            rows={6}
            error={formik.touched.text && Boolean(formik.errors.text)}
            helperText={formik.errors.text && formik.errors.text}
          />

          <Box sx={{ mt: 1 }}>
            <Button variant={'contained'} type="submit">
              Add
            </Button>
          </Box>
        </Stack>
      </form>

      {message.text ? (
        <Box sx={{ mt: 2 }}>
          <AlertMessage message={message} setMessage={setMessage} />
        </Box>
      ) : null}

      {addedArticle.title ? (
        <Box
          sx={{
            padding: 5,
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
          component={Paper}
          elevation={5}
        >
          <Stack direction={'column'} spacing={3}>
            <Typography sx={{ fontSize: 25 }}>{addedArticle.title}</Typography>
            <Typography sx={{ fontSize: 15 }}>{addedArticle.text}</Typography>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Button color={'error'} onClick={() => handleRemoveArticle()}>
              Remove
            </Button>
          </Box>
        </Box>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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

export default AdArticles;
