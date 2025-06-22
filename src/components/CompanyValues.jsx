import React from "react";
import { Box, Grid, Typography, Paper, useTheme, Container } from "@mui/material";
import { CrueltyFree, Spa, Recycling, Science } from "@mui/icons-material";

const ValueItem = ({ icon, title, description }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderRadius: "24px",
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: theme.palette.mode === "dark"
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.06)",
        backdropFilter: "blur(10px)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        mx: "auto",
        maxWidth: "300px",
        position: "relative",
        overflow: "hidden",
        
        // Efecto de brillo sutil
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
            : "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)",
        },
        
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: theme.palette.mode === "dark"
            ? "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.1)"
            : "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)",
          border: theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.15)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        },
        
        "&:active": {
          transform: "translateY(-4px) scale(1.01)",
        },
        
        [theme.breakpoints.down("sm")]: {
          maxWidth: "100%",
          borderRadius: "20px",
        },
      }}
    >
      <Box
        sx={{
          width: 65,
          height: 65,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.light,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          color: theme.palette.primary.main,
        }}
      >
        {React.cloneElement(icon, { fontSize: "large" })}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

const CompanyValues = () => {
  const values = [
    {
      icon: <CrueltyFree color="terciary" />,
      title: "Sin Crueldad Animal",
      description: "Nuestros productos están diseñados sin pruebas en animales.",
    },
    {
      icon: <Spa color="terciary"/>,
      title: "Ingredientes Naturales",
      description: "Usamos los mejores ingredientes 100% naturales.",
    },
    {
      icon: <Recycling color="terciary" />,
      title: "Embalaje Reciclable",
      description: "Nuestros empaques son reciclables y amigables con el medio ambiente.",
    },
    {
      icon: <Science color="terciary"/>,
      title: "Libre de Tóxicos",
      description: "Sin sulfatos, parabenos ni siliconas. Solo lo mejor para ti.",
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: 10,
        px: 3,
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 6,
            color: "primary.main",
          }}
        >
          Nuestros Valores
        </Typography>

        {/* OPCIÓN 1: Agregar rowGap al Grid container */}
        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          sx={{ 
            rowGap: { xs: 8, sm: 10 } // Espacio adicional entre filas
          }}
        >
          {values.map((value, index) => (
            <Grid size={{xs:12, sm:6, m:3}}  key={index}>
              <ValueItem icon={value.icon} title={value.title} description={value.description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CompanyValues;