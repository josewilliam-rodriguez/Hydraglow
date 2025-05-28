import React, { useRef, useEffect } from "react";
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
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";

const ModalDetailProduct = ({ open, onClose, product, isPromocion }) => {
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

    content.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      content.removeEventListener("touchmove", handleTouchMove);
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
    const priceToShow =
      product.promocion === "si" ? discountedPrice : product.precio;
    const message = `¡Hola! Estoy interesado en el producto: ${
      product.nombre
    }\n\n*Detalles:*\n- Categoría: ${product.categoria}\n- Línea: ${
      product.linea
    }\n- Precio: $${priceToShow.toLocaleString()}\n${
      product.promocion === "si"
        ? `- Descuento: ${
            product.porcentajeDescuento
          }%\n- Ahorras: $${savings.toLocaleString()}\n`
        : ""
    }\nPor favor, indíqueme cómo puedo realizar la compra.`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Función para convertir el string de usos en array y limpiar espacios
  const getUsosArray = () => {
    if (!product.uso) return [];
    if (Array.isArray(product.uso)) return product.uso;
    return product.uso
      .split(",")
      .map((u) => u.trim())
      .filter((u) => u);
  };

  const usos = getUsosArray();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <Box
        ref={modalContentRef}
        sx={{
          width: { xs: "95%", md: "800px" },
          maxWidth: "1000px",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          margin: "auto", // ✅ Asegura centrado horizontal
          alignItems: "center", // ✅ Estira los hijos verticalmente
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            zIndex: 1,
            bgcolor: "rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.2)" },
            touchAction: "manipulation",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Sección de imagen */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { md: "400px" },
            minHeight: "250px",
            position: "relative",
            bgcolor: theme.palette.grey[100],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            borderRadius: { xs: "16px 16px 0 0", md: "16px 0 0 16px" },
            aspectRatio: "1/1",
          }}
        >
          <CardMedia
            component="img"
            image={product.imagen}
            alt={product.nombre}
            sx={{
              width: "100%", // Ocupa todo el espacio disponible
              height: "100%",
              maxHeight: "100%", // Reduce un poco el tamaño para dar aire
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: 1.5, // Bordes más pronunciados
              border: `1px solid ${theme.palette.grey[300]}`, // Borde sutil
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // Sombra suave
              padding: "4px", // Espacio interno para el borde
              backgroundColor: "white", // Fondo blanco para contrastar
              aspectRatio: "1/1",
            }}
          />

          {product.promocion === "si" && (
            <Chip
              label={`${product.porcentajeDescuento}% OFF`}
              color="error"
              icon={<LocalOfferIcon />}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                fontWeight: "bold",
                boxShadow: 2,
              }}
            />
          )}
        </Box>

        {/* Sección de detalles */}
        <Box
          sx={{
            flex: 1,
            width: { xs: "100%", md: "50%" },
            p: { xs: 3, md: 4 },
            overflowY: "auto",
            maxHeight: { md: "90vh" },
            justifyContent: "center",
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
                color="black"
              >
                {product.nombre}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
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
                    <Typography variant="h4" color="black" fontWeight="bold">
                      ${Math.round(discountedPrice).toLocaleString()}
                    </Typography>
                    <Chip
                      label={`${product.porcentajeDescuento}% OFF`}
                      color="error"
                      size="small"
                    />
                  </Stack>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through" }}
                  >
                    ${product.precio.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Ahorras: ${Math.round(savings).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" color="black" fontWeight="bold">
                  ${product.precio.toLocaleString()}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <InventoryIcon color={product.stock > 0 ? "success" : "error"} />
              <Typography color="secondary" fontWeight="bold">
                {product.stock > 0 ? "En stock" : "Agotado"}
                {product.stock > 0 && (
                  <Typography component="span" color="text.secondary" ml={1}>
                    ({product.stock} UD)
                  </Typography>
                )}
              </Typography>
            </Stack>

            <Box>
              <Typography variant="h6" gutterBottom color="black" fontWeight="bold">
                Descripción
              </Typography>
              <Typography color="text.secondary" whiteSpace="pre-line">
                {product.descripcion || "No hay descripción disponible."}
              </Typography>
            </Box>

            {usos.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom color="black" fontWeight="bold">
                  Uso recomendado
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    "& .MuiChip-root": {
                      mb: 1,
                      mr: 1,
                    },
                  }}
                >
                  {usos.map((uso, index) => (
                    <Chip
                      key={index}
                      label={uso}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#4caf50", // Verde
                        color: "#2e7d32", // Verde oscuro
                        backgroundColor: "#e8f5e9", // Verde muy claro
                        margin: "0 8px 8px 0", // Espaciado
                        "&:hover": {
                          backgroundColor: "#c8e6c9", // Verde claro al hover
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                fullWidth
                color={isPromocion ? "primary" : "secondary"}
                size="small"
                onClick={handleWhatsAppClick}
                sx={{ mb: 1 }}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Agotado" : "Comprar"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDetailProduct;
//handleWhatsAppClick
