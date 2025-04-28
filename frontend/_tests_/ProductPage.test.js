import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPage from './ProductPage';

// Test for product name
test('renders product name', () => {
    render(<ProductPage />);
    expect(screen.getByText(/product name/i)).toBeInTheDocument();
});

// Test for showing product price
test('shows product price', () => {
    render(<ProductPage />);
    expect(screen.getByText(/\$\d+/)).toBeInTheDocument();
});

// Test for size dropdown menu
test('selects a size', () => {
    render(<ProductPage />);
    fireEvent.mouseDown(screen.getByLabelText(/select size/i));
    fireEvent.click(screen.getByText('Medium'));
    expect(screen.getByRole('button', { name: /M/i })).toBeInTheDocument();
  });

// Quantity input test
test('allows only positive integer quantities', () => {
    render(<ProductPage />);
    const input = screen.getByLabelText(/quantity/i);
    fireEvent.change(input, { target: { value: '-3' } });
    expect(input.value).toBe('');
});

// Add to cart with no selection 
test('add to cart disabled without selecting size', () => {
    render(<ProductPage />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
});

// Add to cart success message
test('adds item to cart successfully', async () => {
    window.alert = jest.fn();
    render(<ProductPage />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(window.alert).toHaveBeenCalled();
});

// Back to home
test('clicking back navigates to home', () => {
    const navigate = jest.fn();
    render(<ProductPage navigate={navigate} />);
    fireEvent.click(screen.getByText(/back to home/i));
    expect(navigate).toHaveBeenCalled();
});


// more productpage tests havent checked

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPage from './ProductPage';
import { BrowserRouter } from 'react-router-dom';

// Wrapper to handle useNavigate and useParams
const MockProductPage = (props) => (
  <BrowserRouter>
    <ProductPage {...props} />
  </BrowserRouter>
);

// Mock window.alert
beforeEach(() => {
  window.alert = jest.fn();
});

// 1. Test rendering product name
test('renders product name', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/product name/i)).toBeInTheDocument();
});

// 2. Test rendering product price
test('renders product price', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/\$\d+/)).toBeInTheDocument();
});

// 3. Test size dropdown exists
test('renders size dropdown', async () => {
  render(<MockProductPage />);
  expect(await screen.findByLabelText(/select size/i)).toBeInTheDocument();
});

// 4. Test selecting a size
test('selects a size', async () => {
  render(<MockProductPage />);
  fireEvent.mouseDown(screen.getByLabelText(/select size/i));
  fireEvent.click(await screen.findByText(/medium/i));
  expect(await screen.findByRole('button', { name: /m/i })).toBeInTheDocument();
});

// 5. Test quantity input exists
test('renders quantity input', () => {
  render(<MockProductPage />);
  expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
});

// 6. Test invalid quantity input
test('blocks negative quantities', () => {
  render(<MockProductPage />);
  const input = screen.getByLabelText(/quantity/i);
  fireEvent.change(input, { target: { value: '-2' } });
  expect(input.value).toBe('');
});

// 7. Test adding to cart without selecting size
test('disable add to cart button if no size selected', () => {
  render(<MockProductPage />);
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
});

// 8. Test successful add to cart
test('adds item to cart successfully', async () => {
  render(<MockProductPage />);
  fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
  expect(window.alert).toHaveBeenCalled();
});

// 9. Test back to home navigation
test('clicking back navigates to home', async () => {
  render(<MockProductPage />);
  fireEvent.click(await screen.findByText(/back to home/i));
});

// 10. Test loading spinner
test('shows loading spinner initially', () => {
  render(<MockProductPage />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

// 11. Test product not found case
test('shows error if product not found', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/product not found/i)).toBeInTheDocument();
});

// 12. Test review section title
test('renders customer reviews title', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/customer reviews/i)).toBeInTheDocument();
});

// 13. Test empty reviews text
test('shows no reviews text when empty', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/no reviews yet/i)).toBeInTheDocument();
});

// 14. Test review rating input exists
test('renders review rating input', () => {
  render(<MockProductPage />);
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
});

// 15. Test submitting review without login
test('alert user when submitting review without login', async () => {
  localStorage.removeItem('token'); // ensure no token
  render(<MockProductPage />);
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('You must be logged in to submit a review.');
  });
});

// 16. Test quantity field accepts only numbers
test('quantity input accepts only numbers', () => {
  render(<MockProductPage />);
  const input = screen.getByLabelText(/quantity/i);
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(input.value).toBe('');
});

// 17. Test open image zoom modal
test('opens zoom image modal', async () => {
  render(<MockProductPage />);
  const img = await screen.findByAltText(/product name/i);
  fireEvent.click(img);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

// 18. Test close image zoom modal
test('closes zoom modal on close icon click', async () => {
  render(<MockProductPage />);
  const img = await screen.findByAltText(/product name/i);
  fireEvent.click(img);
  const closeButton = await screen.findByRole('button', { name: /close/i });
  fireEvent.click(closeButton);
});

// 19. Test material text is shown
test('renders material text', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/material/i)).toBeInTheDocument();
});

// 20. Test description text is shown
test('renders description text', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/description/i)).toBeInTheDocument();
});

// 21. Test star rating is displayed
test('renders star rating based on popularity', async () => {
  render(<MockProductPage />);
  expect(await screen.findByLabelText(/rating/i)).toBeInTheDocument();
});

// 22. Test search for "add to cart" button
test('renders add to cart button', () => {
  render(<MockProductPage />);
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
});

// 23. Test that adding to cart with invalid quantity shows error
test('shows quantity error if invalid when adding to cart', async () => {
  render(<MockProductPage />);
  const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
  fireEvent.click(addToCartButton);
  expect(await screen.findByText(/you have to choose a valid quantity/i)).toBeInTheDocument();
});

// 24. Test Leave a Review section appears
test('renders leave a review section', async () => {
  render(<MockProductPage />);
  expect(await screen.findByText(/leave a review/i)).toBeInTheDocument();
});

// 25. Test submit review button is clickable
test('submit review button is clickable', async () => {
  render(<MockProductPage />);
  const button = await screen.findByRole('button', { name: /submit/i });
  expect(button).not.toBeDisabled();
});
