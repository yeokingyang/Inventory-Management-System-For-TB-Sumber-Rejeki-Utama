import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const Outgoingitemlist = () => {

    const [outgoingitems, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");


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

    const deleteOutgoingItem = async (itemId) => {
        await axios.delete(`http://localhost:5000/outgoingItems/${itemId}`);
        const newTotalRows = rows - 1;
        setRows(newTotalRows);
        const newTotalPages = Math.ceil(newTotalRows / limit);
        if (page >= newTotalPages) {
            setPage(newTotalPages - 1);
        }
        setPages(newTotalPages);
        const response = await axios.get(
            ` http://localhost:5000/outgoingItems`
        );
        setItems(response.data.result);
    };


    return (

        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="title text-4xl font-bold text-white">Outgoing Items</h1>
                    <h2 className="subtitle text-white">List of Items Sold History</h2>
                </div>
                <Link to="/sellitem/" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
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
                        <th className="px-4 py-2 border text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {outgoingitems.map((outgoingitem, index) => (
                        <tr key={outgoingitem.iuid} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{outgoingitem.iuid}</td>
                            <td className="px-4 py-2 border">{outgoingitem.name}</td>
                            <td className="px-4 py-2 border">{outgoingitem.type}</td>
                            <td className="px-4 py-2 border">{outgoingitem.credit}</td>
                            <td className="px-4 py-2 border">{outgoingitem.quantitySold}</td>
                            <td className="px-4 py-2 border">{outgoingitem.quantification}</td>
                            <td className="px-4 py-2 border">{outgoingitem.totalCredit}</td>
                            <td className="px-4 py-2 border">{new Date(outgoingitem.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">
                                <Link to={`/outgoingItems/edit/${outgoingitem.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => deleteOutgoingItem(outgoingitem.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm">
                                    Delete
                                </button>
                            </td>
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

export default Outgoingitemlist;