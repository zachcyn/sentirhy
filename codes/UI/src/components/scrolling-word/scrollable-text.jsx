import PropTypes from 'prop-types'; 

import React, { useEffect, useRef, useState } from 'react';

import { Typography, Box } from '@mui/material';

const ScrollableText = ({ text = '', variant = ''}) => {
  const textRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const containerWidth = textRef.current?.parentNode.offsetWidth ?? 0;
  const textWidth = textRef.current?.offsetWidth ?? 0;

  useEffect(() => {
    const checkScroll = () => {
      setShouldScroll(textWidth > containerWidth);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, [textWidth, containerWidth]);

  const scrollAnimationStyle = shouldScroll ? {
    animation: `scrollText 20s linear infinite`, 
    animationFillMode: 'forwards',
    '--containerWidth': `${containerWidth}px`
  } : {};

  return (
    <Box style={{ overflow: 'hidden'}}>
        <Box ref={textRef} style={{ width: 'fit-content', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', ...scrollAnimationStyle }}>
            <Typography variant={variant} noWrap>{text}</Typography>
        </Box>
    </Box>
  );
};

ScrollableText.propTypes = {
    text: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['body1', 'caption', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'overline', 'inherit']),
  };

  
export default ScrollableText;
