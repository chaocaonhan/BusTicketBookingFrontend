import React from "react";

export const PasswordModal = ({
  showPasswordModal,
  setShowPasswordModal,
  passwordData,
  handlePasswordChange,
  handlePasswordSubmit,
}) => {
  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Đổi mật khẩu</h3>
          <button
            onClick={() => setShowPasswordModal(false)}
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
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-400 focus:border-orange-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ImageModal = ({
  showImageModal,
  setShowImageModal,
  preview,
  onFileChange,
  onUpload,
}) => {
  if (!showImageModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Thay đổi ảnh đại diện
          </h3>
          <button
            onClick={() => setShowImageModal(false)}
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
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="mb-4"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="max-w-[300px] rounded-lg mb-4"
              />
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              onClick={onUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Tải lên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RatingModal = ({
  showRatingModal,
  handleCloseRatingModal,
  order,
  rating,
  setRating,
  comment,
  setComment,
  existingRating,
  handleRatingSubmit,
}) => {
  if (!showRatingModal || !order) return null;

  const isReadonly = order.daDanhGia;
  const displayRating = isReadonly ? existingRating?.soSao : rating;
  const displayComment = isReadonly ? existingRating?.noiDung || "" : comment;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isReadonly ? "Đánh giá của bạn" : "Đánh giá chuyến đi"}
          </h3>
          <button
            onClick={handleCloseRatingModal}
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
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => !isReadonly && setRating(star)}
                className={`text-3xl ${
                  star <= displayRating ? "text-yellow-400" : "text-gray-300"
                } ${!isReadonly ? "hover:text-yellow-400" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-md text-sm"
            placeholder="Nhập đánh giá của bạn..."
            rows={4}
            value={displayComment}
            onChange={(e) => !isReadonly && setComment(e.target.value)}
            disabled={isReadonly}
          />
          {!isReadonly && (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseRatingModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRatingSubmit(order.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
              >
                Gửi đánh giá
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
