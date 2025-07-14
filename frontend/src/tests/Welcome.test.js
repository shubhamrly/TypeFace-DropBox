import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Welcome from "../components/Welcome";
import { BrowserRouter } from "react-router-dom";

describe("Welcome", () => {
  it("renders welcome image and text", () => {
    render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    expect(screen.getByAltText(/welcome/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Easily upload, store, and share your documents and do much more/i)
    ).toBeInTheDocument();
  });
});