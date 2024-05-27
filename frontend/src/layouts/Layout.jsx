import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
const Layout = ({ children, showHero = false }) => {
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <Header />
      {showHero && <Hero />}
      <div className="" style={{ padding: "10px" }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
