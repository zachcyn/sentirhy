import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Typography
} from '@mui/material';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';

import { alpha, useTheme } from '@mui/material/styles';

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
    const [pwdEntered, setPwdEntered] = useState(false);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const minimumYear = currentYear - 120;
    const minimumDateOfBirth = new Date(minimumYear, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0];
    const maximumDateofBirth = new Date().toISOString().split('T')[0];
    const theme = useTheme();

    const getUserData = () => {
        const userDataString = localStorage.getItem('userData') || sessionStorage.getItem('userData');
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
    

    const [values, setValues] = useState({
        user: userData.user,
        firstName: userData.fname,
        lastName: userData.lname,
        email: userData.email,
        country: userData.country,
        dob: userData.dob,
    });

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

    const handleSubmit = useCallback(
        (event) => {
        event.preventDefault();
        },
        []
    );

    return (
        <>
            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
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
                                        onChange={handleChange}
                                        required
                                        value={values.email}
                                        />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField 
                                        name='date'
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
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        onChange={handlePwdEntered}
                                        required
                                        value={null}
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
                        <Button 
                            variant="contained"
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
                        >
                            Save Details
                        </Button>
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


