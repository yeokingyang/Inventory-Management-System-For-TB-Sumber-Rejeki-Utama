import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    cartItems: [],
    amount: 0,
    debit: 0,
    total: 0
};

const StockSlice = createSlice({
    name: "stockcart",
    initialState,
    reducers: {
        add: (state, action) => {
            state.amount++;
            const cartItem = state.cartItems.find(
                (cartItem) => cartItem.id === action.payload.id
            );
            cartItem
                ? (cartItem.amount = cartItem.amount + 1)
                : state.cartItems.push({ ...action.payload, amount: 1, debit: 0 });
        },
        increase: (state, action) => {
            state.amount++;
            const itemIndex = state.cartItems.findIndex(
                (cartItem) => cartItem.id === action.payload.id
            );
            state.cartItems[itemIndex].amount += 1;
            state.cartItems[itemIndex].debit = state.debit;
            let total = 0;
            total = state.cartItems[itemIndex].amount * state.cartItems.debit;
        },
        decrease: (state, action) => {
            const itemIndex = state.cartItems.findIndex(
                (cartItem) => cartItem.id === action.payload.id
            );
            state.cartItems[itemIndex].amount > 0 &&
                state.cartItems[itemIndex].amount-- &&
                state.amount--;
            state.cartItems[itemIndex].debit = state.debit;
        },
        remove: (state, action) => {
            state.cartItems.map((cartItem) => {
                if (cartItem.id === action.payload.id) {
                    state.cartItems = state.cartItems.filter(
                        (item) => item.id !== cartItem.id
                    );
                    state.amount = state.amount - cartItem.amount;
                }
            });
        },
        total: (state) => {
            let total = 0;
            state.cartItems.forEach((cartItem) => {
                total += cartItem.amount * cartItem.debit;
            });
            state.total = total;
        },
        updateDebit: (state, action) => {
            const { id, debit } = action.payload;
            const itemIndex = state.cartItems.findIndex(
                (cartItem) => cartItem.id === id
            );
            if (itemIndex !== -1) {
                state.cartItems[itemIndex].debit = Number(debit);
            }
        },
        clear: (state) => {
            state.cartItems = [];
            state.amount = 0;
        },
    },
});
export const { add, increase, decrease, remove, total, clear, updateDebit } =
    StockSlice.actions;
export default StockSlice.reducer;