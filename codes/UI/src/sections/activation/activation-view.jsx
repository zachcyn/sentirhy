import  PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function ActivationView() {
  const theme = useTheme();
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  const getToken = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token');
  }

  const token = getToken();

  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/activate?token=${token}`)
        .then(response => {
            response.json();
          if (response.ok) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        })
        .catch(err => {
          console.error('Activation error:', err);
          setStatus('error');
        });
    }
  }, [token]);

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRequest = () => {
    router.push('/forgot-pwd')
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <ActivationLoadingView />
        );
      case 'success':
        return (
          <ActivationSuccessView handleLogin={handleLogin} />
        );
      case 'error':
        return (
          <ActivationErrorView handleRequest={handleRequest} />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        minHeight: '100vh',
        height: 'auto',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          {renderContent()}
        </Card>
      </Stack>
    </Box>
  );
}

function ActivationLoadingView() {
  return (
    <Box width="100%"  sx={{    
      mt: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center'
      }}>
        <CircularProgress />
    </Box>
  );
}

function ActivationSuccessView({ handleLogin }) {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src="assets/illustrations/tick.png" alt="Confirmed" width="30%" />
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>Account activation</Typography>
      <Typography variant="subtitle2">Your account has been activated successfully.</Typography>
      <Link variant="subtitle2" underline="hover" sx={{ mt: 2, ml: 0.5, cursor: 'pointer' }} onClick={handleLogin}>Continue to Login</Link>
    </Box>
  );
}

function ActivationErrorView({ handleRequest }) {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src="assets/illustrations/incorrect.png" alt="Error" width="31%" />
      <Typography variant="h4" sx={{ mb: 2, mt: 2 }}>Account activation</Typography>
      <Typography variant="subtitle2">Your account failed to activate.</Typography>
      <Link variant="subtitle2" underline="hover" sx={{ mt: 2, ml: 0.5, cursor: 'pointer' }} onClick={handleRequest}>Request activation link again</Link>
    </Box>
  );
}


ActivationSuccessView.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};

ActivationErrorView.propTypes = {
  handleRequest: PropTypes.func.isRequired,
};
