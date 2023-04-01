import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Formeditoutgoingitem = () => {

  const [iuid, setIuid] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [credit, setCredit] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [quantification, setQuantification] = useState("");
  const [explanation, setExplanation] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const editOutgoingItem = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/outgoingItems/${id}`, {
        credit: credit,
        quantitySold: quantitySold,
        quantification: quantification,
        explanation: explanation
      });
      await axios.patch("http://localhost:5000/updateQuantitySold", {
        iuid: iuid
    });
      await axios.patch("http://localhost:5000/updateQuantityOnHand", {
        iuid : iuid
      });

      navigate("/outgoingItems");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    const getOutgoingItemById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/outgoingItems/${id}`
        );
        setIuid(response.data.iuid);
        setName(response.data.name);
        setType(response.data.type);
        setCredit(response.data.credit);
        setQuantitySold(response.data.quantitySold);
        setQuantification(response.data.quantification);
        setExplanation(response.data.explanation);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getOutgoingItemById();
  }, [id]);

  return (
    <div className="bg-gray-800 h-screen flex flex-col justify-top pt-10 pl-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="title text-4xl font-bold text-white">Items</h1>
          <h2 className="subtitle text-white">Update Items</h2>
        </div>
      </div>
      <form onSubmit={editOutgoingItem}>
        <p className="text-center text-white">{msg}</p>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Code</label>
          <h1 className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-white'>
            {iuid}
          </h1>
        </div>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Name</label>
          <h1 className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-white'>
            {name}
          </h1>
        </div>

        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Type</label>
          <h1 className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-white'>
            {type ? type : '-'}
          </h1>
        </div>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Price</label>
          <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            placeholder="Price" />
        </div>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Quantity</label>
          <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            placeholder="Price" />
        </div>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Quantification</label>
          <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
            value={quantification}
            onChange={(e) => setQuantification(e.target.value)}
            placeholder="quantification" />
        </div>
        <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
          <label>Information</label>
            <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black'
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="information" />
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

export default Formeditoutgoingitem;
