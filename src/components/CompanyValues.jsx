import React from "react";
import { Box, Grid, Typography, Paper, useTheme, Container } from "@mui/material";
import { CrueltyFree, Spa, Recycling, Science } from "@mui/icons-material";

const ValueItem = ({ icon, title, description }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        borderRadius: "16px",
        backgroundColor: theme.palette.mode === "dark" ? "#242424" : "#ffffff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        mx: "auto",
        maxWidth: "280px",
        boxShadow: theme.shadows[3],
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: theme.shadows[6],
        },
        [theme.breakpoints.down("sm")]: {
          p: 3,
          maxWidth: "100%",
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

        <Grid container spacing={4} justifyContent="center">
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ValueItem icon={value.icon} title={value.title} description={value.description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CompanyValues;