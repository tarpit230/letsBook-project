import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../store/UserContext";
import { useToast } from "../store/ToastContext";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);
    const { showToast } = useToast();

    async function handleLoginSubmit(ev){
        ev.preventDefault();
        try {
            const {data} = await axios.post('/login', {email, password}, {withCredentials: true});
            setUser(data);
            if(data.status == 401) showToast("Invalid Credentials!", "error");
            else{
                showToast('LogIn successful', "success");
                setRedirect(true);
            } 
        } catch (e) {
            showToast("LogIn Failed", "error");
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">LogIn</h1>
            <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                <input type="email" placeholder={'your@email.com'} 
                    value={email} 
                    onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                <button className="primary">LogIn</button>
                <div className="text-center py-2 text-gray-500">
                    Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                </div>
            </form>
            </div>
            
        </div>
    );
}