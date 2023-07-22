import React, { useState } from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import {
  RenderCheckboxQuestion,
  RenderDateQuestion,
  RenderDropdownQuestion,
  RenderLongQuestion,
  RenderMultipleChoiceQuestion,
  RenderShortQuestion,
} from './RenderQuestions';

const Form = ({ form }) => {
  const { formTitle, questions } = form;
  const [formData, setFormData] = useState({});

  const handleInputChange = (event, value, name) => {
    try {
      if (event === null) {
        setFormData({ ...formData, [name]: value });
      } else setFormData({ ...formData, [event.target.name]: event.target.value });
    } catch (err) {
      console.log(err.message);
    }
  };

  const questionObj = {
    'short-question': (q) => (
      <RenderShortQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />
    ),
    paragraph: (q) => (
      <RenderLongQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />
    ),
    checkbox: (q) => (
      <RenderCheckboxQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />
    ),
    date: (q) => <RenderDateQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />,
    'multiple-choice': (q) => (
      <RenderMultipleChoiceQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />
    ),
    dropdown: (q) => (
      <RenderDropdownQuestion name={q.id} value={formData[q.id]} handleInputChange={handleInputChange} {...q} />
    ),
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <Container sx={{ mt: 10 }} component={Paper}>
      <Typography
        sx={{ fontFamily: 'Wix Madefor Display', fontWeight: 900, fontSize: 40, color: '#03045e', textAlign: 'center' }}
      >
        {formTitle}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, mt: 1.5 }}>
        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <Box key={index}>{questionObj[q.type](q)}</Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Form;
