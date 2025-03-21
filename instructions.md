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

4.  **Open Two Terminals from Your Machine (NOT VScode):**
    * Search for your operating system's terminal and open 2 instances of it.
    * You should now have two terminal windows outside of VS Code.
    * If you open terminals from VS Code, you _will_ face issues with `sudo` access and other problems such as starting the database.
    * One terminal will be used for running the bash script (explained later), and the other one is for checking MySQL.

5.  **Install Dependencies (Crucial Step):**
    * **Backend Dependencies:**
        * In one of the terminals, navigate to the backend directory: `cd backend`
        * Run the following command to install the required packages: `npm install`
    * **Frontend Dependencies:**
        * In the *other* terminal, navigate to the frontend directory: `cd ../frontend` (or `cd frontend` if you opened the second terminal in the project root).
        * Run the following command to install the required packages: `npm install`
    * **Explanation:** `npm install` reads the `package.json` files in each directory and downloads all the necessary libraries for the backend and frontend to function correctly. Without this step, the application won't run.

6. **Run the Bash Script:**
    * In the root directory of the project, there's a file called `script.sh`, which you can run by:
        * First, make the script executable by running:
        ```bash
        chmod +x script.sh
        ```
        * Then, run the Script
        ```bash
        ./script.sh
        ```
        * If done successfully, the frontend and backend should start automatically with no issues, and you browser will redirect you to the website.
        * In case this does _not_ happen, then follow the next steps and start the frontend and backend manually.
    * The reason we need 2 terminals is that running the script in one of them will start the MySQL database in the background, but we also want to visibly check the information in the database.
        * In order to do this, type `sudo mysql` in the other terminal.
        * Most likely, you will not need to enter a password.
        * If it asks for a password, enter your computer's password.
        * Afterwards, you should see an environment like: `mysql> ` where you can enter your SQL commands.
        * Make sure to immediately type:
        ```sql
        USE fashion_ecommerce;
        SHOW TABLES;
        ```
        * Do this to make sure you're using the correct database.

7.  **Start the Backend Server:**
    * In the backend terminal (the one in the `./backend/` folder):
        * Run: `npx nodemon server.js`
        * Open a new browser tab and go to `http://localhost:5000/`.
        * You should see a message like "API is running..." (or whatever your backend returns on the root route).

8.  **Start the Frontend Application:**
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

## Possible Issue with Version 22
If you face issues with node v22 always being installed or defaulting to v22 (instead of v16), do the following:
1. Uninstall node v22: `nvm uninstall 22`
2. Install node v16 (just to make sure it's properly installed): `nvm install 16`
3. Set v16 as the default version: `nvm alias default 16`
4. Use v16: `nvm use 16`
5. Verify the version: `node -v`
