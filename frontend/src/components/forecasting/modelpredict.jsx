import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";

const ModelPredict = () => {
    // Get the state values from the location object
    const location = useLocation();
    const forecastItemConfirm = location.state?.forecastItemConfirm || null;
    const forecastBy = location.state?.forecastBy || null;
    const [prevData, setPrevData] = useState([]);
    const [mse, setMse] = useState([]);
    const [rmse, setRmse] = useState([]);
    const [mape, setMape] = useState([]);
    const [predictedItem, setPredictedItem] = useState([]);
    const [income, setIncome] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');


    // Function to send forecast data to backend
    const sendForecastDataToBackend = async (data1, data2) => {
        try {
            const response = await axios.post('http://localhost:8000/forecast/', {
                forecastBy: data1,
                forecastItemConfirm: data2
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //  console.log(response.data); // Handle success response from backend
            const { mse, rmse, mape, forecastItemConfirm, prevData } = response.data;

            // Update the state variables with the fetched data
            setMse(mse);
            setRmse(rmse);
            setMape(mape);
            setPredictedItem(forecastItemConfirm);
            setPrevData(prevData);
            // console.log(predictedItem);

        } catch (error) {

            if (error.response) {

                setPrevData(error.response.data.prevData);

                // Update state or display error message
                const errorMessage = error.response.data.message; // Assuming error message is returned in 'error' field
                setErrorMessage(errorMessage); // Update state with error message

            } else {

                setErrorMessage(error.message); // Update state with error message

            }
        }
    }

    const sendForecastIncomeToBackend = async (data1, data2) => {
        try {
            const response = await axios.post('http://localhost:8000/forecastIncome/', {
                forecastBy: data1,
                forecastIncome: data2
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //  console.log(response.data); // Handle success response from backend
            const { mse, rmse, mape, forecastIncome, prevData } = response.data;

            // Update the state variables with the fetched data
            setMse(mse);
            setRmse(rmse);
            setMape(mape);
            setPredictedItem(forecastIncome);

            setPrevData(prevData);
            console.log(response.data);

        } catch (error) {

            if (error.response) {

                setPrevData(error.response.data.prevData);

                // Update state or display error message
                const errorMessage = error.response.data.message; // Assuming error message is returned in 'error' field
                setErrorMessage(errorMessage); // Update state with error message

            } else {

                setErrorMessage(error.message); // Update state with error message

            }
        }
    }

    const getIncome = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/incomeForecast`
            );
            setIncome(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => {
                setErrorMessage('');
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [errorMessage]);

    useEffect(() => {
        getIncome();
    }, []);


    // Render component
    return (
        <div className='relative'>
            <div className="sticky top-0 bg-gray-800 p-4 border z-10">
                <Link className="text-white flex items-center" to={`/analytics`}>
                    <HiChevronLeft className="mr-2" />
                    <span className="uppercase text-sm select-none">Go Back</span>
                </Link>
                <div className="flex items-center justify-center mb-5">

                    <h1 className="text-4xl font-bold text-white mt-10 items-center">Preprocess Data</h1>
                </div>
            </div>
            {forecastBy === "quantitySold" && (
                <div>
                    <div className='border mt-10'>
                        <h2 className="text-2xl font-bold mt-4 mb-4 text-white">History of {forecastBy} from {forecastItemConfirm[0].name}</h2>
                        <LineChart width={800} height={400} data={prevData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "white" }}
                                tickFormatter={(dateStr) => {
                                    const date = new Date(dateStr);
                                    const year = date.getFullYear();
                                    const month = date.getMonth() + 1;
                                    return `${year}-${month}`;
                                }}
                            />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="quantitySold" stroke="#8884d8" />
                        </LineChart>
                    </div>
                    <div className='flex items-center justify-center mb-5 mt-5'>
                        <button
                            onClick={() => sendForecastDataToBackend(forecastBy, forecastItemConfirm)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Check Connection to Backend
                        </button>
                    </div>

                    <div>
                        <div className='border'>
                            <h2 className="text-2xl font-bold mt-4 text-white">MSE: {mse}</h2>
                            <h2 className="text-2xl font-bold text-white">RMSE: {rmse}</h2>
                            <h2 className="text-2xl font-bold text-white">MAPE: {mape}</h2>
                        </div>

                        <div className='border'>
                            <h2 className="text-2xl font-bold mt-4 mb-4 text-white">Forecasted Item {forecastItemConfirm[0].name}</h2>
                            <LineChart width={800} height={400} data={predictedItem}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fill: "white" }} />
                                <YAxis tick={{ fill: "white" }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="quantitySold" stroke="#8884d8" />
                            </LineChart>

                        </div>
                    </div>
                    {errorMessage && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-center py-2 px-4 rounded border">
                            {errorMessage}
                        </div>
                    )}
                </div>
            )}

            {forecastBy === "income" && (
                <div>
                    <div className='flex items-center justify-center mb-5 mt-5'>
                        <button
                            onClick={() => sendForecastIncomeToBackend(forecastBy, income)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Check Connection to Backend
                        </button>
                    </div>

                    <div className='border mt-10'>
                        <h2 className="text-2xl font-bold mt-4 mb-4 text-white">History of {forecastBy} </h2>
                        <LineChart width={800} height={400} data={prevData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: "white" }} />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalIncome" stroke="#8884d8" />
                        </LineChart>
                    </div>

                    <div className='border'>
                        <div className='border'>
                            <h2 className="text-2xl font-bold mt-4 text-white">MSE: {mse}</h2>
                            <h2 className="text-2xl font-bold text-white">RMSE: {rmse}</h2>
                            <h2 className="text-2xl font-bold text-white">MAPE: {mape}</h2>
                        </div>
                        <h2 className="text-2xl font-bold mt-4 mb-4 text-white">Forecasted Item </h2>
                        <LineChart width={800} height={400} data={predictedItem}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: "white" }} />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalIncome" stroke="#8884d8" />
                        </LineChart>

                    </div>

                </div>
            )}

        </div>
    );

}

export default ModelPredict;
