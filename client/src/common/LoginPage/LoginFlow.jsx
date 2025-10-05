import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage'
import ContactForm from './ContactForm' ;
import CreatePassword from './CreatePassword' ;
import OtpVerification from './OtpVerification';
import Forgotpassword from './Forgotpassword';
import ForgotOtp from './ForgotOtp';
import OtpRegister from './OtpRegister';
import OTPVerification from './OtpVerification';
import SignUp from './SignUp';
import PersonalDetailsForm from '../../doctor/Components/Registration/Registration';

function LoginFlow() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login/*" element={<LoginPage />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/otpverification" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/forgot-otp" element={<ForgotOtp />} />
            <Route path="/otp-register" element={<OtpRegister />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<PersonalDetailsForm />} />
        </Routes>
    </div>
  )
}

export default LoginFlow