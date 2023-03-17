import React from "react";
import { add } from "../features/cartslice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import placeholderImg from '../assets/placeholderimg.jpg'

const SellItemList = ({ item }) => {

  const dispatch = useDispatch();
  const { iuid, image, credit, name } = item;

  return (
    <div className="border max-w-[350px]">
      <Link to={`/itemdetails/${item.id}`}>
        <div className="bg-grey mt-2 h-[120px] flex items-center justify-center">
        <img src={item.url} alt="" className="w-[120px]" />
        </div>
      </Link>
      <div className="mt-6 flex justify-between items-center px-5">
        <div>
          <div className="text-sm text-white font-bold mb-3">{name}</div>
          <div className="text-xl text-white font-bold">Rp{credit}</div>
        </div>
        <button className="bg-grey text-white p-3" onClick={() => dispatch(add(item))}>
          Add To Cart
        </button>
      </div>
      
    </div>
  );
};

export default SellItemList;