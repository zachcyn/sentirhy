import PropTypes from 'prop-types';
import React, {  useMemo, useState, useContext, createContext, useCallback } from 'react';

export const SpotifyPlaybackContext = createContext({ 
    playingTrack: null,
    updateTrack: () => {},
    playTrack: () => {} ,
});

export const useSpotifyPlayback = () => useContext(SpotifyPlaybackContext);

export const SpotifyPlaybackProvider = ({ children }) => {
    const [playingTrack, setPlayingTrack] = useState(null);
    const [currentTrackUri, setCurrentTrackUri] = useState(null);
    const [playlistUris, setPlaylistUris] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const playTrack = useCallback((uri) => {
        setCurrentTrackUri(uri);
    }, []);

    const playPlaylist = useCallback((uris, startIndex=0) => {
        setPlaylistUris(uris);
        setCurrentTrackIndex(startIndex);
        playTrack(uris[startIndex]);
    }, [playTrack]);

    const updateTrack = (details) => {
        setPlayingTrack(details);
    }

    const value = useMemo(() => ({ 
        currentTrackUri, 
        playTrack ,
        playingTrack,
        setPlayingTrack,
        playPlaylist,
        currentTrackIndex,
        playlistUris,
        setCurrentTrackIndex,
    }), [
        playTrack,
        setCurrentTrackIndex,
        currentTrackUri, 
        playingTrack,
        playPlaylist,
        currentTrackIndex,
        playlistUris 
    ]);

    return (
        <SpotifyPlaybackContext.Provider value={value}>
            {children}
        </SpotifyPlaybackContext.Provider>
    );
};

SpotifyPlaybackProvider.propTypes = {
    children: PropTypes.node,
};