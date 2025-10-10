import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import './AdminLayout.scss';

export const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header />
      <Sidebar />
      <main className="admin-layout__content" role="main">
        <div className="admin-layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}; 