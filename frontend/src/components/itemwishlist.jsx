import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import placeholderImg from '../assets/placeholderimg.jpg'
import { useSelector } from "react-redux";

const Itemwishlist = () => {

    const [wishlistitems, setWishlistitems] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(30);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const role = useSelector((state) => state.auth.user?.role);

    useEffect(() => {
        getWishlistItems();
    }, [page, keyword]);

    const getWishlistItems = async () => {
        const response = await axios.get(
            `http://localhost:5000/wishlistitems?search_query=${keyword}&page=${page}&limit=${limit}`
        );
        setWishlistitems(response.data.result);
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

    const deleteWishlistItem = async (itemId) => {
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            await axios.delete(`http://localhost:5000/wishlistitems/${itemId}`);
            const newTotalRows = rows - 1;
            setRows(newTotalRows);
            const newTotalPages = Math.ceil(newTotalRows / limit);
            if (page >= newTotalPages) {
                setPage(newTotalPages - 1);
            }
            setPages(newTotalPages);
            setWishlistitems(wishlistitems.filter((wishlistitem) => wishlistitem.id !== itemId));
        }
    };


    return (

        <div>
            <div className="sticky  top-0 left-0 w-full bg-gray-800 p-4 z-15">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Items</h1>
                        <h2 className="subtitle text-white">Items Wishlist</h2>
                    </div>
                    <Link to="/wishlistitems/add" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                        Add New Wishlist
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
                        <th className="px-4 py-2 border text-left">Name</th>
                        <th className="px-4 py-2 border text-left">Type</th>
                        <th className="px-4 py-2 border text-left">Price</th>
                        <th className="px-4 py-2 border text-left">Quantity</th>
                        <th className="px-4 py-2 border text-left">Quantification</th>
                        <th className="px-4 py-2 border text-left">information</th>
                        {role === "admin" && (<th className="px-4 py-2 border text-left">Action</th>)}
                    </tr>
                </thead>
                <tbody>
                    {wishlistitems.map((wishlistitem, index) => (
                        <tr key={wishlistitem.id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                                <div className="mt-2 h-[50px] shadow-md rounded-md overflow-hidden">
                                    <img src={wishlistitem.url || placeholderImg} alt="Image" className="w-[50px]" />
                                </div>
                            </td>
                            <td className="px-4 py-2 border">{wishlistitem.name}</td>
                            <td className="px-4 py-2 border">{wishlistitem.type}</td>
                            <td className="px-4 py-2 border">{wishlistitem.credit}</td>
                            <td className="px-4 py-2 border">{wishlistitem.quantity}</td>
                            <td className="px-4 py-2 border">{wishlistitem.quantification}</td>
                            <td className="px-4 py-2 border">{wishlistitem.explanation}</td>
                            {role === "admin" && (<td className="px-4 py-2 border">
                       
                                <button onClick={() => deleteWishlistItem(wishlistitem.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm">
                                    Delete
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
    );
};

export default Itemwishlist;