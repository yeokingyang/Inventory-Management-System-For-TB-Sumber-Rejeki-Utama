import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";

const ModelPredict = () => {
    // Get the state values from the location object
    const location = useLocation();
    const [prevData, setPrevData] = useState(location.state?.forecastItem || null);
    const forecastBy = location.state?.forecastBy || null;
    const [mse, setMse] = useState([]);
    const [rmse, setRmse] = useState([]);
    const [mape, setMape] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [history, setHistory] = useState([]);
    const [income, setIncome] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [modeltype, setModelType] = useState(0);
    const [time, setTime] = useState(0);

    const startPrediciton = () => {
        if (modeltype !== 0 && time !== 0) {
            sendForecastIncomeToBackend();
        }
        else
            setErrorMessage("please select model and time to start forecasting")
    };

    // Function to send forecast data 
    const sendForecastIncomeToBackend = async () => {
        console.log(prevData)
        if (prevData != null) {
            try {
                const response = await axios.post('http://localhost:8000/forecastIncome/', {
                    modelType: modeltype,
                    time: time,
                    forecastIncome: prevData
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
                setPrediction(forecastIncome);
                setHistory(prevData);
                // console.log(response.data);

            } catch (error) {

                const errorMessage = error.response.data.message; // Assuming error message is returned in 'error' field
                setErrorMessage(errorMessage); // Update state with error message

            }
        }
        else
            setErrorMessage("prev Data is null");
    }

    const handleModelTypeChange = (e) => {
        setModelType(e.target.value);
    };

    const handletimeChange = (e) => {
        setTime(e.target.value);
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



    // Render component
    return (
        <div className='relative'>
            <div className="sticky top-0 bg-gray-800 p-4 border z-10">
                <Link className="text-white flex items-center" to={`/analytics`}>
                    <HiChevronLeft className="mr-2" />
                    <span className="uppercase text-sm select-none">Go Back</span>
                </Link>

                <div className="sticky top-0 bg-gray-800 p-4 border grid grid-cols-2 z-10">
                    <div>
                        <label htmlFor="forecastByselect" className="block text-white mt-4">
                            Select Model:
                        </label>
                        <div className="w-1/2">
                            <select
                                onChange={handleModelTypeChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">-- Select Operation --</option>
                                <option value="lsm">Least Square Method</option>
                                <option value="es">Exponential Smoothing</option>
                                <option value="arima">Arima</option>
                            </select>
                        </div>
                        <label htmlFor="forecastByselect" className="block text-white mt-4">
                            Select How Many to predict:
                        </label>
                        <div className="w-1/2">
                            <select
                                onChange={handletimeChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">-- Select Operation --</option>
                                <option value="1">1 months ahead</option>
                                <option value="2">2 months ahead</option>
                                <option value="3">3 months ahead</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mt-10 items-center">Preprocess Data</h1>
                    </div>

                </div>
            </div>

            {forecastBy === "income" && (
                <div>
                    <div className='flex items-center justify-center mb-5 mt-5'>
                        <button
                            onClick={() => startPrediciton()}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Check Connection to Backend
                        </button>
                    </div>

                    <div className='border mt-10 p-4 '>
                        <h2 className="text-2xl font-bold mt-4 mb-4 text-white">History of {forecastBy} </h2>
                        <LineChart width={800} height={400} data={history}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: "white" }} />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalIncome" stroke="#8884d8" />
                        </LineChart>
                    </div>

                    <div className='border p-4 '>
                        <div className='border p-4 '>
                            <h2 className="text-2xl font-bold mt-4 text-white">MSE: {mse}</h2>
                            <h2 className="text-2xl font-bold text-white">RMSE: {rmse}</h2>
                            <h2 className="text-2xl font-bold text-white">MAPE: {mape}</h2>
                            <h2 className="text-2xl font-bold text-white">MAPE: {mape}</h2>
                        </div>
                        <h2 className="text-2xl font-bold mt-4 mb-4 text-white">Forecasted Income </h2>
                        <LineChart width={800} height={400} data={prediction}>
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
            {errorMessage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-center py-2 px-4 rounded border">
                    {errorMessage}
                </div>
            )}
        </div>
    );

}

export default ModelPredict;
