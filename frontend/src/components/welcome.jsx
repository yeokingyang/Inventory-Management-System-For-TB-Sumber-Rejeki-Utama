import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiUsers } from 'react-icons/fi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore, IoIosPhotos } from 'react-icons/io';
import axios from "axios";
import { Link } from "react-router-dom";
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
      <div className="flex items-center justify-center">
        <div className="flex items-start justify-start relative z-0">
          <img src={placeholderImg} alt="" className="w-[1000px] h-[300px] " />
          <div className="p-5 text-white flex flex-col items-center justify-center absolute -top-0 z-0">
            <p className="text-lg font-bold">Earnings</p>
            <p className="text-lg font-bold">Rp {sumTotalPrice}</p>
          </div>
        </div>
      </div>
      <div className="flex m-3 flex-wrap justify-center items-center">

        <div className="flex items-center justify-center relative ">
          <div className="bg-gray h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl mx-4 ">
            <Link to="/users">
              <button
                type="button"
                style={{ color: "white", backgroundColor: "gray" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <FiUsers />
              </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold text-white">20</span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Employee</p>
          </div>

          <div className="bg-gray h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl mx-4">
            <Link to="/items">
              <button
                type="button"
                style={{ color: "blue", backgroundColor: "gray" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <IoIosPhotos />
              </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold text-white">20</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Items</p>
          </div>


          <div className="bg-gray h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl mx-4">
            <button
              type="button"
              style={{ color: "blue", backgroundColor: "gray" }}
              className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
            >
              <IoIosPhotos />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">20</span>
              <span className={`text-sm text-$ ml-2`}>
                10%
              </span>
            </p>
            <p className="text-sm text-gray-400  mt-1">Test</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Welcome;
