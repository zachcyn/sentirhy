import PropTypes from 'prop-types';
import React, { useMemo, createContext, useState, useCallback, useContext, useEffect } from 'react';

const SpotifyPlaybackContext = createContext();

export const useSpotifyPlayback = () => useContext(SpotifyPlaybackContext);

export const SpotifyPlaybackProvider = ({ children, token }) => {
    const [currentTrackUri, setCurrentTrackUri] = useState(null);
    const [playlistUris, setPlaylistUris] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50); // Assuming volume is a percentage (0-100)
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off'); // Possible values: 'off', 'context', 'track'
    const [duration, setDuration] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0)

    const playTrack = useCallback((uri) => {
        setCurrentTrackUri(uri);
        setIsPlaying(true);
    }, []);

    
    const handleProgressChange = useCallback((newValue) => {
        const newPositionMs = (newValue / 100) * duration; // Assuming newValue is a percentage
        setTrackProgress(newPositionMs);
    }, [duration])

    const playPlaylist = useCallback((uris, startIndex = 0) => {
        setPlaylistUris(uris);
        setCurrentTrackIndex(startIndex);
        setCurrentTrackUri(uris[startIndex]);
        setIsPlaying(true);
    }, []);

    const skipToNext = useCallback(() => {
        setCurrentTrackIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % playlistUris.length;
            setCurrentTrackUri(playlistUris[nextIndex]);
            return nextIndex;
        });
    }, [playlistUris]);

    const skipToPrevious = useCallback(() => {
        setCurrentTrackIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + playlistUris.length) % playlistUris.length;
            setCurrentTrackUri(playlistUris[nextIndex]);
            return nextIndex;
        });
    }, [playlistUris]);

    const togglePlayPause = useCallback(() => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    }, []);

    const adjustVolume = useCallback((newVolume) => {
        setVolume(newVolume);
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prevIsMuted) => !prevIsMuted);
    }, []);

    const toggleShuffle = useCallback(() => {
        setIsShuffled((prevIsShuffled) => !prevIsShuffled);
    }, []);

    const toggleRepeat = useCallback(() => {
        setRepeatMode((prevMode) => {
            if (prevMode === 'off') return 'context';
            if (prevMode === 'context') return 'track';
            return 'off';
        });
    }, []);

    // Additional logic to integrate with the Spotify Web Playback SDK as needed

    const contextValue = useMemo(() => ({
        currentTrackUri,
        playlistUris,
        currentTrackIndex,
        isPlaying,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        duration,
        trackProgress,
        token,
        handleProgressChange,
        setDuration,
        playTrack,
        playPlaylist,
        skipToNext,
        skipToPrevious,
        togglePlayPause,
        adjustVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        setCurrentTrackUri,
    }), [
        currentTrackUri,
        playlistUris,
        currentTrackIndex,
        isPlaying,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        duration,
        trackProgress,
        token,
        handleProgressChange,
        setDuration,
        playTrack,
        playPlaylist,
        skipToNext,
        skipToPrevious,
        togglePlayPause,
        adjustVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        setCurrentTrackUri,
    ]);

    return (
        <SpotifyPlaybackContext.Provider value={contextValue}>
            {children}
        </SpotifyPlaybackContext.Provider>
    );
};

SpotifyPlaybackProvider.propTypes = {
    children: PropTypes.node.isRequired,
    token: PropTypes.string.isRequired, 
};