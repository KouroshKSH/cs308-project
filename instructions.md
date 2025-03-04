# Quick Version: Setting Up the CS308 Project

If you don't have time to read the whole thing, follow these steps:

1.  **Install Node.js and npm (Essential First Step):**
    * **Using nvm (Recommended):**
        * Open a terminal.
        * Run the following command to download and install nvm (Node Version Manager):
           ```bash
			# Download and install nvm:
			curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
			
			# in lieu of restarting the shell
			\. "$HOME/.nvm/nvm.sh"
			
			# Download and install Node.js:
			nvm install 16
			
			# Verify the Node.js version:
			node -v # Should print "v16.20.2".
			nvm current # Should print "v16.20.2".
			
			# Verify npm version:
			npm -v # Should print "8.19.4".
			```
        * **Note:** Let's all use version 16 to avoid future dependency issues, trust me, 16 is better than 22.

2.  **Clone the Project from GitHub:**
    * Go to our repository: [Link](https://github.com/KouroshKSH/cs308-project.git)
    * Open a terminal and navigate to the directory where you want to store the project.
    * Run the following command:
        ```bash
        git clone https://github.com/KouroshKSH/cs308-project.git
        ```
    * Then `cd cs308-project` to move into the newly created directory.

3.  **Open the Project in VS Code:**
    * Open VS Code and select "File" -> "Open Folder..." and choose the `cs308-project` directory you just cloned.

4.  **Open Two Terminals in VS Code:**
    * In VS Code, go to "Terminal" -> "New Terminal."
    * Open another terminal by going to "Terminal" -> "New Terminal" again.
    * You should now have two terminal windows within VS Code.

5.  **Install Dependencies (Crucial Step!):**
    * **Backend Dependencies:**
        * In one of the terminals, navigate to the backend directory: `cd backend`
        * Run the following command to install the required packages: `npm install`
    * **Frontend Dependencies:**
        * In the *other* terminal, navigate to the frontend directory: `cd ../frontend` (or `cd frontend` if you opened the second terminal in the project root).
        * Run the following command to install the required packages: `npm install`
    * **Explanation:** `npm install` reads the `package.json` files in each directory and downloads all the necessary libraries for the backend and frontend to function correctly. Without this step, the application won't run.

6.  **Start the Backend Server:**
    * In the backend terminal (the one in the `./backend/` folder):
        * Run: `npx nodemon server.js`
        * Open a new browser tab and go to `http://localhost:5000/`.
        * You should see a message like "API is running..." (or whatever your backend returns on the root route).

7.  **Start the Frontend Application:**
    * In the frontend terminal (the one in the `./frontend/` folder):
        * Run: `npm start`
        * A new browser tab should automatically open, showing the React application.
        * If it doesn't open automatically, manually go to `http://localhost:3000/` in your browser.
        * If you see the following error:
          * ```bash
            Error: error:0308010C:digital envelope routines::unsupported
            js:59:103 {
            opensslErrorStack: [
                'error:03000086:digital envelope routines::initialization error',
                'error:0308010C:digital envelope routines::unsupported'
            ],
            library: 'digital envelope routines',
            reason: 'unsupported',
            code: 'ERR_OSSL_EVP_UNSUPPORTED'
            }

            Node.js v22.14.0
            ```
        * Then downgrade node to version 16 by doing this:
          * In the same terminal, `Ctrl + C` to stop the process.
          * Then install version 16 by typing `nvm install 16`.
          * Then switch to it by typing `nvm use 16`.
          * At last, confirm your node's version by typing `node -v`, which should print `v16.20.2`.
