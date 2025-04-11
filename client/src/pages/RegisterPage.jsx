import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../store/ToastContext";

export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();

    async function registerUser(ev){
        ev.preventDefault();
        try{
            await axios.post('/auth/register', {
                name,
                email,
                password
            });
            showToast('Registration successful, Email verification mail sent via mail', 'success')
        } catch (e) {
            showToast('Registration Failed', 'error');
        }
        
    }

    async function handleEmailVerification() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        try {
            const res = await axios.post(`/auth/register/verify-token?token=${token}`, { email }, { withCredentials: true });
            if(res.data.success){
                showToast('Email successfully validated', 'success');
            }
        } catch (error) {
            showToast('Email Verification Failed', 'error');
        }
    }

    useEffect(() => {
        handleEmailVerification();
    }, [])
    
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
                <input type="text" placeholder="Arpit Tripathi"
                       value={name}
                       onChange={ev => setName(ev.target.value)} />
                <div className="">
                    <input type="email" placeholder={'your@email.com'}
                            value={email}
                            onChange={ev => setEmail(ev.target.value)} />
                </div>
                <input type="password" placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}  />
                <button className="primary">Register</button>
                <div className="text-center py-2 text-gray-500">
                    Already a member? <Link className="underline text-black" to={'/login'}>LogIn</Link>
                </div>
            </form>
            </div>
            
        </div>
    );
}