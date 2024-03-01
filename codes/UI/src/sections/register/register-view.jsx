import { useState, useEffect } from 'react';
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
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress'
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import LanguagePopover from 'src/layouts/dashboard/common/language-popover';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

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

export default function RegisterView() {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDOB] = useState("");
  const [country, setCountry] = useState("");
  const [checkedTerms, setCheckedTerms] = useState(true);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const minimumYear = currentYear - 120;
  const minimumDateOfBirth = new Date(minimumYear, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
  const maximumDateofBirth = new Date().toISOString().split('T')[0];
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } =  useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname, lname, dob, username, email, password, country }),
      });

      const data = await response.json();
      if (response.ok) {
          console.log('Registration successful', data);
          setShowSuccessMessage(true);
        } else {
          console.error('Registration failed', data);
          setErrorMessage(data.message || "Registration failed. Please try again.")
        }
    } catch (error) {
      console.error('Network error', error);
      setErrorMessage('Network error. Please check your connection and try again.')
    }

    setLoading(false);
  };

  useEffect(() => {
    setFname('');
    setLname('');
    setDOB('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPwd('');
    setCountry('');
  }, [showSuccessMessage, errorMessage]);

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleLogin = () => {
    router.push('/login');
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword)
    setStrength(evaluatePasswordStrength(password))
  }

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPwd = event.target.value;
    setConfirmPwd(newConfirmPwd);
    setPasswordMatch(newConfirmPwd === password);
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

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(val).toLowerCase());
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value.trim();
    setEmail(newEmail);
    setEmailError(!validateEmail(newEmail));
  };

  const countries = [
    'United States',
    'United Kingdom',
    'Japan',
    'Malaysia',
    'Korea',
    'Hong Kong',
  ]

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>

        <Stack direction="row" spacing={2}>

          <TextField name='fname'
          label={t("First Name")}
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
          />

          <TextField name='lname'
          label={t("Last Name")}
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
          />
        </Stack>

        <TextField name='date'
        label={t("Date of Birth")}
        type="date"
        value={dob}
        onChange={(e) => setDOB(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          inputProps: {
            min: minimumDateOfBirth,
            max: maximumDateofBirth
          }
        }}
        required
        />

        <FormControl fullWidth>
          <Autocomplete
            freeSolo
            options={countries}
            renderInput={(params) => (
              <TextField {...params} label='Country' required />
            )}
            onChange={(event, newValue) => {
              setCountry(newValue);
            }}
            />
        </FormControl>

        <TextField name="username" 
        label={t("Username" )}
        value={username} 
        type='text'
        onChange={(e) => setUsername(e.target.value)} 
        required
         />

        <TextField
          name="email"
          label={t("Email")}
          value={email}
          type='email'
          onChange={handleEmailChange}
          error={emailError}
          helperText={emailError && "Please enter a valid email address."}
          required
        />

        <Box sx={{ width:"100%", position:'relative', display: 'flex', flexDirection: 'column'}}>
          <TextField
            name="password"
            label={t("Password")}
            value={password}
            onChange={handlePasswordChange}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <>
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
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
              label={t("Confirm Password")}
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <FormControlLabel required  control={<Checkbox size='small'onClick={() => setCheckedTerms(!checkedTerms)} />} label={
          <Typography variant="body2" style={{ fontSize: '0.85rem' }}>
            {t("I agree to the ")}<Link>{t("terms and conditions")}</Link>
          </Typography>
          }
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
        disabled={checkedTerms || !passwordMatch}
      >
        {t("Register")}
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

          {showSuccessMessage ? (
            <Box width="100%"  sx={{    
              mt: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center'
              }}>
                <img src="assets/illustrations/tick.png" alt="Confirmed" width="30%"/>
              <Typography variant="h4" sx={{mb: 2, mt: 2}}>{t("Thanks for signing up.")}</Typography>
              <Typography variant="subtitle2">{t("Check your mail to activate your account.")}</Typography>
              <Link variant="subtitle2" underline="hover" sx={{ mt:2, ml: 0.5, cursor:'pointer'}} onClick={handleLogin}>
                {t("Continue to Login")}
              </Link>
            </Box>
          ):(
            <>
            <Typography variant="h4">{t("Create your Sentirhy account")}</Typography>

            <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
              {t("Already a member?")}
              <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={handleLogin} >
                {t('Log in')}
              </Link>
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
      </>
  );
}
