import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
  amount: 0,
  total: 0
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action) => {
      state.amount++;
      const cartItem = state.cartItems.find(
        (cartItem) => cartItem.iuid === action.payload.iuid
      );
      cartItem
        ? (cartItem.amount = cartItem.amount + 1)
        : state.cartItems.push({ ...action.payload, amount: 1 });
    },
    increase: (state, action) => {
      state.amount++;
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.iuid === action.payload.iuid
      );
      state.cartItems[itemIndex].amount += 1;
      let total = 0;
      total = state.cartItems[itemIndex].amount * state.cartItems.credit;
    },
    decrease: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.iuid === action.payload.iuid
      );
      state.cartItems[itemIndex].amount > 0 &&
        state.cartItems[itemIndex].amount-- &&
        state.amount--;
    },
    remove: (state, action) => {
      state.cartItems.map((cartItem) => {
        if (cartItem.iuid === action.payload.iuid) {
          state.cartItems = state.cartItems.filter(
            (item) => item.iuid !== cartItem.iuid
          );
          state.amount = state.amount - cartItem.amount;
        }
      });
    },
    updateCredit: (state, action) => {
      const { iuid, credit } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.iuid === iuid
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].credit = Number(credit);
        state.credit = state.cartItems[itemIndex].credit;
      }
    },
    updateQuantification: (state, action) => {
      const { iuid, quantification } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.iuid === iuid
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].quantification = String(quantification);
        state.quantification = state.cartItems[itemIndex].quantification;
      }
    },
    total: (state) => {
      let total = 0;
      state.cartItems.forEach((cartItem) => {
        total += cartItem.amount * cartItem.credit;
      });
      state.total = total;
    },
    clear: (state) => {
      state.cartItems = [];
      state.amount = 0;
    },
  },
});
export const { add, increase, decrease, remove, total, clear, updateCredit, updateQuantification } =
  CartSlice.actions;
export default CartSlice.reducer;