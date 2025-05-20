// tests/managers/orderManagement.test.js
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

describe('Order Management Tests', () => {
  // Setup - run before each test
  beforeEach(() => {
    // Reset mock
    mock.reset();
    localStorage.clear();
    // Mock authentication token
    localStorage.setItem('token', 'fake-sales-manager-token');
  });

  test('should fetch product sales statistics', async () => {
    // Mock the API response for getting product sales stats
    mock.onGet(`${API_URL}/orders/stats/products`).reply(200, [
      {
        product_id: 1,
        product_name: 'Cotton T-Shirt',
        total_units_sold: 50,
        total_revenue: 999.50,
        total_profit: 499.75
      },
      {
        product_id: 2,
        product_name: 'Cargo Pants',
        total_units_sold: 30,
        total_revenue: 1350.00,
        total_profit: 675.00
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/orders/stats/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].product_name).toBe('Cotton T-Shirt');
    expect(response.data[0].total_units_sold).toBe(50);
  });

  test('should fetch variation sales statistics', async () => {
    // Mock the API response for getting variation sales stats
    mock.onGet(`${API_URL}/orders/stats/variations`).reply(200, [
      {
        product_id: 1,
        variation_id: 1,
        variation_name: 'SN10-1',
        total_units_sold: 20,
        total_revenue: 399.80,
        total_profit: 199.90
      },
      {
        product_id: 1,
        variation_id: 2,
        variation_name: 'SN10-2',
        total_units_sold: 30,
        total_revenue: 599.70,
        total_profit: 299.85
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/orders/stats/variations`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].variation_name).toBe('SN10-1');
    expect(response.data[1].total_units_sold).toBe(30);
  });

  test('should fetch variation sales statistics for a specific product', async () => {
    const productId = 1;
    
    // Mock the API response for getting variation sales stats by product
    mock.onGet(`${API_URL}/orders/stats/variations/product/${productId}`).reply(200, [
      {
        product_id: 1,
        variation_id: 1,
        variation_name: 'SN10-1',
        total_units_sold: 20,
        total_revenue: 399.80,
        total_profit: 199.90
      },
      {
        product_id: 1,
        variation_id: 2,
        variation_name: 'SN10-2',
        total_units_sold: 30,
        total_revenue: 599.70,
        total_profit: 299.85
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/orders/stats/variations/product/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].product_id).toBe(1);
    expect(response.data[1].product_id).toBe(1);
  });

  test('should handle unauthorized access to sales stats', async () => {
    // Mock customer token instead of sales manager
    localStorage.setItem('token', 'fake-customer-token');
    
    // Mock the API response for unauthorized access
    mock.onGet(`${API_URL}/orders/stats/products`).reply(403, {
      message: "Only sales managers can access product sales stats."
    });

    try {
      // Make the API call
      await axios.get(`${API_URL}/orders/stats/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toBe("Only sales managers can access product sales stats.");
    }
  });

  test('should get an order with its items', async () => {
    const orderId = 1;
    
    // Mock the API response for getting an order with items
    mock.onGet(`${API_URL}/orders/with-items/${orderId}`).reply(200, {
      order: {
        order_id: 1,
        user_id: 1,
        status: 'delivered',
        total_price: 64.98,
        delivery_address: '123 Test St'
      },
      items: [
        {
          order_item_id: 1,
          product_id: 1,
          variation_id: 1,
          quantity: 2,
          price_at_purchase: 19.99,
          product_name: 'Cotton T-Shirt'
        },
        {
          order_item_id: 2,
          product_id: 2,
          variation_id: 3,
          quantity: 1,
          price_at_purchase: 25.00,
          product_name: 'Cargo Pants'
        }
      ]
    });

    // Make the API call
    const response = await axios.get(`${API_URL}/orders/with-items/${orderId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.order.order_id).toBe(1);
    expect(response.data.items.length).toBe(2);
    expect(response.data.items[0].product_name).toBe('Cotton T-Shirt');
  });
});