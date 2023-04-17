import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Formedituser = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { uuid } = useParams();

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${uuid}`);
                setName(response.data.name);
                setEmail(response.data.email);
                setRole(response.data.role);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getUserById();
    }, [uuid]);

    const editUser = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/users/${uuid}`, {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role,
            });
            navigate("/users");
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
                    <h1 className="title text-4xl font-bold text-white">Users</h1>
                    <h2 className="subtitle text-white">Update Users</h2>
                </div>

            </div>
            <form onSubmit={editUser}>
                <p className="text-center text-white">{msg}</p>
                <div className='flex flex-col  text-gray-400 font-bold text-2xl py-2'>
                    <label>Email</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Name</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Password</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Confirm Password</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        placeholder="******" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Role</label>
                    <div className="select is-fullwidth text-black py-2">
                        <select className="w-full rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
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

export default Formedituser;
