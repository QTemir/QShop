import React from 'react';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

const Admin = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <ProductForm />
      <ProductTable />
    </div>
  );
};

export default Admin;