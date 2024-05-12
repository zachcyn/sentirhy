import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import ThemeToggleButton from 'src/components/mode-button';

import { useAuth } from 'src/sections/login/authContext';

<<<<<<< HEAD
=======

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile Settings',
    icon: 'eva:home-fill',
    path: '/profile-settings' ,
  },
];

// ----------------------------------------------------------------------

>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
export default function AccountPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(null);
  const [avatar, setAvatar] = useState(false);
  const { logout, user } = useAuth();
<<<<<<< HEAD
  const { t } = useTranslation();

  const MENU_OPTIONS = [
    {
      label: t('Profile Settings'),
      icon: 'eva:home-fill',
      path: '/profile-settings' ,
    },
  ];
=======
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c

  const getUserData = () => {
    if (user) {
      try {
        return user;
      } catch (e) {
        console.error("Error parsing user data:", e);
        return null;
      }
    }
    return null;
  };
  
  const userData = getUserData();

  useEffect(() => {
      if (userData?.img !== 'undefined'){
          setAvatar(true)
      }
  }, [userData])

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logoutAccount = () => {
    logout();
    router.push('/login');

  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={avatar ? `${import.meta.env.VITE_API_URL}/file/user-profile/${userData?.imgurl}` : "None"}
          alt={userData?.user}
          sx={{
            width: 36,
            height: 36,
          }}
        />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${userData?.fname} ${userData?.lname}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem 
            key={option.label} 
            component={RouterLink}
            href={option.path}
            >
            {option.label}
          </MenuItem>
        ))}
        <ThemeToggleButton/>
        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={logoutAccount}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
<<<<<<< HEAD
          {t('Logout')}
=======
          Logout
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
        </MenuItem>
      </Popover>
    </>
  );
}
