import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileViewer from "../components/FileViewer";
import { Provider } from "react-redux";
import store from "../components/store";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
jest.mock("axios");
axios.get.mockResolvedValue({ data: { files: [] } });
describe("FileViewer", () => {
  it("loads empty state when no files", async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <FileViewer />
        </Provider>
      </BrowserRouter>
    );
    expect(await screen.findByAltText(/no-files-found/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search files/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/view mode/i)).toBeInTheDocument();
    expect(screen.getByText(/desc date/i)).toBeInTheDocument();
    expect(screen.getByText(/all files/i)).toBeInTheDocument();
  });
});
