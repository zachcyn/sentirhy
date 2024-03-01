import SimpleBar from 'simplebar-react';

import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

export const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
      borderRadius: '10px',
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: '10px',
    borderRadius: '10px',
    backgroundColor: 'transparent', 
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));
