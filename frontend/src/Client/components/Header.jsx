import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow-md p-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/admin" className="text-gray-600 hover:text-blue-500">Admin</Link>
                    </li>
                    <li>
                        <Link to="/settings" className="text-gray-600 hover:text-blue-500">Settings</Link>
                    </li>
                    <li>
                        <Link to="/stats" className="text-gray-600 hover:text-blue-500">Statistics</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;