import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

const LANGS = [
  {
    index: 0,
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
    language: 'en'
  },
  {
    index: 1,
    value: 'cn',
    label: 'Chinese',
    icon: '/assets/icons/ic_flag_cn.svg',
    language: 'zh'
  },
  {
    index: 2,
    value: 'jp',
    label: 'Japanese',
    icon: '/assets/icons/ic_flag_jp.svg',
    language: 'ja'
  },
  {
    index: 3,
    value: 'kr',
    label: 'Korean',
    icon: '/assets/icons/ic_flag_kr.svg',
    language: 'ko'
  },
  {
    index: 4,
    value: 'my',
    label: 'Malay',
    icon: '/assets/icons/ic_flag_my.svg',
    language: 'ms'
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(0);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  }

  const handleLanguage = (selection, index) => {
    changeLanguage(selection);
    setSelected(index);
  }

  useEffect(() => {
    const currentLang = i18n.language;
    const currentLangIndex = LANGS.findIndex(lang => lang.language === currentLang);
    setSelected(currentLangIndex >= 0 ? currentLangIndex : 0);
  }, [i18n.language]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src={LANGS[selected].icon} alt={LANGS[selected].label} />
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
            width: 210,
          },
        }}
      >
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === LANGS[selected].value}
            onClick={() => handleLanguage(option.language, option.index)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
