import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiUsers } from 'react-icons/fi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore, IoIosPhotos } from 'react-icons/io';
import axios from "axios";
import { Link } from "react-router-dom";
import placeholderImg from '../assets/bannerearning.jpg'
import LineChart from "./charts/linechart";
import BarChart from "./charts/barchart";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [sumTotalPrice, setSumTotalPrice] = useState(0);
  const [sumStaffs, setSumStaffs] = useState(0);
  const [sumItems, setSumItems] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseThisMonth, setExpenseThisMonth] = useState(0);
  const [incomeThisMonth, setIncomeThisMonth] = useState(0);
  const [incomeDifferences, setIncomeDifferences] = useState(0);

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

  const countStaffs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/staffs/count`
      );
      setSumStaffs(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const countItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/inventory/stat`
      );
      setSumItems(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const getExpense = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/expense`
      );
      setExpense(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getExpenseThisMonth = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/expenseThisMonth`
      );
      setExpenseThisMonth(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getThisMonthIncome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/incomeThisMonth`
      );
      setIncomeThisMonth(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getThisMonthVsLastMonthIncome = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/incomeDifferences`
      );
      setIncomeDifferences(response.data);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    getOutgoingItemsSumTotalCredit();
    countStaffs();
    countItems();
    getExpense();
    getExpenseThisMonth();
    getThisMonthIncome();
    getThisMonthVsLastMonthIncome();
  }, []);

  return (
    <div>
      <h1 className="text-5xl text-white font-bold mb-5">Dashboard</h1>
      <h2 className="text-3xl text-white mb-10">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
      <div id="first div" className="flex flex-wrap justify-center bg-white rounded md:w-full md:h-full">
        <div className="flex items-start m-3 justify-start relative z-0">
          <img src={placeholderImg} alt="" className="w-[1000px] h-[300px] " />
          <div className="p-5 text-white flex flex-col items-center justify-center absolute -top-0 z-0">
            <p className="text-lg font-bold">Earnings</p>
            <p className="text-lg font-bold">Rp {sumTotalPrice}</p>
          </div>
        </div>
      </div>
      <div id="second div" className="flex flex-wrap justify-center mt-0.5 bg-white rounded md:w-full md:h-full">
        <div className="flex items-center justify-center bg-white m-3 border rounded-2xl w-full">
          <div className="bg-gray h-44  dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl mx-4 ">
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
              <span className="text-lg font-semibold text-black">{sumStaffs}</span>
            </p>
            <p className="text-sm text-black  mt-1">Employee</p>
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
              <span className="text-lg font-semibold text-black">{sumItems}</span>
            </p>
            <p className="text-sm text-black mt-1">Items</p>
          </div>



        </div>
      </div>

      <div id="third div" className="flex flex-wrap justify-center mt-0.5 bg-white md:w-full md:h-full">
        <div className="bg-white m-3 p-10 border rounded-2xl w-full">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-red-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Income</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col md:flex-row md:gap-10 md:justify-start">
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">Rp {incomeThisMonth}</span>
                  <span className={`p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white ${incomeDifferences.isIncrease ? 'bg-green-400' : 'bg-red-400'} ml-3 text-xs`}>
                    {incomeDifferences.percentageDiff}%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Income</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">RP {expenseThisMonth}</p>

                <p className="text-gray-500 mt-1">Expense</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full md:w-1/2">
              <LineChart width={300} height={300} data={expense} />
            </div>
            <div className="w-full md:w-1/2">
              <BarChart width={400} height={440} data={expense} />
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Report
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};


export default Welcome;
