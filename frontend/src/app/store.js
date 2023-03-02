import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authslice";
import CheckOutReducer from "../features/checkoutslice";
import cartReducer from "../features/cartslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    checkout: CheckOutReducer,
    cart: cartReducer
  },
});