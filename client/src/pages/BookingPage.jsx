import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import ChatComponent from "../components/ChatComponent";
import { UserContext } from "../store/UserContext";

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/api/bookings", { withCredentials: true }).then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);

        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <AddressLink className="text-sm text-blue-700">
          {booking.place.address}
        </AddressLink>
        <ChatComponent
          currentUserId={user._id}
          managerUserId={booking.place.owner}
          user={user}
          title="Talk to Manager"
        />
      </div>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your Booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div className="">Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
