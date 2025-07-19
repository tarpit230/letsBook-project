import { useToast } from "../store/ToastContext";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { showToast } = useToast();
  const [showPage, setShowPage] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const { token } = useParams();
  const  navigate  = useNavigate();

  async function handleForgotPassword(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/auth/change-password",
        { userId, confirmPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        showToast(res.data.message, "success");
        navigate('/');
      } else {
        showToast(res.data.message, "error");
      }
    } catch (error) {
      showToast("Something Went Wrong!", "error");
    }
  }

  async function sendTokenForValidation() {
    try {
      const res = await axios.get(`${BASE_URL}/auth/verify-link/${token}`);
      if (res.data.success) {
        setShowPage(true);
        setUserId(res.data.userId);
        showToast(res.data.message, "success");
      } else showToast(res.data.message, "error");
    } catch (error) {}
  }

  useEffect(() => {
    sendTokenForValidation();
  }, []);

  return (
    <>
      {showPage ? (
        <div className=" w-[100%] h-[90vh] flex justify-center items-center">
          <div
            className="flex flex-col justify-start min-w-[350px] h-auto 
                    rounded-lg border border-gray-300 bg-white shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8"
          >
            <form onSubmit={handleForgotPassword}>
              <div className="mt-1">
                <p>Enter New Password:</p>
                <input
                  className="border border-gray-300"
                  type="password"
                  name="newPassword"
                  id="newPasswordId"
                  placeholder="******"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-1">
                <p>Confirm New Password:</p>
                <input
                  className="border border-gray-300"
                  type="password"
                  name="confirmPassword"
                  id="confirmPasswordId"
                  placeholder="******"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-[100%] px-2 py-1 bg-[#EC5228] text-white rounded-md mt-2"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <p className="font-semibold">
            This Link is either Invalid or Expired.{" "}
          </p>
        </div>
      )}
    </>
  );
}
