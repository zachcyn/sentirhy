import { useState, useEffect, useContext } from 'react';
// import { useTranslation } from 'react-i18next';

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
  const [tracks, setTracks] = useState([]);
  const [emotion, setEmotion] = useState();
  const [showSelectors, setShowSelectors] = useState(false);
  const theme = useTheme();
  const { playingTrack, playTrack } = useSpotifyPlayback();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEmotionChange = async (e) => {
    const selectedEmotion = e.target.value;
    setEmotion(selectedEmotion);
  }

  const handlePlay = (uri) => {
    playTrack(uri);
  }

  useEffect(() => {
    fetchRecommendation(emotion);
  }, [emotion]);

  const fetchRecommendation = async (selectedEmotion) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/recommend/country-categorized?mood=${selectedEmotion}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTracks(data);
      console.log('in emotion', data)
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  return (
    <Container sx={{width:'100%'}}>
      <Typography variant="h4">
        Emotion Detector
      </Typography>
      
      {/* <Camera /> */}
      <Button onClick={() => setShowSelectors(!showSelectors)}>
        {showSelectors ? 'Show Now Playing' : 'Show Selectors'}
      </Button>

      <Grid container spacing={3}>
        {!showSelectors ? (
          !isMobile && (
            <Grid item xs={12} sm={false} md={6} lg={7} sx={{ display: 'flex', justifyContent: 'flex-start'}}>
              {playingTrack ? (
                <Card sx={{ display: 'flex', justifyContent: 'center', height: '70vh', backgroundColor: 'red', boxShadow: 0, borderRadius: 0 }}>
                  <img
                    src={playingTrack.albumImageUrl}
                    alt={`${playingTrack.name} album cover`}
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                  />
                </Card>
              ) : (
                <Typography>No track playing...</Typography>
              )}
            </Grid>
          )
        ) : (
            <Grid item xs={12} sm={6} md={3}>
              <Card
              component={Stack}
              spacing={3}
              direction="row"
              sx={{
                px: 3,
                py: 5,
                borderRadius: 2
              }}
            >
              <FormControl fullWidth>
                <InputLabel id='emotion'>Emotion</InputLabel>
                <Select
                    value={emotion}
                    label='Emotion'
                    onChange={handleEmotionChange}
                    >
                    <MenuItem value='Happy'>Happy</MenuItem>
                    <MenuItem value='Sad'>Sad</MenuItem>
                    <MenuItem value='Angry'>Angry</MenuItem>
                    <MenuItem value='Neutral'>Neutral</MenuItem>
                  </Select>
              </FormControl>
            </Card>
          </Grid>
        )}


        <Grid item xs={12} md={6} lg={5}>
          <Button>Play All</Button>
            <List sx={{ display: 'flex', 
            flexDirection: 'column', 
            width: '100%', 
            bgcolor: 'background.default', 
            height: { // THIS NEED TO FIXED LATER ON FOR RESPONSIVE ADAPTABLE
              xs: isMobile ? '53vh' :'42vh',
              sm: '53vh',
              md: '70vh', 
              lg: '70vh', 
            },
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
        </Grid>
      </Grid>
    </Container>
  );
}
