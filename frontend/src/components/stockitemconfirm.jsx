import React, { useState } from "react";
import axios from "axios";
import { HiChevronLeft, HiTrash } from "react-icons/hi";
import Stockitemconfirmlist from "./stockitemconfirmlist";
import { open } from "../features/checkinslice";
import { clear } from "../features/stockslice";
import { useDispatch, useSelector } from "react-redux";

const StockItemConfirm = () => {
    const dispatch = useDispatch();
    const { cartItems, amount, total } = useSelector((state) => state.stockcart);

    const handleCheckout = async () => {
        try {
            for (let i = 0; i < cartItems.length; i++) {
                const { iuid, amount, debit } = cartItems[i];
                await axios.post("http://localhost:5000/incomingItems", {
                    iuid,
                    debit: debit,
                    quantityPurchased: amount
                });
            }
            dispatch(clear());
            dispatch(open());
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="fixed bg-transparentBlack top-0 left-0 w-full h-screen ">
            <div className="absolute inset-0 bg-black opacity-10 "></div>
            <div className="relative w-1/2 p-4 h-full overflow-y-auto bg-white rounded-lg shadow-md mx-0">

                <div className="flex items-center justify-between">
                    <div className="flex items-center cursor-pointer z-10"
                        onClick={() => dispatch(open())}>
                        <HiChevronLeft />
                        <span className="uppercase text-[0.95rem] select-none">
                            Continue Stocking
                        </span>
                    </div>
                    <div className="text-black">Shopping Bag ({amount})</div>
                </div>

                <div className="mt-8">
                    {cartItems.length === 0 ? (
                        <div className="uppercase text-center text-3xl">
                            Your cart is empty
                        </div>
                    ) : (
                        <>
                            {cartItems.map((cartItem) => {
                                return (
                                    <Stockitemconfirmlist key={cartItem.id}
                                        cartItem={cartItem}
                                    />

                                );
                            })}
                            <div className="flex justify-between items-center mt-12">
                                <div>Total Cost: Rp{total.toFixed(2)}</div>
                                <HiTrash
                                    className="cursor-pointer text-3xl z-10"
                                    onClick={() => dispatch(clear())}
                                />
                            </div>
                            <button className="w-full text-center cursor-pointer bg-black text-white p-3 mt-8 z-10"
                                onClick={handleCheckout} >
                                Add to Stock
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>



    );
};

export default StockItemConfirm;