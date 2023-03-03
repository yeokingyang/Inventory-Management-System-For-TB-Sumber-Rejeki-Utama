import React from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'

const Layout = ({ children }) => {
    return (
        <div className='fixed top-0 left-0 w-full'>
                <Navbar />
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 bg-gray-800">
                    <main className="p-4">{children}</main>
                </div>
            </div>
        </div>
    );
};
export default Layout;