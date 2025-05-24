import { useEffect } from 'react';
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
  Divider,
  Button,
  useTheme
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
  const theme = useTheme();

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    // Eliminar todo excepto dígitos
    const cleaned = phone.toString().replace(/\D/g, '');
    
    // Si el número ya empieza con 57 (código de Colombia), agregar el +
    if (cleaned.startsWith('57')) {
      return '+' + cleaned;
    }
    
    // Si es un número de 10 dígitos sin código, agregar +57
    if (cleaned.length === 10) {
      return '+57' + cleaned;
    }
    
    // Si es un número móvil sin 0 al inicio (ej: 3123456789)
    if (cleaned.length === 9 && !cleaned.startsWith('0')) {
      return '+57' + cleaned;
    }
    
    // Si no cumple con los formatos esperados, devolverlo limpio
    return cleaned;
  };

  const handleWhatsAppRedirect = (product) => {
    if (!product.contacto) {
      alert('Este producto no tiene un número de contacto asignado');
      return;
    }

    // Formatear el número de teléfono
    const formattedPhone = formatPhoneNumber(product.contacto);
    
    // Validar que el número sea válido
    if (!formattedPhone.startsWith('+57') || formattedPhone.length < 12) {
      alert('El número de contacto no es válido. Debe ser un número colombiano de 10 dígitos');
      return;
    }

    // Mensaje predefinido con detalles del producto
    const message = `¡Hola! Estoy interesado en comprar el producto:\n\n*${product.nombre}*\n\n• Categoría: ${product.categoria || 'No especificada'}\n• Precio: $${product.precio?.toLocaleString() || '0'}\n\n${product.descripcion ? `Descripción:\n${product.descripcion}\n\n` : ''}Por favor, indíqueme cómo proceder con la compra.`;
    
    // Crear el enlace de WhatsApp
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

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
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color: "black" }}>
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
            <Grid item key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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

                  {/* Botón de WhatsApp */}
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      color="success"
                      size="small"
                      onClick={() => handleWhatsAppRedirect(product)}
                      sx={{
                        backgroundColor: '#25D366',
                        '&:hover': {
                          backgroundColor: '#128C7E',
                        }
                      }}
                    >
                      Comprar por WhatsApp
                    </Button>
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