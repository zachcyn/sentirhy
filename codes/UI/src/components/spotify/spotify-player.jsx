import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

import ScrollableText from '../scrolling-word/scrollable-text';
import { useSpotifyPlayback } from './spotify-context';

const SpotifyPlayer = () => {
    const {
        isPlaying,
        currentTrack,
        togglePlayPause,
        playNextTrack,
        playPreviousTrack,
        volume,
        adjustVolume,
        isMuted,
        toggleMute,
        duration,
        trackProgress,
        handleProgressChange,
    } = useSpotifyPlayback();


    const formatTime = (milliseconds) => {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeOffIcon />;
        if (volume > 0 && volume <= 0.5) return <VolumeDownIcon />;
        return <VolumeUpIcon />;
    };
    
    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            }}
        >

        {!isMobile && (
          <Box
            sx={{
              position: 'relative',
              left: 0,
              right: 0,
              zIndex: 2,
              top: {
                xs: '2.5vh', // Applies to extra-small screens regardless of isTablet
                md: isTablet ? '2.5vh' : '3.5vh', // Overrides for medium screens if isTablet is true
                lg: theme.breakpoints.down('lg') ? '2.5vh' : '3.5vh', // Overrides for large screens if isTablet is true
              },
            }}
          >
            <Slider
              value={trackProgress / duration * 100}
              onChange={handleProgressChange}
              aria-labelledby="track-progress-slider"
              sx={{
                zIndex: 2, 
                '& .MuiSlider-thumb': {
                  color: '#ffffff',
                  boxShadow: 'none',
                  width: 18,
                  height: 18,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                      opacity: 1, 
                  },
              },
              '&:hover .MuiSlider-thumb': {
                  opacity: 1,
              },
              }}
            />
          </Box>
        )}
        <Box
            sx={{
              position: 'relative',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.palette.background.paper,
              padding: '20px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              zIndex: 1,
            }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', width: isMobile ? '100%' : '30.36%'}}>
            {currentTrack && (
              <img
                src={currentTrack.albumImageUrl}
                alt="Album cover"
                style={{ height: 60, width: 60, marginRight: '16px'}}
              />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
              {/* <ScrollableText text={currentTrack?.name || ''} />
              <ScrollableText text={currentTrack?.artist || ''} /> */}
              <Typography variant="body1" noWrap>{currentTrack?.name}</Typography>
              <Typography variant="subtitle1" noWrap>{currentTrack?.artist}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: isMobile ? '100%' : '36%', flex: isMobile ? 1 : 'none', flexGrow: 1}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', flex: isMobile ? 1 : 'none', flexGrow: 1}}>
              <IconButton onClick={playPreviousTrack}>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton onClick={togglePlayPause}>
                {isPlaying ? (
                  <PauseCircleOutlineIcon fontSize="large" />
                ) : (
                  <PlayCircleOutlineIcon fontSize="large" />
                )}
              </IconButton>
              <IconButton onClick={playNextTrack}>
                <SkipNextIcon />
              </IconButton>
            </Box>
              {isMobile && (
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width:"100%"}}>
                  <Typography variant='caption' sx={{ flex: 1, mr: 1, alignSelf:'center' }}>{formatTime(trackProgress)}</Typography>
                  <Slider
                    value={trackProgress / duration * 100}
                    onChange={handleProgressChange}
                    aria-labelledby="track-progress-slider"
                    sx={{
                      width: '100%',
                      '& .MuiSlider-thumb': {
                        color: '#ffffff',
                        boxShadow: 'none',
                        width: 18,
                        height: 18,
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        '&:hover': {
                            opacity: 1, 
                        },
                    },
                    '&:hover .MuiSlider-thumb': {
                        opacity: 1,
                    },
                    }}
                  />
                  <Typography variant='caption' sx={{ flex: 1, ml: 1, alignSelf:'center' }}>{formatTime(duration)}</Typography>
                </Box>
              )}
          </Box>
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' , marginLeft: 'auto'}}>
              <IconButton onClick={toggleMute}>
                {getVolumeIcon()}
              </IconButton>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={adjustVolume}
                sx={{ mx: 2 }}
              />
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', maxWidth: '33%' }}>
              <IconButton onClick={toggleMute}>
                {getVolumeIcon()}
              </IconButton>
              <Slider
                
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={adjustVolume}
                sx={{
                  width: '150px',
                  mx: 2,
                  '& .MuiSlider-thumb': {
                      color: '#ffffff',
                      boxShadow: 'none',
                      width: 12,
                      height: 12,
                      opacity: 0, 
                      transition: 'opacity 0.2s ease-in-out',
                      '&:hover': {
                          opacity: 1,
                      },
                  },
                  '&:hover .MuiSlider-thumb': {
                      opacity: 1,
                  },
              }}
              />
            </Box>
          )}
        </Box>
      </Box>
    )
};

export default SpotifyPlayer;