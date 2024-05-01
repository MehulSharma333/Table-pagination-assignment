import React from "react";
import { NavLink as Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full h-[80px] bg-slate-400 flex justify-end items-center">
      <ul className="flex gap-8 text-white mr-10">
        <Link to="/">Home</Link>
        <Link to="about">About</Link>
      </ul>
    </nav>
  );
}

export default Navbar;
