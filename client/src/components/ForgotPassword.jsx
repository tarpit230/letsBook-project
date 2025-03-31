import { IoMdArrowRoundBack } from "react-icons/io";

export default function ForgotPassword({ setShowDialog }) {
    return (
        <div className=" w-[100%] h-[90vh] flex justify-center items-center">
            <div className="flex flex-col justify-start min-w-[350px] h-auto 
                rounded-lg border border-gray-300 bg-white shadow-[0_0_5px_rgba(0,0,0,0.3)] p-8">
                    <div className="bg-gray-200 px-3 py-2 rounded-md mb-1 w-[35px] flex justify-center
                        cursor-pointer"
                        onClick={() => setShowDialog(false)}>
                        <button type="button"><IoMdArrowRoundBack /></button>
                    </div>
                    <form className="w-[100%]">
                        <div className="mt-1">
                            <p>Enter your Email:</p>
                            <input className="border border-gray-300" type="email" name="email" id="emailId"
                                placeholder="abc@gmail.com" required />
                        </div>
                        <div className="mt-1">
                            <p>Enter New Password:</p>
                            <input className="border border-gray-300" type="password" name="newPassword"
                             id="newPasswordId" placeholder="******" required />
                        </div>
                        <div className="mt-1">
                            <p>Confirm New Password:</p>
                            <input className="border border-gray-300" type="password" name="confirmPassword"
                             id="confirmPasswordId" placeholder="******" required />
                        </div>
                        <button type="submit" className="w-[100%] px-2 py-1 bg-[#EC5228] text-white rounded-md mt-2">
                            Reset Password</button>
                    </form>
            </div>
        </div>
    );
}