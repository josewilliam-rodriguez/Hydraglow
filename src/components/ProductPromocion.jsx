import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress, 
  useMediaQuery, 
  useTheme,
  Container,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { fetchPromociones, selectAllPromociones, selectPromocionesStatus } from '../redux/slices/promocionesSlices';
import ProductCard from './ProductCard';
import { styled } from '@mui/material/styles';

const PromoHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  boxShadow: theme.shadows[4],
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -10,
    right: -10,
    width: 100,
    height: 100,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%'
  }
}));

const ProductPromocion = () => {
  const dispatch = useDispatch();
  const productosPromocion = useSelector(selectAllPromociones);
  const status = useSelector(selectPromocionesStatus);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Cargar productos en promoción al montar el componente
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPromociones());
    }
  }, [status, dispatch]);

  // Filtrar productos únicos por ID para evitar repeticiones
  const productosUnicos = React.useMemo(() => {
    const seenIds = new Set();
    return productosPromocion.filter(producto => {
      if (seenIds.has(producto.id)) {
        return false;
      }
      seenIds.add(producto.id);
      return true;
    });
  }, [productosPromocion]);

  // Estados de carga
  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  // Manejo de errores
  if (status === 'failed') {
    return (
      <Box textAlign="center" my={6} p={4} sx={{ background: theme.palette.background.paper, borderRadius: 2 }}>
        <Typography variant="h5" color="error" gutterBottom>
          ¡Ups! Algo salió mal
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          No pudimos cargar las promociones en este momento.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => dispatch(fetchPromociones())}
          sx={{ 
            px: 4,
            py: 1,
            fontWeight: 'bold'
          }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  // Si no hay productos en promoción
  if (status === 'succeeded' && productosUnicos.length === 0) {
    return (
      <Box textAlign="center" my={6} p={4} sx={{ background: theme.palette.background.paper, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="primary">
          No hay promociones disponibles
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Estamos preparando nuevas ofertas especiales para ti
        </Typography>
        <Box mt={3}>
          <Button variant="outlined" color="primary">
            Ver productos regulares
          </Button>
        </Box>
      </Box>
    );
  }

  // Renderizado de los productos
  return (
    <Container maxWidth="xl" sx={{ py: isSmallScreen ? 2 : 6 }}>
      <PromoHeader>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 800,
          mb: 1,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
          ¡Ofertas Especiales!
        </Typography>
        <Typography variant="h6" sx={{ 
          opacity: 0.9,
          position: 'relative',
          mb: 2
        }}>
          Aprovecha nuestras promociones por tiempo limitado
        </Typography>
        <Chip 
          label="Descuentos exclusivos" 
          color="secondary" 
          sx={{ 
            mt: 1,
            color: theme.palette.common.white,
            fontWeight: 'bold',
            fontSize: '1rem',
            px: 2,
            py: 1,
            position: 'relative'
          }} 
        />
      </PromoHeader>

      <Divider sx={{ 
        my: 2,
        borderWidth: 1,
        borderColor: 'divider'
      }} />

      <Grid container spacing={isSmallScreen ? 2 : 4} justifyContent="center">
        {productosUnicos.map((producto) => (
          <Grid 
            item 
            key={producto.id} 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <ProductCard 
              producto={producto} 
              isPromocion={true}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          * Promociones válidas hasta agotar existencias. Productos seleccionados.
        </Typography>
        <Box mt={3}>
          <Button 
            variant="text" 
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Ver todas las promociones →
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPromocion;