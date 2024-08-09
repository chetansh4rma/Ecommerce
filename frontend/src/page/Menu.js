import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProductGallery from "../components/AllProduct";
import { addCartItem } from "../redux/productSlide";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);

  const selectedProduct = productList.find((item) => item._id === productId);

  const handleAddToCart = () => {
    dispatch(addCartItem(selectedProduct));
  };

  const handlePurchase = () => {
    dispatch(addCartItem(selectedProduct));
    navigate("/checkout");
  };

  return (
    <section className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex-1">
          <img
            src={selectedProduct?.image}
            alt={selectedProduct?.name}
            className="w-full h-full object-cover transition-transform transform hover:scale-105"
          />
        </div>
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 capitalize">
              {selectedProduct?.name}
            </h2>
            <h3 className="text-lg text-gray-600 mt-1">
              {selectedProduct?.category}
            </h3>
            <div className="text-3xl font-bold text-red-600 mt-4">
              ₹{selectedProduct?.price}
            </div>
          </div>
          <div className="flex flex-col space-y-4 mb-6">
            <button
              onClick={handlePurchase}
              className="w-full bg-green-600 text-white py-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
            >
              Purchase Now
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Product Description:</h4>
            <p className="text-gray-600 mt-2">{selectedProduct?.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductGallery heading={"You Might Also Like"} />
      </div>
    </section>
  );
};

export default ProductDetail;
