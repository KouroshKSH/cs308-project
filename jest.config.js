// jest.config.js
module.exports = {
  testEnvironment: "node",
  // No setupFilesAfterEnv - we don't need this for backend tests
  // The mockResolvedValue syntax works in Node environment without additional setup
}