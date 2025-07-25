import { useContext, useState } from "react";
import { UserContext } from "../store/UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

export default function ProfilePage(){
    const [redirect, setRedirect] = useState(null);
    const {ready, user, setUser} = useContext(UserContext);

    let {subpage} = useParams();
    
    
    if(user?.message !== "No User Found" && subpage === undefined){
        subpage = 'profile';
    }

    async function logout(){
        try {
            await axios.post('/auth/logout', {withCredentials: true});
            localStorage.removeItem("user")
            setUser(null);
            setRedirect('/');
        } catch(error) {
            console.error('Logout failed. Error:', error.message);
        }
       
    }

    if(!ready) {
        return 'Loading...';
    }
    if(ready && !user && !redirect){
        return <Navigate to={'/login'} />
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <AccountNav />
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {(subpage === 'places' && user.role === "admin") && (
                <PlacesPage />
            )}
        </div>
    );
}