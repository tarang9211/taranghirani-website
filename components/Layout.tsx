import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;