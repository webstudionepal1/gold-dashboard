import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
  text: string;
  button?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, text }) => {
  return (
    <div className="flex items-center justify-between px-1 pb-5 ">
      <h2 className="xl:text-[1.8rem] md:text-[1.6rem] sm:text-[1.5rem] 1.4rem font-semibold">{text}</h2>
      {children}
    </div>
  );
};

export default Header;
