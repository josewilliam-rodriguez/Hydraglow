import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Typography } from '@mui/material';
import Slider from 'react-slick';
import producto1 from '../images/product1.jpeg'


const SliderHome = () => {
    const items = [
        {
          image: "https://res.cloudinary.com/duqoqmq8i/image/upload/v1748466644/f004ff78-c6ff-4756-9e65-6197e5f0c501_ickesn.jpg",
          title: "Productos naturales de alta calidad",
          description: "producto para la piel 100% calificado ",
          link: "/Productos"
        },
        {
          image: "https://res.cloudinary.com/duqoqmq8i/image/upload/v1748466639/fc95777e-3e5d-4068-b5da-cff93e89c6d1_c7gigr.jpg",
          title: "Perros felices, dueños tranquilos",
          description: "Productos especial para perros exigentes.",
          link: "/Productos"
        },
        {
          image: "https://res.cloudinary.com/duqoqmq8i/image/upload/v1748466635/05888b8c-5af9-4e94-8c46-758472b2f754_icf2ow.jpg",
          title: "Promociones de la semana",
          description: "No te pierdas nuestras ofertas exclusivas.",
          link: "/Productos"
        }
      ];
      const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false
      };

            const handlePromoClick = (e, link) => {
        if (link === "#promociones") {
          e.preventDefault();
          const promoSection = document.getElementById('promociones');
          if (promoSection) {
            promoSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };
    
  return (
    <> <Box sx={{ width: "100%", overflow: "hidden" }}>
    <Slider {...settings}>
      {items.map((item, index) => (
        <Box key={index} sx={{ position: "relative" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "5%",
              transform: "translateY(-50%)",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "1rem",
              borderRadius: 2,
              maxWidth: "80%"
            }}
          >
            <Typography variant="h5">{item.title}</Typography>
            <Typography variant="body1">{item.description}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              href={item.link}
              onClick={(e) => handlePromoClick(e, item.link)}
            >
              Ver más
            </Button>
          </Box>
        </Box>
      ))}
    </Slider>
  </Box></>
  )
}

export default SliderHome