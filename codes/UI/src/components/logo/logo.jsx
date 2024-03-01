import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';

  const logoSrc = isLightMode ? "/favicon/light-name/original.png" : "/favicon/dark-name/original.png"

  const logo = (
    <Box
      component="img"
      src={logoSrc}
      sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
