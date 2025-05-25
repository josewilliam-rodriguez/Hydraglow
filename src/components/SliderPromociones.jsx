import { useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  styled,
  Button
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromociones,
  selectAllPromociones,
  selectPromocionesStatus,
} from "../redux/slices/promocionesSlices";
import Slider from "react-slick";
import ProductCard from "./ProductCard";

const StyledSlider = styled(Slider)(({ theme }) => ({
  width: '100%', // Ocupa todo el ancho disponible
  maxWidth: '1200px', // Ancho máximo del slider
  margin: '0 auto', // Centrado horizontal
  
  "& .slick-slide": {
    padding: theme.spacing(0, 1),
    boxSizing: "border-box",
    height: '100%', // Altura completa del contenedor
    
    "& > div": {
      height: "100%",
      display: "flex",
      justifyContent: "center", // Centra las tarjetas horizontalmente
    },
  },
  
  "& .slick-list": {
    margin: theme.spacing(0, -1),
    overflow: "hidden",
    height: '100%', // Altura completa
  },
  
  "& .slick-track": {
    display: "flex",
    alignItems: "center", // Centra verticalmente
    height: '100%', // Altura completa
  },
  
  // Estilos para las flechas de navegación
  "& .slick-prev, & .slick-next": {
    width: '40px',
    height: '40px',
    zIndex: 1,
    "&:before": {
      fontSize: '30px',
      color: theme.palette.primary.main,
    },
  },
  
  "& .slick-prev": {
    left: '-45px',
  },
  
  "& .slick-next": {
    right: '-45px',
  },
  
  // Estilos para los puntos de navegación
  "& .slick-dots": {
    bottom: '-30px',
    "& li button:before": {
      fontSize: '12px',
      color: theme.palette.primary.main,
    },
  },
}));

const SliderPromociones = () => {
  const dispatch = useDispatch();
  const productosPromocion = useSelector(selectAllPromociones);
  const status = useSelector(selectPromocionesStatus);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (status === "idle") dispatch(fetchPromociones());
  }, [status, dispatch]);

  const settings = {
    dots: true,
    infinite: productosPromocion.length > 1,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 3,
    autoplay: !isMobile,
    autoplaySpeed: 4000,
    arrows: !isMobile,
    centerMode: false,
    focusOnSelect: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 15,
    waitForAnimate: true,
    useCSS: true,
    cssEase: 'ease-out',
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box textAlign="center" py={2}>
        <Typography color="error">Error al cargar promociones</Typography>
        <Button
          variant="outlined"
          onClick={() => dispatch(fetchPromociones())}
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  if (status === "succeeded" && productosPromocion.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        my: 6,
        px: isMobile ? 2 : 4,
        position: "relative",
        maxWidth: '100vw', // Limita el ancho máximo
        
        overflow: 'hidden', // Oculta cualquier desbordamiento
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          color: theme.palette.primary.main,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        Ofertas Especiales
      </Typography>

      <Box sx={{
        maxWidth: '60%',
        height: '60%',
        mx: 'auto',
        position: 'relative',
      }}>
        <StyledSlider {...settings}>
          {productosPromocion.map((producto) => (
            <Box
              key={producto.id}
              sx={{
                px: 1,
                height: "100%",
                display: "flex",
                ...(!isMobile && {
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.3s ease",
                  },
                }),
              }}
            >
              <ProductCard
                producto={producto}
                isPromocion={true}
                sx={{ 
                  height: "100%", 
                  flex: 1,
                  maxWidth: '100%', // Asegura que las tarjetas no excedan el ancho
                }}
              />
            </Box>
          ))}
        </StyledSlider>
      </Box>
    </Box>
  );
};

export default SliderPromociones;