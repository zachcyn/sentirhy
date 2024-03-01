import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';

import { useSpotifyPlayback } from './spotify-context';

const SpotifySDK = () => {
    const {
        currentTrackUri,
        isPlaying,
        volume,
        isMuted,
        setIsPlaying,
        setTrackProgress,
        setDuration,
        playNextTrack,
        playPreviousTrack,
        setCurrentTrackUri,
        token,
    } = useSpotifyPlayback();

    const playerRef = useRef(null);

    /* eslint-disable consistent-return */
    useEffect(() => {
      if (!window.Spotify || !token) return;

      const player = new window.Spotify.Player({
          name: 'Your Web Player Name',
          getOAuthToken: cb => cb(token),
          volume: 0.5,
      });

      // Event listener for player state changes
      player.addListener('player_state_changed', state => {
          if (!state) return;

          setIsPlaying(!state.paused);
          setTrackProgress(state.position);
          setDuration(state.duration);

          // Update current track URI for context
          const trackuri = state.track_window.current_track.uri;
          setCurrentTrackUri(trackuri);

          // Example logic for auto-playing next track (this might need customization)
          if (state.position === 0 && state.paused) {
              // This simple condition checks if we're at the start and paused, might indicate track end
              playNextTrack(); // Your context should handle deciding what "next" means (e.g., handling playlists)
          }
      });

      // Ready event listener
      player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          playerRef.current = player;
          // Transfer playback here if needed
      });

      // Connect to the player
      player.connect();

      // Cleanup on component unmount or token change
      return () => {
          player.removeListener('player_state_changed');
          player.removeListener('ready');
          player.disconnect();
      };
  }, [token, setIsPlaying, setTrackProgress, setDuration, playNextTrack, playPreviousTrack, setCurrentTrackUri]);
  /* eslint-disable consistent-return */

  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
        playerRef.current.resume();
    } else {
        playerRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(volume / 100); // Ensure volume is appropriately scaled
  }, [volume]);

  useEffect(() => {
    if (!playerRef.current) return;
    const targetVolume = isMuted ? 0 : volume / 100;
    playerRef.current.setVolume(targetVolume);
  }, [isMuted, volume]);

    // Effect to handle playing a specific track URI
    useEffect(() => {
      if (!currentTrackUri || !token) return;

      // Assuming playerRef.current holds the Spotify player instance
      fetch(`https://api.spotify.com/v1/me/player/play`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [currentTrackUri] }), // For a single track
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      }).then(response => {
          if (response.ok) {
              console.log('Playback started successfully');
          } else {
              console.error('Failed to start playback', response);
          }
      }).catch(error => {
          console.error('Error in play function', error);
      });
  }, [currentTrackUri, token]);
  
  // Remember to handle cleanup and other necessary setup

  return null; // This component does not render anything
};

export default SpotifySDK;
