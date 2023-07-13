import React, { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
  FormHelperText,
  IconButton,
  Switch,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { remove } from 'lodash';
import { useObjContext } from '../../../context/context';
import {
  RenderShortQuestion,
  RenderLongQuestion,
  RenderMultipleChoiceQuestion,
  RenderDateQuestion,
} from './FormFieldRender';
import { StyledButton } from '../../../custom/Button';
import { StyledTextField } from '../../../custom/TextField';
import { getExistingData } from '../../../services/platform';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const DateQuestion = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });
  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      isRequired: false,
    },
    onSubmit: () => {
      setFormQuestions((prevstate) => [
        ...prevstate,
        { id: nanoid(), type: 'date', questionText: formik.values.question, isRequired: formik.values.isRequired },
      ]);
      formik.handleReset();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
          <Box>
            <StyledTextField
              name="question"
              value={formik.values.question}
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
              variant="outlined"
              placeholder={'Question'}
              error={formik.touched.question && Boolean(formik.errors.question)}
              helperText={formik.errors.question && formik.errors.question}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Icon icon={'uim:calender'} width={35} />
            <TextField value={'Month, date, year'} variant="standard" size="small" sx={{ ml: 1, mt: 1 }} disabled />
          </Box>
          <Box sx={{ mt: 3 }}>
            <StyledButton variant="contained" type="submit">
              Add question
            </StyledButton>
          </Box>
        </Box>
      </form>
    </>
  );
};

