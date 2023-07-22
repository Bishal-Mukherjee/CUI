import { TextField, styled } from '@mui/material';

export const StyledTextField = styled(TextField)({
  width: '100%',

  '& .MuiTextField-root': {
    width: '50ch',
  },
  '& label.Mui-focused': {
    color: 'black',
  },
  '& label': {
    color: '#274c77',
    fontFamily: 'Wix MadeFor Display',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
  },
});
