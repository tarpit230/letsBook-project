import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { BASE_URL } from "../App";
import { useNavigate } from "react-router-dom";

export const GoogleLoginComponent = () => {
  const YOUR_GOOGLE_CLIENT_ID =
    "542833311202-na5kpdibpl0ln6t5rq1kqr4ldrfqcnjk.apps.googleusercontent.com";

  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: credentialResponse.credential,
      }),
    });
    const response = await res.json();
    if(response.loggedIn) navigate('/');
  }  
    
  return (
    <GoogleOAuthProvider clientId={YOUR_GOOGLE_CLIENT_ID}>
      <div className="w-[75%] mx-auto border border-black rounded-md">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};
