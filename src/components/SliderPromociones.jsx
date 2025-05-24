import { useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  styled,
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
  "& .slick-slide": {
    padding: theme.spacing(0, 1),
    boxSizing: "border-box",
    "& > div": {
      height: "100%",
      display: "flex", // Asegura que el contenedor interno use flexbox
    },
  },
  "& .slick-list": {
    margin: theme.spacing(0, -1),
    overflow: "visible",
  },
  "& .slick-track": {
    display: "flex",
    alignItems: "stretch", // Asegura altura uniforme
    "& .slick-slide": {
      height: "auto", // Permite que las tarjetas se ajusten al contenedor
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
    if (status === "idle") {
      dispatch(fetchPromociones());
    }
  }, [status, dispatch]);

  const settings = {
    dots: true,
    infinite: productosPromocion.length > 1,
    speed: 500,
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 3,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: !isMobile,
    centerMode: false,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
        "&:before, &:after": {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          width: isMobile ? 20 : 60,
          zIndex: 2,
          background: `linear-gradient(to ${
            theme.direction === "rtl" ? "left" : "right"
          }, ${theme.palette.background.default} 0%, transparent 100%)`,
        },
        "&:before": {
          left: 0,
        },
        "&:after": {
          right: 0,
          background: `linear-gradient(to ${
            theme.direction === "rtl" ? "right" : "left"
          }, ${theme.palette.background.default} 0%, transparent 100%)`,
        },
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

      <StyledSlider {...settings}>
        {productosPromocion.map((producto) => (
          <Box
            key={producto.id}
            sx={{
              px: 1,
              height: "100%",
              display: "flex", // Usa flexbox para el contenedor
              "&:hover": {
                transform: "scale(1.02)",
                transition: "transform 0.3s ease",
              },
            }}
          >
            <ProductCard
              producto={producto}
              isPromocion={true}
              sx={{ height: "100%", flex: 1 }} // Asegura que la tarjeta ocupe todo el espacio
            />
          </Box>
        ))}
      </StyledSlider>
    </Box>
  );
};

export default SliderPromociones;
