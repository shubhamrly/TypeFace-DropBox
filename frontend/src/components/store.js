import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import fileViewerReducer from "./fileViewerSlice";
const persistConfig = {
  key: "fileViewer",
  storage,
};
const persistedReducer = persistReducer(persistConfig, fileViewerReducer);
const store = configureStore({
  reducer: {
    fileViewer: persistedReducer,
  },
});
export const persistor = persistStore(store);
export default store;