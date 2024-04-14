import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
import { SpotifyPlaybackContext } from './spotify-context';

function loadSpotifySDK(onReady) {
    if (window.Spotify) {
        onReady();
        return;
    }

    window.onSpotifyWebPlaybackSDKReady = onReady;

    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
    document.head.appendChild(scriptTag);
}

const SpotifyPlayer = ({ token }) => {
    const [spotifyPlayer, setSpotifyPlayer] = useState(null); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isActive, setActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [muted, setMuted] = useState(false);
    const [prevVolume, setPrevVolume] =  useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const playerRef = useRef(null);
    const { currentTrackUri, setPlayingTrack, playlistUris, currentTrackIndex, setCurrentTrackIndex } = useContext(SpotifyPlaybackContext);
    const [trackProgress, setTrackProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const transferPlaybackHere = useCallback(async (device_id) => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "device_ids": [device_id],
            "play": false
          })
        });
    
        if (response.ok) {
          console.log('Playback transferred');
        } else {
          console.error('Failed to transfer playback', response.status);
        }
      } catch (error) {
        console.error('Error transferring playback', error);
      }
    }, [token]);

    const play = useCallback(async (spotifyUri) => {
      if (!spotifyUri) {
        console.error('No Spotify URI provided to play function');
        return;
      }
      
      const playRequest = async () => {
        try {
          const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            console.log('Playback started');
            setIsPlaying(true);
          } else {
            console.error('Failed to start playback', await response.json());
          }
        } catch (error) {
          console.error('Error in play function', error);
        }
      };
  
      playRequest();
    }, [token]);

    const fetchCurrentPlaybackState = useCallback(async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching playback state: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        if (!text) {
          return;
        }
        
        const data = JSON.parse(text);

        if (data && data.item) {
          const newTrackDetails = {
            name: data.item.name,
            artist: data.item.artists.map((artist) => artist.name).join(', '),
            albumImageUrl: data.item.album.images[0].url,
          };
          setCurrentTrack(newTrackDetails);
          setPlayingTrack(newTrackDetails);
          setTrackProgress(data.progress_ms);
          setDuration(data.item.duration_ms);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false); 
      }
    }, [token, setPlayingTrack]);

  useEffect(() => {

    let playerInstance;

    const onSDKReady = () => {
      playerInstance = new window.Spotify.Player({
          name: 'Sentirhy Web Playback',
          getOAuthToken: cb => { cb(token); },
      });

      playerRef.current = playerInstance;

      setSpotifyPlayer(playerInstance);

      playerInstance.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      fetchCurrentPlaybackState();
      // transferPlaybackHere(device_id);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
      });

      playerInstance.addListener('player_state_changed', async (state) => {
        console.log('Player state changed:', state);
        if (!state) return;
        setIsPlaying(!state.paused);
        const trackEnded = state.position === 0 && state.paused;
        if (trackEnded) {
          setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlistUris.length);
        }
      });

      playerInstance.connect();
    };

    if (!window.Spotify) {
      loadSpotifySDK(onSDKReady); 
    } else {
      onSDKReady(); 
    }

    return () => {
      if (playerInstance) {
        playerRef.current.removeListener('ready');
        playerRef.current.removeListener('not_ready');
        playerRef.current.removeListener('player_state_changed');
        playerRef.current.disconnect();
        playerRef.current = null; 
      }
    };

  }, [token, fetchCurrentPlaybackState, transferPlaybackHere, currentTrackIndex, setCurrentTrackIndex, play, playlistUris]);

  useEffect(() => {
    if (currentTrackUri) {
      play(currentTrackUri);
    }
  }, [currentTrackUri, play]);

  useEffect(() => {
    if (playlistUris.length > 0 && currentTrackIndex !== null) {
      const trackUri = playlistUris[currentTrackIndex];
      play(trackUri); 
    }
  }, [playlistUris, currentTrackIndex, play]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentPlaybackState();
    }, 1000); 

    return () => clearInterval(interval); 
  }, [fetchCurrentPlaybackState]);

  const handleProgressChange = (event, newValue) => {
    const newPositionMs = (newValue / 100) * duration; // Assuming newValue is a percentage
    playerRef.current.seek(newPositionMs).then(() => {
      setTrackProgress(newPositionMs);
    });
  }
  
  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current.togglePlay();
    }
  };

  const nextTrack = () => {
    if (playerRef.current) {
      playerRef.current.nextTrack();
    }
  };

  const previousTrack = () => {
    if (playerRef.current) {
      playerRef.current.previousTrack();
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    playerRef.current.setVolume(newValue); 
    setMuted(newValue === 0);
  };

  const toggleMute = () => {
      if (muted || volume === 0) {
          playerRef.current.setVolume(prevVolume)
          setVolume(prevVolume);
          setMuted(false);
      } else {
          playerRef.current.setVolume(0);
          setPrevVolume(volume);
          setVolume(0);
          setMuted(true);
      }
  }

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }  

  const getVolumeIcon = () => {
      if (muted || volume === 0) return <VolumeOffIcon />;
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
              '@media (max-width:1920px)': {
                top: '3vh'
              },
              '@media (min-width:1920px)': {
                top: '2.5vh'
              },
              '@media (min-width: 600px) and (max-width: 900px) and (orientation: portrait)':{
                top: '2.5vh'
              },
              '@media (min-width: 600px) and (max-width: 1200px) and (max-height: 1200px) and (orientation: landscape)':{
                top: '3.5vh'
              },
              '@media (min-width: 300px) and (max-width: 900px) and (orientation: landscape)': {
                top: '8vh'
              },
              '@media (min-width: 400px) and (max-width: 1000px) and (orientation: landscape)':{
                top: '7vh'
              },
              '@media (min-width: 1024px) and (max-width: 1180px) and (orientation: landscape)':{
                top: '3.5vh'
              },
              '@media (max-width: 1366px) and (min-height: 1024px) and (orientation: landscape)':{
                top: '3vh'
              },
              '@media (min-width: 1000px) and (max-width: 1366px) and (orientation: portrait)':{
                top: '2.5vh'
              },
              '@media (min-width: 900px) and (max-width: 1000px) and (orientation: portrait)':{
                top: '2.5vh'
              }
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
              '@media (min-width:1920px)': {
                padding: '20px',
              },
              [theme.breakpoints.up('lg')]: {
                padding: '20px',
              },
              '@media (min-width: 600px) and (max-width: 900px) and (orientation: portrait)':{
                padding: '20px',
              },
              '@media (min-width: 600px) and (max-width: 1200px) and (orientation: landscape)':{
                padding: '20px',
              },
              '@media (min-width: 400px) and (max-width: 1000px) and (orientation: landscape)':{
                padding: '0px',
              },
              '@media (min-width: 200px) and (max-width: 600px) and (orientation: portrait)':{
                padding: '20px',
              },
              '@media (min-width: 1024px) and (max-width: 1180px) and (orientation: landscape)':{
                padding: '20px',
              },
              '@media (max-width: 1366px) and (min-height: 1024px) and (orientation: landscape)':{
                padding: '20px',
              },
              '@media (min-width: 1000px) and (max-width: 1366px) and (orientation: portrait)':{
                padding: '20px',
              },
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-start', maxWidth: isMobile ? '100%' : '33%'}}>
            {currentTrack && (
              <img
                src={currentTrack.albumImageUrl}
                alt="Album cover"
                style={{ height: 60, width: 60, marginRight: '16px'}}
              />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 76px)'}}>
              <ScrollableText text={currentTrack?.name || ''} variant='subtitle1' />
              <ScrollableText text={currentTrack?.artist || ''} variant='body2' /> 
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: isMobile ? '100%' : '36%', flex: isMobile ? 1 : 'none', flexGrow: 1}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', flex: isMobile ? 1 : 'none', flexGrow: 1}}>
              <IconButton onClick={previousTrack}>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton onClick={togglePlay}>
                {isPlaying ? (
                  <PauseCircleOutlineIcon fontSize="large" />
                ) : (
                  <PlayCircleOutlineIcon fontSize="large" />
                )}
              </IconButton>
              <IconButton onClick={nextTrack}>
                <SkipNextIcon />
              </IconButton>
            </Box>
              {isMobile && (
                <Box sx={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  width:"100%"}}>
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
                onChange={handleVolumeChange}
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
                onChange={handleVolumeChange}
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
    );
};

SpotifyPlayer.propTypes = {
    token: PropTypes.string.isRequired
};

export default SpotifyPlayer;