const DropdownQuestion = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });

  const [options, setOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      option: '',
      isRequired: false,
    },
    onSubmit: () => {
      if (options.length > 0) {
        setFormQuestions((prevstate) => [
          ...prevstate,
          {
            id: nanoid(),
            type: 'dropdown',
            questionText: formik.values.question,
            options,
            isRequired: formik.values.isRequired,
          },
        ]);
        setOptions([]);
        formik.handleReset();
      } else {
        setShowAlert(true);
      }
    },
  });

  const handleAddOptions = () => {
    try {
      if (formik.values.option) {
        setOptions((prevstate) => [...prevstate, formik.values.option]);
        formik.setValues({ ...formik.values, option: '' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <Box>
          <StyledTextField
            name="question"
            value={formik.values.question}
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
            variant="outlined"
            placeholder={'Question'}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.errors.question && formik.errors.question}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <StyledTextField
            name="option"
            value={formik.values.option}
            onChange={formik.handleChange}
            sx={{
              width: '100%',
              mt: 2,
              '.MuiInputLabel-root': {
                fontFamily: 'Wix MadeFor Display',
              },
              '.MuiInputBase-input': {
                fontFamily: 'Wix MadeFor Display',
              },
            }}
            variant="outlined"
            placeholder={'Option'}
          />
        </Box>

        {showAlert ? (
          <Box sx={{ bgcolor: '#ff8080', mt: 2, borderRadius: 1 }}>
            <Typography fontFamily={'Wix MadeFor Display'} sx={{ p: 2, color: 'white' }}>
              Please add options
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ mt: 2 }}>
          {options.map((op, index) => (
            <Box
              key={index}
              sx={{ p: 0.5, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 2 }}
            >
              <Typography fontFamily={'Wix MadeFor Display'} sx={{ ml: 0.5 }}>
                {index + 1}. {op}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          sx={{ mt: 1 }}
          variant="contained"
          onClick={() => handleAddOptions()}
          disabled={formik.values.option.length === 0}
        >
          Add option
        </Button>

        <Box sx={{ mt: 3 }}>
          <StyledButton variant="contained" type="submit">
            Add question
          </StyledButton>
        </Box>
      </form>
    </>
  );
};

const CheckboxQuestion = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });

  const [options, setOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      option: '',
      isRequired: false,
    },
    onSubmit: () => {
      if (options.length > 0) {
        setFormQuestions((prevstate) => [
          ...prevstate,
          {
            id: nanoid(),
            type: 'checkbox',
            questionText: formik.values.question,
            options,
            isRequired: formik.values.isRequired,
          },
        ]);
        setOptions([]);
        formik.handleReset();
      } else {
        setShowAlert(true);
      }
    },
  });

  const handleAddOptions = () => {
    try {
      if (formik.values.option) {
        setOptions((prevstate) => [...prevstate, formik.values.option]);
        formik.setValues({ ...formik.values, option: '' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <Box>
          <StyledTextField
            name="question"
            value={formik.values.question}
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
            variant="outlined"
            placeholder={'Question'}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.errors.question && formik.errors.question}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <StyledTextField
            name="option"
            value={formik.values.option}
            onChange={formik.handleChange}
            sx={{
              width: '100%',
              mt: 2,
              '.MuiInputLabel-root': {
                fontFamily: 'Wix MadeFor Display',
              },
              '.MuiInputBase-input': {
                fontFamily: 'Wix MadeFor Display',
              },
            }}
            variant="outlined"
            placeholder={'Option'}
          />
        </Box>

        {showAlert ? (
          <Box sx={{ bgcolor: '#ff8080', mt: 2, borderRadius: 1 }}>
            <Typography fontFamily={'Wix MadeFor Display'} sx={{ p: 2, color: 'white' }}>
              Please add options
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ mt: 2 }}>
          {options.map((op, index) => (
            <Box
              key={index}
              sx={{ p: 0.5, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 2 }}
            >
              <Icon icon={'bx:checkbox'} />{' '}
              <Typography fontFamily={'Wix MadeFor Display'} sx={{ ml: 0.5 }}>
                {op}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          sx={{ mt: 1 }}
          variant="contained"
          onClick={() => handleAddOptions()}
          disabled={formik.values.option.length === 0}
        >
          Add option
        </Button>

        <Box sx={{ mt: 3 }}>
          <StyledButton variant="contained" type="submit">
            Add question
          </StyledButton>
        </Box>
      </form>
    </>
  );
};

const MultipleChoice = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });

  const [options, setOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      option: '',
      isRequired: false,
    },
    onSubmit: () => {
      if (options.length > 0) {
        setFormQuestions((prevstate) => [
          ...prevstate,
          {
            id: nanoid(),
            type: 'multiple-choice',
            questionText: formik.values.question,
            options,
            isRequired: formik.values.isRequired,
          },
        ]);
        setOptions([]);
        formik.handleReset();
      } else {
        setShowAlert(true);
      }
    },
  });

  const handleAddOptions = () => {
    try {
      if (formik.values.option) {
        setOptions((prevstate) => [...prevstate, formik.values.option]);
        formik.setValues({ ...formik.values, option: '' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <Box>
          <StyledTextField
            name="question"
            value={formik.values.question}
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
            variant="outlined"
            placeholder={'Question'}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.errors.question && formik.errors.question}
          />
        </Box>
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <StyledTextField
            name="option"
            value={formik.values.option}
            onChange={formik.handleChange}
            sx={{
              width: '100%',
              mt: 2,
              '.MuiInputLabel-root': {
                fontFamily: 'Wix MadeFor Display',
              },
              '.MuiInputBase-input': {
                fontFamily: 'Wix MadeFor Display',
              },
            }}
            variant="outlined"
            placeholder={'Option'}
          />
        </Box>

        {showAlert ? (
          <Box sx={{ bgcolor: '#ff8080', mt: 2, borderRadius: 1 }}>
            <Typography fontFamily={'Wix MadeFor Display'} sx={{ p: 2, color: 'white' }}>
              Please add options
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ mt: 2 }}>
          {options.map((op, index) => (
            <Box
              key={index}
              sx={{ p: 0.5, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 2 }}
            >
              <Icon icon={'fluent:radio-button-16-filled'} />{' '}
              <Typography fontFamily={'Wix MadeFor Display'} sx={{ ml: 0.5 }}>
                {op}
              </Typography>
            </Box>
          ))}

          <Button
            sx={{ mt: 1 }}
            variant="contained"
            onClick={() => handleAddOptions()}
            disabled={formik.values.option.length === 0}
          >
            Add option
          </Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <StyledButton variant="contained" type="submit">
            Add question
          </StyledButton>
        </Box>
      </form>
    </>
  );
};

const LongAnswer = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });
  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      isRequired: false,
    },
    onSubmit: () => {
      setFormQuestions((prevstate) => [
        ...prevstate,
        { id: nanoid(), type: 'paragraph', questionText: formik.values.question, isRequired: formik.values.isRequired },
      ]);
      formik.handleReset();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <StyledTextField
          name="question"
          value={formik.values.question}
          onChange={formik.handleChange}
          sx={{ width: '100%' }}
          variant="outlined"
          placeholder={'Question'}
          error={formik.touched.question && Boolean(formik.errors.question)}
          helperText={formik.errors.question && formik.errors.question}
        />
        <FormHelperText>Long answer text</FormHelperText>
        <Box sx={{ mt: 3 }}>
          <StyledButton variant="contained" type="submit">
            Add question
          </StyledButton>
        </Box>
      </form>
    </>
  );
};

