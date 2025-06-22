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
  Button,
  useTheme,
  Badge,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  Divider,
  Paper,
  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
} from "../redux/slices/productosSlices";
import ModalDetailProduct from "./ModalDetailProduc";
import {
  LocalOffer as OfferIcon,
  WhatsApp as WhatsAppIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

// Componente de Badge para promociones mejorado
const PromoBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 16,
    top: 16,
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(12),
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
}));

// Tarjeta de producto estilizada
const ProductCard = styled(Card)(({ theme, ispromo }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[6],
  },
  border: ispromo === "true" ? `2px solid ${theme.palette.error.main}` : "none",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
}));

// Componente de valoración con estrellas
const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<StarIcon key={i} color="warning" fontSize="small" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<StarIcon key={i} color="warning" fontSize="small" />);
    } else {
      stars.push(<StarBorderIcon key={i} color="disabled" fontSize="small" />);
    }
  }

  return (
    <Box display="flex" alignItems="center">
      {stars}
      <Typography variant="caption" color="text.secondary" ml={0.5}>
        ({rating.toFixed(1)})
      </Typography>
    </Box>
  );
};

const Productos = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Obtener categorías únicas
  const categories = ["todas", ...new Set(products.map(product => product.categoria || "General"))];

  // Efecto para filtrar productos
  useEffect(() => {
    let result = [...products];
    
    // Filtrar por categoría
    if (selectedCategory !== "todas") {
      result = result.filter(product => 
        (product.categoria || "General") === selectedCategory
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.nombre.toLowerCase().includes(term) || 
        (product.descripcion && product.descripcion.toLowerCase().includes(term))
  )}
    
    // Ordenar productos: primero los que tienen promoción y mejor valoración
    result.sort((a, b) => {
      if (a.promocion === "si" && b.promocion !== "si") return -1;
      if (a.promocion !== "si" && b.promocion === "si") return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

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

  // Redirección a WhatsApp
  const handleWhatsAppRedirect = (product) => {
    const formattedPhone = product.contacto
      ? `+57${product.contacto.toString().replace(/\D/g, "").slice(-10)}`
      : null;

    if (!formattedPhone) {
      alert("Este producto no tiene contacto asignado");
      return;
    }

    const isPromo = product.promocion === "si";
    const discountedPrice = isPromo
      ? calculateDiscountedPrice(product.precio, product.porcentajeDescuento)
      : product.precio;

    let message = `¡Hola! Estoy interesado en el producto:\n\n*${product.nombre}*`;
    message += `\n\n• Precio: ${formatPrice(isPromo ? discountedPrice : product.precio)}`;
    
    if (isPromo) {
      message += `\n• Descuento: ${product.porcentajeDescuento}%`;
      message += `\n• Precio regular: ${formatPrice(product.precio)}`;
    }
    
    message += `\n\nPor favor, indíqueme disponibilidad y forma de pago.`;

    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todas");
  };

  // Carga inicial de productos
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Estados de carga
  if (status === "loading") {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            boxShadow: theme.shadows[1]
          }}
        >
          Error al cargar los productos. Por favor intenta nuevamente.
          <Button
            variant="outlined"
            color="error"
            onClick={() => dispatch(fetchProducts())}
            sx={{ ml: 2 }}
          >
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 6,
        px: { xs: 2, sm: 3 },
      }}
    >
      <ModalDetailProduct
        open={openModal}
        onClose={handleCloseModal}
        product={selectedProduct}
        onWhatsAppClick={handleWhatsAppRedirect}
      />

      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ 
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
            position: "relative",
            display: "inline-block",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 4,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            }
          }}
        >
          Nuestro Catálogo
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          maxWidth="md"
          mx="auto"
        >
          Descubre nuestra selección premium de productos con la mejor calidad y precios competitivos
        </Typography>
      </Box>

      {/* Filtros y buscador */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setSearchTerm("")}
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                variant="outlined"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon color="primary" />
                  </InputAdornment>
                }
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === "todas" ? "Todas las categorías" : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              disabled={searchTerm === "" && selectedCategory === "todas"}
              startIcon={<ClearIcon />}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>
        
        {filteredProducts.length !== products.length && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Mostrando {filteredProducts.length} de {products.length} productos
          </Typography>
        )}
      </Paper>

      {filteredProducts.length === 0 ? (
        <Box 
          textAlign="center" 
          py={10}
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 3,
            boxShadow: theme.shadows[1]
          }}
        >
          <Typography variant="h5" color="text.secondary" mb={2}>
            No se encontraron productos
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {searchTerm || selectedCategory !== "todas" 
              ? "Intenta con otros términos de búsqueda o categorías" 
              : "No hay productos disponibles en este momento"}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleClearFilters}
            sx={{ mr: 2 }}
          >
            Limpiar búsqueda
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => dispatch(fetchProducts())}
          >
            Recargar catálogo
          </Button>
        </Box>
      ) : (
        <Grid
          container
          spacing={4}
          sx={{
            justifyContent: "center",
          }}
        >
          {filteredProducts.map((product) => {
            const isPromo = product.promocion === "si";
            const discountedPrice = isPromo
              ? calculateDiscountedPrice(product.precio, product.porcentajeDescuento)
              : product.precio;

            return (
              <Grid 
                key={product.id} 
                size={{
                xs:12, 
                sm:6, 
                md:4, 
                lg:3,
                }}

                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isPromo ? (
                  <PromoBadge badgeContent="PROMO" overlap="rectangular">
                    <ProductCard 
                      ispromo="true"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <CardActionArea onClick={() => handleOpenModal(product)}>
                        <Box
                          sx={{
                            position: "relative",
                            paddingTop: "75%", // Relación de aspecto 4:3
                            overflow: "hidden",
                          }}
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                              transform: hoveredProduct === product.id ? "scale(1.05)" : "scale(1)",
                            }}
                            image={product.imagen || "/placeholder-product.png"}
                            alt={product.nombre}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 1,
                              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                            }}
                          >
                            <Chip
                              label={`${product.porcentajeDescuento}% OFF`}
                              color="error"
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                mr: 1,
                              }}
                            />
                            {product.rating && (
                              <RatingStars rating={product.rating} />
                            )}
                          </Box>
                        </Box>
                      </CardActionArea>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          p: 3,
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: theme.typography.h6.lineHeight * 2,
                          }}
                        >
                          {product.nombre}
                        </Typography>

                        <Box sx={{ mt: "auto" }}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Typography
                              variant="h6"
                              color="error.main"
                              fontWeight={700}
                            >
                              {formatPrice(discountedPrice)}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              {formatPrice(product.precio)}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" mb={2}>
                            <Chip
                              label={product.categoria || "General"}
                              color="secondary"
                              size="small"
                              variant="outlined"
                            />
                            <Typography
                              variant="caption"
                              color={product.stock > 0 ? "success.main" : "error"}
                              fontWeight="medium"
                            >
                              {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<WhatsAppIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhatsAppRedirect(product);
                              }}
                              disabled={product.stock === 0}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: "medium",
                              }}
                            >
                              Consultar
                            </Button>
                            <Tooltip title="Ver detalles">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenModal(product)}
                                sx={{
                                  border: `1px solid ${theme.palette.primary.main}`,
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </CardContent>
                    </ProductCard>
                  </PromoBadge>
                ) : (
                  <ProductCard 
                    ispromo="false"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <CardActionArea onClick={() => handleOpenModal(product)}>
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "75%",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            transform: hoveredProduct === product.id ? "scale(1.05)" : "scale(1)",
                          }}
                          image={product.imagen || "/placeholder-product.png"}
                          alt={product.nombre}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 1,
                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                          }}
                        >
                          {product.rating && (
                            <RatingStars rating={product.rating} />
                          )}
                        </Box>
                      </Box>
                    </CardActionArea>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: theme.typography.h6.lineHeight * 2,
                        }}
                      >
                        {product.nombre}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          fontWeight={700}
                          mb={1}
                        >
                          {formatPrice(product.precio)}
                        </Typography>

                        <Stack direction="row" justifyContent="space-between" mb={2}>
                          <Chip
                            label={product.categoria || "General"}
                            color="secondary"
                            size="small"
                            variant="outlined"
                          />
                          <Typography
                            variant="caption"
                            color={product.stock > 0 ? "success.main" : "error"}
                            fontWeight="medium"
                          >
                            {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<WhatsAppIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppRedirect(product);
                            }}
                            disabled={product.stock === 0}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "medium",
                            }}
                          >
                            Consultar
                          </Button>
                          <Tooltip title="Ver detalles">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenModal(product)}
                              sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
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