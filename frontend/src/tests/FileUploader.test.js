import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUploader from "../components/FileUploader";
import axios from "axios";

// Mock axios
jest.mock("axios");

const mockSetFiles = jest.fn();
const mockOnUploadSuccess = jest.fn();

function setup() {
  render(
    <FileUploader setFiles={mockSetFiles} uploadFiles={jest.fn()} onUploadSuccess={mockOnUploadSuccess} />
  );
}

describe("FileUploader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders drag & drop area and upload button", () => {
    setup();
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start upload/i })).toBeInTheDocument();
  });

  it("shows error if submitting with no files", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /start upload/i }));
    expect(screen.getByText(/select some files before submitting/i)).toBeInTheDocument();
  });

  it("accepts valid file types and calls setFiles", () => {
    setup();
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockSetFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByText(/selected files/i)).toBeInTheDocument();
    expect(screen.getByText(/test.png/i)).toBeInTheDocument();
  });

  it("rejects unsupported file types", () => {
    setup();
    window.alert = jest.fn();
    const file = new File(["dummy"], "test.exe", { type: "application/x-msdownload" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/unsupported file type/i)
    );
  });

  it("removes a selected file", () => {
    setup();
    const file = new File(["dummy"], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText(/test.txt/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(mockSetFiles).toHaveBeenLastCalledWith([]);
  });

  it("shows error if file limit exceeded", () => {
    setup();
    const files = Array.from({ length: 16 }, (_, i) => new File([""], `file${i}.txt`, { type: "text/plain" }));
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files } });
    expect(screen.getByText(/files allowed at a time/i)).toBeInTheDocument();
  });

  it("uploads files and shows success", async () => {
    axios.post.mockResolvedValue({});
    setup();
    const file = new File(["dummy"], "test.json", { type: "application/json" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: /start upload/i }));
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    await waitFor(() => expect(mockOnUploadSuccess).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: /start upload/i })).toBeInTheDocument();
  });

});