import {  Box, keyframes } from "@mui/material";

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = ({ size = 24, color = '#C47C4D', sx }) => (
    <Box
      sx={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid ${color}`,
        borderBottomColor: 'transparent',
        borderRadius: '50%',
        animation: `${rotate} 1s linear infinite`,
        ...sx
      }}
    />
);

export default LoadingSpinner;