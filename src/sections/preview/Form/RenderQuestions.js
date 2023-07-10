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
import { Icon } from '@iconify/react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const RenderShortQuestion = ({ questionText }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 1.5 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField variant="standard" sx={{ width: '100%' }} />
      </Box>
    </Box>
  </Box>
);

export const RenderLongQuestion = ({ questionText }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 1.5 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField multiline rows={4} sx={{ width: '100%' }} />
      </Box>
    </Box>
  </Box>
);

// multiple-choice, checkbox, dropdown
export const RenderCheckboxQuestion = ({ questionText, options }) => (
  <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} component={Paper} sx={{ p: 1.5 }}>
    <Box>
      <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
        {questionText}
      </Typography>
    </Box>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {options.map((op, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Box width={'100%'} display={'flex'} alignItems={'center'}>
            <Checkbox /> <Typography>{op}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
    <Box />
  </Box>
);

export const RenderDateQuestion = ({ questionText }) => (
  <Box display={'flex'} alignItems={'center'} component={Paper}>
    <Box mt={0.5} sx={{ width: '100%', p: 2 }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box display={'flex'} mt={2}>
        <DatePicker />
      </Box>
    </Box>
  </Box>
);

export const RenderMultipleChoiceQuestion = ({ questionText, options }) => (
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
            <FormControlLabel key={index} value={op} control={<Radio />} label={op} />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  </Box>
);

export const RenderDropdownQuestion = ({ questionText, options }) => (
  <Box display={'flex'} alignItems={'center'} component={Paper} sx={{ width: '100%', p: 2 }}>
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant="h5" fontFamily={'Wix MadeFor Display'}>
          {questionText}
        </Typography>
      </Box>
      <Box sx={{ mt: 2, width: '60%' }}>
        <Select sx={{ width: '100%' }}>
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
