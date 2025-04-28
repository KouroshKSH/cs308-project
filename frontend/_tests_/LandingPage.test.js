import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LandingPage from "../LandingPage";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const mockProducts = [
  { product_id: 1, name: "Test Product 1", price: 10, image_url: "url_SN01", popularity_score: 5 },
  { product_id: 2, name: "Test Product 2", price: 20, image_url: "url_SN02", popularity_score: 8 }
];

const renderLandingPage = () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
};

describe("LandingPage", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  it("renders landing page correctly", async () => {
    renderLandingPage();
    expect(screen.getByText(/Women Collection/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });
  });

  it("sorts products by price when 'Sort by Price' is clicked", async () => {
    renderLandingPage();
    const sortButton = screen.getByText(/Sort by Price/i);
    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/sort/price"));
    });
  });

  it("sorts products by popularity when 'Sort by Popularity' is clicked", async () => {
    renderLandingPage();
    const sortButton = screen.getByText(/Sort by Popularity/i);
    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/sort/popularity"));
    });
  });

  it("shows search box when search icon clicked in Header", async () => {
    renderLandingPage();
    const searchIcon = screen.getByLabelText(/search/i);
    fireEvent.click(searchIcon);
    expect(await screen.findByLabelText(/Search Products/i)).toBeInTheDocument();
  });
});
