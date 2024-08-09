import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsCartFill, BsList } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import Logo from "../assest/Foodemon.logo.webp";
import { isAuthenticated } from "../utility/auth";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const cartItemNumber = useSelector((state) => state.product.cartItem);

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutRedux());
    toast("Logout successfully");
  };

  return (
    <header className="fixed w-full h-16 px-2 md:px-4 z-50 bg-white shadow-md">
      <div className="flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/">
          <div className="h-10">
            <img src={Logo} alt="Logo" className="h-full" />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 md:gap-7">
          <nav className="flex gap-4 md:gap-6 text-base md:text-lg">
            <Link to="/" className="hover:text-blue-500 transition">Home</Link>
            <Link to="/login" className="hover:text-blue-500 transition">Login</Link>
          </nav>
          <div className="relative text-2xl text-slate-600">
            <Link to="/cart" className="relative">
              <BsCartFill />
              {cartItemNumber.length > 0 && (
                <div className="absolute -top-1 -right-1 text-white bg-red-500 h-4 w-4 rounded-full text-xs text-center">
                  {cartItemNumber.length}
                </div>
              )}
            </Link>
          </div>
          <div className="relative text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} alt="User" className="h-full w-full object-cover" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2 shadow-md flex flex-col min-w-[150px] text-left">
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to="/newproduct" className="whitespace-nowrap px-4 py-2 hover:bg-gray-100 transition">New Product</Link>
                )}
              
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={handleShowMenu} className="text-2xl">
            <BsList />
          </button>
          {showMenu && (
            <div className="absolute top-16 right-0 bg-white shadow-md w-48 py-2">
              <nav className="flex flex-col items-start px-4">
                <Link to="/" className="block py-2 text-base hover:bg-gray-100 transition">Home</Link>
                <Link to="/cart" className="flex items-center py-2 text-base hover:bg-gray-100 transition">
                  <BsCartFill />
                  <span className="ml-2">{cartItemNumber.length}</span>
                </Link>
                {userData.email === process.env.REACT_APP_ADMIN_EMAIL && (
                  <Link to="/newproduct" className="block py-2 text-base hover:bg-gray-100 transition">New Product</Link>
                )}
               
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
