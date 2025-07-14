import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Logout from "../components/Logout";
import { Provider } from "react-redux";
import store from "../components/store";
import * as fileViewerSlice from "../components/fileViewerSlice";
import * as storeModule from "../components/store";

jest.mock("../components/Footer", () => () => <div>Footer</div>);

describe("Logout", () => {
  it("shows bye-gif and redux resetState and persistor.purge", () => {
    const resetStateSpy = jest
      .spyOn(fileViewerSlice, "resetState")
      .mockReturnValue({ type: "reset" });
    const purgeSpy = jest
      .spyOn(storeModule.persistor, "purge")
      .mockImplementation(() => {});
    render(
      <Provider store={store}>
        <Logout />
      </Provider>
    );
    expect(screen.getByAltText(/bye-gif/i)).toBeInTheDocument();
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
    expect(resetStateSpy).toHaveBeenCalled();
    expect(purgeSpy).toHaveBeenCalled();
    resetStateSpy.mockRestore();
    purgeSpy.mockRestore();
  });
});
