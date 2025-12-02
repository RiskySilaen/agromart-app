import React, { useEffect, useState } from "react";

function Notification({ show, message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-24 right-6 z-1000 animate-slideIn ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}
      style={{ animation: "slideIn 0.3s ease-out" }}
    >
      <i
        className={`fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
        } mr-2`}
      ></i>
      <span>{message}</span>
    </div>
  );
}

export default Notification;
