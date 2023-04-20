import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Formaddwishlistitem = () => {
    const [name, setName] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const [type, setType] = useState("");
    const [credit, setCredit] = useState("");
    const [quantification, setQuantification] = useState("");
    const [explanation, setExplanation] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };


    const saveItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('type', type);
        formData.append('credit', credit);
        formData.append('quantification', quantification);
        formData.append('explanation', explanation);
        try {
            await axios.post('http://localhost:5000/wishlistitems', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/wishlistitems');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div className="bg-gray-800 h-screen flex flex-col justify-top pt-10 pl-10 pr-10 border rounded-2xl overflow-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="title text-4xl font-bold text-white">Items</h1>
                    <h2 className="subtitle text-white">Add Item to Wishlist</h2>
                </div>
            </div>
            <hr className="my-6 border-gray-300" />
            <form onSubmit={saveItem}>
                <p className="text-center text-white">{msg}</p>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Image</label>
                    <div className="relative flex items-center justify-center bg-gray-100 rounded-md">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={loadImage}
                        />
                        <span className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200">
                            Choose a file...
                        </span>
                    </div>
                </div>

                {preview && (
                    <figure className="mt-2">
                        <img className="w-32 h-32 object-contain" src={preview} alt="Preview Image" />
                    </figure>
                )}
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Name</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item Name" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Type</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Item Type" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Price</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={credit}
                        onChange={(e) => setCredit(e.target.value)}
                        placeholder="Price" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Quantification</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={quantification}
                        onChange={(e) => setQuantification(e.target.value)}
                        placeholder="Quantification" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Information</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        placeholder="Information about the item" />
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

export default Formaddwishlistitem;
