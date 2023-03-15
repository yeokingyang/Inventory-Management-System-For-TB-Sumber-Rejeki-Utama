import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Formedititem = () => {

    const [iuid, setIuid] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const [type, setType] = useState("");
    const [credit, setCredit] = useState("");
    const [quantification, setQuantification] = useState("");
    const [explanation, setExplanation] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getItemById = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/items/${id}`
                );
                setIuid(response.data.iuid);
                setName(response.data.name);
                setCredit(response.data.credit);
                setType(response.data.type);
                setQuantification(response.data.quantification);
                setExplanation(response.data.explanation);
                setFile(response.data.image);
                setPreview(response.data.url);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getItemById();
    }, [id]);


    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    };

    const editItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('iuid', iuid);
        formData.append('name', name);
        formData.append("file", file);
        formData.append('type', type);
        formData.append('credit', credit);
        formData.append('quantification', quantification);
        formData.append('explanation', explanation);
        try {
            await axios.patch(`http://localhost:5000/items/${id}`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                }
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
                    <h2 className="subtitle text-white">Update Items</h2>
                </div>
            </div>
            <form onSubmit={editItem}>
                <p className="text-center text-white">{msg}</p>
                <div >
                    <label className='text-gray-400 font-bold text-2xl'> Image</label>
                    <div className="flex items-center mt-2">
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={loadImage}
                        />
                    </div>
                    
                    {preview ? (
                        <figure className=" mb-5">
                            <img src={preview} alt="Preview Image" className="w-40 h-40 object-cover rounded-lg shadow-md" />
                        </figure>
                    ) : (
                        ""
                    )}
                            <label htmlFor="fileInput" className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded cursor-pointer">
                            Choose a file...
                        </label>
                </div>

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
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Type</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Item Type" />
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
                        Update
                    </button>
                </div>
            </form>
        </div>


    )
}

export default Formedititem;
