import React from 'react';
import { Alert, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';

const AlertMessage = ({ message, setMessage }) => (
  <Alert
    severity={message.type}
    action={
      <IconButton aria-label="close" color="inherit" size="small" onClick={() => setMessage({ type: '', text: '' })}>
        <Icon icon={'carbon:close-outline'} />
      </IconButton>
    }
  >
    {message.text}
  </Alert>
);

export default AlertMessage;

AlertMessage.propTypes = {
  message: PropTypes.string,
  setMessage: PropTypes.object,
};
