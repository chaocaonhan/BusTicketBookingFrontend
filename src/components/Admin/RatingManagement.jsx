import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const RatingManagement = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  // Filter state
  const [ratingFilter, setRatingFilter] = useState("all");

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/danhGia", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách đánh giá");
      }

      const data = await response.json();
      if (data.code === 200) {
        setRatings(data.result);
      } else {
        throw new Error(data.message || "Lỗi khi lấy danh sách đánh giá");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const filteredRatings = ratings.filter((rating) => {
    if (ratingFilter === "all") return true;
    return rating.soSao === parseInt(ratingFilter);
  });

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đánh giá</h1>
        <div className="flex items-center gap-4">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ minHeight: "500px" }}>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Chuyến xe
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Nội dung
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRatings.length > 0 ? (
                filteredRatings.map((rating) => (
                  <tr
                    key={rating.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRating(rating)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {rating.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <img
                          src={rating.anhNguoiDung}
                          alt={rating.tenKhachHang}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{rating.tenKhachHang}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {rating.tenChuyenXe}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {renderStars(rating.soSao)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {rating.noiDung || "Không có nội dung"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Không có đánh giá nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Rating Detail Modal */}
      {selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Chi tiết đánh giá
              </h3>
              <button
                onClick={() => setSelectedRating(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedRating.anhNguoiDung}
                  alt={selectedRating.tenKhachHang}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {selectedRating.tenKhachHang}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedRating.tenChuyenXe}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {renderStars(selectedRating.soSao)}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  {selectedRating.noiDung || "Không có nội dung đánh giá"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingManagement;
