import React from 'react';
import PropTypes from 'prop-types'; 

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import ScrollableText from '../scrolling-word/scrollable-text';

const TrackItem = ({ track, handlePlay }) => {
  const theme = useTheme();
  
  return (
    <ListItem sx={{ 
      flexGrow: 1, 
      flexBasis: 0, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'background.paper', 
    }}>
      <ListItemIcon>
        <img 
          src={track.coverarturl} 
          alt={track.title} 
          style={{ 
            height: '60px', 
            width: '60px', 
            borderRadius: '10px', 
            objectFit: 'cover',
            marginRight: '16px',
          }} 
        />
      </ListItemIcon>
      <ListItemText 
        primary={<ScrollableText text={track.title || ''} variant='subtitle1'/>}
        secondary={<ScrollableText text={track.name || ''} variant='body2' />}
        sx={{ '& .MuiListItemText-primary': { whiteSpace: 'nowrap' } }}
      />
      <Box sx={{ marginLeft: 'auto' }}>
        <IconButton onClick={() => handlePlay(track.spotifyurl)} sx={{ color: theme.palette.text.primary }}>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Box>
    </ListItem>

 )};

TrackItem.propTypes = {
  track: PropTypes.shape({
    trackid: PropTypes.string.isRequired,
    coverarturl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    spotifyurl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  handlePlay: PropTypes.func.isRequired,
};


export default TrackItem;
