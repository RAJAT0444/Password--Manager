import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white flex flex-col justify-center items-center py-4 px-6 mt-8 w-full">
      <div className="logo font-bold text-white text-2xl mb-2">
        <span className="text-green-700">&lt;</span>
        <span>Dozz</span>
        <span className="text-green-700">Password /&gt;</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>Created with</span>
        <img className="w-7 h-7" src="icons/cancer.jpeg" alt="heart" />
        <span>by RAJAT KUMAR</span>
      </div>
    </footer>
  );
};

export default Footer;
