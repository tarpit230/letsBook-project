import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";
import { useToast } from "../store/ToastContext";
import { UserContext } from "../store/UserContext";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const { loading, setLoading, Loader, showToast } = useToast();
  const { setUser, setReady } = useContext(UserContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/places", {
          withCredentials: true,
          signal: controller.signal,
        });
        setPlaces(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          
        } else {
          showToast("Failed to fetch Places", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();

    return () => {
      controller.abort();
    };
  }, []);
  
    useEffect(() => {
      let storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setReady(true);
      }
    }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
            <Loader size="70px" color="#EC5228" />
        </div>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {places.length > 0 &&
            places.map((place) => (
              <Link key={place._id} to={"/place/" + place._id}>
                <div className="bg-gray-500 mb-2 rounded-2xl flex">
                  {place.photos?.[0] && (
                    <img
                      className="rounded-2xl object-cover aspect-square"
                      src={`${BASE_URL}/uploads/` + place.photos?.[0]}
                      alt="can't render"
                    />
                  )}
                </div>
                <h2 className="font-bold">{place.title}</h2>
                <h3 className="text-sm text-gray-500">{place.address}</h3>
                <div className="mt-1">
                  <span className="font-bold">${place.price}</span> per night
                </div>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}
