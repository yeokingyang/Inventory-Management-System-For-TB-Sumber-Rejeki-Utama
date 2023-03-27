import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ReactPaginate from "react-paginate";
import placeholderImg from '../assets/placeholderimg.jpg'
import feTrash from '@iconify-icons/fe/trash';
import { Icon } from '@iconify/react';
import { FaCogs } from 'react-icons/fa';


const Itemlist = () => {

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(parseInt(localStorage.getItem('selected')) || 0);
    const [limit, setLimit] = useState(30);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState(localStorage.getItem('searchQuery') || '');
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const role = useSelector((state) => state.auth.user?.role);

    useEffect(() => {
        getItems();
    }, [page, keyword]);


    useEffect(() => {
        localStorage.setItem('searchQuery', keyword);
        localStorage.setItem('selected', page);
    }, [keyword, page]);


    const getItems = async () => {
        const response = await axios.get(
            `http://localhost:5000/items?search_query=${keyword}&page=${page}&limit=${limit}`
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
        localStorage.setItem('selected', selected);
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        setMsg("");
        setKeyword(query);
    };

    const deleteItem = async (itemId) => {
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            await axios.delete(`http://localhost:5000/items/${itemId}`);
            const newTotalRows = rows - 1;
            setRows(newTotalRows);
            const newTotalPages = Math.ceil(newTotalRows / limit);
            if (page >= newTotalPages) {
                setPage(newTotalPages - 1);
            }
            setPages(newTotalPages);
            setItems(items.filter((item) => item.iuid !== itemId));
        }
    };


    return (

        <div>
            <div className="sticky  top-0 left-0 w-full bg-gray-800 p-4 z-15">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Items</h1>
                        <h2 className="subtitle text-white">List of Items</h2>
                    </div>
                    <Link to="/items/add" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                        Add New
                    </Link>
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border text-left">No</th>
                        <th className="px-4 py-2 border text-left">Image</th>
                        <th className="px-4 py-2 border text-left">Code</th>
                        <th className="px-4 py-2 border text-left">Name</th>
                        <th className="px-4 py-2 border text-left">Type</th>
                        <th className="px-4 py-2 border text-left">Price</th>
                        <th className="px-4 py-2 border text-left">Quantity Received</th>
                        <th className="px-4 py-2 border text-left">Quantity Sold</th>
                        <th className="px-4 py-2 border text-left">Quantity Onhand</th>
                        <th className="px-4 py-2 border text-left">Quantification</th>
                        <th className="px-4 py-2 border text-left">information</th>
                        {role === "admin" && (<th className="px-4 py-2 border text-left">Action</th>)}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.iuid} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                                <div className="mt-2 h-[50px] shadow-md rounded-md overflow-hidden">
                                    <img src={item.url || placeholderImg} alt="Image" className="w-[50px]" />
                                </div>
                            </td>
                            <td className="px-4 py-2 border">{item.iuid}</td>
                            <td className="px-4 py-2 border">{item.name}</td>
                            <td className="px-4 py-2 border">{item.type}</td>
                            <td className="px-4 py-2 border">{item.credit}</td>
                            <td className="px-4 py-2 border">{item.quantityReceived}</td>
                            <td className="px-4 py-2 border">{item.quantitySold}</td>
                            <td className="px-4 py-2 border">{item.quantityOnHand}</td>
                            <td className="px-4 py-2 border">{item.quantification}</td>
                            <td className="px-4 py-2 border">{item.explanation}</td>
                            {role === "admin" && (<td className="px-4 py-2 border">
                                <Link to={`/items/edit/${item.id}`} className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out"
                                >
                                    <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Hapus Akun</span>
                                    <FaCogs className="h-5 w-5" />
                                </Link>
                                <button onClick={() => deleteItem(item.iuid)} className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out"
                                >
                                    <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Hapus Akun</span>
                                    <Icon icon={feTrash} className="h-5 w-5" />
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
                    initialPage={page}
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
    );
};

export default Itemlist;