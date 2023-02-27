import React from "react";
import { AiOutlineQuestionCircle, AiOutlineLogout} from 'react-icons/ai';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authslice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
  
    const logout = () => {
      dispatch(LogOut());
      dispatch(reset());
      navigate("/");
    };

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
                    <button onClick={logout} className="bg-[#0e0e0e] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <AiOutlineLogout size={40} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;