import { useEffect, useState } from "react";
import "../styles/Notification.css";
import { FaCheckCircle } from "react-icons/fa";
import { MdClear, MdError } from "react-icons/md";

export function ShowSuccessToast(message) {
  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);
  return (
    <>
      {showToast && (
        <div className="container">
          <div className="message-box">
            <span className="msg-icon">
              <FaCheckCircle color="lawngreen" size={30} />
            </span>
            <span>{message}</span>
            <span className="clear">
              <MdClear />
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export function ShowErrorToast(message) {
  useEffect(() => {
    const container = document.querySelector(".container");
    container.style.border = "2px solid orange";
    container.classList.add("error");
  }, []);

  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  return (
    <>
      {showToast && (
        <div className="container">
          <div className="message-box">
            <span className="msg-icon">
              <MdError color="orange" size={30} />
            </span>
            <span>{message}</span>
            <span className="clear">
              <MdClear />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
