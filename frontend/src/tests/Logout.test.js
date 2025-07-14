import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Logout from "../components/Logout";
import { Provider } from "react-redux";
import store from "../components/store";
import * as fileViewerSlice from "../components/fileViewerSlice";
import * as storeModule from "../components/store";

// Mock Footer to avoid rendering its internals
jest.mock("../components/Footer", () => () => <div>Footer</div>);

describe("Logout", () => {
  it("renders bye gif and calls resetState and persistor.purge", () => {
    // Mock resetState and persistor.purge
    const resetStateSpy = jest.spyOn(fileViewerSlice, "resetState").mockReturnValue({ type: "reset" });
    const purgeSpy = jest.spyOn(storeModule.persistor, "purge").mockImplementation(() => {});

    render(
      <Provider store={store}>
        <Logout />
      </Provider>
    );

    // Check GIF
    expect(screen.getByAltText(/bye gif/i)).toBeInTheDocument();
    // Check Footer
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
    // Check resetState and purge called
    expect(resetStateSpy).toHaveBeenCalled();
    expect(purgeSpy).toHaveBeenCalled();

    // Clean up mocks
    resetStateSpy.mockRestore();
    purgeSpy.mockRestore();
  });
});