import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Userlist = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        const response = await axios.get("http://localhost:5000/items");
        setItems(response.data);
    };

    const deleteItem = async (itemId) => {
        await axios.delete(`http://localhost:5000/items/${itemId}`);
        getItems();
    };


    return (

        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="title text-4xl font-bold text-white">Items</h1>
                    <h2 className="subtitle text-white">List of Items</h2>
                </div>
                <Link to="/items/add" className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                    Add New
                </Link>
            </div>

            <table className="table is-striped w-full text-white bg-gray-800 mt-5">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border text-left">No</th>
                        <th className="px-4 py-2 border text-left">Code</th>
                        <th className="px-4 py-2 border text-left">Name</th>
                        <th className="px-4 py-2 border text-left">Price</th>
                        <th className="px-4 py-2 border text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.iuid} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">{item.iuid}</td>
                            <td className="px-4 py-2 border">{item.name}</td>
                            <td className="px-4 py-2 border">{item.credit}</td>
                            <td className="px-4 py-2 border">
                                <Link to={`/items/edit/${item.iuid}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm mr-2">
                                    Edit
                                </Link>
                                <button onClick={() => deleteItem(item.iuid)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm">
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