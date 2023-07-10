import React, { useEffect } from 'react';
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

  const questionObj = {
    'short-question': (q) => <RenderShortQuestion {...q} />,
    paragraph: (q) => <RenderLongQuestion {...q} />,
    checkbox: (q) => <RenderCheckboxQuestion {...q} />,
    date: (q) => <RenderDateQuestion {...q} />,
    'multiple-choice': (q) => <RenderMultipleChoiceQuestion {...q} />,
    dropdown: (q) => <RenderDropdownQuestion {...q} />,
  };

  return (
    <Container sx={{ mt: 10 }} component={Paper}>
      <Typography
        sx={{ fontFamily: 'Wix Madefor Display', fontWeight: 900, fontSize: 40, color: '#03045e', textAlign: 'center' }}
      >
        {formTitle}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, mt: 1.5 }}>
        <form>
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
