# CS308 Project
This is team 9's repository for CS308 (Software Engineering) course project, for the 2025 Spring semester, at Sabanci University.

## People Involved
- The team members:
  1. Kourosh Sharifi [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/KouroshKSH) , [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kouroshsharifi)
  2. Zeynep Merve Yaman [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/zeynepyaman)
  3. Reyhan Turhan
  4. Nur Ayca İlhan
  5. Arif Kemal Sarı
  6. Mervan Yusuf Gür
- The TA assigned to team 9:
  - Kağan Gülsüm
- The instructor of this course:
  - [Ahmet Demirelli](https://fens.sabanciuniv.edu/tr/faculty-members/detail/928)

---

# Overview
Our website is a clothing e-commerce website built with:
1. **ReactJS** and **Material-UI** for the frontend.
2. **Node.js** for the backend.
3. **MySQL** as the database.

![ReactJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![NODE.JS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![MYSQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## Code Structure
The main design pattern for our project is Model View Controller (MVC), where given a request from the frontend, it gets passed along as:

`frontend -> route -> controller -> model -> database`

And the response will traverse the same path from the DB back to the webpage.

```
cs308-project/
├── backend/
│   ├── invoices/              # For invoice-related files
│   ├── src/
│   │   ├── config/            # Configuration files (e.g., database.js)
│   │   ├── controllers/       # Handles business logic for routes
│   │   ├── database/          # Database-related scripts or utilities
│   │   ├── middleware/        # Middleware functions for request handling
│   │   ├── models/            # Database models
│   │   ├── routes/            # API route definitions
│   │   └── server.js          # Main backend server file
├── frontend/
│   ├── node_modules/          # Dependencies installed via npm
│   ├── public/
│   │   └── index.html         # Main HTML file for the React app
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page-level components
│   │   ├── utils/             # Utility functions
│   │   ├── App.js             # Main React app component
│   │   └── index.js           # Entry point for the React app
├── script.sh                  # Bash script to start the project
├── instructions.md            # Project setup and usage instructions
└── README.md                  # Project overview and documentation
```
