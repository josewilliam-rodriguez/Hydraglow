import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  useTheme,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
} from "../redux/slices/productosSlices";
import ModalDetailProduct from "./ModalDetailProduc";

// Componente de Badge para promociones
const PromoBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 10,
    top: 10,
    padding: "0 4px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
}));

// Componente de Card unificado
const ProductCard = styled(Card)(({ theme, ispromo }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
  border: ispromo === "true" ? `2px solid ${theme.palette.error.main}` : "none",
}));

const Productos = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Ordenar productos: primero los que tienen promoción
  const sortedProducts = [...products].sort((a, b) => {
    if (a.promocion === "si" && b.promocion !== "si") return -1;
    if (a.promocion !== "si" && b.promocion === "si") return 1;
    return 0;
  });

  // Formateador de precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calcula el precio con descuento
  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  // Manejo del modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  // Validación y formato de teléfono
  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const cleaned = phone.toString().replace(/\D/g, "");
    if (cleaned.startsWith("57")) return `+${cleaned}`;
    if (cleaned.length === 10) return `+57${cleaned}`;
    return null;
  };

  // Redirección a WhatsApp
  const handleWhatsAppRedirect = (product) => {
  if (!product.contacto) {
    alert("Este producto no tiene contacto asignado");
    return;
  }

  const formattedPhone = formatPhoneNumber(product.contacto);
  if (!formattedPhone) {
    alert("Número inválido. Debe ser un número colombiano de 10 dígitos");
    return;
  }

  const isPromo = product.promocion === "si";
  const discountedPrice = isPromo
    ? calculateDiscountedPrice(product.precio, product.porcentajeDescuento)
    : product.precio;

  let message = `¡Hola! Estoy interesado en comprar el producto:\n\n*${product.nombre}*`;
  
  // Agregar categoría y línea si existen
  if (product.categoria || product.linea) {
    message += `\n\n• Categoría: ${product.categoria || "No especificada"}`;
    message += `\n• Línea: ${product.linea || "No especificada"}`;
  }

  // Mensaje para productos en promoción
  if (isPromo) {
    message += `\n\n• Precio regular: ${formatPrice(product.precio)}`;
    message += `\n\n📢 *¡OFERTA ESPECIAL!* 📢`;
    message += `\n  - Descuento: ${product.porcentajeDescuento}%`;
    message += `\n  - Precio final: ${formatPrice(discountedPrice)}`;
    message += `\n  - Ahorras: ${formatPrice(product.precio - discountedPrice)}`;
  } else {
    // Mensaje para productos sin promoción
    message += `\n\n• Precio: ${formatPrice(product.precio)}`;
  }

  // Agregar descripción si existe
  if (product.descripcion) {
    message += `\n\nDescripción:\n${product.descripcion}`;
  }

  message += "\n\nPor favor, indíqueme cómo proceder con la compra.";

  window.open(
    `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

  // Carga inicial de productos
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Estados de carga
  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error al cargar los productos. Por favor intenta nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ModalDetailProduct
        open={openModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        onWhatsAppClick={handleWhatsAppRedirect}
      />

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 600, mb: 3, color: "text.primary" }}
      >
        Catálogo de Productos
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {sortedProducts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h5" color="text.secondary">
            No hay productos disponibles
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => {
            const isPromo = product.promocion === "si";
            const discountedPrice = isPromo
              ? calculateDiscountedPrice(
                  product.precio,
                  product.porcentajeDescuento
                )
              : product.precio;

            return (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                {isPromo ? (
                  <PromoBadge badgeContent="OFERTA" overlap="rectangular">
                    <ProductCard ispromo="true">
                      <CardMedia
                        component="img"
                        sx={{
                          height: 160,
                          objectFit: "contain",
                          p: 2,
                          backgroundColor: theme.palette.grey[50],
                        }}
                        image={product.imagen || "/placeholder-product.png"}
                        alt={product.nombre}
                        onClick={() => handleOpenModal(product)}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h3"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.nombre}
                        </Typography>

                        <Box sx={{ mt: "auto" }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <Typography
                              variant="body1"
                              color="error.main"
                              fontWeight={600}
                            >
                              {formatPrice(discountedPrice)}
                            </Typography>
                            <Chip
                              label={`${product.porcentajeDescuento}% OFF`}
                              color="error"
                              size="small"
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            {formatPrice(product.precio)}
                          </Typography>

                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt={1}
                          >
                            <Typography
                              variant="caption"
                              color={
                                product.stock > 0 ? "success.main" : "error"
                              }
                            >
                              {product.stock > 0 ? `Disponible` : "Agotado"}
                            </Typography>
                            <Typography variant="caption" color="success.main">
                              Ahorras{" "}
                              {formatPrice(product.precio - discountedPrice)}
                            </Typography>
                          </Box>

                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => handleWhatsAppRedirect(product)}
                            disabled={product.stock === 0}
                          >
                            {product.stock > 0 ? "Comprar ahora" : "Agotado"}
                          </Button>
                        </Box>
                      </CardContent>
                    </ProductCard>
                  </PromoBadge>
                ) : (
                  <ProductCard ispromo="false">
                    <CardMedia
                      component="img"
                      sx={{
                        height: 160,
                        objectFit: "contain",
                        p: 2,
                        backgroundColor: theme.palette.grey[50],
                      }}
                      image={product.imagen || "/placeholder-product.png"}
                      alt={product.nombre}
                      onClick={() => handleOpenModal(product)}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.nombre}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Typography
                          variant="body1"
                          color="primary.main"
                          fontWeight={600}
                          mb={1}
                        >
                          {formatPrice(product.precio)}
                        </Typography>

                        <Box display="flex" justifyContent="space-between">
                          <Typography
                            variant="caption"
                            color={product.stock > 0 ? "success.main" : "error"}
                          >
                            {product.stock > 0 ? `Disponible` : "Agotado"}
                          </Typography>
                          <Chip
                            label={product.linea || "General"}
                            color="secondary"
                            size="small"
                          />
                        </Box>

                        <Button
                          fullWidth
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => handleWhatsAppRedirect(product)}
                          disabled={product.stock === 0}
                        >
                          {product.stock > 0 ? "Consultar" : "Agotado"}
                        </Button>
                      </Box>
                    </CardContent>
                  </ProductCard>
                )}
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Productos;