import React from "react";
import { useSelector } from "react-redux";
import CartProduct from "../components/CartProduct";
import emptyCartImage from "../assest/empty.gif";
import { toast } from "react-hot-toast";
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  const handlePayment = async () => {
    if (user.email) {
      const stripePromise = await loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/create-checkout-session`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(productCartItem)
      });
      if (res.status !== 200) return;

      const { sessionId } = await res.json();
      toast("Redirecting to payment gateway...");
      stripePromise.redirectToCheckout({ sessionId });
    } else {
      toast("Please log in first!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Your Cart Items</h2>

      {productCartItem.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Cart Items */}
          <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
            {productCartItem.map((item) => (
              <CartProduct
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                category={item.category}
                qty={item.qty}
                total={item.total}
                price={item.price}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="w-full md:w-80 bg-white shadow-lg rounded-lg p-4">
            <h2 className="bg-blue-600 text-white text-lg font-semibold p-2 rounded-t-lg">Summary</h2>
            <div className="flex justify-between py-2 border-b">
              <p className="font-medium">Total Qty:</p>
              <p className="font-bold">{totalQty}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p className="font-medium">Total Price:</p>
              <p className="font-bold text-orange-600">
                ₹{totalPrice}
              </p>
            </div>
            <button
              className="bg-orange-600 text-white font-bold py-2 px-4 w-full rounded-lg mt-4 hover:bg-orange-700 transition"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <img src={emptyCartImage} alt="Empty Cart" className="w-64 mb-4" />
          <p className="text-gray-600 text-2xl font-bold">Your Cart is Empty</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
