import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addCartItem } from "../redux/productSlide";

const CardFeature = ({ image, name, price, category, loading, id }) => {
  const dispatch = useDispatch();

  const handleAddCartProduct = (e) => {
    e.stopPropagation(); // Prevent link click when button is clicked
    dispatch(addCartItem({
      _id: id,
      name,
      price,
      category,
      image,
    }));
  };

  return (
    <div className="w-full max-w-sm bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      {image ? (
        <Link
          to={`/menu/${id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block p-4"
        >
          <div className="h-48 flex justify-center items-center">
            <img src={image} alt={name} className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-xl font-semibold text-gray-800 capitalize">{name}</h3>
            <p className="text-gray-600 font-medium">{category}</p>
            <p className="text-lg font-bold mt-2">
              <span className="text-red-500">₹</span>
              <span>{price}</span>
            </p>
          </div>
        </Link>
      ) : (
        <div className="h-48 flex justify-center items-center bg-gray-200">
          <p className="text-gray-500">{loading}</p>
        </div>
      )}
      <div className="p-4">
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          onClick={handleAddCartProduct}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CardFeature;
