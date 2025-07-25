import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../store/UserContext";
import { useToast } from "../store/ToastContext";
import ForgotPassword from "../components/ForgotPassword";
import { GoogleLoginComponent } from "../components/AuthComponents";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { setUser } = useContext(UserContext);
  const { showToast } = useToast();

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem("user",JSON.stringify(data));
      if (data.status == 401) showToast("Invalid Credentials!", "error");
      else {
        showToast("LogIn successful", "success");
        setRedirect(true);
      }
    } catch (e) {
      showToast("LogIn Failed", "error");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      {showDialog ? (
        <ForgotPassword setShowDialog={setShowDialog} />
      ) : (
        <>
        <div className="mt-4 max-w-md mx-auto flex flex-col items-center justify-around height-[100vh]">
          <div className="">
            <h1 className="text-4xl text-center mb-4">LogIn</h1>
            <form className="w-[100%]" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder={"your@email.com"}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <button className="primary">LogIn</button>
              <p
                className="text-blue-800 text-center hover:underline cursor-pointer mt-2"
                onClick={() => setShowDialog(true)}
              >
                Forgot Password?
              </p>
              <div className="text-center py-2 text-gray-500">
                Don't have an account yet?{" "}
                <Link className="underline text-black" to={"/register"}>
                  Register now
                </Link>
              </div>
            </form>
          </div>
          <div className="flex justify-center w-[100%] mt-4">
            <GoogleLoginComponent />
        </div>
        </div>
        
        </>
      )}
    </>
  );
}