const ShortAnswer = ({ setFormQuestions }) => {
  const validationSchema = yup.object({
    question: yup.string().required('*required'),
  });
  const formik = useFormik({
    validationSchema,
    initialValues: {
      question: '',
      isRequired: false,
    },
    onSubmit: () => {
      setFormQuestions((prevstate) => [
        ...prevstate,
        {
          id: nanoid(),
          type: 'short-question',
          questionText: formik.values.question,
          isRequired: formik.values.isRequired,
        },
      ]);
      formik.handleReset();
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} alignItems={'center'} ml={-1}>
          <Switch
            onClick={() => {
              formik.setValues({ ...formik.values, isRequired: !formik.values.isRequired });
            }}
            checked={formik.values.isRequired}
          />
          <FormHelperText>Required?</FormHelperText>
        </Box>
        <StyledTextField
          name="question"
          value={formik.values.question}
          onChange={formik.handleChange}
          sx={{ width: '100%' }}
          variant="outlined"
          placeholder={'Question'}
          error={formik.touched.question && Boolean(formik.errors.question)}
          helperText={formik.errors.question && formik.errors.question}
        />
        <FormHelperText>Short answer text</FormHelperText>
        <Box sx={{ mt: 3 }}>
          <StyledButton variant="contained" type="submit">
            Add question
          </StyledButton>
        </Box>
      </form>
    </>
  );
};

const CustomizableForm = () => {
  const [formQuestions, setFormQuestions] = useState([]);

  const { user, editingObj, saveChangesToCloud } = useObjContext();
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    initialValues: {
      formTitle: 'Form',
      questionType: 'short-answer',
      isRequired: false,
    },
  });

  const formFields = [
    { label: 'Short answer', icon: <Icon icon={'uis:paragraph'} />, slug: 'short-answer' },
    { label: 'Paragraph', icon: <Icon icon={'system-uicons:paragraph-left'} />, slug: 'paragraph' },
    { label: 'Multiple choice', icon: <Icon icon={'fluent:radio-button-16-filled'} />, slug: 'multiple-choice' },
    { label: 'Checkbox', icon: <Icon icon={'ion:checkbox'} />, slug: 'checkbox' },
    { label: 'Dropdown', icon: <Icon icon={'iconamoon:arrow-down-6-circle'} />, slug: 'dropdown' },
    { label: 'Date', icon: <Icon icon={'uim:calender'} />, slug: 'date' },
  ];

  const questionObj = {
    'short-answer': <ShortAnswer setFormQuestions={setFormQuestions} />,
    paragraph: <LongAnswer setFormQuestions={setFormQuestions} />,
    'multiple-choice': <MultipleChoice setFormQuestions={setFormQuestions} />,
    checkbox: <CheckboxQuestion setFormQuestions={setFormQuestions} />,
    dropdown: <DropdownQuestion setFormQuestions={setFormQuestions} />,
    date: <DateQuestion setFormQuestions={setFormQuestions} />,
  };

  const handleRemoveQuestion = (formQuestionId) => {
    try {
      remove(formQuestions, (fq) => fq.id === formQuestionId);
      setFormQuestions([...formQuestions]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (formQuestions.length > 0) {
        saveChangesToCloud({
          form: {
            formTitle: formik.values.formTitle,
            questions: formQuestions,
          },
        });
      } else {
        setShowAlert(true);
      }

      setShowUploadLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetExistingData = async () => {
    try {
      const existingData = await getExistingData({ user, editingObj, sectionName: 'form' });
      if (existingData.questions) setFormQuestions(existingData.questions);
      if (existingData.formTitle)
        formik.setValues({
          ...formik.values,
          formTitle: existingData.formTitle,
        });
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
      <Grid container>
        <Grid item xs={6} md={6}>
          <Box>
            <StyledTextField
              label="Add form title"
              name="formTitle"
              value={formik.values.formTitle}
              onChange={formik.handleChange}
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Box sx={{ mt: 1 }}>
            <Select
              sx={{ width: '25rem' }}
              name="questionType"
              value={formik.values.questionType}
              onChange={formik.handleChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: ITEM_HEIGHT * 2.5 + ITEM_PADDING_TOP,
                    width: 250,
                  },
                },
              }}
            >
              {formFields.map((q, index) => (
                <MenuItem key={index} value={q.slug}>
                  <Box display={'flex'} alignItems={'center'}>
                    {q.icon}{' '}
                    <Typography fontFamily={'Wix MadeFor Display'} ml={1.5}>
                      {q.label}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>

        <Grid item xs={12} md={12} mt={2}>
          {questionObj[formik.values.questionType]}
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, mb: 5 }}>
        {formQuestions.map((fq, index) => (
          <Box key={index}>
            {fq.type === 'short-question' ? (
              <RenderShortQuestion
                index={index}
                questionText={fq.questionText}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
            {fq.type === 'paragraph' ? (
              <RenderLongQuestion
                index={index}
                questionText={fq.questionText}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
            {fq.type === 'multiple-choice' ? (
              <RenderMultipleChoiceQuestion
                index={index}
                questionText={fq.questionText}
                options={fq.options}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
            {fq.type === 'checkbox' ? (
              <RenderMultipleChoiceQuestion
                index={index}
                questionText={fq.questionText}
                options={fq.options}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
            {fq.type === 'dropdown' ? (
              <RenderMultipleChoiceQuestion
                index={index}
                questionText={fq.questionText}
                options={fq.options}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
            {fq.type === 'date' ? (
              <RenderDateQuestion
                index={index}
                questionText={fq.questionText}
                handleRemoveQuestion={() => handleRemoveQuestion(fq.id)}
              />
            ) : null}
          </Box>
        ))}
      </Box>

      {showAlert ? (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error"> Please add some questions </Alert>
        </Box>
      ) : null}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Tooltip title={'Save changes to cloud'}>
          <StyledButton sx={{ height: 45 }} variant={'contained'} onClick={() => handleSaveChanges()}>
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

export default CustomizableForm;
