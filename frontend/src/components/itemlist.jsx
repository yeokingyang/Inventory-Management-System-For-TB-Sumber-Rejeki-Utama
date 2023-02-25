import React, { useState, useEffect } from "react";


const Userlist = () => {

    return (
        <div>
            <h1 className="title text-4xl font-bold">Items</h1>
            <h2 className="subtitle">List of Items</h2>

            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2">Explanation</th>
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