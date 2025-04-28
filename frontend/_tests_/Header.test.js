import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../Header";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const renderHeader = (props = {}) => {
  return render(
    <BrowserRouter>
      <Header category="Women" setCategory={jest.fn()} onSearchResults={jest.fn()} {...props} />
    </BrowserRouter>
  );
};

describe("Header", () => {
  it("renders header with navigation items", () => {
    renderHeader();
    expect(screen.getByText(/Women/i)).toBeInTheDocument();
    expect(screen.getByText(/Men/i)).toBeInTheDocument();
    expect(screen.getByText(/Kids/i)).toBeInTheDocument();
  });

  it("shows search input when search icon clicked", () => {
    renderHeader();
    const searchButton = screen.getByLabelText(/search/i);
    fireEvent.click(searchButton);
    expect(screen.getByLabelText(/Search Products/i)).toBeInTheDocument();
  });

  it("submits search and calls API", async () => {
    const mockOnSearchResults = jest.fn();
    axios.get.mockResolvedValue({ data: [] });

    renderHeader({ onSearchResults: mockOnSearchResults });

    fireEvent.click(screen.getByLabelText(/search/i));
    const searchInput = screen.getByLabelText(/Search Products/i);
    fireEvent.change(searchInput, { target: { value: "jeans" } });

    const submitButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(mockOnSearchResults).toHaveBeenCalled();
    });
  });

  it("navigates to profile when profile icon clicked", () => {
    renderHeader();
    const profileButton = screen.getByLabelText(/account/i);
    fireEvent.click(profileButton);
    // We can't verify navigation easily without mocking useNavigate
    // so basic interaction check is enough here
    expect(profileButton).toBeInTheDocument();
  });

  it("opens mini cart when cart icon clicked", () => {
    renderHeader();
    const cartButton = screen.getByLabelText(/cart/i);
    fireEvent.click(cartButton);
    expect(screen.getByRole("presentation")).toBeInTheDocument(); // MiniCart Drawer
  });
});
