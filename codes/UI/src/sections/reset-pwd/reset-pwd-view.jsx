import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress'
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import LanguagePopover from 'src/layouts/dashboard/common/language-popover';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

function evaluatePasswordStrength(password) {
  let strength = 0;
  if (password.length > 0) strength += 1;
  if (password.length > 8) strength += 1;
  if (password.length > 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  return strength
}

// ----------------------------------------------------------------------
export default function ResetPwdView() {
  const theme = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [strength, setStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { t } =  useTranslation();

  const getToken = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token');
  }

  const token = getToken();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowSuccessMessage(true);
        setMessage(data.message || "Password successfully reset.");
      } else {
        setShowErrorMessage(true);
        setMessage(data.message || "Password reset failed.")
      }
    } catch (error) {
        setShowErrorMessage(true);
        setMessage("Failed to reset password. Please try again.");
        console.error('Network error', error);
    }
  };

  useEffect(() => {
    setNewPassword('');
    setConfirmPwd('');
  }, [showSuccessMessage, showErrorMessage]);

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setNewPassword(password);
    setStrength(evaluatePasswordStrength(newPassword));
    setPasswordMatch(newPassword === confirmPwd);
  }

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPwd = event.target.value;
    setConfirmPwd(newConfirmPwd);
    setPasswordMatch(newConfirmPwd === newPassword);
  }

  const getColor = (color) => {
    if (color === 0) return '#000';
    if (color <= 1) return '#d32f2f'; 
    if (color <= 3) return '#fbc02d'; 
    return '#388e3c'; 
  };

  const getText = (text) => {
    if (text === 0) return 'None';
    if (text <= 1) return 'Weak';
    if (text <= 3) return 'Moderate';
    return 'Strong';
  };

  const renderForm = (
    <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box sx={{ width:"100%", position:'relative', display: 'flex', flexDirection: 'column'}}>
            <TextField
              name="password"
              label={t("New Password")}
              value={newPassword}
              onChange={handlePasswordChange}
              type={showPassword1 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <>
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
                      <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                    <LinearProgress
                      variant="determinate"
                      value={(strength / 5) * 100}
                      sx={{
                        width: 'calc(100% - 5px)',
                        position: 'absolute',
                        bottom: 1,
                        left: 2,
                        backgroundColor: "#eee",
                        height: 4,
                        borderRadius: 4,
                        [`& .MuiLinearProgress-bar`]: {
                          backgroundColor: getColor(strength),
                        },
                      }}
                    />
                </>
                ),
              }}
              required
              fullWidth
            />
              <Typography 
                variant="caption" 
                display="block" 
                style={{ color: getColor(strength) }}
                >
                Strength: {getText(strength)}
              </Typography>
          </Box>
          <TextField
              name="password"
              label={t("Confirm New Password")}
              value={confirmPwd}
              onChange={handleConfirmPasswordChange}
              type={showPassword2 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                      <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
              fullWidth
            />

          <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              disabled={!passwordMatch || newPassword.trim() === ''}
              >
              {t('Reset Password')}
          </LoadingButton>
        </Stack>
        <Box width="100%" sx={{mt: 2, display:"flex", justifyContent:"center"}}>
          <Typography variant="subtitle2">{t('Remember your password?')} </Typography>
            <Link variant="subtitle2" underline="hover" sx={{ ml: 0.5, cursor:'pointer'}} onClick={handleLogin}>
            {t('Back to Login')}
            </Link>
        </Box>
    </form>
  );

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
    {showErrorMessage && (
      <Alert severity='success' onClose={() => setShowErrorMessage(false)} sx={{position:'absolute', width:"100%", zIndex:1}}>
        {message}
      </Alert>
    )}

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

        {showSuccessMessage ? (
          <Box width="100%"  sx={{    
            mt: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center'
            }}>
              <img src="assets/illustrations/tick.png" alt="Confirmed" width="30%"/>
            <Typography variant="h4" sx={{mb: 2, mt: 2}}>{t("Password changed!")}</Typography>
            <Typography variant="subtitle2">{t("You password has been successfully changed.")}</Typography>
            <Link variant="subtitle2" underline="hover" sx={{ mt:2, ml: 0.5, cursor:'pointer'}} onClick={handleLogin}>
              {t("Continue to Login")}
            </Link>
          </Box>
        ):(
          <>
          <Typography variant="h4">{t('Reset your password')}</Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
                {t("Create a new password. Then re-enter to confirm your new password.")}
              </Typography>

              {renderForm}
          </>
        )}

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
  );
}
