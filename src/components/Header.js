import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import ProfileDropdown from "./ProfileDropdown";
import "../styles/header-style.css";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ title, profileImage, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTitleClick = () =>{
    if(location.pathname !=="/" && location.pathname !== "/register"){
      navigate("/board");
    }
  }
  return (
    <>
      <Navbar id="custom-navbar" className="justify-content-center align-items-start ">
      <Container className="d-flex justify-content-between" >
        {onBack ? (
        <Button
        className="me-2 back-button"
        onClick={onBack}
      />
        ) : (
        <div className="placeholder-btn me-2"></div> 
        )}
       <Navbar.Brand
          className="text-center mx-auto"
          onClick={handleTitleClick}
          style={{
            cursor: location.pathname === "/" || location.pathname === "/register" ? "default" : "pointer",
          }}
        >  <img src="/images/cloud.png" alt="Logo" className="brand-logo" />{title}</Navbar.Brand>
            {profileImage ? (
        <ProfileDropdown avatar={profileImage} />
        ) : (
        <div className="placeholder-btn2"></div> 
        )}
      </Container>
      </Navbar>
    </>
  );
};

export default Header;