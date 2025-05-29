import React from "react";
import { Link } from "react-router-dom";

const PayFail = () => {
  return (
    <section className="container mx-auto px-4 py-8 mt-14">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Failure Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Failure Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600">
            Thanh toán thất bại. Bạn có thể thanh toán lại trong phần quản lý
            đơn đặt của bạn
          </p>
          <p className="text-gray-600">
            Chúng tôi sẽ giữ vé giúp bạn trong 10 phút.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Trở về trang chủ
            </button>
          </Link>
          <Link to="/booking">
            <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
              Thử lại
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PayFail;
