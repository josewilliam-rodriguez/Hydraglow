import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Badge,
  useTheme,
  Stack,
  Divider,
  Rating,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ModalDetailProduct from "./ModalDetailProduc";

// Función para formatear como COP
const formatCOP = (value) => {
  const amount =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d]/g, "")) || 0
      : value || 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("COP", "")
    .trim();
};

const PromoBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 10,
    top: 10,
    padding: "0 4px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontWeight: "bold",
    fontSize: "0.7rem",
    borderRadius: 4,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: 12,
  overflow: "hidden",
  minHeight: "450px",
  boxShadow: theme.shadows[2],
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const ProductCard = ({ producto, isPromocion = false }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
   const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  // Asegurarse de que tenemos valores numéricos correctos
  const precioBase =
    typeof producto.precio === "string"
      ? parseFloat(producto.precio.replace(/[^\d]/g, "")) || 0
      : producto.precio || 0;

  const descuento = isPromocion
    ? typeof producto.porcentajeDescuento === "string"
      ? parseFloat(producto.porcentajeDescuento) || 0
      : producto.porcentajeDescuento || 0
    : 0;

  // Calcular valores derivados
  const precioFinal = isPromocion
    ? precioBase * (1 - descuento / 100)
    : precioBase;
  const ahorro = precioBase * (descuento / 100);

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const cleaned = phone.toString().replace(/\D/g, "");
    if (cleaned.startsWith("57")) return "+" + cleaned;
    if (cleaned.length === 10) return "+57" + cleaned;
    if (cleaned.length === 9 && !cleaned.startsWith("0"))
      return "+57" + cleaned;
    return cleaned;
  };

  const handleWhatsAppRedirect = () => {
    const formattedPhone = formatPhoneNumber(producto.contacto);

    if (
      !formattedPhone ||
      !formattedPhone.startsWith("+57") ||
      formattedPhone.length < 12
    ) {
      alert(
        "El número de contacto no es válido. Debe ser un número colombiano de 10 dígitos"
      );
      return;
    }

    const message = `¡Hola! Estoy interesado en comprar el producto:\n\n*${
      producto.nombre
    }*\n\n• Categoría: ${producto.categoria || "No especificada"}\n• Línea: ${
      producto.linea || "No especificada"
    }\n• Precio regular: ${formatCOP(precioBase)}\n${
      isPromocion
        ? `• 📢 *¡OFERTA ESPECIAL!* 📢\n  - Descuento: ${descuento}%\n  - Precio final: ${formatCOP(
            precioFinal
          )}\n  - Ahorras: ${formatCOP(ahorro)}\n\n`
        : "\n"
    }${
      producto.descripcion ? `Descripción:\n${producto.descripcion}\n\n` : ""
    }Por favor, indíqueme cómo proceder con la compra.`;

    window.open(
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <PromoBadge
        badgeContent={isPromocion ? `-${descuento}%` : null}
        invisible={!isPromocion}
      >
        <StyledCard
        onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {/* Imagen del producto con overlay de acciones */}
          <Box
            sx={{
              position: "relative",
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[50],
              p: 2,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                display: "flex",
                gap: 0.5,
              }}
            >
              <Tooltip title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
                <IconButton
                  size="small"
                  onClick={toggleFavorite}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon color="error" fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Compartir">
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

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
                              transform: isHovered ? "scale(1.05)" : "scale(1)",
                            }}
              image={producto.imagen}
              alt={producto.nombre}
              onError={(e) => {
                e.target.src = "/imagen-no-disponible.jpg";
              }}
            />
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            {/* Categoría y rating */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Chip
                label={producto.categoria || "General"}
                size="small"
                color="default"
                variant="outlined"
              />
              {producto.rating && (
                <Rating
                  value={producto.rating}
                  precision={0.5}
                  size="small"
                  readOnly
                />
              )}
            </Stack>

            {/* Nombre del producto */}
            <Typography
              gutterBottom
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 1,
                minHeight: "3em",
              }}
            >
              {producto.nombre}
            </Typography>

            {/* Precios */}
            <Box mt="auto">
              {isPromocion && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: theme.palette.text.disabled,
                  }}
                >
                  {formatCOP(precioBase)}
                </Typography>
              )}

              <Stack direction="row" alignItems="flex-end" spacing={1}>
                <Typography
                  variant="h6"
                  color={isPromocion ? "error" : "primary"}
                  sx={{ fontWeight: 700 }}
                >
                  {formatCOP(precioFinal)}
                </Typography>
                
                {isPromocion && (
                  <Typography variant="caption" color="success.main">
                    Ahorras {formatCOP(ahorro)}
                  </Typography>
                )}
              </Stack>

              {producto.stock <= 5 && producto.stock > 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  ¡Solo quedan {producto.stock} unidades!
                </Typography>
              )}
            </Box>
          </CardContent>

          {/* Botones */}
          <Box sx={{ p: 2, pt: 0 }}>
            <Stack spacing={1}>
              <Button
                variant="contained"
                fullWidth
                color={isPromocion ? "error" : "primary"}
                size="medium"
                onClick={handleWhatsAppRedirect}
                disabled={producto.stock === 0}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.8rem",
                  letterSpacing: 0.5,
                }}
              >
                {producto.stock === 0 ? "Agotado" : "Comprar ahora"}
              </Button>
              
              <Divider sx={{ my: 1 }}>o</Divider>
              
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                onClick={handleOpen}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Ver detalles
              </Button>
            </Stack>
          </Box>
        </StyledCard>
      </PromoBadge>

      {/* Modal de detalles */}
      <ModalDetailProduct
        open={open}
        onClose={handleClose}
        product={producto}
        isPromocion={isPromocion}
        precioBase={precioBase}
        precioFinal={precioFinal}
        descuento={descuento}
        ahorro={ahorro}
        onWhatsAppClick={handleWhatsAppRedirect}
      />
    </>
  );
};

export default ProductCard;