import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import FileView from "../components/FileView";

describe("FileView", () => {
  it("renders the file name", () => {
    const file = {
      filename: "abc123.pdf",
      originalName: "My File.pdf"
    };
    render(
      <MemoryRouter>
        <FileView file={file} />
      </MemoryRouter>
    );
    expect(screen.getByText(/my file\.pdf/i)).toBeInTheDocument();
  });
});