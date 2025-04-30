

import React from 'react';
import Header from '../../../components/Signup/SignupEmail/Header';
import Ev2pnav from '../../../components/Signup/SignupEmail/Ev2pnav';
import EmailForm from '../../../components/Signup/SignupEmail/EmailForm';
import ImageContent from '@/components/Signup/SignupEmail/ImageContent';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-1/2 min-h-[calc(150vh-64px)]">
          <Ev2pnav />
          <EmailForm />
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] bg-[#2D2D2D]">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default Page;