// layout.tsx
import React from 'react';
import './globals.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 shadow-lg flex flex-col">
                <div className="p-6 text-lg font-semibold">Brand</div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    <a href="#" className="block py-2 px-4 rounded-md hover:text-gray-700 hover:bg-gray-200">Dashboard</a>
                    <a href="#" className="block py-2 px-4 rounded-md hover:text-gray-700 hover:bg-gray-200">Projects</a>
                    <a href="#" className="block py-2 px-4 rounded-md hover:text-gray-700 hover:bg-gray-200">Teams</a>
                    <a href="#" className="block py-2 px-4 rounded-md hover:text-gray-700 hover:bg-gray-200">Settings</a>
                </nav>
                <div className="p-4">
                    <button className="w-full py-2 px-4 text-white bg-blue-500 rounded-md">Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="flex items-center justify-between p-4 shadow-md">
                    <div className="text-lg font-semibold">Page Title</div>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <img src="/user-avatar.png" alt="User" className="w-8 h-8 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="bg-red-50 w-full h-full p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
