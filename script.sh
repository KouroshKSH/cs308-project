#!/bin/bash

# 1. Check if we are in the correct directory
echo "Checking current directory..."
current_dir=$(pwd)
expected_dir="/home/kourosh/Documents/Sabanci/classes/cs308/cs308-project"
if [ "$current_dir" != "$expected_dir" ]; then
  echo "Error: Please run this script from the project's root directory: $expected_dir"
  exit 1
fi
echo "Current directory is correct: $current_dir"

# 2. Print Node.js and npm versions
echo "Expect these numbers to be shown for the following commands:"
echo "node -v should give v16.20.2"
echo "npm -v should give 8.19.4"
node -v
npm -v

# 3.1 Start the backend server
echo "Starting backend server..."
cd backend/src/
echo "You should see the message 'Server running on port 5000' if the backend is working correctly."
npx nodemon server.js &

# 3.2 Start the frontend server
echo "Starting frontend server..."
cd ../../frontend/
echo "If you run the frontend successfully, you should see a message like:"
echo "Local:            http://localhost:3000"
echo "On Your Network:  http://10.51.38.164:3000"
npm start

# 4. End of script
echo "Script execution completed."