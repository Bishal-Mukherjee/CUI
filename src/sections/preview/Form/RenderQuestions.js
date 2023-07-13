import {
  Typography,
  Box,
  Grid,
  Checkbox,
  TextField,
  Paper,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export const RenderShortQuestion = ({ name, value, questionText, handleInputChange }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 1.5 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          variant="standard"
          name={name}
          value={value}
          onChange={(e) => handleInputChange(e, null, null)}
          sx={{ width: '100%' }}
        />
      </Box>
    </Box>
  </Box>
);

export const RenderLongQuestion = ({ name, value, questionText, handleInputChange }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 1.5 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          multiline
          rows={4}
          name={name}
          value={value}
          onChange={(e) => handleInputChange(e, null, null)}
          sx={{ width: '100%' }}
        />
      </Box>
    </Box>
  </Box>
);

export const RenderCheckboxQuestion = ({ name, value, questionText, options, handleInputChange }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper} sx={{ p: 1.5 }}>
    <Box>
      <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
        {questionText} uu
      </Typography>
    </Box>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {options.map((op, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Box width={'100%'} display={'flex'} alignItems={'center'}>
            <Checkbox name={name} value={value} onClick={() => handleInputChange(null, op, name)} />{' '}
            <Typography>{op}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
    <Box />
  </Box>
);

export const RenderDateQuestion = ({ name, value, questionText, handleInputChange }) => (
  <Box display={'flex'} alignItems={'center'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 2 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box display={'flex'} mt={2}>
        <DatePicker
          format="DD/MM/YYYY"
          value={value}
          onChange={(v) => handleInputChange(null, dayjs(v).format('DD/MM/YYYY'), name)}
        />
      </Box>
    </Box>
  </Box>
);

export const RenderMultipleChoiceQuestion = ({ name, questionText, options, handleInputChange }) => (
  <Box display={'flex'} alignItems={'center'} component={Paper} sx={{ width: '100%', p: 2 }}>
    <Box>
      <FormControl>
        <Box>
          <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
            {questionText}
          </Typography>
        </Box>
        <RadioGroup>
          {options.map((op, index) => (
            <FormControlLabel
              key={index}
              name={name}
              value={op}
              control={<Radio onClick={() => handleInputChange(null, op, name)} />}
              label={op}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  </Box>
);

export const RenderDropdownQuestion = ({ name, value, questionText, options, handleInputChange }) => (
  <Box display={'flex'} alignItems={'center'} component={Paper} sx={{ width: '100%', p: 2 }}>
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2, width: '60%' }}>
        <Select name={name} value={value} onChange={(e) => handleInputChange(e, null, null)} sx={{ width: '100%' }}>
          {options.map((op, index) => (
            <MenuItem value={op} key={index}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  </Box>
);
