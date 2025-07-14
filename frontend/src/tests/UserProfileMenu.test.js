import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfileMenu from "../components/UserProfileMenu";
import { MemoryRouter } from "react-router-dom";

// Helper to render with router at a specific route
function renderWithRoute(route) {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <UserProfileMenu />
    </MemoryRouter>
  );
}

describe("UserProfileMenu", () => {
  it("shows Sign In button on welcome page", () => {
    renderWithRoute("/");
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows Sign In button on logout page", () => {
    renderWithRoute("/logout");
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows profile icon and menu on /home", () => {
    renderWithRoute("/home");
    // Profile icon should be present
    expect(screen.getByRole("button")).toBeInTheDocument();

    // Open menu
    fireEvent.click(screen.getByRole("button"));
    // Email menu item
    expect(screen.getByText(/@/)).toBeInTheDocument();
    // Sign Out menu item
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });
});