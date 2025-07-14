import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // <-- Add this import
import App from "../App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../components/store";
import axios from "axios";

// Mock axios
jest.mock("axios");

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {ui}
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome page by default", () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/TypeFace-Dropbox/i)).toBeInTheDocument();
    // Adjust this line if your Welcome page text is different
    // expect(screen.getByText(/Easily upload, store, and share/i)).toBeInTheDocument();
  });

  it("shows backend warning if API call fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));
    window.history.pushState({}, "Home", "/home");
    renderWithProviders(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Backend is not available/i)).toBeInTheDocument()
    );
  });
});