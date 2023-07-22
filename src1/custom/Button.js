import { Button, styled } from '@mui/material';

export const StyledButton = styled(Button)({
  color: '#ffffff',
  backgroundColor: '#000000',
  ':hover': {
    color: '#000000',
    backgroundColor: '#ced4da',
  },
  ':disabled': {
    color: '#adb5bd',
    backgroundColor: '#dee2e6',
  },
});
