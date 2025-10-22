import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton color="inherit" onClick={handleClick} sx={{ ml: 1 }}>
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => handleLanguageChange("en")}
          selected={language === "en"}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageChange("hi")}
          selected={language === "hi"}
        >
          हिन्दी (Hindi)
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector;
