import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
  text: string;
  button?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, text }) => {
  return (
    <div className="flex items-center justify-between px-1 pb-8 ">
      <h2 className="text-[2.1rem] font-semibold">{text}</h2>
      {children}
    </div>
  );
};

export default Header;
