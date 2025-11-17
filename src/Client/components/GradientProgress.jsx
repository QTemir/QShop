import React from 'react';

const GradientProgress = ({ progress }) => {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-400"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default GradientProgress;