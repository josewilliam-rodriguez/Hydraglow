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
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(0, 1),
  
  "& .slick-slide": {
    padding: theme.spacing(1),
    boxSizing: "border-box",
    display: 'flex !important', // Añade esto
    justifyContent: 'center', 
    alignItems: 'center',
    height: 'auto',
    transition: "transform 0.3s ease-in-out",
    
    "& > div": {
      height: "100%",
      width: '100%',
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    
    "&:focus": {
      outline: 'none'
    }
  },
  
  "& .slick-list": {
    margin: theme.spacing(0, -1),
    overflow: 'visible',
    padding: theme.spacing(1, 0),
  },
  
  "& .slick-track": {
    display: "flex",
    alignItems: "stretch",
     padding: theme.spacing(1, 0),
  },
  
  "& .slick-prev, & .slick-next": {
    width: 40,
    height: 40,
    zIndex: 1,
    background: theme.palette.background.paper,
    borderRadius: '50%',
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s ease',
    
    "&:hover, &:focus": {
      background: theme.palette.background.paper,
      transform: 'scale(1.1)'
    },
    
    "&:before": {
      fontSize: 24,
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },
  
  "& .slick-prev": {
    left: -15,
    [theme.breakpoints.down('md')]: {
      left: -10
    }
  },
  
  "& .slick-next": {
    right: -15,
    [theme.breakpoints.down('md')]: {
      right: -10
    }
  },
  
  "& .slick-dots": {
    bottom: -30,
    
    "& li": {
      margin: 0,
      width: 12,
      height: 12,
      
      "& button": {
        padding: 0,
        width: 12,
        height: 12,
        
        "&:before": {
          fontSize: 10,
          color: theme.palette.grey[400],
          opacity: 1,
          width: 12,
          height: 12,
        }
      },
      
      "&.slick-active button:before": {
        color: theme.palette.primary.main,
      }
    }
  }
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

  // Configuración del autoplay
  const settings = {
    dots: true,
    infinite: productosPromocion.length > 1,
    speed: 800,
    slidesToShow: Math.min(isMobile ? 1 : isTablet ? 2 : 4, productosPromocion.length),
    slidesToScroll: isMobile ? 1 : isTablet ? 2 : 4,
    centerMode: productosPromocion.length >= (isMobile ? 1 : isTablet ? 2 : 4),
  centerPadding: '0px', // Asegúrate que sea 0 para no tener padding extra
    autoplay: true, // Habilita el autoplay
    autoplaySpeed: 5000, // Cambia cada 5 segundos (5000ms)
    pauseOnHover: true, // Pausa al hacer hover
    pauseOnFocus: true, // Pausa al enfocar
    arrows: !isMobile,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
                slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: true, // Mantén esto en los breakpoints
        centerPadding: '0px'
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          arrows: false,
          autoplaySpeed: 6000 // Más lento en móviles
        }
      }
    ]
  };

  if (status === "loading") {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box 
        textAlign="center" 
        py={4}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[1]
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar promociones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchPromociones())}
          sx={{ 
            mt: 2,
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
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
      component="section"
      sx={{
        py: isMobile ? 4 : 6,
        px: isMobile ? 1 : 2,
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          backgroundColor: theme.palette.primary.light,
          opacity: 0.05,
          zIndex: 0
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1800px',
          margin: '0 auto'
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h2"
          sx={{
            textAlign: "center",
            mb: isMobile ? 2 : 4,
            fontWeight: 700,
            color: theme.palette.text.primary,
            position: 'relative',
            display: 'inline-block',
            width: '100%',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: theme.palette.primary.main,
              margin: `${theme.spacing(2)} auto 0`,
              borderRadius: '2px'
            }
          }}
        >
          Ofertas Especiales
        </Typography>

        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{
            textAlign: "center",
            mb: isMobile ? 3 : 5,
            maxWidth: '700px',
            margin: '0 auto',
            px: 2
          }}
        >
          Descubre nuestras promociones exclusivas por tiempo limitado
        </Typography>

        <Box sx={{ px: isMobile ? 0 : 2 }}>
          <StyledSlider {...settings}>
            {productosPromocion.map((producto) => (
              <Box
                key={producto.id}
                sx={{
                  px: 1,
                  height: "100%",
                  display: "flex",
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: isMobile ? 'none' : 'translateY(-8px)'
                  }
                }}
              >
                <ProductCard
                  producto={producto}
                  isPromocion={true}
                  sx={{ 
                    height: "100%", 
                    width: '100%', // Añade esto
                    maxWidth: '300px', // Establece un ancho máximo si es necesario
                    flex: 1,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4]
                    }
                  }}
                />
              </Box>
            ))}
          </StyledSlider>
        </Box>
      </Box>
    </Box>
  );
};

export default SliderPromociones;