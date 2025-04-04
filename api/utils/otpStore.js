const otpStore = new Map(); // Stores { email: otp }

const setOtp = (email, otp) => {
  otpStore.set(email, otp);
  setTimeout(() => otpStore.delete(email), 300000); // OTP expires in 5 mins
};

const getOtp = (email) => otpStore.get(email);

module.exports = { setOtp, getOtp };
