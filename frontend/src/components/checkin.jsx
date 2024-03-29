import React, { useState } from "react";
import axios from "axios";
import { HiChevronLeft, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { clear } from "../features/stockslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const { cartItems, total, amount } = useSelector((state) => state.stockcart);
    const [isLoading, setIsLoading] = useState(false);
      
    const handleCheckin = async () => {
        setIsLoading(true);
        try {
            for (let i = 0; i < cartItems.length; i++) {
                const { iuid, amount, debit } = cartItems[i];
                await axios.post("http://localhost:5000/incomingItems", {
                    iuid,
                    debit: debit,
                    quantityPurchased: amount,
                    date : date
                });
                await axios.patch("http://localhost:5000/updateQuantityReceived", {
                    iuid: iuid
                });
                await axios.patch("http://localhost:5000/updateQuantityOnHand", {
                    iuid: iuid
                });
            }
            navigate("/stockitem");
            dispatch(clear());
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="bg-white min-h-screen">
            {isLoading && <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-50 z-50"></div>}
            {isLoading && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl z-50">Loading...</div>}
            <div className="flex items-center justify-between">

                <Link to={`/stockitem`}
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
                                <div key={cartItem.iuid} className="flex justify-between items-center border border-solid border-glass p-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img src={cartItem.url} alt="" className="w-20 h-20 object-cover" />
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
                        <div className="flex justify-between items-center mt-12 mx-2">
                            <div></div>
                            <div>
                            <h1 className="ml-6"> Date </h1>
                            <input
                                type="date"
                                value={date}
                                onChange={e=>setDate(e.target.value)}
                                className="rounded-lg bg-white-800 p-2 focus:border-blue-500 focus:outline-none text-black ml-4"
                            />
                            </div>

                        </div>
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