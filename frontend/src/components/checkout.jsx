import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiChevronLeft, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import { clear } from "../features/cartslice";
import { useDispatch, useSelector } from "react-redux";
import placeholderImg from '../assets/placeholderimg.jpg'
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, total, amount } = useSelector((state) => state.cart);
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [customerMoney, setCustomerMoney] = useState("");
    const [exchange, setExchange] = useState("");

    useEffect(() => {
        const exchangeValue = customerMoney - total;
        setExchange(exchangeValue.toFixed(2));
    }, [customerMoney, total]);


    const handleCheckout = async () => {
        try {
            for (let i = 0; i < cartItems.length; i++) {
                const { iuid, amount, credit, quantification } = cartItems[i];
                await axios.post("http://localhost:5000/outgoingItems", {
                    iuid,
                    credit: credit,
                    quantitySold: amount,
                    quantification: quantification,
                    date: date
                });
                await axios.patch("http://localhost:5000/updateQuantitySold", {
                    iuid: iuid
                });
                await axios.patch("http://localhost:5000/updateQuantityOnHand", {
                    iuid: iuid
                });

            }
            navigate("/sellitem");
            dispatch(clear());
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="bg-white min-h-screen">
            <div className="flex items-center justify-between">

                <Link to={`/sellitem`}
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
                                        <img src={cartItem.url} alt="" className="w-20 h-20 object-cover" />
                                    </div>
                                    <div className="flex flex-col items-start max-w-[6.8rem]">
                                        <div>{cartItem.name}</div>
                                        <div className="flex items-center gap-4 mt-2">

                                            <div>{cartItem.amount}</div>
                                            <div>{cartItem.quantification}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 ">
                                        <div>Rp {(cartItem.credit * cartItem.amount).toFixed(2)}</div>
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
                                    onChange={e => setDate(e.target.value)}
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
                        <div className="flex items-center z-10">
                            <div className="mr-2 mx-2">Pay: Rp</div>
                            <input
                                type="input"
                                placeholder="Customer Money"
                                value={customerMoney}
                                onChange={(e) => setCustomerMoney(e.target.value)}
                                className="rounded-lg bg-white-800 p-2 focus:border-blue-500 focus:outline-none text-black"
                            />
                        </div>
                        <div className="flex items-center z-10 mb-8 mx-2">
                            <div className="mr-2">Exchange: Rp</div>
                            <input
                                type="text"
                                value={exchange}
                                placeholder="Exchange Money"
                                readOnly
                                className="rounded-lg bg-white-800 p-2 focus:border-blue-500 focus:outline-none text-black"
                            />
                        </div>

                        <button
                            className="w-full bg-black text-white rounded-md text-center py-3 px-40 mt-8  mx-1 z-10"
                            onClick={() => {
                                handleCheckout();
                            }}>
                            Confirm Payment
                        </button>
                    </>
                )}
            </div>

        </div >



    );
};

export default Checkout;