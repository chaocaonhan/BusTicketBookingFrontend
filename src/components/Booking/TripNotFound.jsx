import React from "react";
import busGoing from "../../assets/busGoing.png";

const TripNotFound = () => {
  return (
    <div className="w-full text-center flex flex-col items-center justify-center py-8">
      <hr className="w-full mb-4" />
      <p className="font-bold text-2xl mb-2">Không tìm thấy chuyến xe</p>
      <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
        Hiện tại, hệ thống chưa tìm thấy chuyến đi theo yêu cầu của quý khách,
        vui lòng nhập thông tin khác hoặc thử lại sau.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
        <div className="flex items-center gap-2"></div>
      </div>
      <div className="flex justify-center">
        <img src={busGoing} alt="" className="max-w-xs w-full" />
      </div>
    </div>
  );
};

export default TripNotFound;
