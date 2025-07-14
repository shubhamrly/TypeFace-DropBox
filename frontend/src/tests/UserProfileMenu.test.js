import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfileMenu from "../components/UserProfileMenu";
import { BrowserRouter } from "react-router-dom";

// move to the home screen
function renderWithRoute(route) {
  window.history.pushState({}, "home", route);
  return render(
    <BrowserRouter>
      <UserProfileMenu />
    </BrowserRouter>
  );
}
//ignore case i.
describe("UserProfileMenu", () => {
  it("should shows Sign In button on welcome page", () => {
    renderWithRoute("/");
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it(" should shows Sign In button on logout page", () => {
    renderWithRoute("/logout");
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it(" should shows profile icon (FaSecret) and menu on /home", () => {
    renderWithRoute("/home");
    expect(screen.getByRole("button")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/@/)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });
});