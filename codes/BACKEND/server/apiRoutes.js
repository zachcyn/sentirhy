const express = require('express');
const router = express.Router();

router.post('/spotify/refresh', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET)
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ message: 'Failed to refresh token'});
        }

        res.json({
            accessToken: data.access_token,
            expiresIn: data.expires_in
        });
    } catch (err) {
        console.error('Error refreshing Spotify token:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/spotify/token', async (req, res) => {
    const code = req.body.code;

    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3030/spotify-callback'
        })
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        if (!response.ok) {
            console.log("Spotify API response", data);
            return res.status(400).json({ message: 'Failed to exchange code for token', details: data });
        }

        res.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in
        });
    } catch (err) {
        console.error('Error exchanging Spotify code for token:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;