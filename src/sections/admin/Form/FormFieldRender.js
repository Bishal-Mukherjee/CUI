import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Divider, IconButton } from '@mui/material';
import React from 'react';
import { Icon } from '@iconify/react';

export const RenderShortQuestion = ({ questionText, index, handleRemoveQuestion }) => (
  <Box display={'flex'} alignItems={'center'}>
    <Box mt={0.5} sx={{ width: '100%', p: 2, bgcolor: '#DFE3E8', borderRadius: 1 }}>
      <Typography fontFamily={'Wix MadeFor Display'}>
        {index + 1}. {questionText}
      </Typography>
    </Box>
    <IconButton onClick={() => handleRemoveQuestion()}>
      <Icon icon={'zondicons:close-solid'} />
    </IconButton>
  </Box>
);

export const RenderLongQuestion = ({ questionText, index, handleRemoveQuestion }) => (
  <Box display={'flex'} alignItems={'center'}>
    <Box mt={0.5} sx={{ width: '100%', p: 2, bgcolor: '#DFE3E8', borderRadius: 1 }}>
      <Typography fontFamily={'Wix MadeFor Display'}>
        {index + 1}. {questionText}
      </Typography>
    </Box>
    <IconButton onClick={() => handleRemoveQuestion()}>
      <Icon icon={'zondicons:close-solid'} />
    </IconButton>
  </Box>
);

// multiple-choice, checkbox, dropdown
export const RenderMultipleChoiceQuestion = ({ questionText, options, index, handleRemoveQuestion }) => (
  <Box display={'flex'} alignItems={'center'} mt={0.5}>
    <Accordion sx={{ width: '100%', bgcolor: '#DFE3E8' }}>
      <AccordionSummary expandIcon={<Icon icon={'ep:arrow-down-bold'} width={15} />}>
        <Typography fontFamily={'Wix MadeFor Display'}>
          {index + 1}. {questionText}
        </Typography>
      </AccordionSummary>

      <Divider />

      <AccordionDetails>
        {options.map((op, ind) => (
          <Box key={index}>
            <Typography>
              {ind + 1}. {op}
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
    <IconButton onClick={() => handleRemoveQuestion()}>
      <Icon icon={'zondicons:close-solid'} />
    </IconButton>
  </Box>
);

export const RenderDateQuestion = ({ questionText, index, handleRemoveQuestion }) => (
  <Box display={'flex'} alignItems={'center'}>
    <Box mt={0.5} sx={{ width: '100%', p: 2, bgcolor: '#DFE3E8', borderRadius: 1 }}>
      <Typography fontFamily={'Wix MadeFor Display'}>
        {index + 1}. {questionText}
      </Typography>
      <Box display={'flex'} mt={1}>
        <Icon icon={'uim:calender'} width={25} />
        <Typography fontFamily={'Wix MadeFor Display'} sx={{ ml: 1 }}>
          Month, date, year
        </Typography>
      </Box>
    </Box>

    <IconButton onClick={() => handleRemoveQuestion()} sx={{ mt: 1 }}>
      <Icon icon={'zondicons:close-solid'} />
    </IconButton>
  </Box>
);
