import React, { useEffect, useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import axios from "axios";
import Sellitemlist from "./sellitemlist";
import { open } from "../features/checkoutslice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { FaSearch } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';

const SellItemstore = () => {

    const dispatch = useDispatch();
    const { amount } = useSelector((state) => state.cart);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(36);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
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
    }, [page, keyword]);

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
                        <h1 className="title text-4xl font-bold text-white">Outgoing Items</h1>
                        <h2 className="subtitle text-white mt-5">Sell Items</h2>
                    </div>

                </div>
                <form onSubmit={searchData} className="flex items-center mt-8">

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
                </form>
            </div>
            <div className="fixed top-32 right-2 p-4">
                <div className="relative cursor-pointer"
                    onClick={() => dispatch(open())} >

                    <BiShoppingBag className="text-3xl opacity-80 text-white" />

                    <animated.div style={props} className="absolute w-4 h-4 rounded-full z-10 right-[-3px] bottom-[-3px] flex items-center justify-center text-[10px] bg-black text-white">
                        {amount}
                    </animated.div>
                </div>
            </div>
            <div className=" section mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 ">
                {items.map((item) => {
                    return <Sellitemlist key={item.iuid} item={item} />;
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

export default SellItemstore;