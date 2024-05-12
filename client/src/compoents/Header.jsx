import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
      <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">KTM</span>
          <span className="text-slate-700"> Estate</span>
        </h1>
        </Link>
        <form className="bg-slate-200  p-1 rounded-md flex items-center ">
          <input
            type="text"
            placeholder=" Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <span>
            <IoSearchSharp />
          </span>
        </form>
        <ul className="flex gap-2">
        <Link to="/">
          <li className="hidden sm:inline text-slate-900 hover:text-white">
            HOME
          </li>
          </Link>
          <Link to="about">
          <li className="hidden sm:inline hover:text-white">ABOUT</li>
          </Link>
          <Link to="sign-up">
          <li>SIGN-UP</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
