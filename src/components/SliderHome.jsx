import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button, Typography } from '@mui/material';
import Slider from 'react-slick';


const SliderHome = () => {
    const items = [
        {
          image: "https://th.bing.com/th/id/R.0d6bcb347e148d82325214af1356a232?rik=fASvVirccmHt%2bA&riu=http%3a%2f%2fmaquillajestudio.cl%2fwp-content%2fuploads%2f2017%2f09%2fhomemade-hair-conditioner.jpg&ehk=IQ%2b%2fBsWyHaQt98%2fZUE3mwpf0ZeizEQZF8EqRbhsmsfM%3d&risl=&pid=ImgRaw&r=0",
          title: "Productos naturales de alta calidad",
          description: "producto para la piel 100% calificado ",
          link: "/productos/perros"
        },
        {
          image: "https://nanova.org/wp-content/uploads/2024/02/lh95b720.bmp.jpg",
          title: "Gatos felices, dueños tranquilos",
          description: "Alimento especial para gatos exigentes.",
          link: "/productos/gatos"
        },
        {
          image: "https://zaragozatop.com/wp-content/uploads/2023/09/los-beneficios-de-los-productos-naturales-en-los-herbolarios-1.jpg",
          title: "Promociones de la semana",
          description: "No te pierdas nuestras ofertas exclusivas.",
          link: "/promociones"
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