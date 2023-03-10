import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import placeholderImg from '../assets/placeholderimg.jpg'


const Itemdetails = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [credit, setCredit] = useState("");
    const [quantification, setQuantification] = useState("");
    const [explanation, setExplanation] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { iuid } = useParams();

    useEffect(() => {
        const getItemById = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/items/${iuid}`
                );
                console.log(response.data);
                setName(response.data.name);
                setCredit(response.data.credit);
                setType(response.data.type);
                setQuantification(response.data.quantification);
                setExplanation(response.data.explanation);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
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
                    src={placeholderImg}
                    alt=""
                    className="lg:w-[35rem] md:w-[30rem] w-[25rem] h-full object-cover rounded-lg lg:rounded-l-lg"
                />
                <div className="p-8">
                    <div className="text-3xl font-extrabold mb-4 text-gray-800">{name}</div>
                    <div className="mb-4 text-gray-800">Rp {credit}</div>
                    <p className="max-w-[400px] mb-4 text-gray-800">
                        {explanation}
                    </p>
                    <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-300">
                        Add to cart
                    </button>
                </div>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mt-10" onClick={goBack}>Go Back</button>
        </div>

    );
};

export default Itemdetails;
