import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Formadditem = () => {
    const [iuid, setIuid] = useState("");
    const [name, setName] = useState("");
    const [credit, setCredit] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/items", {
                iuid: iuid,
                name: name,
                credit: credit,
            });
            navigate("/items");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div className="bg-gray-800 h-screen flex flex-col justify-top pt-10 pl-10">
           <div className="flex justify-between items-center">
                <div>
                    <h1 className="title text-4xl font-bold text-white">Items</h1>
                    <h2 className="subtitle text-white">Add Items</h2>
                </div>
            </div>
            <form onSubmit={saveItem}>
                <p className="text-center text-white">{msg}</p>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Code</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={iuid}
                        onChange={(e) => setIuid(e.target.value)}
                        placeholder="Item Code" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Name</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item Name" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Price</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                        placeholder="Price" />
                </div>
                <div className="control mt-5">
                    <button type='submit' className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>


    )
}

export default Formadditem;
