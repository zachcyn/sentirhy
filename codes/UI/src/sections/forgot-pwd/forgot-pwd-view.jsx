import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import LanguagePopover from 'src/layouts/dashboard/common/language-popover';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------
export default function ForgotPwdView() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { t } =  useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
          console.log('Request successful');
          setShowSuccessMessage(true);
        } else {
          console.error('Request failed');
        }
    } catch (error) {
      console.error('Network error', error);
    }
  };

  useEffect(() => {
    setEmail('');
    setEmailError(false);
  }, [showSuccessMessage]);

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(val).toLowerCase());
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value.trim();
    setEmail(newEmail);
    setEmailError(!validateEmail(newEmail));
  };

  const renderForm = (
    <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
            name="email"
            label={t("Email")}
            value={email}
            type='email'
            onChange={handleEmailChange}
            error={emailError}
            helperText={emailError ? t("Please enter a valid email address.") : ''}
            required
            />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                disabled={emailError || email.trim() === ''}
                >
                {t('Request reset link')}
            </LoadingButton>
        </Stack>
        <Box width="100%" sx={{mt: 2, display:"flex", justifyContent:"center"}}>
            <Link variant="subtitle2" underline="hover" sx={{ ml: 0.5, cursor:'pointer'}} onClick={handleLogin}>
            {t('Back to Login')}
            </Link>
        </Box>
    </form>
  );

  return (
    <>
    {showSuccessMessage && (
      <Alert severity='success' onClose={() => router.push('/login')} sx={{position:'absolute', width:"100%", zIndex:1}}>
        {t('If the email is associated with an account, a reset link will be sent.')}
      </Alert>
    )}
    
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
          <Typography variant="h4">{t('Forgot your password')}</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            {t('Please enter your username or email address. You will receive a link to create a new password via email.')}
          </Typography>

          {renderForm}
        </Card>
      </Stack>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
        }}
      >
      <LanguagePopover/>
      </Box>
    </Box>
    </>
  );
}
