import React from "react";
import SliderHome from "./SliderHome";
import SobreNosotros from "./SobreNosotros";
import SliderPromociones from "./SliderPromociones";
import Footer from "./Footer";
import CompanyValues from "./CompanyValues";

const Home = () => {
  return (
    <>
      <SliderHome />
      <br />
      <SobreNosotros />
      <br />
      <div id="promociones">
        {/* Contenido de tus promociones */}
        <SliderPromociones />
      </div>
      <br />
      <CompanyValues />
      <br />
      <Footer />
    </>
  );
};

export default Home;
