// Notification service (optional - bisa juga langsung di App.jsx)
export const showNotification = (
  setNotification,
  message,
  type = "success"
) => {
  setNotification({ show: true, message, type });
  setTimeout(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, 3000);
};
