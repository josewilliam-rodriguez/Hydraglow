import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import SobreImg from "../images/HidraglowNatural.jpeg";

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;
const slideFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const SobreNosotros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: 4,
        backgroundColor: "#f8f0e5",
      }}
    >
      <Box
        component="img"
        src={SobreImg}
        alt="Hidraglow"
        sx={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: 3,
          animation: `${fadeInScale} 1s ease-in-out`,
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6,
          },
        }}
      />
      <Box
        maxWidth={500}
        sx={{
          animation: `${slideFadeIn} 1.2s ease-in-out`,
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: 1, color: theme.palette.primary.main }}
        >
          Sobre Nosotros
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            textAlign: "justify",
            color: "black",
            lineHeight: 1.6,
          }}
        >
          Nuestros jabones artesanales <b>Hydraglow</b> están diseñados para
          nutrir y proteger tu piel, proporcionándote una sensación de{" "}
          <b>suavidad</b> y <b>frescura</b>. Están elaborados con ingredientes
          <b> naturales</b> de alta calidad, seleccionados cuidadosamente para
          ofrecerte los mejores beneficios.
        </Typography>
      </Box>
    </Box>
  );
};

export default SobreNosotros;
