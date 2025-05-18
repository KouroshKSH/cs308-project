#!/bin/bash

# 1. Check if we are in the correct directory
echo "Checking current directory..."
current_dir=$(basename "$PWD")
expected_dir="cs308-project"
if [ "$current_dir" != "$expected_dir" ]; then
  echo "Error: Please run this script from the project's root directory: ./$expected_dir"
  exit 1
fi
echo "Current directory is correct: $current_dir"

# 2. Check if MySQL is running
echo "Checking MySQL status..."
pgrep mysqld > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Error: MySQL is not running."
  echo "👉 Please run this in another terminal first:"
  echo "   sudo /opt/homebrew/opt/mysql/bin/mysqld_safe --datadir=/opt/homebrew/var/mysql"
  exit 1
fi
echo "✅ MySQL is running."

# 3. Print Node.js and npm versions
echo "Expect these numbers to be shown for the following commands:"
echo "node -v should give v16.20.2"
echo "npm -v should give 8.19.4"
node -v
npm -v

# 4.1 Start the backend server
echo "Starting backend server..."
cd backend/src/
echo "You should see the message 'Server running on port 5000' if the backend is working correctly."
npx nodemon server.js &

# 4.2 Start the frontend server
echo "Starting frontend server..."
cd ../../frontend/
echo "If you run the frontend successfully, you should see a message like:"
echo "Local:            http://localhost:3000"
echo "On Your Network:  http://10.51.38.164:3000"
npm start

# 5. End of script
echo "✅ Script execution completed."
