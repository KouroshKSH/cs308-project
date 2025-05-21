import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Footer from "../components/Footer";
import DrawerMenu from "../components/DrawerMenu";

const About = () => {
  const [cart] = useState([]);
  const product = { department_name: "Home" };

  const navigateToDepartment = (department) => {
    console.log(`Navigating to department: ${department}`);
  };

  return (
    <>
      <div style={{ padding: "10px 20px 0 30px" }}>
        <DrawerMenu />
      </div>

      <div>
        <Box
          sx={{
            padding: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
            color: "#333",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            textAlign: "center",
          }}
        >
          <img
            src="/assets/images/noire-vogue-logo.png"
            alt="Noire Vogue Logo"
            style={{ height: "80px", marginBottom: "1.5rem" }}
          />

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ marginBottom: "2rem" }}
          >
            Premium fashion. Simplified shopping.
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              textAlign: "justify",
            }}
          >
            Welcome to <strong>Noire Vogue</strong>, your one-stop destination
            for premium fashion. We offer a wide range of clothing and
            accessories for men, women, and kids. Browse our curated collections
            and find your style.
          </Typography>

          <Divider sx={{ margin: "3rem 0" }} />

          <Typography variant="h4" gutterBottom fontWeight={600}>
            About the Project
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", textAlign: "justify" }}
          >
            This website was developed as part of the{" "}
            <strong>CS308 Software Engineering</strong> course at Sabancı
            University. It is a full-stack e-commerce platform developed using
            the following technologies:
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <img
              src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge"
              alt="ReactJS"
            />
            <img
              src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white"
              alt="Material UI"
            />
            <img
              src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"
              alt="Node.js"
            />
            <img
              src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"
              alt="MySQL"
            />
          </Box>

          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.05rem", textAlign: "justify" }}
          >
            The project follows the{" "}
            <strong>MVC (Model-View-Controller)</strong> architecture and was
            developed by Team 9:
          </Typography>

          <ul
            style={{
              lineHeight: 1.8,
              fontSize: "1.05rem",
              paddingLeft: "1rem",
              textAlign: "left",
            }}
          >
            <li>Kourosh Sharifi</li>
            <li>Zeynep Merve Yaman</li>
            <li>Arif Kemal Sarı</li>
            <li>Nur Ayca İlhan</li>
            <li>Reyhan Turhan</li>
            <li>Mervan Yusuf Gür</li>
          </ul>
        </Box>

        <Box sx={{ marginBottom: "60px" }} />
      </div>

      <Footer />
    </>
  );
};

export default About;
