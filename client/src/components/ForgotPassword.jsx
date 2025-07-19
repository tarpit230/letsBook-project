import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useToast } from "../store/ToastContext";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export default function ForgotPassword({ setShowDialog }) {
    const { showToast, Loader, loading, setLoading } = useToast();
    const [email, setEmail] = useState();

    async function sendResetLink(e) {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post('auth/send-link', { email }, { withCredentials: true });
            showToast(res.data.message, "success");
        } catch (error) {
            showToast("Error Sending Reset Password Link!", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=" w-[100%] h-[90vh] flex justify-center items-center">
            <div className="flex flex-col justify-start min-w-[350px] h-auto 
                rounded-lg border border-gray-300 bg-white shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8">
                    <div className="bg-gray-200 px-3 py-2 rounded-md mb-1 w-[35px] flex justify-center
                        cursor-pointer"
                        onClick={() => setShowDialog(false)}>
                        <button type="button"><IoMdArrowRoundBack /></button>
                    </div>
                    <form className="w-[100%]" onSubmit={sendResetLink}>
                        <div className="mt-1">
                            <p>Enter your Email:</p>
                            <input className="border border-gray-300" type="email" name="email" id="emailId"
                                placeholder="abc@gmail.com" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-[100%] px-2 py-1 bg-[#EC5228] text-white rounded-md mt-2">
                            {loading ? <Loader size="30px" color="#fff" /> : 'Submit'}</button>
                    </form>
                    
            </div>
        </div>
    );
}

