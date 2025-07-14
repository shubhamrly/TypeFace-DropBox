import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer", () => {
  it("renders the assignment notice", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Sample for assignment, Edu use only./i)
    ).toBeInTheDocument();
  });
});
