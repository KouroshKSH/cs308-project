# CS308 Project
This is team 9's repository for CS308 (Software Engineering) course project, for the 2025 Spring semester, at Sabanci University.

## People Involved
- The team members:
  1. Reyhan Turhan
  2. Nur Ayca İlhan
  3. Arif Kemal Sarı
  4. Zeynep Merve Yaman
  5. Kourosh Sharifi
  6. Mervan Yusuf Gür
- The TA assigned to team 9:
  - Kağan Gülsüm
- The instructor of this course:
  - [Ahmet Demirelli](https://fens.sabanciuniv.edu/tr/faculty-members/detail/928)

---

## Code Structure

```
cs308-project/
├── backend/
│   ├── node_modules/          # Dependencies installed via npm
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Database connection configuration
│   │   ├── controllers/
│   │   │   └── authController.js  # Handles login and register logic
│   │   ├── models/
│   │   │   └── user.js        # User model for database queries
│   │   ├── routes/
│   │   │   └── index.js       # Defines API routes (e.g., /register, /auth/login)
│   │   ├── server.js          # Main backend server file
│   │   └── insert_user.js     # Script to insert users into the database
│   ├── package.json           # Backend dependencies and scripts
│   ├── package-lock.json      # Backend dependency lock file
│   └── .env                   # Environment variables (e.g., DB credentials, JWT secret)
├── frontend/
│   ├── node_modules/          # Dependencies installed via npm
│   ├── public/
│   │   └── index.html         # Main HTML file for the React app
│   ├── src/
│   │   ├── components/        # React components (if applicable)
│   │   ├── App.js             # Main React app component
│   │   ├── Login.js           # Login screen component
│   │   ├── index.js           # Entry point for the React app
│   │   └── styles/            # CSS or styling files (if applicable)
│   ├── package.json           # Frontend dependencies and scripts
│   ├── package-lock.json      # Frontend dependency lock file
│   └── .env                   # Environment variables for the frontend (e.g., API URL)
├── script.sh                  # Bash script to start the project
├── instructions.md            # Project setup and usage instructions
├── README.md                  # Project overview and documentation
└── LICENSE                    # License file (if applicable)
```