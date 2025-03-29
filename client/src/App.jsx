import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./Layout";
import axios from "axios";
import { UserContextProvider } from "./store/UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import { ToastProvider } from "./store/ToastContext";

export const BASE_URL = "http://localhost:4000";
// export const BASE_URL='https://letsbook-m0kt.onrender.com'

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/account/places" element={<PlacesPage />} />
                <Route
                  path="/account/places/new"
                  element={<PlacesFormPage />}
                />
                <Route
                  path="/account/places/:id"
                  element={<PlacesFormPage />}
                />
                <Route path="/place/:id" element={<PlacePage />} />
                <Route path="/account/bookings" element={<BookingsPage />} />
                <Route path="/account/bookings/:id" element={<BookingPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
