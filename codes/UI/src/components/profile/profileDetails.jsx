import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import { Unstable_Grid2 as Grid } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

function evaluatePasswordStrength(password) {
    let strength = 0;
    const criteria = [
        { regex: /.{1,}/, points: 1 }, 
        { regex: /.{9,}/, points: 1 }, 
        { regex: /.{13,}/, points: 1 }, 
        { regex: /[A-Z]/, points: 1 }, 
        { regex: /[0-9]/, points: 1 }, 
        { regex: /[^A-Za-z0-9]/, points: 1 }, 
    ];
    criteria.forEach(criterion => {
        if (criterion.regex.test(password)) strength += criterion.points;
    });

  
    return strength
}


export const AccountProfileDetails = () => {
    const { t } =  useTranslation();
    const [emailError, setEmailError] = useState(false);
    const [pwd, setPwd] = useState("");
    const [currentPwd, setCurrentPwd] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [confirmPwd, setConfirmPwd] = useState("");
    const [strength, setStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [popup, setPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pwdEntered, setPwdEntered] = useState(pwd.length > 0);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const minimumYear = currentYear - 120;
    const minimumDateOfBirth = new Date(minimumYear, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
    const maximumDateofBirth = new Date().toISOString().split('T')[0];
    const theme = useTheme();

    const getUserData = () => {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData')
        if (userDataString) {
            try {
            return JSON.parse(userDataString);
            } catch (e) {
            console.error("Error parsing user data:", e);
            return null;
            }
        }
        return null;
        };
    
    const userData = getUserData();
    const dateInputFormat = userData?.dob && !Number.isNaN(new Date(userData.dob).getTime()) 
        ? new Date(userData.dob).toISOString().split("T")[0]
        : '1970-01-01';

    const [values, setValues] = useState({
        user: userData?.user,
        firstName: userData?.fname,
        lastName: userData?.lname,
        email: userData?.email,
        country: userData?.country,
        dob: dateInputFormat,
    });

    const handleOpenPopup = () => setPopup(true);

    const handleClosePopup = () => setPopup(false);

    const getColor = (color) => {
        if (color === 0) return theme.palette.text.primary;
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
        setValues(prevValues => ({
            ...prevValues,
            email: newEmail,
          }));
        setEmailError(!validateEmail(newEmail));
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword)
        setStrength(evaluatePasswordStrength(newPassword))
    }

    const handleCurrentPwdChange = (event) => {
        const newPassword = event.target.value;
        setCurrentPwd(newPassword)
    }

    const handleConfirmPasswordChange = (event) => {
        const newConfirmPwd = event.target.value;
        setConfirmPwd(newConfirmPwd);
        setPasswordMatch(newConfirmPwd === password);
    }

    const handlePwdEntered = (event) => {
        const newPassword = event.target.value;
        setPwd(newPassword)
        setPwdEntered(newPassword.length > 0);
    }

    const handleChange = useCallback(
        (event) => {
        setValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
        },
        []
    );

    const handleSubmit = async(event) => {
        setLoading(true);
        event.preventDefault(); 

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No token found');
            return;
        }
        const enteredData = {
            fname: values.firstName,
            lname: values.lastName,
            email: values.email,
            dob: values.dob,
            password: pwd
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-detail`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(enteredData),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to update user details');
            }

            const data = await res.json();
            console.log('User details updated successfully:', data.user);
            setPwd("")
            setLoading(false);
            setPwdEntered(pwd.length > 0)

        } catch (err) {
            console.error('Error updating user details', err);
        }
    };

    return (
        <>
            <form autoComplete="off">
                <Card sx={{padding: "2%"}}>
                    <CardHeader
                    title="Profile Details"
                    />
                    <CardContent>
                        <Box>
                            <Grid xs={12} sx={{ pl: 1, mb:3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Username
                                </Typography>
                                <Typography variant="body1">{values.user}</Typography>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstName"
                                        onChange={handleChange}
                                        required
                                        value={values.firstName}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastName"
                                        onChange={handleChange}
                                        required
                                        value={values.lastName}
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        onChange={handleEmailChange}
                                        error={emailError}
                                        helperText={emailError && "Please enter a valid email address."}
                                        required
                                        value={values.email}
                                        />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField 
                                        name='dob'
                                        fullWidth
                                        label={t("Date of Birth")}
                                        type="date"
                                        value={values.dob}
                                        onChange={handleChange}
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
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        name="password"
                                        label={t("Password")}
                                        value={pwd}
                                        onChange={handlePwdEntered}
                                        type={showPassword3 ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword3(!showPassword3)} edge="end">
                                                <Iconify icon={showPassword3 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button 
                            variant="contained" 
                            onClick={handleOpenPopup}
                            sx={{ 
                            py: 1,
                            backgroundColor: theme.palette.text.primary, 
                            color: theme.palette.background.paper,
                            '&:hover': { 
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.paper
                            },
                            mt: 2,
                            mb: 2
                            }}  
                        >
                            Reset Password
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <LoadingButton 
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ 
                            py: 1,
                            backgroundColor: theme.palette.text.primary, 
                            color: theme.palette.background.paper,
                            '&:hover': { 
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.paper
                            },
                            mt: 2,
                            mb: 2
                            }}    
                            disabled={!pwdEntered}
                            loading={loading}
                        >
                            Save Details
                        </LoadingButton>
                    </CardActions>
                </Card>
            </form>
            <Modal
                open={popup}
                onClose={handleClosePopup}
                aria-labelledby="reset-password-modal-title"
            >
                 <Box sx={{
                        ...bgGradient({
                        color: alpha(theme.palette.background.default, 0.9),
                        imgUrl: '/assets/background/overlay_4.jpg',
                        }),
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        [theme.breakpoints.up('sm')]: {
                        width: '60%',
                        height: '40%'
                        },
                        [theme.breakpoints.up('md')]: {
                        width: '35vw',
                        height: '50%'
                        },
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        height: '55%',
                        borderRadius: '16px',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                }}>
                    <IconButton
                        onClick={handleClosePopup}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                        Password Reset
                    </Typography>
                <form style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                            sx={{ mb: 2 }}
                            name="currentPassword"
                            label={t("Current Password")}
                            value={currentPwd}
                            onChange={handleCurrentPwdChange}
                            type={showPassword3 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword3(!showPassword3)} edge="end">
                                    <Iconify icon={showPassword3 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                                ),
                            }}
                            required
                            fullWidth
                    />
                    <Box sx={{ mt: 2, mb: 2, width: '100%', maxWidth: '500px'}}>
                        <TextField
                            name="password"
                            label={t("New Password")}
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
                        sx={{ mb: 2}}
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
                     <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{ 
                            backgroundColor: theme.palette.text.primary, 
                            color: theme.palette.background.paper,
                            '&:hover': { 
                                backgroundColor: theme.palette.text.secondary,
                                color: theme.palette.background.paper
                            },
                            mt: 2
                        }}
                        loading={loading}
                        disabled={!passwordMatch}
                    >
                        {t('Save')}
                    </LoadingButton>
                    </form>
                </Box>
            </Modal>
        </>
    );
};


