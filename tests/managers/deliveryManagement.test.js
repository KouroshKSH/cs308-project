// tests/managers/deliveryManagement.test.js
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

describe('Delivery Management Tests', () => {
  // Setup - run before each test
  beforeEach(() => {
    // Reset mock
    mock.reset();
    localStorage.clear();
    // Mock authentication token for product manager
    localStorage.setItem('token', 'fake-product-manager-token');
  });

  test('should create a new delivery', async () => {
    const deliveryData = {
      order_id: 1,
      delivery_status: 'pending',
      tracking_number: 'TRK123456789'
    };

    // Mock the API response for creating a delivery
    mock.onPost(`${API_URL}/deliveries`).reply(201, {
      message: "Delivery created",
      delivery_id: 1
    });

    // Make the API call
    const response = await axios.post(`${API_URL}/deliveries`, deliveryData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Delivery created");
    expect(response.data.delivery_id).toBe(1);
  });

  test('should fetch all deliveries', async () => {
    // Mock the API response for getting all deliveries
    mock.onGet(`${API_URL}/deliveries`).reply(200, [
      {
        delivery_id: 1,
        order_id: 1,
        delivery_status: 'pending',
        tracking_number: 'TRK123456789',
        delivery_address: '123 Test St'
      },
      {
        delivery_id: 2,
        order_id: 2,
        delivery_status: 'shipped',
        tracking_number: 'TRK987654321',
        delivery_address: '456 Main St'
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/deliveries`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].delivery_status).toBe('pending');
    expect(response.data[1].delivery_status).toBe('shipped');
  });

  test('should fetch deliveries by status', async () => {
    const status = 'pending';
    
    // Mock the API response for getting deliveries by status
    mock.onGet(`${API_URL}/deliveries/status/${status}`).reply(200, [
      {
        delivery_id: 1,
        order_id: 1,
        delivery_status: 'pending',
        tracking_number: 'TRK123456789'
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/deliveries/status/${status}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(1);
    expect(response.data[0].delivery_status).toBe('pending');
  });

  test('should get a delivery by order ID', async () => {
    const orderId = 1;
    
    // Mock the API response for getting a delivery by order ID
    mock.onGet(`${API_URL}/deliveries/${orderId}`).reply(200, {
      delivery_id: 1,
      order_id: 1,
      delivery_status: 'pending',
      tracking_number: 'TRK123456789'
    });

    // Make the API call
    const response = await axios.get(`${API_URL}/deliveries/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.order_id).toBe(1);
    expect(response.data.delivery_status).toBe('pending');
  });

  test('should update delivery status', async () => {
    const deliveryId = 1;
    const updateData = {
      delivery_status: 'shipped'
    };
    
    // Mock the API response for updating delivery status
    mock.onPatch(`${API_URL}/deliveries/${deliveryId}/status`).reply(200, {
      message: "Delivery status updated"
    });

    // Make the API call
    const response = await axios.patch(`${API_URL}/deliveries/${deliveryId}/status`, updateData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Delivery status updated");
  });
});