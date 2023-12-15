import * as React from 'react';

import {Alert, Stack} from '@mui/material';

// CustomAlert Component used to throw alerts based on severity and message passed as props
export default function BasicAlerts(props) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert variant="filled" severity={props.severity}>
        {props.message}
      </Alert>
    </Stack>
  );
}

// CustomAlert Component used to throw alerts based on severity and message passed as props
export const CustomAlert = ({ isAlertSet, severity, message }) => {
  return (
    isAlertSet ? (
      <Alert severity={severity}>{message}</Alert>) : null
  )
}