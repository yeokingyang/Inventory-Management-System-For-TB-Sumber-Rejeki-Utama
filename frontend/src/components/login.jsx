import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authslice";
import loginImg from '../assets/loginscreenbg.jpg'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);
    useEffect(() => {
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };
    return (
        <div className='relative h-screen'>
            <img className='w-full h-full object-cover' src={loginImg} alt="" />
            <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
                <div className='bg-gray-800 flex flex-col justify-center rounded-lg'>
                    <form onSubmit={Auth} className='max-w-[1000px] w-full mx-auto
                     bg-gray-900 p-20 px-20 rounded-lg' action="">
                        {isError && <p className="text-center text-white">{message}</p>}
                        <h2 className='text-4xl text-white font-bold text-center mb-10 '>SIGN IN</h2>
                        <div className='flex flex-col text-gray-400 text-2xl py-2'>
                            <label>Email</label>
                            <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                type="text" />
                        </div>
                        <div className='flex flex-col text-gray-400 py-2 text-2xl'>
                            <label>Password</label>
                            <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                type="password" />
                        </div>
                        <div className='flex justify-between text-gray-400 py-2'>

                        </div>
                        <button type="submit" className='w-full my-5 mt-10 py-2 text-2xl bg-teal-500 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/15 text-white font-semibold rounded-lg
                    '>  {isLoading ? "Loading..." : "Login"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;