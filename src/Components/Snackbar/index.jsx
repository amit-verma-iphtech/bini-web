import React from 'react';
import { Snackbar as MuiSnackbar, SnackbarContent as MuiSnackbarContent, withStyles } from '@material-ui/core';

const SnackbarTypes = { default: 'default', error: 'error', success: 'success' };
const DefaultSnackbarContent = withStyles(() => ({
  root: {
    color: '#fff',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
}))(MuiSnackbarContent);
const SnackbarContent = {
  [SnackbarTypes.default]: withStyles(() => ({}))(DefaultSnackbarContent),
  [SnackbarTypes.error]: withStyles(() => ({ root: { backgroundColor: '#ff0000' } }))(DefaultSnackbarContent),
  [SnackbarTypes.success]: withStyles(() => ({ root: { backgroundColor: 'green' } }))(DefaultSnackbarContent),
};
export const defaultSnackbar = { isVisible: false, type: undefined, message: undefined };

export const Snackbar = ({ autoHideDuration, isVisible, message, onClose, type }) => {
  const CurrentSnackbarContent = SnackbarContent[type];

  return (
    <MuiSnackbar autoHideDuration={autoHideDuration} onClose={onClose} open={isVisible}>
      <CurrentSnackbarContent message={message} />
    </MuiSnackbar>
  );
};

Snackbar.defaultProps = {
  autoHideDuration: 1500,
  type: SnackbarTypes.default,
};
