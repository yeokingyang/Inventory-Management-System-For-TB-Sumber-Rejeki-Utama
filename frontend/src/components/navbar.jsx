import React from "react";
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { NavLink } from "react-router-dom";

const Navbar = () => {

    return (
        <nav className="bg-[#0e0e0e]  px-5 py-7">

            <div className="relative flex items-center justify-between h-16">
                <div className="flex-1 flex items-center ml-5">
                    <h1 className="text-gray-200 font-bold text-2xl ">TB SUMBER REJEKI UTAMA</h1>
                </div>
                <div className="flex items-center">
                    <button className="bg-[#0e0e0e] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <AiOutlineQuestionCircle size={40} />
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;