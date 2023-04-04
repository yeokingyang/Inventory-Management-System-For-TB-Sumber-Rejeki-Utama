import React, { useState } from "react";
import { HiX } from "react-icons/hi";
import { increase, decrease, remove, updateDebit } from "../features/stockslice";
import { useDispatch } from "react-redux";
import placeholderImg from '../assets/placeholderimg.jpg'

const StockItemConfirmList = ({ cartItem }) => {

    const dispatch = useDispatch();
    const { id, amount, name } = cartItem;
    const [debit, setDebit] = useState("");
    const [intervalId, setIntervalId] = useState(null);

    const handleDebitChange = async (e) => {
        e.preventDefault();
        setDebit(e.target.value);
        dispatch(updateDebit({ id, debit: e.target.value }));
    };

    const handleDecreaseMouseDown = () => {
        const id = setInterval(() => dispatch(decrease(cartItem)), 50);
        setIntervalId(id);
    };

    const handleDecreaseMouseUp = () => {
        clearInterval(intervalId);
    };

    const handleIncreaseMouseDown = () => {
        const id = setInterval(() => dispatch(increase(cartItem)), 50);
        setIntervalId(id);
    };

    const handleIncreaseMouseUp = () => {
        clearInterval(intervalId);
    };

    return (
        <div className="flex justify-between items-center border border-solid border-glass p-4 mb-6">
            <div className="flex items-center gap-4">
                <img src={cartItem.url} alt="" className="w-20 h-20 object-cover" />
            </div>
            <div className="flex flex-col items-start max-w-[6.8rem]">
                <div>{name}</div>
                <div className="flex flex-col items-start max-w-[6.8rem] z-10">
                    <input
                        type="number"
                        placeholder="Debit"
                        value={debit}
                        onChange={handleDebitChange}
                        className="rounded-lg bg-white-800 p-2 focus:border-blue-500 focus:outline-none text-black ml-4"
                    />
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <button
                        className="w-8 h-8 z-10 text-white bg-black rounded-full "
                        onMouseDown={handleDecreaseMouseDown}
                        onMouseUp={handleDecreaseMouseUp}
                        onMouseLeave={handleDecreaseMouseUp}
                        onClick={() => dispatch(decrease(cartItem))}
                    >
                        -
                    </button>
                    <div>{amount}</div>
                    <button
                        className="w-8 h-8 z-10 text-white bg-black rounded-full "
                        onMouseDown={handleIncreaseMouseDown}
                        onMouseUp={handleIncreaseMouseUp}
                        onMouseLeave={handleIncreaseMouseUp}
                        onClick={() => dispatch(increase(cartItem))}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-center gap-3 ">
                <HiX
                    className="cursor-pointer text-xl z-10 text-black"
                    onClick={() => dispatch(remove(cartItem))}
                />
                <div>Rp {(debit * amount).toFixed(2)}</div>
            </div>
        </div>
    );
};

export default StockItemConfirmList;
