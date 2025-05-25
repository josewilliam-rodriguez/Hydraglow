import React, { useRef, useEffect } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Stack,
  Typography,
  Chip,
  Button,
  CardMedia,
  Divider,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';

const ModalDetailProduct = ({ 
  open, 
  onClose, 
  product 
}) => {
  const theme = useTheme();
  const modalContentRef = useRef(null);

  useEffect(() => {
    const content = modalContentRef.current;
    if (!content) return;

    const handleTouchMove = (e) => {
      if (content.scrollHeight > content.clientHeight) {
        e.preventDefault();
      }
    };

    content.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      content.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  if (!product) return null;

  // Calcula el precio con descuento
  const calculateDiscountedPrice = () => {
    if (product.promocion === "si" && product.porcentajeDescuento) {
      return product.precio * (1 - product.porcentajeDescuento / 100);
    }
    return product.precio;
  };

  const discountedPrice = calculateDiscountedPrice();
  const savings = product.precio - discountedPrice;

  const handleWhatsAppClick = () => {
    const phone = `57${product.contacto}`;
    const priceToShow = product.promocion === "si" ? discountedPrice : product.precio;
    const message = `¡Hola! Estoy interesado en el producto: ${product.nombre}\n\n*Detalles:*\n- Categoría: ${product.categoria}\n- Línea: ${product.linea}\n- Precio: $${priceToShow.toLocaleString()}\n${product.promocion === "si" ? `- Descuento: ${product.porcentajeDescuento}%\n- Ahorras: $${savings.toLocaleString()}\n` : ''}\nPor favor, indíqueme cómo puedo realizar la compra.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Función para convertir el string de usos en array y limpiar espacios
  const getUsosArray = () => {
    if (!product.uso) return [];
    if (Array.isArray(product.uso)) return product.uso;
    return product.uso.split(',').map(u => u.trim()).filter(u => u);
  };

  const usos = getUsosArray();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)'
      }}
    >
      <Box 
        ref={modalContentRef}
        sx={{
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '1000px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 1,
            bgcolor: 'rgba(0,0,0,0.1)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' },
            touchAction: 'manipulation'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Sección de imagen */}
        <Box sx={{
          width: { xs: '100%', md: '45%' },
          height: { xs: '300px', md: 'auto' },
          minHeight: '300px',
          position: 'relative',
          bgcolor: theme.palette.grey[100],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3
        }}>
          <CardMedia
            component="img"
            image={product.imagen}
            alt={product.nombre}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: 1
            }}
          />
          
          {product.promocion === "si" && (
            <Chip
              label={`${product.porcentajeDescuento}% OFF`}
              color="error"
              icon={<LocalOfferIcon />}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>

        {/* Sección de detalles */}
        <Box sx={{
          width: { xs: '100%', md: '55%' },
          p: { xs: 3, md: 4 },
          overflowY: 'auto',
          maxHeight: { md: '90vh' }
        }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom color='secondary'>
                {product.nombre}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={product.linea} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={product.categoria} 
                  color="secondary" 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Box>
              {product.promocion === "si" ? (
                <>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      ${Math.round(discountedPrice).toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${product.porcentajeDescuento}% OFF`}
                      color="error"
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${product.precio.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Ahorras: ${Math.round(savings).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${product.precio.toLocaleString()}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <InventoryIcon color={product.stock > 0 ? 'success' : 'error'} />
              <Typography color='secondary'>
                {product.stock > 0 ? 'En stock' : 'Agotado'}
                {product.stock > 0 && (
                  <Typography component="span" color="text.secondary" ml={1}>
                    ({product.stock} unidades disponibles)
                  </Typography>
                )}
              </Typography>
            </Stack>

            <Box>
              <Typography variant="h6" gutterBottom color='secondary'>Descripción</Typography>
              <Typography color="text.secondary" whiteSpace="pre-line">
                {product.descripcion || 'No hay descripción disponible.'}
              </Typography>
            </Box>

            {usos.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom color='secondary'>Uso recomendado</Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiChip-root': {
                    mb: 1,
                    mr: 1
                  }
                }}>
                  {usos.map((uso, index) => (
                    <Chip
                      key={index}
                      label={uso}
                      color="info"
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'info.main',
                        color: 'info.dark',
                        backgroundColor: 'info.light',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<WhatsAppIcon />}
                fullWidth
                onClick={handleWhatsAppClick}
                sx={{
                  py: 1.5,
                  backgroundColor: '#25D366',
                  '&:hover': { backgroundColor: '#128C7E' }
                }}
              >
                Contactar por WhatsApp
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDetailProduct;