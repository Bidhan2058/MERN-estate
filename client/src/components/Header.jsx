import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

    // try {
    //   const res = await fetch("/api/listing/get");
    //   const data = await res.json();
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchermFromUrl=urlParams.get("searchTerm");
    if(searchermFromUrl){
      setSearchTerm(searchermFromUrl);
    }
  },[location.search])
  return (
    <header className="bg-slate-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">KTM</span>
            <span className="text-slate-700"> Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-200  p-1 rounded-md flex items-center "
        >
          <input
            type="text"
            placeholder=" Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <IoSearchSharp />
          </button>
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
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <Link to="/sign-in">
                <li className=" text-slate-700 hover:underline"> Sign in</li>
              </Link>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
