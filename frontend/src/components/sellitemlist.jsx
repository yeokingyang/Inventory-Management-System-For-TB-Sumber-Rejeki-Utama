import React, { useState } from "react";
import { add } from "../features/cartslice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSpring, animated } from 'react-spring';

import placeholderImg from '../assets/placeholderimg.jpg'

const SellItemList = ({ item }) => {

  const dispatch = useDispatch();
  const { iuid, image, credit, name, type } = item;
  const [addedToCart, setAddedToCart] = useState(false);

  const cartIconProps = useSpring({
    color: addedToCart ? '#ff0000' : '#ffffff',
  });

  return (
    <div className="border max-w-[350px]">
      <Link to={`/itemdetails/${item.id}`}>
        <div className="bg-grey mt-2 h-[120px] flex items-center justify-center overflow-hidden">
          <img src={item.url} alt="" className="w-[200px]" />
        </div>
      </Link>
      <div className="mt-6 flex justify-between items-center px-5">
        <div>
          <div className="text-sm text-white font-bold">{name}</div>
          <div className="text-sm text-white font-bold mb-3">{type}</div>
          <div className="text-xl text-white font-bold mb-3">Rp{credit}</div>
        </div>
        <animated.button
          className={`text-white p-3 ${addedToCart ? 'added-to-cart' : ''}`}
          onClick={() => {
            dispatch(add(item));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 250);
          }}
          style={cartIconProps}
        >
          Add To Cart
        </animated.button>
      </div>

    </div>
  );
};

export default SellItemList;
