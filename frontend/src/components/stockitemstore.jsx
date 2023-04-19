import React, { useEffect, useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import axios from "axios";
import Stockitemlist from "./stockitemlist";
import { open } from "../features/checkinslice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { FaSearch } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';

const StockItemstore = () => {

    const dispatch = useDispatch();
    const { amount } = useSelector((state) => state.stockcart);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(36);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const [orderBy, setOrderBy] = useState('name');
    const [orderType, setOrderType] = useState('asc');

    const [color, setColor] = useState('#ffffff');

    const props = useSpring({
        color: color,
        textShadow: amount > 0 ? '0px 0px 5px #ff0000' : 'none'
    });

    useEffect(() => {
        if (amount > 0) {
            setColor('#ff0000');
            setTimeout(() => {
                setColor('#ffffff');
            }, 250);
        }
    }, [amount]);

    useEffect(() => {
        getItems();

    }, [page, keyword, orderBy, orderType]);

    const handleOrderBy = (e) => {
        setOrderBy(e.target.value);
    };

    const handleOrderType = (e) => {
        setOrderType(e.target.value);
    };

    const getItems = async () => {
        const response = await axios.get(
            `http://localhost:5000/items?search_query=${keyword}&page=${page}&limit=${limit}&orderBy=${orderBy}&orderType=${orderType}`
        );
        setItems(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    };

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 8) {
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



    return (
        <div>
            <div className="sticky top-0 bg-gray-800 p-4 z-15 border">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Incoming Items</h1>
                        <h2 className="subtitle text-white mt-5">Stocking Items</h2>
                    </div>

                </div>
                <form onSubmit={searchData} >
                    <div className="flex items-center mt-4">
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
                                <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Cari Item</span>
                                <FaSearch className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </form>
                <div className="flex justify-end p-2 mr-11 mt-4">
                    <label htmlFor="orderBy" className="font-bold text-white">
                        Order By:
                    </label>
                    <select
                        id="orderBy"
                        className="border ml-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                        value={orderBy}
                        onChange={handleOrderBy}
                    >
                        <option value="name">Name</option>
                        <option value="type">Type</option>
                        <option value="quantification">Quantification</option>
                        <option value="quantityReceived">Top Purchased</option>
                        <option value="quantityOnHand">Inventory Stock</option>
                    </select>
                    <div>
                        <label htmlFor="asc" className="font-bold text-white ml-2">
                            Ascending
                        </label>
                        <input
                            type="radio"
                            id="asc"
                            name="orderType"
                            value="asc"
                            checked={orderType === 'asc'}
                            onChange={handleOrderType}
                            className="ml-2 mr-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="desc" className="font-bold text-white">
                            Descending
                        </label>
                        <input
                            type="radio"
                            id="desc"
                            name="orderType"
                            value="desc"
                            checked={orderType === 'desc'}
                            onChange={handleOrderType}
                            className="ml-2 mr-5"
                        />
                    </div>
                </div>
            </div>
            <div className="fixed top-32 right-10 p-4">
                <div className="relative cursor-pointer"
                    onClick={() => dispatch(open())} >
                    <BiShoppingBag className="text-3xl opacity-80 text-white" />
                    <animated.div style={props} className="absolute w-4 h-4 rounded-full z-10 right-[-3px] bottom-[-3px] flex items-center justify-center text-[10px] bg-black text-white">
                        {amount}
                    </animated.div>
                </div>
            </div>
            <div className="section mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {items.sort((a, b) => {
                    const order = orderType === 'asc' ? 1 : -1;
                    if (a[orderBy] < b[orderBy]) {
                        return -1 * order;
                    }
                    if (a[orderBy] > b[orderBy]) {
                        return 1 * order;
                    }
                    return 0;
                }).map((item) => {
                    return <Stockitemlist key={item.iuid} item={item} />;
                })}
            </div>

            <div className="justify-between items-center mt-10 mb-5">
                <p className="text-center text-red-500">{msg}</p>
                <p className="text-center text-white ">
                    Total Items: {rows} Page: {rows ? page + 1 : 0} of {pages}
                </p>
            </div>
            <nav className="flex justify-center" key={rows} role="navigation" aria-label="pagination">
                <ReactPaginate
                    previousLabel={"< Prev"}
                    nextLabel={"Next >"}
                    pageCount={Math.min(9, pages)}
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
        </div >
    );
};

export default StockItemstore;