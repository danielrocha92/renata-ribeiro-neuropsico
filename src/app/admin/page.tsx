'use client';

import React from 'react';
import AdminPrivateRoute from '../../components/AdminPrivateRoute';

const AdminPage: React.FC = () => {
  return (
    <AdminPrivateRoute>
      <div>
        <h1>Bem-vindo, Administrador!</h1>
      </div>
    </AdminPrivateRoute>
  );
};

export default AdminPage;
