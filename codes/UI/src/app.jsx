/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';
import { useMemo, useState, useEffect,useContext } from 'react';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { Box, useMediaQuery } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';
import { alpha, createTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { useAuth } from './sections/login/authContext';
import SpotifyPlayer from './components/spotify/spotify-sdk';
import { SpotifyPlaybackProvider } from './components/spotify/spotify-context'
import { refreshSpotifyToken, validateSpotifyToken } from './components/spotify/spotify-api';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const [showModal, setShowModal] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [isSpotifyValid, setIsSpotifyValid] = useState(false);
  const { authState } = useAuth();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  useEffect(()=>{
    if (!authState.isAuthenticated){
      return;
    }
    const musicService = localStorage.getItem('musicService');
    const spotifyConnected = localStorage.getItem('spotifyConnected');
    const youtubeConnected = localStorage.getItem('youtubeConnected');
    const token = localStorage.getItem('spotifyAccessToken');

    if (musicService === 'spotify' && spotifyConnected === 'true') {
      validateSpotifyToken()
        .then(isValid => {
          setIsSpotifyValid(isValid);
          setShowModal(false);
          setSpotifyToken(token);
          if (!isValid) {
            refreshSpotifyToken()
            .then(isRefresh => {
              setIsSpotifyValid(isRefresh);
              if (!isRefresh) {
                setShowModal(true);
              };
            })
          }
        })
        .catch(error => {
          console.error("Error validating Spotify token:", error)
        });
    } else {
      setShowModal(true);
    }
  }, [authState.isAuthenticated, theme]);

  const handleConnect = (service) => {
    localStorage.setItem('musicService', service);
    setShowModal(false);
    if (service === 'spotify') {
      const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URL)}&response_type=code&scope=streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state user-read-currently-playing user-library-read user-top-read playlist-read-private playlist-read-collaborative user-follow-read`;
      window.location.href = spotifyAuthUrl;
    } else if (service === 'youtube') {
      const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_YOUTUBE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URL)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`;
      window.location.href = youtubeAuthUrl;
      localStorage.setItem('youtubeConnected', false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
        <SpotifyPlaybackProvider>
          <Router />
          {authState.isAuthenticated && spotifyToken && <SpotifyPlayer token={spotifyToken} />}
          {showModal &&
           <Modal open={showModal}
              onClose={() => setShowModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                ...bgGradient({
                  color: alpha(theme.palette.background.default, 0.9),
                  imgUrl: '/assets/background/overlay_4.jpg',
                }),
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                [theme.breakpoints.up('sm')]: {
                  width: '60%',
                  height: '30%'
                },
                [theme.breakpoints.up('md')]: {
                  width: '30vw',
                  height: '40%'
                },
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                boxShadow: 24,
                height: '30%',
                borderRadius: '16px',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
                }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                  Choose Music Service
                </Typography>
                <Button 
                  variant='contained' 
                  sx={{ bgcolor:'#1DB954', mb: 2, width: '75%', display: 'flex', justifyContent: 'center' }}
                  onClick={() => handleConnect('spotify')}
                  startIcon={<Iconify icon="mdi:spotify" />}
                >
                  Connect to Spotify
                </Button>
                <Button 
                  variant='contained' 
                  sx={{ bgcolor:'#FF0000', width: '75%', display: 'flex', justifyContent: 'center' }}
                  onClick={() => handleConnect('youtube')}
                  startIcon={<Iconify icon="mdi:youtube" />}
                >
                  Connect to YouTube
                </Button>
              </Box>
            </Modal>
           } 
        </SpotifyPlaybackProvider>
    </ThemeProvider>
  );
}