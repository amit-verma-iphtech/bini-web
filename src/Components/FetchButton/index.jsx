import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function FetchDataButton({ loading, setLoading }) {
  const handleClick = () => {
    setLoading(true);
  };

  return (
    <Box>

      <Box sx={{ '& > button': { m: 2 } }}>
        <LoadingButton
          onClick={handleClick}
          loading={loading}
          loadingIndicator="Loading..."
          variant="outlined"
        >
          Fetch data
        </LoadingButton>
      </Box>
    </Box>
  );
}
