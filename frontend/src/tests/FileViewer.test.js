import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileViewer from "../components/FileViewer";
import { Provider } from "react-redux";
import store from "../components/store";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

// Mock axios to return no files by default
jest.mock("axios");
axios.get.mockResolvedValue({ data: { files: [] } });

describe("FileViewer", () => {
  it("renders empty state when no files", async () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <FileViewer />
        </Provider>
      </MemoryRouter>
    );
    // Wait for the empty state image to appear
    expect(await screen.findByAltText(/no files found/i)).toBeInTheDocument();
    // Controls
    expect(screen.getByLabelText(/search files/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/view mode/i)).toBeInTheDocument();
    expect(screen.getByText(/desc date/i)).toBeInTheDocument();
    expect(screen.getByText(/all files/i)).toBeInTheDocument();
  });
});