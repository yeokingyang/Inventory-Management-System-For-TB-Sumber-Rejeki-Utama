import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Salesreport = () => {
    const [dailySales, setDailySales] = useState(0);
    const [itemDailySales, setItemDailySales] = useState(0);
    const [year, setYear] = useState(0);
    const [month, setMonth] = useState(0);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - 1 + index);

    const getMonthName = (monthNumber) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[monthNumber - 1];
    };

    const getItemDailySales = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/report/itemSalesbyDaily?year=${year}&month=${month}`
            );
            setItemDailySales(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getSalesbyDaily = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/report/salesbyDaily?year=${year}&month=${month}`
            );
            setDailySales(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    useEffect(() => {
        if (year !== 0 && month !== 0) {
            getSalesbyDaily();
            getItemDailySales();
        }
    }, [year, month]);




    return (
        <div>
            <div className="sticky top-0 bg-gray-800 p-4 border grid grid-cols-2 z-10">
                <div>
                    <label className="block text-sm font-medium text-white">Month</label>
                    <div className="w-1/2">
                        <select
                            value={month}
                            onChange={handleMonthChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">-- Select Month --</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{getMonthName(month)}</option>
                            ))}
                        </select>
                    </div>
                    <label className="block text-sm font-medium mt-2 text-white">Year</label>
                    <div className="w-1/2">
                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">-- Select Year --</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <h1 className="text-5xl font-bold text-white text-center p-5">Report</h1>
            </div>

            <div className="border p-10">
                <div className='border mt-10 p-5'>
                    <h2 className="text-2xl font-bold mb-4 text-white text-center">Daily Sales Graph</h2>

                    {dailySales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={dailySales} >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fill: "white" }} />
                                <YAxis tick={{ fill: "white" }}
                                    domain={[0, Math.max(...dailySales.map(data => data.totalSales))]} // Set domain based on highest totalIncome value
                                />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalSales" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-white text-2xl text-center">No data available</p>
                    )}
                </div>
        

                <div className="border mt-10 p-5">
                <h2 className="text-2xl font-bold mb-4 text-white text-center ">Daily Sales Table</h2>
                    {itemDailySales.length > 0 ? (
                        <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border text-left">No</th>
                                    <th className="px-4 py-2 border text-left">Name</th>
                                    <th className="px-4 py-2 border text-left">Quantity Sold</th>
                                    <th className="px-4 py-2 border text-left">Quantification</th>
                                    <th className="px-4 py-2 border text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemDailySales.map((sale, index) => (
                                    <tr key={sale.name} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{sale.name}</td>
                                        <td className="px-4 py-2 border">{sale.quantitySold}</td>
                                        <td className="px-4 py-2 border">{sale.quantification}</td>
                                        <td className="px-4 py-2 border">{sale.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-white text-2xl text-center">No data available</p>
                    )}
                </div>
            </div>


        </div>
    )
}

export default Salesreport