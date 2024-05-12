<<<<<<< HEAD
import { useTranslation } from 'react-i18next';

=======
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { AccountProfile } from "src/components/profile/profileCard";
import { AccountProfileDetails } from 'src/components/profile/profileDetails';

function SettingsView() {
<<<<<<< HEAD
    const { t } =  useTranslation();
    return (
        <Container sx={{ mt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <Stack spacing={3}>
                <Typography variant="h4" sx={{ ml: { xs: 2, sm: 5 }, mt: { xs: 2, sm: 5 }, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                    {t('Account Settings')}
                </Typography>
                <Grid container>
                    <Grid item xs={12} md={6} lg={4} sx={{mb: {xs: 2}}}>
                        <AccountProfile />
                    </Grid>
                    <Grid item xs={12} md={6} lg={8} sx={{pl: {sm: 3}}}>
                        <AccountProfileDetails />
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
=======
  return (
    <Container sx={{ mt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
            <Typography variant="h4" sx={{ ml: { xs: 2, sm: 5 }, mt: { xs: 2, sm: 5 }, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            Account Settings
            </Typography>
            <Grid container>
                <Grid item xs={12} md={6} lg={4} sx={{mb: {xs: 2}}}>
                    <AccountProfile />
                </Grid>
                <Grid item xs={12} md={6} lg={8} sx={{pl: {sm: 3}}}>
                    <AccountProfileDetails />
                </Grid>
            </Grid>
        </Stack>
    </Container>
  );
>>>>>>> 29ec6ef19632cb6ca37b352c02ef5f9ed59a920c
}

export default SettingsView;

