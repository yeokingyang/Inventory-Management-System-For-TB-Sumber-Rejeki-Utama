import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import axios from "axios";
import placeholderImg from '../assets/bannerearning.jpg'

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [sumTotalPrice, setSumTotalPrice] = useState(0);

  const getOutgoingItemsSumTotalCredit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/outgoingItems/sumTotalCredit`
      );
      setSumTotalPrice(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOutgoingItemsSumTotalCredit();
  }, []);

  return (
    <div>
      <h1 className="text-5xl text-white font-bold mb-5">Dashboard</h1>
      <h2 className="text-3xl text-white mb-10">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
      <div className="flex items-center justify-center relative ">
        <div className="flex items-start justify-start">
          <img src={placeholderImg} alt="" className="w-[1000px] h-[300px]" />
          <div className=" p-2 absolute top-5 left-30">
            <p className="text-lg font-bold text-white">Earnings</p>
            <p className="text-lg font-bold text-white">Rp {sumTotalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Welcome;
