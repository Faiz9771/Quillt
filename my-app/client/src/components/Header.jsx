import React from "react";
import { Typography, Box, useTheme, styled } from "@mui/material";
import { keyframes } from "@emotion/react";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(4, 0),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover::after': {
    width: '150px',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.5px',
  marginBottom: theme.spacing(1.5),
  background: `linear-gradient(-45deg, #ff7e5f, #feb47b, #7debf2, #5690d8)`,
  backgroundSize: '300% 300%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${gradientAnimation} 10s ease infinite`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
  maxWidth: '600px',
  opacity: 0.9,
  transition: 'opacity 0.3s ease-in-out',
  '&:hover': {
    opacity: 1,
  },
}));

const Header = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <StyledHeaderBox>
      <StyledTitle variant="h2" component="h1">
        {title}
      </StyledTitle>
      <StyledSubtitle variant="h5" component="h2">
        {subtitle}
      </StyledSubtitle>
    </StyledHeaderBox>
  );
};

export default Header;