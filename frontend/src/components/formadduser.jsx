import React from 'react';

const Formadduser = () => {
    return (
        <div className="bg-gray-800 h-screen flex flex-col justify-top pt-10 pl-10">


            <h1 className="text-5xl text-white font-bold mb-5">Users</h1>
            <h2 className="text-3xl text-white mb-10">Add User</h2>
            <form>
                <div className='flex flex-col  text-gray-400 font-bold text-2xl py-2'>
                    <label>Email</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="text" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Name</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="text" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Password</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="password" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Confirm Password</label>
                    <input className='rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black' type="password" />
                </div>
                <div className='flex flex-col text-gray-400 font-bold text-2xl py-2'>
                    <label>Role</label>
                    <div className="select is-fullwidth text-black py-2">
                        <select className="w-full rounded-lg bg-white-800 mt-2 p-2 focus:border-blue-500 focus:outline-none text-black">
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
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

export default Formadduser;
