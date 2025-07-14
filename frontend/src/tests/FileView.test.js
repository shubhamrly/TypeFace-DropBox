import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FileView from "../components/FileView";

describe("FileView", () => {
  it("renders the file name", () => {
    const file = {
      originalName: "SampleFile.pdf",
    };
    render(
      <BrowserRouter>
        <FileView file={file} />
      </BrowserRouter>
    );
    expect(screen.getByText(/SampleFile\.pdf/i)).toBeInTheDocument();
  });
});
