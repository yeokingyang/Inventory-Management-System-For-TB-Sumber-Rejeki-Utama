import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiChevronLeft, HiTrash, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { clear } from "../features/stockslice";
import { open } from "../features/checkinslice";
import { useDispatch, useSelector } from "react-redux";
import placeholderImg from '../assets/placeholderimg.jpg'
import { useNavigate } from "react-router-dom";

const Checkin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, total, amount } = useSelector((state) => state.stockcart);


    const handleCheckin = async () => {
        try {
            for (let i = 0; i < cartItems.length; i++) {
                const { iuid, amount, debit } = cartItems[i];
                await axios.post("http://localhost:5000/incomingItems", {
                    iuid,
                    debit: debit,
                    quantityPurchased: amount
                });
            }
            navigate("/stockitem");
            dispatch(clear());
            dispatch(open());
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="bg-white min-h-screen">
            <div className="flex items-center justify-between">

                <Link to={`/stockitem`}
                  onClick={() => dispatch(open())}
                >
                    <HiChevronLeft />
                    <span className="uppercase text-[0.95rem] select-none">
                        Go Back
                    </span>
                </Link>

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
                                <div key={cartItem.id} className="flex justify-between items-center border border-solid border-glass p-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img src={placeholderImg} alt="" className="w-20 h-20 object-cover" />
                                    </div>
                                    <div className="flex flex-col items-start max-w-[6.8rem]">
                                        <div>{cartItem.name}</div>
                                        <div className="flex items-center gap-4 mt-2">

                                            <div>{cartItem.amount}</div>

                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 ">
                                        <div>Rp {(cartItem.debit * cartItem.amount).toFixed(2)}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between items-center mt-12 mx-2 ">
                            <div>Total Cost: Rp {total.toFixed(2)}</div>

                            <HiTrash
                                className="cursor-pointer text-3xl z-10"
                                onClick={() => dispatch(clear())}
                            />
                        </div>

                        <button
                            className="w-full bg-black text-white rounded-md text-center py-3 px-40 mt-8  mx-1 z-10"
                            onClick={() => {
                                handleCheckin();
                            }}>
                            Confirm stock
                        </button>
                    </>
                )}
            </div>

        </div >



    );
};

export default Checkin;