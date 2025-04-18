import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
  text: string;
  button?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children, text }) => {
  return (
<<<<<<< HEAD
    <div className="flex items-center justify-between mx-[2rem]  pb-8 px-1 ">
=======
    <div className="flex items-center justify-between px-1 pb-8 ">
>>>>>>> 6d63131991a5f8b5286f0aaa8407f855004bb6f7
      <h2 className="text-[2.1rem] font-semibold">{text}</h2>
      {children}
    </div>
  );
};

export default Header;
