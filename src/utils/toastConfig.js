import { toast } from "react-toastify";

export const toastConfig = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

// Truyền toastConfig vào các hàm toast
export const showSuccess = (message) => toast.success(message, toastConfig);
export const showError = (message) => toast.error(message, toastConfig);
export const showInfo = (message) => toast.info(message, toastConfig);
export const showWarning = (message) => toast.warning(message, toastConfig);
