import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sortOption: "date-1",
  filterType: "",
  searchTerm: "",
  viewMode: "thumbnail",
};

const fileViewerSlice = createSlice({
  name: "fileViewer",
  initialState,
  reducers: {
    setSortOption(state, action) {
      state.sortOption = action.payload;
    },
    setFilterType(state, action) {
      state.filterType = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    resetState(state) {
      return initialState;
    },
  },
});

export const {
  setSortOption,
  setFilterType,
  setSearchTerm,
  setViewMode,
  resetState,
} = fileViewerSlice.actions;

export default fileViewerSlice.reducer;