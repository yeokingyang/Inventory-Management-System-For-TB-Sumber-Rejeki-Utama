import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authslice";
import CheckOutReducer from "../features/checkoutslice";
import CheckInReducer from "../features/checkinslice";
import cartReducer from "../features/cartslice";
import stockReducer from "../features/stockslice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    checkout: CheckOutReducer,
    checkin: CheckInReducer,
    cart: cartReducer,
    stockcart: stockReducer
  },
});