import React from "react";
import CiForkAndKnife from "../assest/groceries-icon-full-basket-of-food-grocery-shopping-icon-vector.jpg";

const FilterProduct = ({ category, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer ${
        isActive ? "text-red-600" : "text-gray-600"
      }`}
    >
      <div
        className={`p-3 rounded-full ${isActive ? "bg-red-600 text-white" : ""}`}
        style={{ width: "100px", height: "100px" }}
      >
        <img
          src={CiForkAndKnife}
          alt="Filter Icon"
          className="w-full h-full object-contain rounded-full"
        />
      </div>
      <p className="text-center font-medium mt-1 text-sm capitalize pb-5">{category}</p>
    </div>
  );
};

export default FilterProduct;
