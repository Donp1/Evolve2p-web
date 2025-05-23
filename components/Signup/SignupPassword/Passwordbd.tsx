'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignup } from "@/context/SignupContext";
import image from "../../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import schecklistInactive from "../../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import schecklistActive from "../../../public/Assets/Evolve2p_checklist2/checklist-active.svg";

const Passwordbd = () => {
  const router = useRouter();
  const { updateSignupData, setCurrentStep } = useSignup();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation Checks
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async () => {
    if (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        setError("Session expired. Please start over.");
        return;
      }

      const response = await fetch('https://evolve2p-backend.onrender.com/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          newPassword: password,
          confirmPassword: password
        })
      });

      // Try to get response as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Then parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update password');
      }

      // Success flow
      console.log('Password update successful:', data);
      updateSignupData({ password });
      setCurrentStep('verify');
      router.push('/Signups/Verify');

    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="max-w-md ml-[80px] mx-auto mt-10 px-4 text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">
        Create password
      </h1>
      <p className="text-[16px] font-[400] text-[#8F8F8F] whitespace-nowrap">
        Create a strong password to protect your trades and funds.
      </p>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mt-4 mb-2">
          {error}
        </div>
      )}

      <label className="block text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-1">
        Password
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          className={`w-[350px] h-[56px] mt-[10px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] mb-4 pl-[15px] pr-10 focus:outline-none rounded-[10px] border-2 ${
            error && (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
              ? "border-[#F5918A]"
              : "border-[#222222]"
          }`}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute border-0 right-2 ml-[-40px] top-[65%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
        >
          <Image
            src={image}
            alt="Toggle password visibility"
            width={20}
            height={20}
          />
        </button>
      </div>

      <ul className="text-[14px] font-[400] font-satoshi ml-[-40px] text-[#8F8F8F] mb-6 space-y-[10px]">
        <li className="flex items-center gap-[5px]">
          <Image
            src={isMinLength ? schecklistActive : schecklistInactive} 
            alt="check list" 
            width={16} 
            height={16} 
          />
          <span className={isMinLength ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
            Minimum 6 characters
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasNumber ? schecklistActive : schecklistInactive} 
            alt="check list" 
            width={16} 
            height={16} 
          />
          <span className={hasNumber ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
            At least 1 number
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasSpecialChar ? schecklistActive : schecklistInactive}
            alt="check list"
            width={16}
            height={16}
          />
          <span className={hasSpecialChar ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
            At least 1 special character
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasUpperLower ? schecklistActive : schecklistInactive}
            alt="check list"
            width={16}
            height={16}
          />
          <span className={hasUpperLower ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
            1 uppercase and 1 lowercase letter
          </span>
        </li>
      </ul>

      <label className="block text-[14px] mt-[20px] font-[500] text-[#8F8F8F] mb-1">
        Confirm password
      </label>
      <div className="relative inline-block">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`w-[350px] h-[56px] bg-[#222222] mt-[10px] text-[#DBDBDB] text-[14px] mb-4 pl-[15px] font-[500] pr-10 rounded-[10px] focus:outline-none border-2 ${
            error && !passwordsMatch ? "border-[#F5918A]" : "border-[#222222]"
          }`}
          placeholder="Re-enter your password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute top-[65%] border-0 right-2 ml-[-40px] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
        >
          <Image
            src={image}
            alt="Toggle password visibility"
            width={20}
            height={20}
          />
        </button>
      </div>

      <button
        className={`w-[370px] h-[56px] border-none cursor-pointer mt-[40px] bg-[#4DF2BE] text-[#0F1012] py-3 rounded-[100px] hover:bg-[#1a5d50] ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        Continue
      </button>

      {isLoading && (
        <div className="fixed inset-0 flex ml-[15%] mt-[30px] items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
          <style jsx global>{`
            .loader {
              width: 30px;
              height: 30px;
              position: relative;
            }
            .loader::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 70%;
              height: 70%;
              border: 5px solid #333333;
              border-top-color: #4DF2BE;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Passwordbd;