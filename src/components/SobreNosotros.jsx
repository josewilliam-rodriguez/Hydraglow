import React from "react";
import { Box, Typography, useMediaQuery, Button, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import SobreImg from "../images/CaraSobreNosotros.jpeg";
import {  Link, useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const SobreNosotros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        padding: { xs: 4, md: 8 },
        backgroundColor: "#f9f5f0",
        backgroundImage: "linear-gradient(to bottom, #f9f5f0, #ffffff)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.light,
          opacity: 0.2,
          zIndex: 0,
        },
      }}
    >
      {/* Imagen con efecto */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          animation: `${fadeIn} 0.8s ease-out`,
        }}
      >
        <Box
          component="img"
          src={SobreImg}
          alt="Productos HidraGlow"
          sx={{
            width: "100%",
            maxWidth: 400,
            borderRadius: "16px",
            objectFit: "cover",
            boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            transform: "perspective(1000px)",
            "&:hover": {
              animation: `${pulse} 2s infinite`,
            },
          }}
        />
      </Box>

      {/* Contenido de texto */}
      <Box
        sx={{
          flex: 1,
          zIndex: 1,
          animation: `${fadeIn} 1s ease-out`,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: theme.palette.primary.dark,
            fontSize: { xs: "2rem", md: "2.5rem" },
            lineHeight: 1.2,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: 0,
              width: 80,
              height: 4,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 2,
            },
          }}
        >
          Descubre el poder de lo natural
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.8,
            mb: 3,
            color: theme.palette.text.secondary,
          }}
        >
          En <strong>HidraGlow</strong>, transformamos el cuidado de la piel con 
          ingredientes 100% naturales que devuelven la hidratación y el brillo 
          perdido. Nuestra fórmula exclusiva penetra profundamente para resultados 
          visibles desde la primera aplicación.
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {[
            "🌿 Ingredientes orgánicos certificados",
            "💧 Hidratación 72 horas continuas",
            "✨ Resultados visibles en 7 días",
          ].map((item, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.05rem",
                color: theme.palette.text.primary,
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
          component={Link}
          to="/Productos" 
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            Conoce nuestros productos
          </Button>
          {/* <Button  
            variant="outlined"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Nuestra historia
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default SobreNosotros;