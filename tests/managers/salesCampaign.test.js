// tests/managers/salesCampaign.test.js
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

describe('Sales Campaign Management Tests', () => {
  // Rest of your test remains the same...
  
  // Setup - run before each test
  beforeEach(() => {
    // Reset mock
    mock.reset();
    localStorage.clear();
    // Mock authentication token
    localStorage.setItem('token', 'fake-sales-manager-token');
  });

  test('should create a new sales campaign', async () => {
    const campaignData = {
      productId: 1,
      discountPercent: 15,
      startDate: '2025-05-20',
      endDate: '2025-06-20'
    };

    // Mock the API response for creating a sales campaign
    mock.onPost(`${API_URL}/sales-campaigns`).reply(201, {
      salesId: 1
    });

    // Make the API call
    const response = await axios.post(`${API_URL}/sales-campaigns`, campaignData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(201);
    expect(response.data.salesId).toBe(1);
  });

  test('should fetch all sales campaigns with details', async () => {
    // Mock the API response for getting all sales campaigns
    mock.onGet(`${API_URL}/sales-campaigns/details`).reply(200, [
      {
        sales_id: 1,
        product_id: 1,
        discount_percent: 15,
        start_date: '2025-05-20',
        end_date: '2025-06-20',
        product_name: 'Cotton T-Shirt',
        original_price: 19.99,
        discounted_price: 16.99,
        campaign_status: 'On-going'
      },
      {
        sales_id: 2,
        product_id: 2,
        discount_percent: 20,
        start_date: '2025-06-01',
        end_date: '2025-06-30',
        product_name: 'Cargo Pants',
        original_price: 45.00,
        discounted_price: 36.00,
        campaign_status: 'Not Started'
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/sales-campaigns/details`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].product_name).toBe('Cotton T-Shirt');
    expect(response.data[0].discount_percent).toBe(15);
  });

  test('should filter sales campaigns by status', async () => {
    // Mock the API response for getting ongoing sales campaigns
    mock.onGet(`${API_URL}/sales-campaigns/details?filter=ongoing`).reply(200, [
      {
        sales_id: 1,
        product_id: 1,
        discount_percent: 15,
        start_date: '2025-05-20',
        end_date: '2025-06-20',
        product_name: 'Cotton T-Shirt',
        original_price: 19.99,
        discounted_price: 16.99,
        campaign_status: 'On-going'
      }
    ]);

    // Make the API call
    const response = await axios.get(`${API_URL}/sales-campaigns/details?filter=ongoing`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(1);
    expect(response.data[0].campaign_status).toBe('On-going');
  });

  test('should delete a sales campaign', async () => {
    const salesId = 1;
    
    // Mock the API response for deleting a sales campaign
    mock.onDelete(`${API_URL}/sales-campaigns/${salesId}`).reply(200, {
      message: 'Sales campaign deleted successfully'
    });

    // Make the API call
    const response = await axios.delete(`${API_URL}/sales-campaigns/${salesId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Sales campaign deleted successfully');
  });

  test('should prevent creating overlapping sales campaigns', async () => {
    const campaignData = {
      productId: 1,
      discountPercent: 15,
      startDate: '2025-05-20',
      endDate: '2025-06-20'
    };

    // Mock the API response for overlapping sales campaign
    mock.onPost(`${API_URL}/sales-campaigns`).reply(400, {
      message: "Can't have multiple sales at the same time for the same product!"
    });

    try {
      // Make the API call
      await axios.post(`${API_URL}/sales-campaigns`, campaignData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertions
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe("Can't have multiple sales at the same time for the same product!");
    }
  });
});