import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import {differenceInCalendarDays, format} from 'date-fns'
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";
import { useToast } from "../store/ToastContext";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const { showToast, Loader, loading, setLoading } = useToast();

    async function getBookings() {
        setLoading(true)
        try {
            await axios.get('/api/bookings', {withCredentials:true}).then(response => {
            setBookings(response.data);
        })
        } catch (error) {
            showToast("Something went wrong!", "error");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getBookings();
    }, [])

    return (
        <div>
            <AccountNav />
            <div className="my-2">
                {loading ? 
                    <div className="flex justify-center"><Loader size="50px" color="#EC5228" /></div>
                : bookings?.length > 0 ? bookings.map(booking => (
                    <Link key={booking?._id} to={`/account/bookings/${booking?._id}`} className="my-4 flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
                        <div className="w-48">
                            <PlaceImg place={booking?.place} />
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{booking?.place?.title}</h2>
                            <BookingDates booking={booking} className="items-center border-t border-gray-300 mt-2 py-2" />
                        </div>
                        <div className="text-xl p-2">
                            {differenceInCalendarDays(new Date(booking?.checkOut), new Date(booking?.checkIn))} nights
                            | Total Price: ${booking?.price}
                        </div>
                    </Link>
                )) : 
                    <div className="mt-4 flex justify-center font-semibold">
                        No Bookings Yet!
                    </div>
                }
            </div>
        </div>
    );
}