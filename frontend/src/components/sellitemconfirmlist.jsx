import React from "react";
import { HiX } from "react-icons/hi";
import { increase, decrease, remove } from "../features/cartslice";
import { useDispatch } from "react-redux";
import placeholderImg from '../assets/placeholderimg.jpg'

const SellItemConfirmList = ({ cartItem }) => {

  const dispatch = useDispatch();
  const { id, credit, amount, name } = cartItem;
  return (
    <div className="flex justify-between items-center border border-solid border-glass p-4 mb-6">
      <div className="flex items-center gap-4">
        <img src={placeholderImg} alt="" className="w-20 h-20 object-cover" />
      </div>
      <div className="flex flex-col items-start max-w-[6.8rem]">
        <div>{name}</div>
        <div className="flex items-center gap-4 mt-2">
          <button
            className="w-8 h-8 z-10 text-white bg-black rounded-full "
            onClick={() => dispatch(decrease(cartItem))}
          >
            -
          </button>
          <div>{amount}</div>
          <button
            className="w-8 h-8 z-10 text-white bg-black rounded-full "
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
        <div>${(credit * amount).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default SellItemConfirmList;
