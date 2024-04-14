import { chaoticOrbit, waveform, quantum, hatch } from 'ldrs';
// import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import useMediaQuery from '@mui/material/useMediaQuery';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import Camera from '../../components/camera';
import TrackItem from '../../components/playlist';
import Scrollbar from '../../components/scrollbar';
import { useSpotifyPlayback } from '../../components/spotify/spotify-context';
// import SpotifyLogin from '../../components/spotify';
// ----------------------------------------------------------------------

export default function EmotionView() {
  chaoticOrbit.register()
  waveform.register()
  quantum.register()
  hatch.register()
  const [tracks, setTracks] = useState([]);
  const [emotion, setEmotion] = useState('none');
  const [showSelectors, setShowSelectors] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState('waiting');
  const [isDetecting, setIsDetecting] = useState(false);
  const { playingTrack, playTrack, playPlaylist } = useSpotifyPlayback();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cameraRef = useRef(null);
  let imageSrc;
  let altText;

  const handleCapture = async (imageData) => {
    setPlaylistLoading('detecting');
    const response = await fetch(imageData);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    fetch(`${import.meta.env.VITE_API_URL}/recommend/predict-emotion-for-music` , {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      setEmotion(data.predictedEmotion);
      setPlaylistLoading('fetching');
      setTimeout(() => {
        setTracks(data.recommendations);
      }, 3000);
    })
    .catch(err => {
      console.error('Error', err)
    })
  }

  const handlePlay = (uri) => {
    playTrack(uri);
  }

  const handlePlayAll = () => {
    const uris = tracks.map(track => track.spotifyurl);
    playPlaylist(uris);
  };

  if (!showSelectors) {
    if (theme.palette.mode === 'light') {
      imageSrc = '/assets/icons/ic_emotion_dark.svg';
      altText = 'light emotion logo';
    } else {
      imageSrc = '/assets/icons/ic_emotion_light.svg';
      altText = 'dark emotion logo';
    }
  } else if (theme.palette.mode === 'light') { 
    imageSrc = '/assets/icons/ic_music_dark.svg';
    altText = 'light music logo';
  } else {
    imageSrc = '/assets/icons/ic_music_light.svg';
    altText = 'dark music logo';
  }

  return (
    <Container sx={{width:'100%'}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <Typography variant="h4">
          Emotion Detector
        </Typography>
        
        <IconButton 
          onClick={() => setShowSelectors(!showSelectors)}
          sx={{
            width: 40,
            height: 40,
            ml: 1
          }}
        >
          <img src={imageSrc} alt={altText} />
        </IconButton>
      </Box>
      <Grid container spacing={3}>
        {!showSelectors ? (
          !isMobile && (
            <Grid item xs={12} sm={false} md={6} lg={7} sx={{ display: 'flex', justifyContent: 'flex-start'}}>
              {playingTrack ? (
                <Card sx={{ display: 'flex', justifyContent: 'center', height: '70vh', mt:2, boxShadow: 0, borderRadius: 0, bgcolor:'red'}}>
                  <img
                    src={playingTrack.albumImageUrl}
                    alt={`${playingTrack.name} album cover`}
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  />
                </Card>
              ) : (
                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%",  height: '70vh', mt: 2, mr: 3, backgroundColor: theme.palette.background.neutral, boxShadow: 0, borderRadius: 0 }}>
                  <l-chaotic-orbit size="35" speed="1.5" color={theme.palette.text.primary} />
                </Card>
              )}
            </Grid>
          )
        ) : (
          <Grid item xs={12} md={6} lg={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Card sx={{ 
              mt: 2,
              boxShadow: 0,
              borderRadius: 0,
              height: '55vh', 
              width:'100%',
              bgcolor: 'transparent',
              }}>
                <Box 
                  sx={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'flex-start', 
                    height: '100%',
                    mr: 3,
                  }}
                >
                  <Camera ref={cameraRef} isDetecting={isDetecting} setDetecting={setIsDetecting} onCapture={handleCapture}/>
                </Box>
            </Card>
            <Card sx={{ 
              bgcolor: 'transparent',
              height: '15vh',
              width: '100%',
              boxShadow: 0, 
              borderRadius: 0, 
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', mr:3}}>
                { emotion === 'none' ? (
                  <Box sx={{
                    width:"100%",
                    height: "15vh",
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <l-quantum size="35" speed="1.75" color={theme.palette.text.primary} />
                  </Box>
                ):(
                  <>
                  <Box sx={{display: 'flex', flexDirection: 'column', pl: 1}}>
                    {emotion === 'Happy' && (
                      <>
                        <Typography variant="body1">
                          Your smile is contagious! You seem really <strong>happy</strong> today 😊, and that&apos;s wonderful.
                        </Typography>
                        <Typography variant="body1">
                          Feel like sharing that joy once more?
                        </Typography>
                      </>
                    )}
                    {emotion === 'Sad' && (
                      <>
                        <Typography variant="body1">
                          It seems like you&apos;re feeling a bit <strong>sad</strong> 😔. It&apos;s perfectly okay to feel that way, and I&apos;m here for you.
                        </Typography>
                        <Typography variant="body1">
                          Would you like to try detecting your emotions again, or is there something else you&apos;d prefer to do?
                        </Typography>
                      </>
                    )}
                    {emotion === 'Angry' && (
                      <>
                        <Typography variant="body1">
                          You appear to be feeling quite <strong>angry</strong> 😡. That&apos;s a natural response, and I want to support you through it.
                        </Typography>
                        <Typography variant="body1">
                          When you&apos;re ready, shall we try again or do something to cool off?
                        </Typography>
                      </>
                    )}
                    {emotion === 'Neutral' && (
                      <>
                        <Typography variant="body1">
                        You&apos;re showing a <strong>neutral</strong> 😐 mood. That&apos;s a calm place to be, and it&apos;s just as valid as any other feeling.
                        </Typography>
                        <Typography variant="body1">
                          If you&apos;d like to explore more, we can check in with your emotions again.
                        </Typography>
                      </>
                    )}
                  </Box>
                    <Button 
                      onClick={() => {
                        cameraRef.current.toggleDetection();
                        setEmotion('none');
                        setPlaylistLoading('detecting');
                        setTracks([]);
                      }}
                      variant="contained" 
                      sx={{ 
                        backgroundColor: theme.palette.text.primary, 
                        color: theme.palette.background.paper,
                        '&:hover': { 
                            backgroundColor: theme.palette.text.secondary,
                            color: theme.palette.background.paper
                        },
                        alignSelf:'flex-end',
                        position:'absolute',
                        bottom: 0 
                      }}>
                        Detect Again
                    </Button>
                  </>
                  )}
              </Box>
            </Card>
          </Grid>
        )}


        <Grid item xs={12} sm={5} md={5} lg={4}>
          {tracks.length > 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              '@media (max-width:1920px)': {  // laptop
                height: '70vh',
              },
              '@media (min-width:1920px)': {  // desktop
                height: '70vh',
              },
              '@media (min-width: 400px) and (max-height: 932px) and (orientation: portrait)':{  // iphone 14 pro max
                height: '58vh',
              },
              '@media (min-width: 300px) and (max-height: 844px) and (orientation: portrait)':{  // iphone 12 pro
                height: '54vh',
              },
              '@media (min-width: 414px) and (max-height: 896px) and (orientation: portrait)':{  // iphone xr
                height: '57vh',
              },
              '@media (min-width: 375px) and (max-height: 667px) and (orientation: portrait)':{  // iphone se
                height: '42vh',
              },
              '@media (min-width: 600px) and (max-width: 1200px) and (max-height: 1200px) and (orientation: landscape)':{
                height: '30vh',
              },
              '@media (min-width: 300px) and (max-width: 900px) and (orientation: landscape)': {
                height: '30vh',
              },
              '@media (min-width: 400px) and (max-width: 1000px) and (orientation: landscape)':{
                height: '30vh',
              },
              '@media (min-width: 1024px) and (max-width: 1180px) and (orientation: landscape)':{
                height: '30vh',
              },
              '@media (max-width: 1366px) and (min-height: 1024px) and (orientation: landscape)':{
                height: '30vh',
              },
              '@media (min-width: 1000px) and (max-width: 1366px) and (orientation: portrait)':{
                height: '70vh',
              },
              '@media (min-width: 900px) and (max-width: 1000px) and (orientation: portrait)':{
                height: '70vh',
              },
              mt: 2,
            }}>
              <Button onClick={handlePlayAll} 
              sx={{
                backgroundColor: theme.palette.background.default, 
                color: theme.palette.text.primary,
                '&:hover': { 
                    color: theme.palette.text.disabled,
                    backgroundColor: 'transparent'
                },
                borderRadius: '5px 5px 0 0', 
                borderTop: 1,
                borderLeft: 1,
                borderRight: 1,
                borderColor: 'transparent',
                textTransform: 'none',
                justifyContent: 'flex-start',
                width: 'auto',          
                maxWidth: 'fit-content'   
              }}>Play All</Button>
                <List sx={{ display: 'flex', 
                flexDirection: 'column', 
                width: '100%', 
                bgcolor: 'background.default', 
                // height: { // THIS NEED TO FIXED LATER ON FOR RESPONSIVE ADAPTABLE
                //   xs: isMobile ? '53vh' :'42vh',
                //   sm: '53vh',
                //   md: '70vh', 
                //   lg: '70vh', 
                // },
                overflowY: 'auto', 
                padding: 0 }}>
                  <Scrollbar>
                  {tracks.map((track) => (
                    <>
                    <TrackItem key={track.trackid} track={track} handlePlay={handlePlay} />
                    <Divider sx={{ borderColor: 'background.neutral' }} />
                    </>
                  ))}
                  </Scrollbar>
                </List>
            </Box>
          ):(
            <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: "100%",  height: '70vh', mt:2,  backgroundColor: theme.palette.background.neutral, boxShadow: 0, borderRadius: 0 }}>
              {playlistLoading === 'waiting' && (
                <>
                  <l-waveform size="35" speed="1"stroke="3.5" color={theme.palette.text.primary} />
                  <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                    Waiting for detection...
                  </Typography>
                </>
              )}
              {playlistLoading === 'detecting' && (
                <>
                  <l-quantum size="35" speed="1.75" color={theme.palette.text.primary} />
                  <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                    Analyzing your emotions...
                  </Typography>
                </>
              )}
              {playlistLoading === 'fetching' && (
                <>
                <l-hatch size='35' stroke='4' speed='3.5' color={theme.palette.text.primary} />
                <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                  Tailoring your personalized playlist...
                </Typography>
                </>
              )}
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
