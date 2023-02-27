import React, { useState, useEffect } from "react";


const Userlist = () => {

    return (
        <div>
            <h1 className="title text-4xl font-bold text-white">Users</h1>
            <h2 className="subtitle text-white">List of Users</h2>

            <table className="table-auto w-full text-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border">
                        <td className="px-4 py-2 border"></td>
                        <td className="px-4 py-2 border"></td>
                        <td className="px-4 py-2 border"></td>
                        <td className="px-4 py-2 border"></td>
                        <td className="px-4 py-2 border"></td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};

export default Userlist;