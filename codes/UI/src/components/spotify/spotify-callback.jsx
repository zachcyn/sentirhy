import { useState, useEffect } from 'react';

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

const SpotifyCallback = () => {
    const theme = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const exchangeCodeForToken = async (authCode) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/spotify/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: authCode }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('spotifyAccessToken', data.accessToken);
                localStorage.setItem('spotifyRefreshToken', data.refreshToken);
                localStorage.setItem('spotifyExpiresIn', data.expiresIn);
                localStorage.setItem('spotifyConnected', true);
                setIsLoading(false);
                router.push('/dashboard');
            } else {
                console.error('Failed to exchange code for token');
                setIsLoading(false);
                router.push('/dashboard');
            }
        };

        if (code) {
            setIsLoading(true);
            exchangeCodeForToken(code);
        }
    }, [router]);

    return (
        <Modal open={isLoading}>
            <Box sx={{
            ...bgGradient({
                color: alpha(theme.palette.background.default, 0.9),
                imgUrl: '/assets/background/overlay_4.jpg',
            }),
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', // Default width for small devices
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            boxShadow: 24,
            height: '100%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        </Modal>
    )
}

export default SpotifyCallback