import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Instagram, Twitter, Email } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#6D8A63",
        color: "#333",
        py: 6,
        borderTop: "1px solid #e0e0e0",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Columna 1 - Información */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Hydraglow
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#FFFFFF" }}>
              Jabones artesanales elaborados con ingredientes naturales de alta
              calidad.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Link
                href="https://www.facebook.com/profile.php?id=61567835183048"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton aria-label="Facebook" sx={{ color: "#FFFFFF" }}>
                  <Facebook />
                </IconButton>
              </Link>
              <Link
                href="https://www.instagram.com/hidraglow2/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton aria-label="Instagram" sx={{ color: "#FFFFFF" }}>
                  <Instagram />
                </IconButton>
              </Link>
              <Link
              href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#search/valderramajoana377%40gmail.com"
                target="_blank"
                rel="noopener noreferrer">
              <IconButton aria-label="Email" sx={{ color: "#FFFFFF" }}>
                <Email />
              </IconButton>
              </Link>
            </Box>
          </Grid>

          {/* Columna 2 - Productos */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Productos
            </Typography>
            <Link
              href="/Productos"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Jabones
            </Link>
            <Link
              href="#"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Cuidado Facial
            </Link>
            <Link
              href="#"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Hidratantes
            </Link>
            <Link href="#" color="#FFFFFF" underline="hover" display="block">
              Nuevos Lanzamientos
            </Link>
          </Grid>

          {/* Columna 3 - Enlaces útiles */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Enlaces
            </Typography>
            <Link
              href="/Nosotros"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="#"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Blog
            </Link>
            <Link
              href="#"
              color="#FFFFFF"
              underline="hover"
              display="block"
              sx={{ mb: 1 }}
            >
              Preguntas Frecuentes
            </Link>
            <Link href="#" color="#FFFFFF" underline="hover" display="block">
              Contacto
            </Link>
          </Grid>

          {/* Columna 4 - Contacto */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#FFFFFF" }}
            >
              Contacto
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "#FFFFFF" }}>
              valderramajoana377@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: "#FFFFFF" }}>
              +57 317 8918925
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
              Horario: L-V 9:00 - 18:00
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
            © {new Date().getFullYear()} Hydraglow. Todos los derechos
            reservados.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link href="#" color="#FFFFFF" underline="hover" sx={{ mx: 1 }}>
              Términos y condiciones
            </Link>
            <Link href="#" color="#FFFFFF" underline="hover" sx={{ mx: 1 }}>
              Política de privacidad
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
