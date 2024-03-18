import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function UserPage() {
    const theme = useTheme();
    const isLightMode = theme.palette.mode === 'light';
    const logoSrc = isLightMode ? "/favicon/light-name/color-logo.png" : "/favicon/dark-name/color-logo.png"

  return (
    <>
      <Helmet>
        <title> Terms & Conditions | Sentirhy </title>
      </Helmet>

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
        <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
            <Box
                component="img"
                src={logoSrc}
                sx={{
                    position: 'fixed',
                    top: { xs: 16, md: 24 },
                    left: { xs: 16, md: 24 },
                    width: 'auto', // Adjusted line
                    height: 40, 
                    cursor: 'pointer' 
                }}
            />
        </Link>
        <Container sx={{mt: 15, mb: 15}}>
            <Typography variant="h4" gutterBottom>
                Terms and Conditions
            </Typography>

            <Box mt={3}>
                <Typography variant="body1" paragraph>
                    Welcome to Sentirhy! These terms and conditions outline the rules and regulations for the use of Sentirhy&apos;s Service, located at <Link href="www.sentirhy.zachcyn.com">sentirhy.zachcyn.com</Link>.
                </Typography>
                <Typography variant="body1" paragraph>
                    By accessing this service, we assume you accept these terms and conditions. Do not continue to use Sentirhy if you do not agree to all of the terms and conditions stated on this page.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Service Description
                </Typography>
                <Typography variant="body1" paragraph>
                    Sentirhy offers music streaming services by integrating with Spotify and YouTube. It uses facial emotion recognition to recommend music for therapy purposes. The service is designed to explore the potential benefits of music in emotional therapy.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    User Responsibilities
                </Typography>
                <Typography variant="body1" paragraph>
                    As a user of Sentirhy, you are responsible for ensuring that your use of the service is in line with the following guidelines:
                </Typography>
                <List>
                    <ListItem>
                        <Typography variant="body1">
                        • Avoid engaging in any activity that disrupts or interferes with the service, including the servers and networks to which the service is connected.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1">
                        • Do not use the service for any unlawful purposes, including but not limited to copyright infringement, hacking, or unauthorized access to other accounts and data.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography variant="body1">
                        • Respect the privacy and rights of other users. Do not attempt to gather, store, or distribute personal data of other users without their explicit consent.
                        </Typography>
                    </ListItem>
                </List>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Copyright and Intellectual Property
                </Typography>
                <Typography variant="body1" paragraph>
                    The music content provided through our service is sourced from Spotify and YouTube. Sentirhy owns the intellectual property rights for the machine learning model and music recommendation system developed for the service. All intellectual property rights are reserved.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    User Account
                </Typography>
                <Typography variant="body1" paragraph>
                    Users must create an account to access Sentirhy&apos;s services. Your account information and password will be stored securely. Sentirhy may use data related to user preferences, history, and facial data to train and improve machine learning models, specifically for enhancing the service.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Termination Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    Users may delete their accounts at any time. Sentirhy reserves the right to terminate accounts if users violate terms, such as service hijacking or misuse.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Limitation of Liability and Disclaimers
                </Typography>
                <Typography variant="body1" paragraph>
                    Sentirhy is not responsible for any negative effects resulting from the use of the music therapy service. The music streaming service is provided through third-party platforms, Spotify and YouTube. Users agree that Sentirhy&apos;s liability is limited to the extent permitted by law.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Amendments to Terms and Conditions
                </Typography>
                <Typography variant="body1" paragraph>
                    Sentirhy reserves the right to amend these terms at any time. Users will be notified of any changes through their registered email addresses.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Governing Law
                </Typography>
                <Typography variant="body1" paragraph>
                These Terms and Conditions are not governed by any specific laws as Sentirhy is a final year project by a computer science student for educational purposes only and is not a commercial application. As such, it operates in an experimental and academic context without specific legal jurisdiction.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Contact Information
                </Typography>
                <Typography variant="body1" paragraph>
                    For any inquiries or concerns regarding these terms and conditions, please contact us at <Link href="mailto:contact-sentirhy@zachcyn.com">contact-sentirhy@zachcyn.com</Link>.
                </Typography>
            </Box>

            <Box mt={3}>
                <Typography variant="h4" gutterBottom>
                Privacy Policy
                </Typography>
                <Typography variant="body1" paragraph>
                At Sentirhy, we are committed to protecting the privacy and security of our users&apos; information. This Privacy Policy outlines our practices concerning the collection, use, and sharing of personal data when you use our service.
                </Typography>

                <Typography variant="h6" gutterBottom>
                Data Collection
                </Typography>
                <Typography variant="body1" paragraph>
                We collect information that you provide directly to us when you create an account, use our services, or communicate with us. This may include personal details such as your name, email address, and any other information you choose to provide. Additionally, we collect technical data and usage information to improve our service.
                </Typography>

                <Typography variant="h6" gutterBottom>
                Data Use
                </Typography>
                <Typography variant="body1" paragraph>
                The information we collect is used to provide, maintain, and improve our services, to develop new services, and to protect Sentirhy and our users. We may also use the information to communicate with you, such as sending you service updates and administrative messages.
                </Typography>

                <Typography variant="h6" gutterBottom>
                Data Sharing
                </Typography>
                <Typography variant="body1" paragraph>
                We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with our partners, for legal reasons or in connection with a merger or acquisition.
                </Typography>

                <Typography variant="h6" gutterBottom>
                Your Rights
                </Typography>
                <Typography variant="body1" paragraph>
                You have the right to access, update, or delete the information we hold about you. You can manage your information through your account settings or by contacting us directly.
                </Typography>

                <Typography variant="h6" gutterBottom>
                Changes to This Policy
                </Typography>
                <Typography variant="body1" paragraph>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </Typography>
            </Box>
            </Container>
        </Box>
    </>
  );
}
