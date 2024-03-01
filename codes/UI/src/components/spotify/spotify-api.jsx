export const setSpotifyToken = (token) => {
    localStorage.setItem('spotifyAccessToken', token);
};

export const getSpotifyToken = () => localStorage.getItem('spotifyAccessToken');

export const validateSpotifyToken = async () => {
    const token = getSpotifyToken();

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Token invalid');
        }
        console.log('Token accessible')
        return true;
    } catch (err) {
        return false;
    }
};

export const refreshSpotifyToken = async () => {
    try {
        const refreshToken = localStorage.getItem('spotifyRefreshToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/spotify/refresh`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to refresh Spotify token');
        }
        console.log('Token refreshed.')
        localStorage.setItem('spotifyAccessToken', data.accessToken);
        localStorage.setItem('spotifyRefreshToken', data.refreshToken);
        localStorage.setItem('spotifyExpiresIn', data.expiresIn);
        localStorage.setItem('spotifyConnected', true);
        return true;
    } catch (err) {
        console.error('Error refreshing Spotify token:', err)
        return false;
    }
};


const SpotifyAPI = {
    setSpotifyToken,
    getSpotifyToken,
    validateSpotifyToken,
    refreshSpotifyToken,
  };
  
  export default SpotifyAPI;