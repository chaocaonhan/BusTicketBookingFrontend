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

let canShowToast = true;

const showToast = (type, message) => {
  if (canShowToast) {
    canShowToast = false;
    toast[type](message, toastConfig);
    setTimeout(() => {
      canShowToast = true;
    }, 5000);
  }
};

export const showSuccess = (message) => showToast("success", message);
export const showError = (message) => showToast("error", message);
export const showInfo = (message) => showToast("info", message);
export const showWarning = (message) => showToast("warning", message);
