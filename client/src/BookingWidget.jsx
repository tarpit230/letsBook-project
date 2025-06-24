import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { UserContext } from "./store/UserContext";
import { useToast } from "./store/ToastContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);
  const { showToast, Loader, loading, setLoading } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    setLoading(true);
    try {
      const respone = await axios.post(
        "/api/bookings",
        {
          checkIn,
          checkOut,
          numberOfGuests,
          name,
          phone,
          place: place._id,
          price: numberOfNights * place.price,
        },
        { withCredentials: true }
      );
      const bookingId = respone.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
      showToast("Place Booked successfully.", "success");
    } catch (error) {
      showToast("Cannot book this place right now. Try later!", "error");
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <label>Phone number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        {loading ? (
          <Loader size="30px" color="#fff" />
        ) : (
          <>
            Book this place
            {numberOfNights > 0 && (
              <span className="ml-1">₹{numberOfNights * place.price}</span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
