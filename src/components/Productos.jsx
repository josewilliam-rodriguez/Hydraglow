import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../redux/slices/productosSlices';

const ProductCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const Productos = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);

  useEffect(() => {
    dispatch(fetchProducts());
    
    return () => {
      // Limpieza de suscripción si es necesaria
    };
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          Error al cargar los productos. Por favor intenta nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color:"black" }}>
        Catálogo de Productos
      </Typography>
      
      <Divider sx={{ mb: 4 }} />

      {products.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h5" color="textSecondary">
            No hay productos disponibles actualmente
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard>
                {product.imagen && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imagen}
                    alt={product.nombre}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.nombre || 'Producto sin nombre'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.descripcion || 'Sin descripción disponible'}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6" color="primary">
                      ${product.precio?.toLocaleString() || '0'}
                    </Typography>
                    <Chip
                      label={product.categoria || 'General'}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                  
                  <Box mt={2}>
                    <Typography variant="caption" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                      {product.stock > 0 ? `Disponible (${product.stock} unidades)` : 'Agotado'}
                    </Typography>
                  </Box>
                </CardContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Productos;