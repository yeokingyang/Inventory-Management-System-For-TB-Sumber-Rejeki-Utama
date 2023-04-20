import React, { useState } from "react";
import { HiX } from "react-icons/hi";
import { increase, decrease, remove, updateCredit, updateQuantification } from "../features/cartslice";
import { useDispatch } from "react-redux";
import placeholderImg from '../assets/placeholderimg.jpg'

const SellItemConfirmList = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { iuid, credit, amount, name, quantification } = cartItem;
  const [itemCredit, setItemCredit] = useState(credit);
  const [itemQuantification, setItemQuantification] = useState(credit);
  const [intervalId, setIntervalId] = useState(null);

  const handleCreditChange = async (e) => {
    e.preventDefault();
    setItemCredit(e.target.value);
    dispatch(updateCredit({ iuid, credit: e.target.value }));
  };

  const handleQuantificationChange = async (e) => {
    e.preventDefault();
    setItemQuantification(e.target.value);
    dispatch(updateQuantification({ iuid, quantification: e.target.value }));
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
            placeholder="Credit"
            value={credit}
            onChange={handleCreditChange}
            className="rounded-lg bg-white p-2 focus:border-blue-500 focus:outline-none text-black ml-4 border border-gray-400 "
          />
        </div>
        <div className="flex flex-col items-start max-w-[6.8rem] z-10 ">
          <input
            placeholder="Quantification"
            value={quantification}
            onChange={handleQuantificationChange}
            className="rounded-lg bg-white p-2 focus:border-blue-500 focus:outline-none text-black ml-4 border border-gray-400 "
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
        <div>RP{(credit * amount).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default SellItemConfirmList;
