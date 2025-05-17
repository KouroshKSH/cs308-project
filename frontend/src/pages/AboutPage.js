import React , { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Footer from "../components/Footer";

// please DO NOT include a header or drawer for this page because it'll introduce bugs about cart and suchs

const About = () => {

    const [cart] = useState([]); // Initialize an empty cart
    const product = { department_name: "Home" }; // Default department name

    // Function to navigate to a specific department
    const navigateToDepartment = (department) => {
    console.log(`Navigating to department: ${department}`);
    // Add navigation logic here if needed
    };

  return (
    <>
    {/* do NOT include header or drawer here please */}
        <div>
            <Box sx={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                About Noire Vogue
            </Typography>
            <Typography variant="body1" paragraph>
                Welcome to Noire Vogue, your one-stop destination for premium fashion. We offer a wide range of clothing and accessories for men, women, and kids. Explore our categories, including tops, bottoms, shoes, and accessories, to find the perfect fit for your style.
            </Typography>

            {/* let's put a nice design here with clothing and models */}

            <Divider sx={{ margin: "2rem 0" }} />
            <Typography variant="h5" gutterBottom>
                About the Project
            </Typography>
            <Typography variant="body1" paragraph>
                This project is developed as part of the CS308 Software Engineering course at Sabanci University. It is a full-stack e-commerce platform built using:
            </Typography>
            <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <img src="https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge" alt="ReactJS" />
                <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Material UI" />
                <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="Node.js" />
                <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
            </Box>
            <Typography variant="body1" paragraph>
                The project follows the Model-View-Controller (MVC) design pattern, ensuring a clean and maintainable codebase. It was developed by Team 9:
            </Typography>
            <ul>
                <li>Kourosh Sharifi</li>
                <li>Zeynep Merve Yaman</li>
                <li>Arif Kemal Sarı</li>
                <li>Nur Ayca İlhan</li>
                <li>Reyhan Turhan</li>
                <li>Mervan Yusuf Gür</li>
            </ul>
            </Box>

            {/* Add a gap before the footer */}
            <Box sx={{ marginBottom: "60px" }} />
        </div>

        <Footer />
    </>
  );
};

export default About;