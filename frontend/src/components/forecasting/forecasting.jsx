import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import feTrash from '@iconify-icons/fe/trash';
import { Icon } from '@iconify/react';
import { FaCogs, FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Forecasting = () => {

    const [outgoingitems, setItems] = useState([]);
    const [forecastItem, setForecastItem] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [forecastBy, setForecastBy] = useState([]);
    const role = useSelector((state) => state.auth.user?.role);
    const navigate = useNavigate();

    useEffect(() => {
        getOutgoingItems();
    }, [page, keyword]);

    const getOutgoingItems = async () => {
        const response = await axios.get(
            `http://localhost:5000/outgoingItems?search_query=${keyword}&page=${page}&limit=${limit}`
        );
        setItems(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 9) {
            setMsg(
                "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
            );
        } else {
            setMsg("");
        }
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setMsg("");
        setKeyword(query);
    };
    const selectOutgoingItem = async (keyword) => {
        const confirmed = window.confirm(`Are you sure you want to select ${keyword} to forecast?`);
        if (confirmed) {
            try {
                // Make API call to fetch data from backend
                const response = await axios.get(`http://localhost:5000/outgoingItems?search_query=${keyword}&limit=${10000}`);
                // Update state with fetched data
                setForecastItem(response.data.result);
                // Navigate to the '/analytics/editpreprocessdata' route with the forecastItem value as state
                navigate('/analytics/editpreprocessdata', { state: { forecastItem: response.data.result } });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const forecastIncome = async (data) => {
        const confirmed = window.confirm(`Are you sure you want to forecast income?`);
        if (confirmed) {
            try {

                // Navigate to the '/analytics/editpreprocessdata' route with the forecastItem value as state
                navigate('/analytics/modelpredict', { state: { forecastBy: data } });
            } catch (error) {
                console.error(error);
            }
        }
    }


    return (

        <div>
            <div className="sticky top-0 bg-gray-800 p-4 z-15 border">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Forecasting</h1>
                        <h2 className="subtitle text-white">Search Item Name to Forecast by quantitySold</h2>
                    </div>

                </div>
                <form onSubmit={searchData} className="flex items-center mt-4">
                    <div className="flex-1 pr-4">
                        <input
                            type="text"
                            className="w-full border-2 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Find something here..."
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded group"
                        >
                            <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Cari History Jual Item</span>
                            <FaSearch className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>


            <div>
                <div className="flex justify-end mt-5 ">
                    <button
                        onClick={() => setShowTable(!showTable)}
                        className="px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
                    >
                        <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Perlihatkan table</span>
                        {showTable ? 'Hide Table' : 'Show Table'}
                    </button>
                </div>

                {showTable && (
                    <div className="overflow-x-auto">
                        <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border text-left">No</th>
                                    <th className="px-4 py-2 border text-left">Code</th>
                                    <th className="px-4 py-2 border text-left">Name</th>
                                    <th className="px-4 py-2 border text-left">Type</th>
                                    <th className="px-4 py-2 border text-left">Price</th>
                                    <th className="px-4 py-2 border text-left">Quantity Sold</th>
                                    <th className="px-4 py-2 border text-left">Quantification</th>
                                    <th className="px-4 py-2 border text-left">Total Price</th>
                                    <th className="px-4 py-2 border text-left">Date</th>
                                    {role === "admin" && (<th className="px-4 py-2 border text-left">Action</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {outgoingitems.map((outgoingitem, index) => (
                                    <tr key={outgoingitem.id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.iuid}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.name}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.type}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.credit}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.quantitySold}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.quantification}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.totalCredit}</td>
                                        <td className="px-4 py-2 border">{outgoingitem.date.slice(0, 10)}</td>
                                        {role === "admin" && (<td className="px-4 py-2 border">
                                            <button onClick={() => selectOutgoingItem(outgoingitem.name)} className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
                                            >
                                                <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Pilih Item untuk di Prediksi?</span>
                                                <FaPlus className="h-5 w-5" />
                                            </button>
                                        </td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="justify-between items-center mt-10 mb-5">
                            <p className="text-center text-red-500">{msg}</p>
                            <p className="text-center text-white ">
                                Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
                            </p>
                        </div>
                        <nav className="flex justify-center" key={rows} role="navigation" aria-label="pagination">
                            <ReactPaginate
                                previousLabel={"< Prev"}
                                nextLabel={"Next >"}
                                pageCount={Math.min(10, pages)}
                                onPageChange={changePage}
                                containerClassName={
                                    "flex items-center px-4 py-2 ml-3 text-sm font-medium bg-white border-gray-300 rounded-lg "
                                }
                                pageLinkClassName={
                                    "flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-blue-700 active:text-yellow-500"
                                }
                                previousLinkClassName={
                                    "px-3 py-2 rounded-l-lg hover:bg-blue-500 hover:text-white text-blue-500 font-medium"
                                }
                                nextLinkClassName={
                                    "ml-2 px-3 py-2 rounded-r-lg hover:bg-blue-500 hover:text-white text-blue-500 font-medium"
                                }
                            />
                        </nav>
                    </div>

                )}
            </div>

            <div className=" bg-gray-800 p-4 z-15 border mt-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Forecasting</h1>
                        <h2 className="subtitle text-white">Forecast Income </h2>
                    </div>
                    <button
                        onClick={() => forecastIncome("income")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Forecast Income
                    </button>
                </div>

            </div>



        </div>
    );
};

export default Forecasting;