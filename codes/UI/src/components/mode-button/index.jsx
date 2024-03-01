import React, { useContext } from 'react';

import { ThemeContext } from 'src/theme';

const ThemeToggleButton = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <button type="button" onClick={toggleTheme}>Toggle Theme</button>
  );
};

export default ThemeToggleButton;
