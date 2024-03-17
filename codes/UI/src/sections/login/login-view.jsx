import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import LanguagePopover from 'src/layouts/dashboard/common/language-popover';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import { useAuth } from './authContext';
// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { t } =  useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({identifier, password, rememberMe}),
      });

      const data = await response.json();

      if (response.ok){
        console.log("Login successful", data);
        localStorage.setItem('authToken', data.token);
        login({ isAuthenticated: true, user: data.user, token: data.token, fname: data.fname, lname: data.lname, email: data.email }, rememberMe);
        router.push('/dashboard');
      } else {
        setErrorMessage(data.message);
      }
    } catch (err){
      console.error("Login error:", err);
      if (err.name === 'TypeError') {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
    setLoading(false);
  };

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    router.push('/register');
  };

  const handleForgotPwd = () => {
    router.push('/forgot-pwd')
  }

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField name="email" 
        label={t("Username or Email")} 
        value={identifier} 
        onChange={(e) => setIdentifier(e.target.value)} 
        required
         />

        <TextField
          name="password"
          label={t("Password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

        <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 3 }}>
          <FormControlLabel  control={<Checkbox size='small' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />} label={
            <Typography variant="body2" style={{ fontSize: '0.85rem' }}>
              {t('Remember me')}
            </Typography>
            }
          />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" sx={{ ml: 0.5, cursor:'pointer' }} onClick={handleForgotPwd}>
          {t('Forgot password?')}
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
      >
        {t('Login')}
      </LoadingButton>
    </form>
  );

  return (
    <>
      {errorMessage && (
      <Alert severity="error" onClose={() => setErrorMessage("")} sx={{position:'absolute', width:"100%", zIndex:1}}>
        {errorMessage}
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
          <Typography variant="h4">{t('Sign in to Sentirhy')}</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            {t('Do not have an account?')}
            <Link variant="subtitle2" sx={{ ml: 0.5, cursor:'pointer' }} onClick={handleRegister}>
              {t('Register now')}
            </Link>
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
