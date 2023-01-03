import React from 'react';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export default function ToggleButtons({ onChange }) {
  const [alignment, setAlignment] = React.useState('live');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    onChange(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="live" aria-label="left aligned">
        Live
      </ToggleButton>
      <ToggleButton value="queue" aria-label="centered">
        Queue
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
