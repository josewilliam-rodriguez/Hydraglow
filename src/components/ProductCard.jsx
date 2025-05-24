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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

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

  // Función para acortar la descripción
  const shortenDescription = (text, maxLength = 100) => {
    if (!text) return "Sin descripción disponible";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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

  const renderUsos = (uso) => {
    // Caso 1: Campo no existe en absoluto
    if (uso === undefined || uso === null) {
      return (
        <Chip
          label="No especificada"
          size="small"
          color="default"
          variant="outlined"
        />
      );
    }

    // Caso 2: Campo existe pero es string vacío
    if (typeof uso === "string" && uso.trim() === "") {
      return (
        <Chip
          label="No especificada"
          size="small"
          color="default"
          variant="outlined"
        />
      );
    }

    // Caso 3: Valor es válido (string no vacío)
    try {
      const usosArray = String(uso)
        .split(/[,|-]/)
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      if (usosArray.length === 0) {
        return (
          <Chip
            label="No especificada"
            size="small"
            color="default"
            variant="outlined"
          />
        );
      }

      return usosArray.map((u, index) => (
        <Chip
          key={index}
          label={u}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ ml: index === 0 ? 0 : 1 }}
        />
      ));
    } catch (error) {
      console.error("Error al procesar usos:", error);
      return (
        <Chip
          label="Formato inválido"
          size="small"
          color="error"
          variant="outlined"
        />
      );
    }
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
            maxHeight: 450,
            minHeight: 450,
          }}
        >
          {/* Imagen del producto */}
          <Box
            sx={{
              height: 160,
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
              minHeight: 150,
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
              }}
            >
              {producto.nombre}
            </Typography>

            {/* Descripción acortada
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                flexGrow: 1,
                // Compatibilidad con Firefox:
                maxHeight: "4.5em", // 3 líneas (1.5em por línea)
                lineHeight: "1.5em",
              }}
            >
              {shortenDescription(producto.descripcion)}
            </Typography> */}

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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
              color={isPromocion ? "secondary" : "primary"}
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {producto.nombre}
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
          >
            <Box flex={1}>
              <CardMedia
                component="img"
                image={producto.imagen}
                alt={producto.nombre}
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                Descripción Completa
              </Typography>
              <Typography paragraph>
                {producto.descripcion || "No hay descripción disponible"}
              </Typography>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Detalles del Producto
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <strong>Uso:</strong>
                  {renderUsos(producto.uso)}
                </Typography>
                <Typography>
                  <strong>Línea:</strong> {producto.linea || "No especificada"}
                </Typography>
                <Typography>
                  <strong>Precio:</strong> {formatCOP(precioBase)}
                </Typography>
                {isPromocion && (
                  <>
                    <Typography>
                      <strong>Descuento:</strong> {descuento}%
                    </Typography>
                    <Typography>
                      <strong>Precio final:</strong> {formatCOP(precioFinal)}
                    </Typography>
                    <Typography>
                      <strong>Ahorras:</strong> {formatCOP(ahorro)}
                    </Typography>
                  </>
                )}
                <Typography mt={2}>
                  <strong>Stock disponible:</strong> {producto.stock} unidades
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color={isPromocion ? "secondary" : "primary"}
            onClick={handleWhatsAppRedirect}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Agotado" : "Comprar por WhatsApp"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
