import React from 'react';
import { Box, Grid, Typography, Paper, useTheme, Container } from '@mui/material';
import { CrueltyFree, Spa, Recycling, Science } from '@mui/icons-material';

const ValueItem = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: '16px',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
        transition: 'transform 0.3s, box-shadow 0.3s',
        mx: 'auto',
        maxWidth: '280px',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[4]
        },
        [theme.breakpoints.down('sm')]: {
          p: 2,
          maxWidth: '100%'
        }
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.light,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          color: theme.palette.primary.main
        }}
      >
        {React.cloneElement(icon, { fontSize: 'large', color: 'terciary' })}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

const CompanyValues = () => {
  const values = [
    {
      icon: <CrueltyFree />,
      title: "Sin Crueldad Animal",
      description: "Nuestros insumos, procesos y productos son sin crueldad animal."
    },
    {
      icon: <Spa />,
      title: "Natural",
      description: "Usamos los mejores ingredientes 100% naturales."
    },
    {
      icon: <Recycling />,
      title: "Reciclable",
      description: "Nuestros empaques y envases son reciclables y ecológicos."
    },
    {
      icon: <Science />,
      title: "Libre de Tóxicos",
      description: "Nuestros productos son libres de sulfatos, parabenos y siliconas."
    }
  ];

  return (
    <Box 
      component="section"
      sx={{ 
        py: 8,
        px: 2,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            mb: 6,
            color: 'primary.main',
          }}
        >
          Nuestros Valores
        </Typography>
        
        <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center">
          {values.map((value, index) => (
            <Grid 
              key={index}
              size={{ xs: 12, sm: 6, md: 3 }} // Nueva sintaxis para breakpoints
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <ValueItem 
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CompanyValues;