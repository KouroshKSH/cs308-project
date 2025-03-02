# Quick Version: Setting Up the CS308 Project

In order to start working on the project, please follow these steps:

1.  **Clone the Project from GitHub:**
    * Go to our repository: [Link](https://github.com/KouroshKSH/cs308-project.git)
    * Open a terminal and navigate to the directory where you want to store the project.
    * Run the following command:
        ```bash
        git clone https://github.com/KouroshKSH/cs308-project.git
        ```
    * Then `cd cs308-project` to move into the newly created directory.

2.  **Open the Project in VS Code:**
    * Open VS Code and select "File" -> "Open Folder..." and choose the `cs308-project` directory you just cloned.

3.  **Open Two Terminals in VS Code:**
    * In VS Code, go to "Terminal" -> "New Terminal."
    * Open another terminal by going to "Terminal" -> "New Terminal" again.
    * You should now have two terminal windows within VS Code.

4.  **Install Dependencies (Crucial Step!):**
    * **Backend Dependencies:**
        * In one of the terminals, navigate to the backend directory: `cd backend`
        * Run the following command to install the required packages: `npm install`
    * **Frontend Dependencies:**
        * In the *other* terminal, navigate to the frontend directory: `cd ../frontend` (or `cd frontend` if you opened the second terminal in the project root).
        * Run the following command to install the required packages: `npm install`
    * **Explanation:** `npm install` reads the `package.json` files in each directory and downloads all the necessary libraries for the backend and frontend to function correctly. Without this step, the application won't run.

5.  **Start the Backend Server:**
    * In the backend terminal (the one in the `./backend/` folder):
        * Run: `npx nodemon server.js`
        * Open a new browser tab and go to `http://localhost:5000/`.
        * You should see a message like "API is running..." (or whatever your backend returns on the root route).

6.  **Start the Frontend Application:**
    * In the frontend terminal (the one in the `./frontend/` folder):
        * Run: `npm start`
        * A new browser tab should automatically open, showing the React application.
        * If it doesn't open automatically, manually go to `http://localhost:3000/` in your browser.
