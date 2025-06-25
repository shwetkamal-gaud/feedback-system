'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Payload } from '@/types/types';
import { useAuthContext } from '@/context/AuthContext';
import getBaseUrl from '@/lib/getBaseUrl';

const baseUrl = getBaseUrl();

const AuthPage = ({ type }: { type: 'login' | 'signup' }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("")
  const router = useRouter()
  const { authUser, setAuthUser } = useAuthContext()
  const handleLoginOrSignup = async () => {
    const url = type === "signup" ? `${baseUrl}/signup` : `${baseUrl}/login`;
    console.log(url)
    const payload: Payload = { email, password };

    if (type === "signup") {
      payload.name = name;
      payload.role = role;
      payload.team_name = team
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      setAuthUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      router.push('/')
    } else {
      alert(data?.error || "Failed");
    }
  };
  return (
    <div className="flex flex-grow items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" backdrop-blur-lg shadow-lg dark:shadow-2xl  dark:bg-[#2e2d2b]  rounded-lg p-6 w-full max-w-sm"
      >


        <motion.h2 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 text-center">
          {type === "login" ? "Welcome Back" : "Join Us"}
        </motion.h2>

        <p className="text-gray-700 dark:text-white/70 text-sm mb-4 text-center">
          {type === "login"
            ? "Sign in to your account."
            : "Create an account to get started."}
        </p>

        <form className="w-full space-y-4 text-gray-600 dark:text-white/70" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />


          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />


          {type === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <select
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
              <select
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#4e3d9b]"
                value={team}
                onChange={e => setTeam(e.target.value)}
              >
                <option value="">Select Team</option>
                <option value="tech">Tech</option>
                <option value="operation">Operation</option>
              </select>
            </>
          )}
          <button
            type="button"
            onClick={handleLoginOrSignup}
            className="bg-[#4e3d9b] text-white px-4 py-2 rounded w-full"
          >
            {type === "login" ? "Login" : "Sign Up"} <ArrowRight size={18} className="inline ml-1" />
          </button>

        </form>



        <div className="mt-4 text-center text-gray-600 dark:text-white/70 text-sm">
          {type === "login" ? (
            <p>
              {" Don't have an account?"}{" "}
              <Link href="/signup" className="text-[#4e3d9b] hover:underline">Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-[#4e3d9b] hover:underline">Login</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage