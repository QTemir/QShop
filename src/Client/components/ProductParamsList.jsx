import React from 'react';

const ProductParamsList = ({ params, onRemove }) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold">Параметры товара</h3>
            <ul className="list-disc pl-5">
                {params.map((param, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{param}</span>
                        <button 
                            onClick={() => onRemove(index)} 
                            className="text-red-500 hover:text-red-700"
                        >
                            Удалить
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductParamsList;