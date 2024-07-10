import { configureStore } from "@reduxjs/toolkit";
import crudReducer from "./crud";

const store = configureStore({
  reducer: {
    // Define your reducers here
    crud: crudReducer,
  },
});

export default store;
