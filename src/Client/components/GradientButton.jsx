import React from 'react';

const GradientButton = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-gradient-to-r from-blue-600 to-green-400 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default GradientButton;