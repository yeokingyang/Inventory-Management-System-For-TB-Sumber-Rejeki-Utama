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
    const { user, isError, isSuccess, isLoading, message } = useSelector(
        (state) => state.auth);
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
        <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
            <div className='hidden sm:block'>
                <img className='w-full h-full object-cover' src={loginImg} alt="" />
            </div>

            <div className='bg-gray-800 flex flex-col justify-center'>
                <form onSubmit={Auth} className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg' action="">
                    {isError && <p className="has-text-centered">{message}</p>}
                    <h2 className='text-4xl text-white font-bold text-center'>SIGN IN</h2>
                    <div className='flex flex-col text-gray-400 py-2'>
                        <label>Email</label>
                        <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            type="text" />
                    </div>
                    <div className='flex flex-col text-gray-400 py-2'>
                        <label>Password</label>
                        <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            type="password" />
                    </div>
                    <div className='flex justify-between text-gray-400 py-2'>
                        <p className='flex items-center'><input className='mr-2' type="checkbox" />Remember Me</p>
                        <p>Forgot Password</p>
                    </div>
                    <button type="submit" className='w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/15 text-white font-semibold rounded-lg
                    '>  {isLoading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login;