import React from "react";
import { add } from "../features/stockslice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import placeholderImg from '../assets/placeholderimg.jpg'

const StockItemList = ({ item }) => {

  const dispatch = useDispatch();
  const { iuid, name } = item;

  return (
    <div className="border max-w-[350px]">
      <Link to={`/itemdetails/${iuid}`} className="block w-full">
        <div className="bg-grey mt-2 h-[120px] flex items-center justify-center">
          <img src={item.url} alt="" className="w-[120px]" />
        </div>
      </Link>
      <div className="mt-6 flex justify-between items-center px-5">
        <div>
          <div className="text-sm text-white font-bold mb-3">{name}</div>
        </div>
        <button className="bg-grey text-white p-3" onClick={() => dispatch(add(item))}>
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default StockItemList;