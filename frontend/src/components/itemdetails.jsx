import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import placeholderImg from '../assets/placeholderimg.jpg'


const Itemdetails = () => {
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { iuid } = useParams();

    useEffect(() => {
        const getItemById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/items/${iuid}`);
                setItems(response.data.result);
            } catch (error) {
                console.error(error);
                setMsg("Error fetching item details");
            }
        };
    
        getItemById();
    }, [iuid]);

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-gray-100">
            <div className="lg:flex items-center justify-center bg-white rounded-lg shadow-lg mt-10 ml-10">
                <img
                    src={items.url || placeholderImg}
                    alt=""
                    className="lg:w-[35rem] md:w-[30rem] w-[25rem] h-full object-cover rounded-lg lg:rounded-l-lg"
                />
                <div className="p-8">
                    <div className="text-3xl font-extrabold mb-4 text-gray-800">{items.name}</div>
                    <div className="mb-4 text-gray-800">Rp {items.credit}</div>
                    <p className="max-w-[400px] mb-4 text-gray-800">
                        {items.explanation}
                    </p>
                  
                </div>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mt-10" onClick={goBack}>Go Back</button>
        </div>

    );
};

export default Itemdetails;
