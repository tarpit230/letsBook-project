import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import { UserContext } from "./store/UserContext";
import { setupInterceptors } from "./utils/axiosInterceptors";

export default function Layout() {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(logout, navigate);
  }, [logout, navigate]);

  return (
    <div className="pt-4 relative flex flex-col min-h-screen">
      <Header />
      <hr className="mt-4" />
      <div className="px-8">
        <Outlet />
      </div>
      {/* <div className="absolute bottom-0 w-[100%]">
                <Footer />
            </div> */}
    </div>
  );
}
