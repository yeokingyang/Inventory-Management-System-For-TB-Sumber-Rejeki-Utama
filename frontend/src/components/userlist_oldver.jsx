import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Userlist = () => {

     const [users, setUsers] = useState([]);
 
     useEffect(() => {
         getUsers();
     }, []);
 
     const getUsers = async () => {
         const response = await axios.get("http://localhost:5000/users");
         setUsers(response.data);
     };
 
     const deleteUser = async (userId) => {
         await axios.delete(`http://localhost:5000/users/${userId}`);
         getUsers();
     };
   

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="title text-4xl font-bold text-white">Users</h1>
                    <h2 className="subtitle text-white">List of Users</h2>
                </div>
                <Link to="/users/add" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                    Add New
                </Link>
            </div>

            <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border text-left">No</th>
                        <th className="px-4 py-2 border text-left">Name</th>
                        <th className="px-4 py-2 border text-left">Email</th>
                        <th className="px-4 py-2 border text-left">Role</th>
                        <th className="px-4 py-2 border text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.uuid} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{user.name}</td>
                            <td className="px-4 py-2 border">{user.email}</td>
                            <td className="px-4 py-2 border">{user.role}</td>
                            <td className="px-4 py-2 border">
                                <Link to={`/users/edit/${user.uuid}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => deleteUser(user.uuid)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Userlist;