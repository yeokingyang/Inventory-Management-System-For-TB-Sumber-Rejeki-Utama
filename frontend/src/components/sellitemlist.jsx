import React, { useState } from "react";
import { add } from "../features/cartslice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { FaShoppingCart } from "react-icons/fa";
import placeholderImg from '../assets/placeholderimg.jpg'

const SellItemList = ({ item }) => {

  const dispatch = useDispatch();
  const { iuid, image, credit, name, type } = item;
  const [addedToCart, setAddedToCart] = useState(false);

  const cartIconProps = useSpring({
    color: addedToCart ? '#ff0000' : '#ffffff',
  });

  return (
    <div className="border max-w-[350px] p-2">
      <Link to={`/itemdetails/${item.iuid}`} className="block w-full">
        <div className="bg-grey mt-2 h-[120px] flex items-center justify-center overflow-hidden border">
          <img src={item.url} alt="" className="w-[120px]" />
        </div>
      </Link>
      <div className="mt-6 flex justify-between items-center px-5">
        <div>
          <div className="text-sm text-white font-bold mb-3">{name}</div>
          <div className="text-sm text-white font-bold mb-3">{type}</div>
        </div>
        <animated.button
          className={`text-white p-3 ${addedToCart ? "added-to-cart" : ""} flex items-center`}
          onClick={() => {
            dispatch(add(item));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 250);
          }}
          style={cartIconProps}
        >
          <div className="flex-shrink-0 ">
            <FaShoppingCart className="mr-2 sm:w-5 sm:h-5" />
          </div>
          <span className="flex-grow">Add To Cart</span>
        </animated.button>
      </div>

    </div>
  );
};

export default SellItemList;
