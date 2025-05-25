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
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: "bold",
  },
}));

const ProductCard = ({ producto, isPromocion = false }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        badgeContent={isPromocion ? "PROMO" : null}
        invisible={!isPromocion}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: theme.shadows[6],
            },
            maxHeight: 'auto',
            minHeight: 'none',
          }}
        >
          {/* Imagen del producto */}
          <Box
            sx={{
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.grey[50],
              p: 2,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                objectFit: "contain",
                maxHeight: "100%",
                width: "auto",
                maxWidth: "100%",
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
              minHeight: 120,
              overflow: "hidden",
            }}
          >
            {/* Nombre del producto */}
            <Typography
              gutterBottom
              variant="h6"
              component="h3"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                mb: 1,
              }}
            >
              {producto.nombre}
            </Typography>

            {/* Precios */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "auto",
                flexDirection: isPromocion ? "column" : "row",
                alignItems: isPromocion ? "flex-start" : "center",
                gap: isPromocion ? 0.5 : 0,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                {isPromocion && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.disabled">
                      Precio regular:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: theme.palette.text.disabled,
                      }}
                    >
                      {formatCOP(precioBase)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    color={isPromocion ? "secondary" : "text.primary"}
                  >
                    {isPromocion ? "Precio final:" : "Precio:"}
                  </Typography>
                  <Typography
                    variant="h6"
                    color={isPromocion ? "secondary" : "primary"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {formatCOP(precioFinal)}
                  </Typography>
                </Box>

                {isPromocion && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Descuento:
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {descuento}% (Ahorras {formatCOP(ahorro)})
                    </Typography>
                  </Box>
                )}
              </Box>

              {producto.stock <= 5 && producto.stock > 0 && (
                <Chip
                  label={`Últ. ${producto.stock}`}
                  size="small"
                  color="error"
                  sx={{ ml: "auto", alignSelf: "flex-end" }}
                />
              )}
              {producto.stock === 0 && (
                <Chip
                  label="Agotado"
                  size="small"
                  color="error"
                  sx={{ ml: "auto", alignSelf: "flex-end" }}
                />
              )}
            </Box>
          </CardContent>

          {/* Botones */}
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              color={isPromocion ? "primary" : "secondary"}
              size="small"
              onClick={handleWhatsAppRedirect}
              sx={{ mb: 1 }}
              disabled={producto.stock === 0}
            >
              {producto.stock === 0 ? "Agotado" : "Comprar"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={handleOpen}
            >
              Ver Detalles
            </Button>
          </Box>
        </Card>
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