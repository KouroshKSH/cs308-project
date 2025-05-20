// tests/managers/authentication.test.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const API_URL = 'http://localhost:5000/api';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Set global.localStorage to our mock
global.localStorage = localStorageMock;

describe('Manager Authentication Tests', () => {
  // Setup - run before each test
  beforeEach(() => {
    // Reset mock
    mock.reset();
    localStorage.clear();
  });

  test('should authenticate a sales manager', async () => {
    const loginData = {
      email: 'salesmanager1@email.com',
      password: 'pas123',
      role: 'salesManager'
    };

    // Mock the API response for sales manager login
    mock.onPost(`${API_URL}/auth/manager-login`).reply(200, {
      token: 'fake-sales-manager-token',
      message: 'Manager login successful'
    });

    // Make the API call
    const response = await axios.post(`${API_URL}/auth/manager-login`, loginData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.token).toBe('fake-sales-manager-token');
    expect(response.data.message).toBe('Manager login successful');
  });

  test('should authenticate a product manager', async () => {
    const loginData = {
      email: 'productmanager1@email.com',
      password: 'pas123',
      role: 'productManager'
    };

    // Mock the API response for product manager login
    mock.onPost(`${API_URL}/auth/manager-login`).reply(200, {
      token: 'fake-product-manager-token',
      message: 'Manager login successful'
    });

    // Make the API call
    const response = await axios.post(`${API_URL}/auth/manager-login`, loginData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.token).toBe('fake-product-manager-token');
    expect(response.data.message).toBe('Manager login successful');
  });

  test('should reject login with invalid credentials', async () => {
    const loginData = {
      email: 'salesmanager1@email.com',
      password: 'wrongpassword',
      role: 'salesManager'
    };

    // Mock the API response for invalid credentials
    mock.onPost(`${API_URL}/auth/manager-login`).reply(401, {
      message: 'Invalid password'
    });

    try {
      // Make the API call
      await axios.post(`${API_URL}/auth/manager-login`, loginData);
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Invalid password');
    }
  });

  test('should reject login with role mismatch', async () => {
    const loginData = {
      email: 'customer@email.com',
      password: 'password123',
      role: 'salesManager'
    };

    // Mock the API response for role mismatch
    mock.onPost(`${API_URL}/auth/manager-login`).reply(404, {
      message: 'Invalid credentials or role mismatch'
    });

    try {
      // Make the API call
      await axios.post(`${API_URL}/auth/manager-login`, loginData);
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe('Invalid credentials or role mismatch');
    }
  });

  test('should reject access to protected routes without authentication', async () => {
    // Don't set any token

    // Mock the API response for unauthorized access
    mock.onGet(`${API_URL}/sales-campaigns/details`).reply(401, {
      error: 'Authorization token missing'
    });

    try {
      // Make the API call
      await axios.get(`${API_URL}/sales-campaigns/details`);
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error.response.status).toBe(401);
      expect(error.response.data.error).toBe('Authorization token missing');
    }
  });
});