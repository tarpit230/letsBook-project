import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import ChatComponent from "../components/ChatComponent";
import { UserContext } from "../store/UserContext";
import { useToast } from "../store/ToastContext";

export default function PlacesPage() {
  const navigate = useParams();
  const [places, setPlaces] = useState([]);
  const { user } = useContext(UserContext);
  const [managerUserId, setManagerUserId] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const { showToast, Loader, loading, setLoading } = useToast();

  async function getUserPlaces() {
    setLoading(true);
    try {
      await axios
        .get("/api/user-places", { withCredentials: true })
        .then(({ data }) => {
          if (data.message) navigate("/");
          setPlaces(data);
        });
    } catch (error) {
      showToast("Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserPlaces();
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get("/api/bookings/all", { withCredentials: true })
      .then(({ data }) => {
        let newData = data.filter((elem) => elem.place?.owner === user?._id);
        let allNames = newData.map((elem) => elem.name)
        setAllNames(allNames);
        let allIds = newData.map((elem) => elem.user)
        setManagerUserId(allIds);
      });
  }, [user?._id]);

  

  return (
    <div>
      <AccountNav />
      <div className="relative flex justify-center space-x-2 text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
        {managerUserId && (
          <div className="">
            <ChatComponent
              currentUserId={user?._id}
              managerUserId={managerUserId}
              user={user}
              title="Talk to Customer"
              allNames={allNames}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center">
            <Loader size="50px" color="#EC5228" />
          </div>
        ) : (
          places.length > 0 &&
          places.map((place) => (
            <Link
              key={place._id}
              to={"/account/places/" + place._id}
              className="my-4 flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
            >
              <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
