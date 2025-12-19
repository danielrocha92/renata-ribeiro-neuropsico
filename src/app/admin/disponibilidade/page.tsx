'use client';

import React from 'react';
import AdminPrivateRoute from '@/components/AdminPrivateRoute';
import AdminCalendar from '@/components/AdminCalendar';

const DisponibilidadePage = () => {
  return (
    <AdminPrivateRoute>
      <AdminCalendar />
    </AdminPrivateRoute>
  );
};

export default DisponibilidadePage;