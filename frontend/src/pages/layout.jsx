import React from 'react'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'

const Layout = ({ children }) => {
    return (
        <div className='fixed top-0 left-0 w-full h-screen'>
                <Navbar />
            <div className="flex h-full">
                <Sidebar />
                <div className="flex-1 bg-gray-800 overflow-y-auto"
                style={{ height: 'calc(100vh - 7rem)' }}>
                    <main className="p-4">{children}</main>
                </div>
            </div>
        </div>
    );
};
export default Layout;