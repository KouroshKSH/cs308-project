# CS308 Project - Noire Vogue
This is team 9's repository for CS308 (Software Engineering) course project, for the 2025 Spring semester, at Sabanci University.

---

# Overview
Our website is a clothing e-commerce website named _Noire Vogue_ ✨, built with:
1. **ReactJS** and **Material-UI** for the frontend.
2. **Node.js** for the backend.
3. **MySQL** as the database.

![ReactJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![NODE.JS](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![MYSQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

# Demo Videos
## Customer's View
The video below demonstrates what a typical visitor/customer would come across upon entering our website:

https://github.com/user-attachments/assets/7dab6df9-17b0-454a-90c8-d4ab8c5836be

## Product Manager's View
This video shows what the product manager can view and perform:

https://github.com/user-attachments/assets/4c03ed6e-7e53-4147-8d0e-3055ed69f6e1

## Sales Manager's View
Here, you can see what the sales manager can do:

https://github.com/user-attachments/assets/2d61b75f-dde4-4beb-abef-9492b8316efa

## Extra
The last video shows our 2 pages for "About" and "Contact Us".

https://github.com/user-attachments/assets/8bb13162-9eea-4bc1-b3e1-2bb777cb0ca4

---

## Code Structure
The architecture for our project is the Model View Controller (MVC), where given a request from the frontend, it gets passed along as:

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
├── docker-compose.yml         # Docker compose file for running the whole project
├── instructions.md            # Project setup and usage instructions
├── script.sh                  # Bash script to run the project (alternative to Docker)
└── README.md                  # Project overview and documentation
```

---

# People
The team members:
  1. Kourosh Sharifi [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/KouroshKSH) , [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kouroshsharifi)
  2. Zeynep Merve Yaman [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/zeynepyaman)
  3. Reyhan Turhan
  4. Nur Ayca İlhan
  5. Arif Kemal Sarı
  6. Mervan Yusuf Gür

The TA assigned to team 9 was Mr. Kağan Gülsüm. The instructor of this course was Mr. [Ahmet Demirelli](https://fens.sabanciuniv.edu/tr/faculty-members/detail/928).
