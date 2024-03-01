import PropTypes from 'prop-types'; 

import React, { useEffect, useRef, useState } from 'react';

import { Typography, Box } from '@mui/material';

const ScrollableText = ({ text = '' }) => {
  const textRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
        const containerWidth = (textRef.current?.parentNode.parentNode.parentNode.offsetWidth ?? 0) * 0.3036;
        const textWidth = textRef.current?.offsetWidth;
        setShouldScroll(textWidth > containerWidth);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, [text, shouldScroll]);

    const scrollAnimationStyle = shouldScroll ? { 
    animation: `scroll ${Math.max(10, text.length / 5)}s linear infinite`, 
    } : {};


  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
        <div ref={textRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', ...scrollAnimationStyle }}>
            <Typography variant="subtitle1" noWrap>{text}</Typography>
        </div>
    </div>
  );
};

ScrollableText.propTypes = {
    text: PropTypes.string.isRequired,
  };

  
export default ScrollableText;
