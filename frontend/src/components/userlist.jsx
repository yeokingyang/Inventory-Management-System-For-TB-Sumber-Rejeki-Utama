import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import feTrash from '@iconify-icons/fe/trash';
import { Icon } from '@iconify/react';
import { FaCogs, FaPlus, FaSearch } from 'react-icons/fa';
const Userlist = () => {


    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [msg, setMsg] = useState("");
    const role = useSelector((state) => state.auth.user?.role);

    useEffect(() => {
        getUsers();
    }, [page, keyword]);

    const getUsers = async () => {
        const response = await axios.get(
            `http://localhost:5000/users?search_query=${keyword}&page=${page}&limit=${limit}`
        );
        setUsers(response.data.result);
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

    const deleteUser = async (userId) => {
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (confirmed) {
            await axios.delete(`http://localhost:5000/users/${userId}`);
            const newTotalRows = rows - 1;
            setRows(newTotalRows);
            const newTotalPages = Math.ceil(newTotalRows / limit);
            if (page >= newTotalPages) {
                setPage(newTotalPages - 1);
            }
            setPages(newTotalPages);
            const response = await axios.get(
                ` http://localhost:5000/users`
            );
            setUsers(response.data.result);
        }
    };


    return (
        <div>
            <div className="sticky top-0 bg-gray-800 p-4 z-15 border">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="title text-4xl font-bold text-white">Users</h1>
                        <h2 className="subtitle text-white">List of Users</h2>
                    </div>
                    <Link to="/users/add" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800 group">
                        <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Tambah Akun</span>
                        <FaPlus className="h-5 w-5" />
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
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded group"
                        >
                            <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Cari Akun</span>
                            <FaSearch className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex justify-between items-center">
                <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border text-left">No</th>
                            <th className="px-4 py-2 border text-left">Name</th>
                            <th className="px-4 py-2 border text-left">Email</th>
                            <th className="px-4 py-2 border text-left">Role</th>
                            {role === "admin" && (<th className="px-4 py-2 border text-left">Action</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{user.name}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">{user.role}</td>
                                {role === "admin" && (<td className="px-4 py-2 border">
                                    <Link
                                        to={`/users/edit/${user.uuid}`}
                                        className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
                                    >
                                        <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Edit Akun</span>
                                        <FaCogs className="h-5 w-5" />
                                    </Link>

                                    <button
                                        onClick={() => deleteUser(user.uuid)}
                                        className="inline-block align-middle px-4 py-2 mx-2 bg-gray-300 hover:text-red-700 leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out group"
                                    >
                                        <span className="text-white tooltip-text border bg-green-400 -mt-12 -ml-16 rounded-xl hidden group-hover:block absolute text-center py-2 px-6 z-50">Hapus Akun</span>
                                        <Icon icon={feTrash} className="h-5 w-5" />
                                    </button>
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="justify-between items-center mt-10 mb-5">

                <p className="text-center text-white ">
                    Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
                </p>
                <p className="text-center text-red-500">{msg}</p>
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

export default Userlist;