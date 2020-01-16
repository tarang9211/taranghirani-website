import React from 'react';
import '../css/styles.css';

const Container = ({ children }) => {
  return (
    <div className="container mx-auto">
      {children}
    </div>
  );
};

export default Container;